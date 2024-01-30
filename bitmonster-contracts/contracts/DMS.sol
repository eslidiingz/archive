//SPDX-License-Identifier: https://multiverseexpert.com/
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

interface IToken {
    function transfer(address to, uint256 amount) external returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);
}

contract DMS is ERC20, ERC20Burnable, Pausable, AccessControl {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant WITHDRAW_ROLE = keccak256("WITHDRAW_ROLE");

    uint256 public maxSupply = (2 * 10**8) * (10**decimals()); // 200M
    struct tokenomic {
        string typeName;
        uint256 totalDays;
        uint256 minTime;
        uint256 supply;
        address addressRole;
    }
    mapping(address => tokenomic) private tokenomics;
    address[] private allAddress;

    constructor(
        address EARN,
        address ECOSYSTEM,
        address COMMUNITY_MARKETING,
        address ADVISOR,
        address TEAM,
        address PRIVATE_SALE
    ) ERC20("DRAGON MOON STONE", "DMS") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(WITHDRAW_ROLE, EARN);
        _grantRole(WITHDRAW_ROLE, ECOSYSTEM);
        _grantRole(WITHDRAW_ROLE, COMMUNITY_MARKETING);
        _grantRole(WITHDRAW_ROLE, ADVISOR);
        _grantRole(WITHDRAW_ROLE, TEAM);
        _grantRole(WITHDRAW_ROLE, PRIVATE_SALE);
        _mint(address(this), maxSupply);

        tokenomics[EARN] = tokenomic({
            typeName: "EARN",
            totalDays: 0,
            supply: (maxSupply * 50) / 100,
            minTime: block.timestamp,
            addressRole: EARN
        }); // 100M | None Lock up
        allAddress.push(EARN);

        tokenomics[ECOSYSTEM] = tokenomic({
            typeName: "ECOSYSTEM",
            totalDays: 0,
            supply: (maxSupply * 15) / 100,
            minTime: block.timestamp,
            addressRole: ECOSYSTEM
        }); // 30M | None Lock up
        allAddress.push(ECOSYSTEM);

        tokenomics[COMMUNITY_MARKETING] = tokenomic({
            typeName: "COMMUNITY_MARKETING",
            totalDays: 180,
            supply: (maxSupply * 10) / 100,
            minTime: block.timestamp + 180 days,
            addressRole: COMMUNITY_MARKETING
        }); // 20M | 6 Months
        allAddress.push(COMMUNITY_MARKETING);

        tokenomics[ADVISOR] = tokenomic({
            typeName: "ADVISOR",
            totalDays: 90,
            supply: (maxSupply * 10) / 100,
            minTime: block.timestamp + 90 days,
            addressRole: ADVISOR
        }); // 20M | 3 Months
        allAddress.push(ADVISOR);

        tokenomics[TEAM] = tokenomic({
            typeName: "TEAM",
            totalDays: 360,
            supply: (maxSupply * 10) / 100,
            minTime: block.timestamp + 360 days,
            addressRole: TEAM
        }); // 20M | 1 Year
        allAddress.push(TEAM);

        tokenomics[PRIVATE_SALE] = tokenomic({
            typeName: "PRIVATE_SALE",
            totalDays: 360,
            supply: (maxSupply * 5) / 100,
            minTime: block.timestamp + 60 days,
            addressRole: PRIVATE_SALE
        }); // 20M | 1 Year
        allAddress.push(PRIVATE_SALE);

        _grantRole(MINTER_ROLE, msg.sender);
    }

    function withderw(uint256 amount) public onlyRole(WITHDRAW_ROLE) {
        require(
            block.timestamp >= tokenomics[msg.sender].minTime,
            "Token lock"
        );
        require(amount <= tokenomics[msg.sender].supply, "Token over supply");

        tokenomics[msg.sender].supply = tokenomics[msg.sender].supply - amount;
        IToken(address(this)).approve(msg.sender, amount);
        IToken(address(this)).transfer(msg.sender, amount);
    }

    function getTokenomic(address _address)
        public
        view
        returns (tokenomic memory)
    {
        return tokenomics[_address];
    }

    function getTokenomics() public view returns (tokenomic[] memory) {
        tokenomic[] memory data = new tokenomic[](allAddress.length);
        for (uint256 i = 0; i < allAddress.length; i++) {
            data[i] = tokenomics[allAddress[i]];
        }
        return data;
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(amount + totalSupply() <= maxSupply, "Token over max supply");
        _mint(to, amount);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
