// SPDX-License-Identifier: Multiverse Expert
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract BWCoinTest is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant MARKET_ROLE = keccak256("MARKET_ROLE");
    using SafeMath for uint256;

    mapping(address => mapping(address => uint256)) private _allowances;
    mapping(address => uint256) private _balances;
    mapping(address => bool) public isFeeExempt;
    uint256 public liquidityFee;
    uint256 public buybackFee;
    uint256 public reflectionFee;
    uint256 public marketingFee;
    uint256 public totalFee;
    uint256 public feeDenominator;
    uint256 public _totalSupply;
    string private _name;
    string private _symbol;

    constructor() ERC20("BlueWolf Coin", "BWC") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(MARKET_ROLE, msg.sender);
        liquidityFee = 200;
        buybackFee = 300;
        reflectionFee = 800;
        marketingFee = 100;
        totalFee = liquidityFee + buybackFee + reflectionFee + marketingFee;
        feeDenominator = 10000;
        _totalSupply = 100000000000000000000000000;
        _name = "BlueWolf Coin";
        _symbol = "BWC";
        _balances[msg.sender] = _totalSupply;
    }

    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    function decimals() public view virtual override returns (uint8) {
        return 9;
    }

    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function setIsFeeExempt(address holder, bool exempt)
        external
        onlyRole(MARKET_ROLE)
    {
        isFeeExempt[holder] = exempt;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        if (_allowances[from][msg.sender] != _totalSupply) {
            _allowances[from][msg.sender] = _allowances[from][msg.sender].sub(
                amount,
                "Insufficient Allowance"
            );
        }

        _transferFrom(from, to, amount);
        return true;
    }

    function _transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) internal returns (bool) {
        _balances[sender] = _balances[sender].sub(
            amount,
            "Insufficient Balance"
        );

        uint256 amountReceived = shouldTakeFee(sender)
            ? takeFee(sender, recipient, amount)
            : amount;

        _balances[recipient] = _balances[recipient].add(amountReceived);

        emit Transfer(sender, recipient, amountReceived);
        return true;
    }

    function shouldTakeFee(address sender) internal view returns (bool) {
        return !isFeeExempt[sender];
    }

    function takeFee(
        address sender,
        address receiver,
        uint256 amount
    ) internal returns (uint256) {
        uint256 feeAmount = amount.mul(getTotalFee(false)).div(feeDenominator);

        _balances[address(this)] = _balances[address(this)].add(feeAmount);

        return amount.sub(feeAmount);
    }

    function getTotalFee(bool selling) public view returns (uint256) {
        if (selling) {
            return 555;
        }
        return totalFee;
    }

    function approve(address spender, uint256 amount)
        public
        override
        returns (bool)
    {
        _allowances[msg.sender][spender] = amount;
        return true;
    }

    function approveMax(address spender) external returns (bool) {
        return approve(spender, _totalSupply);
    }

    function allowance(address owner, address spender)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return _allowances[owner][spender];
    }

    function balanceOf(address account)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return _balances[account];
    }
}
