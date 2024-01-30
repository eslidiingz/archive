//SPDX-License-Identifier: https://multiverseexpert.com/
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./Nonce.sol";

interface IMonster {
    function safeMint(address to, uint256 monsterId) external returns (uint256);
}

interface ILand {
    function safeMint(
        address to,
        uint256 zone,
        uint256 landId
    ) external returns (uint256);
}

interface IItem {
    function mint(
        address to,
        uint256 id,
        uint256 amount
    ) external;
}

interface IToken {
    function transfer(address to, uint256 amount) external returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);
}

contract Game is ReentrancyGuard, Nonce {
    bytes32 public constant MONSTER_TYPEHASH =
        keccak256(
            "mintMonsterWithGame(uint256 monsterId, uint256 nonce, bytes memory signature)"
        );
    bytes32 public constant LAND_TYPEHASH =
        keccak256(
            "mintLandWithGame(uint256 landId, uint256 nonce, bytes memory signature)"
        );
    bytes32 public constant ITEM_TYPEHASH =
        keccak256(
            "mintItemWithGame(uint256 token, uint256 amount, uint256 nonce, bytes memory signature)"
        );
    bytes32 public constant TOKEN_DMS_TYPEHASH =
        keccak256(
            "mintTokenDMSWithGame(uint256 amount, uint256 nonce, bytes memory signature)"
        );
    bytes32 public constant TOKEN_DGS_TYPEHASH =
        keccak256(
            "mintTokenDGSWithGame(uint256 amount, uint256 nonce, bytes memory signature)"
        );

    address public addressMonster;
    address public addressLand;
    address public addressItem;
    address public addressTokenDMS;
    address public addressTokenDGS;

    constructor(
        address monster,
        address land,
        address item,
        address tokenDMS,
        address tokenDGS
    ) {
        addressMonster = monster;
        addressLand = land;
        addressItem = item;
        addressTokenDMS = tokenDMS;
        addressTokenDGS = tokenDGS;
        _setOracleSigner(msg.sender);
        _enableSequence(true);
    }

    function mintMonsterWithGame(
        uint256 monsterId,
        uint256 nonce,
        bytes memory signature
    )
        external
        nonReentrant
        onlySignerWithUint256(MONSTER_TYPEHASH, monsterId, nonce, signature)
    {
        IMonster(addressMonster).safeMint(msg.sender, monsterId);
    }

    function mintLandWithGame(
        uint256 landId,
        uint256 nonce,
        bytes memory signature
    )
        external
        nonReentrant
        onlySignerWithUint256(LAND_TYPEHASH, landId, nonce, signature)
    {
        ILand(addressLand).safeMint(
            msg.sender,
            (landId / 1000),
            (landId % 1000)
        );
    }

    function mintItemWithGame(
        uint256 token,
        uint256 amount,
        uint256 nonce,
        bytes memory signature
    )
        external
        nonReentrant
        onlySignerWithUint256TwoValue(
            ITEM_TYPEHASH,
            token,
            amount,
            nonce,
            signature
        )
    {
        IItem(addressItem).mint(msg.sender, token, amount);
    }

    function mintTokenDMSWithGame(
        uint256 amount,
        uint256 nonce,
        bytes memory signature
    )
        external
        nonReentrant
        onlySignerWithUint256(TOKEN_DMS_TYPEHASH, amount, nonce, signature)
    {
        IToken(addressTokenDMS).approve(msg.sender, amount);
        IToken(addressTokenDMS).transfer(msg.sender, amount);
    }

    function mintTokenDGSWithGame(
        uint256 amount,
        uint256 nonce,
        bytes memory signature
    )
        external
        nonReentrant
        onlySignerWithUint256(TOKEN_DGS_TYPEHASH, amount, nonce, signature)
    {
        IToken(addressTokenDGS).approve(msg.sender, amount);
        IToken(addressTokenDGS).transfer(msg.sender, amount);
    }
}
