// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Twofast2hodl is ERC20 {
  uint256 private _totalShares;
  uint256 private _trackedBalance;

  event Deposit(address indexed person, uint256 shares, uint256 sharePrice);
  event Withdraw(address indexed person, uint256 shares, uint256 sharePrice);

  constructor() ERC20("2fast2hodl Share", "2F2H") {}

  function decimals() public pure override returns (uint8) {
    return 0;
  }

  // Sets the initial share price
  function initialDeposit() external payable {
    require(_totalShares == 0, "2fast2hodl: Initial deposit already happened");
    require(msg.value != 0, "2fast2hodl: No share price set via message value");

    _trackedBalance = msg.value;
    _totalShares = 1;
    _mint(msg.sender, 1);

    emit Deposit(msg.sender, 1, msg.value);
  }

  function getSharePrice() public view returns (uint256) {
    return _trackedBalance / _totalShares;
  }

  function getTotalShares() external view returns (uint256) {
    return _totalShares;
  }

  function deposit(uint256 minShares) external payable {
    require(_totalShares != 0, "2fast2hodl: No initial deposit yet"); // Use initialDeposit if so
    require(msg.value != 0, "2fast2hodl: No message value set to buy shares with");

    uint256 sharePrice = getSharePrice();
    // take a 5% deposit fee distributed to all holders via increased share price
    // this does use the same share price for the entire purchase instead of the average considering the end share price
    // this incentivizes large participation, and still doesn't allow withdrawing for more than you deposited
    uint256 shares = (msg.value * 19 / 20) / sharePrice;
    require(shares != 0, "2fast2hodl: Buying 0 shares");
    // stops price slippage
    require(shares >= minShares, "2fast2hodl: Price slipped too much");

    _trackedBalance += msg.value;
    _totalShares += shares;
    _mint(msg.sender, shares);

    emit Deposit(msg.sender, shares, sharePrice);
  }

  function withdraw(uint256 shares) external {
    require(shares != 0, "2fast2hodl: Withdrawing 0 shares");

    uint256 sharePrice = getSharePrice();

    _trackedBalance -= shares * sharePrice;
    _totalShares -= shares;
    _burn(msg.sender, shares);

    (bool success, ) = msg.sender.call{value: shares * sharePrice}("");
    require(success, "2fast2hodl: Failed to transfer ETH");

    emit Withdraw(msg.sender, shares, sharePrice);
  }
}
