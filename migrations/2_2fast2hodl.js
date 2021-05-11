const _2fast2hodl = artifacts.require("Twofast2hodl");

module.exports = async function (deployer) {
  let _2f2h = await _2fast2hodl.new();
  await _2f2h.initialDeposit({value: "1000000000000000000"});
};
