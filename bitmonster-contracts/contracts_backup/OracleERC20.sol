//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";
import "./OracleWrapper.sol";

/// @custom:security-contact siriwat576@gmail.com
contract OracleToken is AccessControl, OracleWrapper, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    event OnRegistered(address account);
    event OnClaimedToken(address account, uint256 amount);
    event OnDepositToken(address account, uint256 amount);
    event OnWithdrawToken(address account, uint256 amount);

    bytes32 public constant DEV_ROLE = keccak256("DEV_ROLE");
    bytes32 public constant MIGRATE_ROLE = keccak256("MIGRATE_ROLE");

    bytes32 public constant REGISTER_TYPEHASH = keccak256("register(uint256 nonce, bytes memory signature)");
    bytes32 public constant WITHDRAW_TYPEHASH = keccak256("withdrawToken(uint256 amount, uint256 nonce, bytes memory signature)");
    bytes32 public constant CLAIM_TYPEHASH = keccak256("claimToken(uint256 amount, uint256 nonce, string memory invoice, bytes memory signature)");

    uint256 public constant DEFENDER_DELAY = 0 minutes;

    address private _token;
    uint256 private _minimumClaim = 1 ether;
    uint256 private _minimumDeposit = 1 ether;
    uint256 private _claimRewardFee = 1; // Claim Reward Fee (Percentage %)

    mapping(address => bool) _registeredAccount;
    mapping(address => uint256) _claimAmount;

    bool _isContractActive = true;

    constructor(address _erc20) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DEV_ROLE, msg.sender);

        _setOracleSigner(msg.sender);
        setToken(_erc20);
    }

    modifier isContractActive {
        require(_isContractActive, "Oracle: Contract is not active");
        _;
    }

    modifier onlyRegistered {
        require(_registeredAccount[msg.sender], "Oracle: This account is not yet registered");
        _;
    }

    function setOracleSigner(address _account) public onlyRole(DEV_ROLE) {
        require(address(0) != _account && address(this) != _account, "Oracle: Invalid address");

        _setOracleSigner(_account);
    }

    function setContractActive(bool _toggle) public onlyRole(DEV_ROLE) {
        require(_isContractActive != _toggle, "Oracle: Invalid boolean");

        _isContractActive = _toggle;
    }

    function setToken(address _address) public onlyRole(DEV_ROLE) {
        require(_address != address(0) && _address != address(this), "Oracle: Invalid token");

        _token = _address;
    }

    function setMinimumClaim(uint256 _amount) public onlyRole(DEV_ROLE) {
        require(_amount > 0 && _amount == _minimumClaim, "Oracle: Invalid amount");

        _minimumClaim = _amount;
    }

    function setMinimumDeposit(uint256 _amount) public onlyRole(DEV_ROLE) {
        require(_amount > 0 && _amount == _minimumDeposit, "Oracle: Invalid amount");

        _minimumDeposit = _amount;
    }

    function isRegistered() public view returns(bool) {
        return _registeredAccount[msg.sender];
    }

    function register(uint256 nonce, bytes memory signature)
        public
        onlySigner(REGISTER_TYPEHASH, nonce, signature)
        isContractActive
        nonReentrant
    {
        require(!_registeredAccount[msg.sender], "Oracle: Already registered");

        _registeredAccount[msg.sender] = true;

        emit OnRegistered(msg.sender);
    }

    function claimableToken(address account) public view returns(uint256 amount) {
        return _claimAmount[account];
    }

    function revokeRewardPool(uint256 amount) public onlyRole(MIGRATE_ROLE) nonReentrant {
        uint256 rawAmount = IERC20(_token).balanceOf(address(this));
        require(amount > 0 && amount <= rawAmount, "Migrate: Invalid amount");

        IERC20(_token).approve(address(this), amount);
        IERC20(_token).safeTransferFrom(address(this), msg.sender, amount);
    }

    // Deposit from "On-Chain" to "Off-Chain"
    function depositToken(uint256 amount)
        external
        onlyRegistered
        isContractActive
        oracleFreeze(DEFENDER_DELAY)
        nonReentrant
    {
        require(amount >= _minimumDeposit, "Oracle: Amount does not reach the minimum");

        bool result = IERC20(_token).transferFrom(msg.sender, address(this), amount);

        if(result) {
            // Increase Off-Chain balance
            emit OnDepositToken(msg.sender, amount);
        }
    }

    // Withdraw from "Off-Chain" to "On-Chain"
    function claimToken(uint256 amount, uint256 nonce, string memory invoice, bytes memory signature)
        external
        onlySignerInvoiceWithUint256(CLAIM_TYPEHASH, amount, nonce, invoice, signature)
        onlyRegistered
        isContractActive
        oracleFreeze(DEFENDER_DELAY)
        nonReentrant
    {
        uint256 currentAmount = _claimAmount[msg.sender];
        require(amount > 0 && currentAmount + amount > currentAmount, "Oracle: Invalid amount");

        _claimAmount[msg.sender] += amount;

        // Decrease Off-Chain Balance
        emit OnWithdrawToken(msg.sender, amount);
    }

    function withdrawToken(uint256 amount, uint256 nonce, bytes memory signature)
        external
        onlySignerWithUint256(WITHDRAW_TYPEHASH, amount, nonce, signature)
        onlyRegistered
        isContractActive
        oracleFreeze(DEFENDER_DELAY)
        nonReentrant
    {
        require(amount > 0, "Oracle: Invalid amount");
        require(_claimAmount[msg.sender] > 0, "Oracle: Invalid claim balance");
        
        uint256 _totalAmount = amount;
        if(_totalAmount >= _claimAmount[msg.sender]) {
            _totalAmount = _claimAmount[msg.sender];
        }
        
        require(_totalAmount >= _minimumClaim, "Oracle: Amount does not reach the minimum");

        uint256 feeAmount = 100 - _claimRewardFee;
        uint256 rawAmount = _totalAmount.mul(feeAmount).div(100);
        uint256 centralBalance = IERC20(_token).balanceOf(address(this));

        require(rawAmount <= centralBalance && centralBalance > 0, "Oracle: The central fund is not enough");
        require(rawAmount > 0, "Oracle: Claim zero amount");

        IERC20(_token).approve(address(this), rawAmount);
        IERC20(_token).safeTransferFrom(address(this), msg.sender, rawAmount);
        _claimAmount[msg.sender] -= _totalAmount;
        emit OnClaimedToken(msg.sender, _totalAmount);
    }
}