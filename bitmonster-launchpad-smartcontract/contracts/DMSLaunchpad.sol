// SPDX-License-Identifier: Multiverse Expert
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IDMSLocker {
    function lock(
        address _owner,
        uint256 _amount,
        string memory _sale
    ) external;
}

contract DMSLaunchpad is ReentrancyGuard, Pausable, AccessControl {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public LOCKER_ROLE = keccak256("LOCKER_ROLE");

    address public recipientWallet;

    IERC20 DMSToken;
    IDMSLocker DMSLocker;

    struct Package {
        uint256 totalSupply;
        string name;
        uint256 DMSToken;
        uint256 pairToken;
    }

    mapping(uint256 => Package) packages;
    mapping(address => uint256[]) ownedPackage;
    uint256[] packageIndex;
    address pairTokenAddress;

    event TransferToken(
        string transferType,
        address operator,
        uint256 amountDMS,
        uint256 amountToken
    );

    constructor(
        address _dmstoken,
        address _locker,
        address _pairTokenAddress,
        address _wallet
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(LOCKER_ROLE, msg.sender);

        DMSToken = IERC20(_dmstoken);
        DMSLocker = IDMSLocker(_locker);
        recipientWallet = _wallet;
        pairTokenAddress = _pairTokenAddress;
    }

    function setRecipientWallet(address wallet)
        public
        whenNotPaused
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(address(0) == wallet, "Non Zero Address");
        recipientWallet = wallet;
    }

    function setPackage(
        uint256 _packageIndex,
        uint256 _totalSupply,
        string memory _packageName,
        uint256 _dmsToken,
        uint256 _pairToken
    ) public whenNotPaused onlyRole(DEFAULT_ADMIN_ROLE) {
        packages[_packageIndex] = Package(
            _totalSupply,
            _packageName,
            _dmsToken,
            _pairToken
        );
        packageIndex.push(_packageIndex);
    }

    function getPackage(uint256 _packageIndex)
        public
        view
        returns (Package memory)
    {
        return packages[_packageIndex];
    }

    function getPackageIndex() public view returns (uint256[] memory) {
        return packageIndex;
    }

    function buy(
        address _TokenAddress,
        string memory _saleType,
        uint256 _packageIndex
    ) public nonReentrant whenNotPaused {
        IERC20 pairToken = IERC20(_TokenAddress);
        require(_TokenAddress == pairTokenAddress, "Fix token for sale");
        require(
            packages[_packageIndex].totalSupply > 0,
            "Amount: total amount >0"
        );
        require(
            DMSToken.balanceOf(address(this)) >=
                packages[_packageIndex].DMSToken,
            "Launchpad: not enough token"
        );
        require(
            pairToken.balanceOf(msg.sender) >=
                packages[_packageIndex].pairToken,
            "Token: your balance not enough"
        );
        pairToken.safeTransferFrom(
            msg.sender,
            recipientWallet,
            packages[_packageIndex].pairToken
        );
        ownedPackage[msg.sender].push(_packageIndex);

        DMSLocker.lock(msg.sender, packages[_packageIndex].DMSToken, _saleType);
        DMSToken.safeTransfer(
            address(DMSLocker),
            packages[_packageIndex].DMSToken
        );
        packages[_packageIndex].totalSupply =
            packages[_packageIndex].totalSupply -
            1;

        emit TransferToken(
            "buy",
            msg.sender,
            packages[_packageIndex].DMSToken,
            packages[_packageIndex].pairToken
        );
    }

    function getOwnpackage(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory _packageId = new uint256[](
            ownedPackage[_owner].length
        );

        for (uint256 i = 0; i < ownedPackage[_owner].length; i++) {
            _packageId[i] = ownedPackage[_owner][i];
        }
        return _packageId;
    }
}
