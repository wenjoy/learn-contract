import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-truffle5';
import 'dotenv/config'

import './scripts/nft';

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY
const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY as string

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  etherscan: {
    apiKey: 'C4YT7SIA975H8SYVH51W42MUQG1NENZ2HF'
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [ACCOUNT_PRIVATE_KEY]
    },
    goerli: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [ACCOUNT_PRIVATE_KEY]
    },
  }
};

export default config;
