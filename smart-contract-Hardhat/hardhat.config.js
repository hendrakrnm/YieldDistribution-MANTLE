require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    mantleSepolia: {
      url: "https://rpc.sepolia.mantle.xyz/",       // RPC Mantle Sepolia resmi
      chainId: 5003,
      accounts: [process.env.PRIVATE_KEY].filter(Boolean),
    },
  },
};


/**
 * 
 * 
 * past 
 * 
 * export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    mantleTestnet: {
      url: configVariable("MANTLE_TESTNET_RPC"),
      chainId: 5003,
      type: "http",
      chainType: "op",
      accounts: [configVariable("MANTLE_PRIVATE_KEY")],
      gasPrice: "auto",
    },
    
  },
});
 */