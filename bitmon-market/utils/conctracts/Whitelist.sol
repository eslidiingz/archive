// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract WhitelistMysteryBox is AccessControl {
    struct SWhitelist {
        string typeBox;
        string box;
        uint256 amount;
    }
    mapping(address => mapping(string => mapping(string => uint256)))
        private whitelists; // address => typeBox => box => amount
    mapping(address => SWhitelist[]) private whitelistsAll;
    mapping(address => mapping(string => mapping(string => uint256)))
        private indexWhitelists; // address => typeBox => box => index

    bytes32 public constant CREATE_WHITELIST_ROLE =
        keccak256("CREATE_WHITELIST_ROLE");
    bytes32 public constant DECREMENT_WHITELIST_ROLE =
        keccak256("DECREMENT_WHITELIST_ROLE");

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CREATE_WHITELIST_ROLE, msg.sender);
        _grantRole(DECREMENT_WHITELIST_ROLE, msg.sender);
    }

    function setWhitelist(
        address _address,
        string memory _typeBox,
        string memory _box,
        uint256 _amount
    ) public onlyRole(CREATE_WHITELIST_ROLE) {
        whitelists[_address][_typeBox][_box] = _amount;

        indexWhitelists[_address][_typeBox][_box] = whitelistsAll[_address]
            .length;
        whitelistsAll[_address].push(
            SWhitelist({typeBox: _typeBox, box: _box, amount: _amount})
        );
    }

    function decrementAmountWhitelist(
        address _address,
        string memory _typeBox,
        string memory _box
    ) public onlyRole(DECREMENT_WHITELIST_ROLE) {
        require(
            whitelists[_address][_typeBox][_box] > 0,
            "Balance amount is zero!!"
        );
        whitelists[_address][_typeBox][_box] =
            whitelists[_address][_typeBox][_box] -
            1;

        whitelistsAll[_address][indexWhitelists[_address][_typeBox][_box]]
            .amount = whitelists[_address][_typeBox][_box];
    }

    function getWhitelists(address _address)
        public
        view
        returns (SWhitelist[] memory)
    {
        return whitelistsAll[_address];
    }

    function getWhitelist(
        address _address,
        string memory _typeBox,
        string memory _box
    ) public view returns (uint256) {
        return whitelists[_address][_typeBox][_box];
    }

    function grantRoleAdd(address _address)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _grantRole(CREATE_WHITELIST_ROLE, _address);
    }
}