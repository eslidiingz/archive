// SPDX-License-Identifier: Multiverse Expert
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DMSLocker is Pausable, AccessControl, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public LOCKER_ROLE = keccak256("LOCKER_ROLE");
    IERC20 DMSToken;

    constructor(address _token) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(LOCKER_ROLE, msg.sender);
        DMSToken = IERC20(_token);
    }

    struct SaleType {
        string saleType;
        uint256[] timeLock;
        uint256[] percentLock;
        bool isExist;
    }

    struct TokenLock {
        uint256[] expiration;
        uint256[] claimAmount;
        bool[] claimStatus;
        uint256 totalAmount;
    }

    string[] saleTypeName;
    mapping(string => SaleType) public saleTypeLists;
    mapping(address => mapping(uint256 => TokenLock)) public userTokenLock;
    mapping(address => uint256[]) public userTokenLockId;

    function setSaleType(
        string memory _sale,
        uint256[] memory _timeLock,
        uint256[] memory _percentLock
    ) public whenNotPaused onlyRole(DEFAULT_ADMIN_ROLE) {
        require(bytes(_sale).length > 0, "Sale Type: not empty");
        require(
            saleTypeLists[_sale].isExist == false,
            "Sale Type: already exist"
        );
        saleTypeLists[_sale] = SaleType(_sale, _timeLock, _percentLock, true);
        saleTypeName.push(_sale);
    }

    function unsetSaleType(string memory _sale, bool _exist)
        public
        whenNotPaused
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        saleTypeLists[_sale].isExist = _exist;
    }

    function getSaleType(string memory _sale)
        public
        view
        returns (SaleType memory)
    {
        return saleTypeLists[_sale];
    }

    function getSaleTypeList() public view returns (SaleType[] memory) {
        SaleType[] memory _lists = new SaleType[](saleTypeName.length);

        for (uint256 index = 0; index < saleTypeName.length; index++) {
            _lists[index] = saleTypeLists[saleTypeName[index]];
        }

        return _lists;
    }

    function lock(
        address _owner,
        uint256 _amount,
        string memory _sale
    ) public nonReentrant whenNotPaused onlyRole(LOCKER_ROLE) {
        require(
            keccak256(abi.encodePacked(_sale)) ==
                keccak256(abi.encodePacked(saleTypeLists[_sale].saleType)),
            "Sale type doesn't match"
        );
        SaleType memory _saleType = getSaleType(_sale);
        uint256[] memory _expiration = new uint256[](_saleType.timeLock.length);

        for (uint256 index = 0; index < _saleType.timeLock.length; index++) {
            _expiration[index] = uint256(block.timestamp).add(
                _saleType.timeLock[index]
            );
        }

        uint256[] memory _claimAmount = new uint256[](
            _saleType.percentLock.length
        );
        for (uint256 index = 0; index < _saleType.percentLock.length; index++) {
            _claimAmount[index] = (_amount.mul(_saleType.percentLock[index]))
                .div(100);
        }

        bool[] memory _claimStatus = new bool[](_saleType.percentLock.length);
        for (uint256 index = 0; index < _saleType.percentLock.length; index++) {
            _claimStatus[index] = false;
        }

        uint256 _lockerId = getLockersByOwner(_owner).length;

        userTokenLock[_owner][_lockerId] = TokenLock(
            _expiration,
            _claimAmount,
            _claimStatus,
            _amount
        );
        userTokenLockId[_owner].push(_lockerId);
    }

    function unlock(
        address _owner,
        uint256 _lockerId,
        uint256 _expiration
    ) public nonReentrant whenNotPaused {
        uint256[] memory _expirationList = userTokenLock[_owner][_lockerId]
            .expiration;

        for (uint256 index = 0; index < _expirationList.length; index++) {
            if (_expiration == _expirationList[index]) {
                uint256 _amount = userTokenLock[_owner][_lockerId].claimAmount[
                    index
                ];

                DMSToken.safeTransfer(msg.sender, _amount);
                userTokenLock[_owner][_lockerId].claimStatus[index] = true;
            }
        }
    }

    function getLockersByOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        return userTokenLockId[_owner];
    }

    function getTokenLockByIndex(address _owner, uint256 _lockerId)
        public
        view
        returns (TokenLock memory)
    {
        TokenLock memory _tokenLock = userTokenLock[_owner][_lockerId];
        return _tokenLock;
    }
}
