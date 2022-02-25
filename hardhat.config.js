require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades');

module.exports = {
  solidity: "0.8.9",

  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      hardfork: "arrowGlacier",
    }
  }
};
