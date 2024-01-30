// SPDX-License-Identifier: https://multiverseexpert.com/
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenMock is ERC20 {
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 amount
    ) ERC20(_name, _symbol) {
        _mint(msg.sender, amount);
    }
}
