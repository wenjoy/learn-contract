import { ethers } from 'ethers'
import { getContractAt } from '@nomiclabs/hardhat-ethers/internal/helpers'

const getEnvVariable = (key: string, defaultValue?: string): string => {
  if (process.env[key]) {
    return (process.env[key]) as string
  }

  if (!defaultValue) {
    throw `${key} is not defined and no default value was provided`
  }

  return defaultValue
}

const getProvider = () => {
  return ethers.getDefaultProvider(getEnvVariable('NETWORK', 'sepolia'), {
    alchemy: getEnvVariable('ALCHEMY_API_KEY')
  })
}

const getAccount = () => {
  return new ethers.Wallet(getEnvVariable('ACCOUNT_PRIVATE_KEY'), getProvider())
}

const getContract = (contractName: string, hre: any) => {
  const account = getAccount()
  return getContractAt(hre, contractName, getEnvVariable('NFT_CONTRACT_ADDRESS'), account)
}

export {
  getAccount,
  getContract
}