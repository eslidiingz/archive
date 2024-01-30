// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DMSItem is ERC1155, AccessControl, Pausable, ReentrancyGuard {
    struct Item {
        uint256 typeId;
        uint256 itemId;
        uint256 amount;
        bool isTokenGen;
        string tokenGen;
        bool isLocked;
        uint256 lockedAmount;
        bool isOwned;
    }

    using SafeMath for uint256;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant LOCKER_ROLE = keccak256("LOCKER_ROLE");

    mapping(uint256 => uint256[]) types;
    uint256[] typeId;
    mapping(address => mapping(uint256 => Item)) ownedItems;
    //itemId => uri
    string baseUri;
    mapping(uint256 => string) mapUri;

    constructor() ERC1155(baseUri) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(LOCKER_ROLE, msg.sender);
    }

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause()
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
        onlyRole(PAUSER_ROLE)
    {
        _unpause();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // frequently use

    function setType(uint256 _typeId, uint256[] memory _itemId)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        types[_typeId] = _itemId;
        typeId.push(_typeId);
    }

    function setMapUri(uint256 _itemId, string memory _uri)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        mapUri[_itemId] = _uri;
    }

    function Mint(
        address _owner,
        uint256[] memory _itemId,
        uint256[] memory _amount
    ) public whenNotPaused {
        _mintBatch(_owner, _itemId, _amount, "");

        for (uint256 i = 0; i < _itemId.length; i++) {
            _setURI(mapUri[_itemId[i]]);
        }
    }

    function Burn(
        address _owner,
        uint256[] memory _itemId,
        uint256[] memory _amount
    ) public whenNotPaused {
        for (uint256 i = 0; i < _itemId.length; i++) {
            require(
                balanceOf(_owner, _itemId[i]) >= _amount[i],
                "item Amount is not enough"
            );
        }
        _burnBatch(_owner, _itemId, _amount);
    }

    function getTypeId(uint256 _itemId)
        public
        view
        whenNotPaused
        returns (uint256)
    {
        uint256 _typeId;
        for (uint256 i = 0; i < typeId.length; i++) {
            for (uint256 j = 0; j < types[typeId[i]].length; j++) {
                if (_itemId == types[typeId[i]][j]) {
                    _typeId = typeId[i];
                }
            }
        }
        return _typeId;
    }

    function createItem(
        address _owner,
        uint256[] memory _itemId,
        uint256[] memory _amount
    ) public whenNotPaused {
        uint256 _typeId;
        bool _isTokenGen;
        string memory _tokenGen;
        for (uint256 i = 0; i < _itemId.length; i++) {
            _typeId = getTypeId(_itemId[i]);
            _isTokenGen = _typeId == 4 ? true : false;
            _tokenGen = _itemId[i] == 37 ? "RBS" : _itemId[i] == 38
                ? "DMS"
                : _itemId[i] == 39
                ? "DGS"
                : "None";
            ownedItems[_owner][_itemId[i]] = Item(
                _typeId,
                _itemId[i],
                _amount[i],
                _isTokenGen,
                _tokenGen,
                false,
                0,
                true
            );
        }
    }

    function lockItem(
        address _owner,
        uint256[] memory _tokenId,
        bool _status,
        uint256[] memory _amount
    ) public onlyRole(LOCKER_ROLE) {
        for (uint256 i = 0; i < _tokenId.length; i++) {
            ownedItems[_owner][_tokenId[i]].isLocked = _status;
            if (_status == true) {
                ownedItems[_owner][_tokenId[i]].lockedAmount = _amount[i];
            }
        }
    }

    function updateOwner(
        address _currentOwner,
        address _newOwner,
        uint256[] memory _tokenId,
        uint256[] memory _amount
    ) public {
        for (uint256 j = 0; j < _tokenId.length; j++) {
            require(
                ownedItems[_currentOwner][_tokenId[j]].isOwned == true,
                "The asset is owned by others"
            );
            require(
                balanceOf(_currentOwner, _tokenId[j]) >= _amount[j],
                "Owener doesn't own enough assets"
            );
            ownedItems[_currentOwner][_tokenId[j]].amount =
                ownedItems[_currentOwner][_tokenId[j]].amount -
                _amount[j];
            ownedItems[_newOwner][_tokenId[j]].amount =
                ownedItems[_newOwner][_tokenId[j]].amount +
                _amount[j];
        }
    }

    function getItemByOwnerAndTokenId(address _owner, uint256 _tokenId)
        public
        view
        returns (Item memory)
    {
        return ownedItems[_owner][_tokenId];
    }
}
