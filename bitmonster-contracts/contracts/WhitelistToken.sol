//SPDX-License-Identifier: https://multiverseexpert.com/
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract WhitelistToken is AccessControl {
    mapping(address => bool) private whiteLists;
    uint256 public rateFee;

    constructor(address _address) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        rateFee = 2;
        addTokenWhiteList(_address);
    }

    function getTokenWhiteList(address token) public view returns (bool) {
        return whiteLists[token];
    }

    function addTokenWhiteList(address token)
        public
        payable
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        whiteLists[token] = true;
    }

    function removeTokenWhiteList(address token)
        public
        payable
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        whiteLists[token] = false;
    }

    function grantRole(address user) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(DEFAULT_ADMIN_ROLE, user);
    }

    function setRateFee(uint256 _rateFee)
        public
        payable
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(_rateFee < 100, "Rate fee is incorrect");
        rateFee = _rateFee;
    }

    function getRateFee(uint256 price) public view returns (uint256) {
        return (price * rateFee) / 100;
    }
}
