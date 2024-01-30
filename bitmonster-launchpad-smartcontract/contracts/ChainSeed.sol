// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract ChainSeed is AccessControl, ReentrancyGuard {
    bytes32 public constant DEV_ROLE = keccak256("DEV_ROLE");
    AggregatorV3Interface internal dataFeed;
    address[] public _providers;
    mapping(address => AggregatorV3Interface) _interfaces;
    mapping(address => bool) private _whitelists;
    uint256 private _feedCount;
    bytes32 private _lastSeed;
    uint256 private _nonce;

    constructor(address[] memory provider) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DEV_ROLE, msg.sender);

        for (uint256 i = 0; i < provider.length; i++) {
            dataFeed = AggregatorV3Interface(provider[i]);
            _providers.push(provider[i]);
            _interfaces[provider[i]] = dataFeed;
            _feedCount++;
        }
    }

    // Modifier
    modifier onlyWhitelist() {
        require(_whitelists[msg.sender], "WHITELIST: Forbidden");
        _;
    }

    // Developer
    function addTrustedSource(address[] memory provider)
        public
        onlyRole(DEV_ROLE)
        nonReentrant
    {
        require(provider.length > 0, "SEED: No provider provided");
        for (uint256 i = 0; i < provider.length; i++) {
            if (provider[i] == address(0))
                revert("SEED: Provider address must not be zero");
            if (provider[i] == address(this))
                revert("SEED: Provider address is not valid");
            if (_isProviderExists(provider[i]))
                revert("SEED: Provider is already listed");

            _feedCount++;

            if (!_isProviderExists(provider[i]))
                dataFeed = AggregatorV3Interface(provider[i]);
            _interfaces[provider[i]] = dataFeed;
            _providers.push(provider[i]);
        }
    }

    function removeTrustedSource(address[] memory provider)
        public
        onlyRole(DEV_ROLE)
        nonReentrant
    {
        for (uint256 i = 0; i < provider.length; i++) {
            if (!_isProviderExists(provider[i]))
                revert("SEED: No provider found");

            _feedCount--;
            delete _interfaces[provider[i]];

            for (uint256 j = 0; j < _providers.length; j++) {
                if (provider[i] == _providers[j]) {
                    _providers[j] = _providers[_providers.length - 1];
                    _providers.pop();
                }
            }
        }
    }

    function grantWhitelist(address _owner, bool _active)
        public
        onlyRole(DEV_ROLE)
    {
        require(
            _owner != address(this) && _owner != address(0),
            "WHITELIST: Invalid owner"
        );
        require(_whitelists[_owner] != _active, "WHITELIST: Invalid status");

        _whitelists[_owner] = _active;
    }

    function _isProviderExists(address provider) private view returns (bool) {
        for (uint256 i = 0; i < _providers.length; i++)
            if (_providers[i] == provider) return true;
        return false;
    }

    function randomSeed()
        public
        onlyWhitelist
        nonReentrant
        returns (bytes32 seed)
    {
        require(_providers.length > 0, "RANDOM: No providers found");

        uint256 providerIndex = uint256(
            keccak256(
                abi.encodePacked(block.number, msg.sender, _lastSeed, _nonce)
            )
        ) % _providers.length;

        address provider = _providers[providerIndex];

        (uint80 roundId, int256 answer, , uint256 updatedAt, ) = _interfaces[
            provider
        ].latestRoundData();

        bytes32 finalSeed = _getSeed(answer, updatedAt, roundId);

        // New Linked-Seed
        uint256 providerSafe = providerIndex + 1;
        uint256 seedLoopCount = ((2 *
            roundId +
            block.number +
            uint256(finalSeed)) % providerSafe); // mod again
        _lastSeed = _getHashLoop(seedLoopCount, finalSeed);

        // Increase nonce
        _nonce++;

        return finalSeed;
    }

    function _getSeed(
        int256 answer,
        uint256 updatedAt,
        uint80 roundId
    ) private view returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    answer,
                    updatedAt,
                    roundId,
                    _lastSeed,
                    msg.sender
                )
            );
    }

    function _getHashLoop(uint256 _count, bytes32 _seed)
        private
        view
        returns (bytes32)
    {
        bytes32 rootHash = keccak256(
            abi.encodePacked(block.timestamp, msg.sender, _lastSeed, _nonce)
        );
        bytes32 linkedSeed = rootHash;
        for (uint256 i = 0; i < _count; i++) {
            bytes32 newSeed = keccak256(
                abi.encodePacked(i, linkedSeed, _lastSeed, _seed)
            );
            linkedSeed = newSeed;
        }
        return linkedSeed;
    }
}
