import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-truffle5';
import 'dotenv/config'

import './scripts/nft';

const ALCHEMY_API_KEY = '0RhSl-n6By0K0V4PVcPkDD46FD0QZHG_'
const ACCOUNT_PRIVATE_KEY = 'ffe640be7d7b84d368500255e75e95ab3a45d332e920b0356ac6f26b21598d68'

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [ACCOUNT_PRIVATE_KEY]
    }
  }
};

export default config;
