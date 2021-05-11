var HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    live: {
      provider: function() {
        return new HDWalletProvider("", "https://lb.rpc.egem.io");
      },
      gasPrice: 10000000000,
      network_id: 1987,
    }
  },
  mocha: {},

  compilers: {
    solc: {
      version: "0.8.4",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};
