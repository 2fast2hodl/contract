// Tests the standard flow and success path functionality, using ETH
require("chai")
  .use(require("bn-chai")(web3.utils.BN))
  .use(require("chai-as-promised"))
  .should();

let _2fast2hodl = artifacts.require("Twofast2hodl");

contract("Twofast2hodl", (accounts) => {
  let _2f2h;

  it("should start with no tokens", async () => {
    _2f2h = await _2fast2hodl.new();
    (await _2f2h.totalSupply.call()).should.be.eq.BN(web3.utils.toBN(0));
  });

  it("shouldn't allow deposits before the initial deposit", async () => {
    try {
      await _2f2h.deposit(0, {value: 1});
      throw "Test error";
    } catch (e) {
      if (e.toString() == "Test error") {
        throw "Could deposit before calling initialDeposit";
      }
    }
  });

  it("should support initial deposits", async () => {
    await _2f2h.initialDeposit({value: 100});
    // For some reason, should.be.eq.BN wasn't working here
    (await _2f2h.totalSupply.call()).toString().should.be.equal("1");
    (await _2f2h.balanceOf.call(accounts[0])).toString().should.be.equal("1");
    (await _2f2h.getSharePrice.call()).toString().should.be.equal("100");
  });

  it("shouldn't allow calling initial deposit again", async () => {
    try {
      await _2f2h.initialDeposit({value: 100});
      throw "Test error";
    } catch (e) {
      if (e.toString() == "Test error") {
        throw "Could call initialDeposit again";
      }
    }
  });

  it("should support deposits", async () => {
    await _2f2h.deposit(0, {value: 10000});
    (await _2f2h.totalSupply.call()).toString().should.be.equal("96");
    (await _2f2h.balanceOf.call(accounts[0])).toString().should.be.equal("96");
    (await _2f2h.getSharePrice.call()).toString().should.be.equal("105");
  });

  it("should support withdrawals", async () => {
    await _2f2h.withdraw(2);
    (await web3.eth.getBalance(_2f2h.address)).toString().should.be.equal("9890");
  });
});
