// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "./IERC20.sol";

contract ERC20 is IERC20 {
    string public name;
    string public symbol;
    uint256 public decimals;
    uint256 public totalSupply;
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) approvals;
    //What is indexed
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256);

    modifier sufficientBalance(address _from, uint256 _value) {
        uint256 balance = balanceOf(_from);
        require(balance >= _value, "ERC20: balance is insufficient");
        _;
    }

    constructor(string memory _name, string memory _symbol, uint256 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }

    function _mint(address _to, uint256 _value) public {
        require(_to != address(0), "ERC20: cannot mint to invlaid address");
        balances[_to] = _value;
        totalSupply += _value;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    // prvent re-entrancy attack
    function transfer(
        address _to,
        uint256 _value
    ) public sufficientBalance(msg.sender, _value) returns (bool success) {
        balances[msg.sender] -= _value;
        balances[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function approve(
        address _spender,
        uint256 _value
    ) public sufficientBalance(msg.sender, _value) returns (bool) {
        approvals[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(
        address _owner,
        address _spender
    ) public view returns (uint256 remaining) {
        remaining = approvals[_owner][_spender];
        return remaining;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public sufficientBalance(_from, _value) returns (bool) {
        require(
            allowance(_from, msg.sender) >= _value,
            "allowance is insufficient"
        );
        balances[_from] -= _value;
        balances[_to] += _value;
        return true;
    }
}
