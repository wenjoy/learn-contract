import { task } from 'hardhat/config'
import { getAccount, getContract } from './helplers'

task('check-balance', 'prints out the balance of your account').setAction(async (taskArguments, hre) => {
  const account = getAccount();
  console.log(`Account balance of ${account.address} : ${await account.getBalance()}`)
})

task('deploy', 'Deploy the NFT.sol contract').setAction(async (taskArguments, hre) => {
  const account = getAccount()
  const nftContractFactory = await hre.ethers.getContractFactory('NFT', account)
  const nft = await nftContractFactory.deploy()
  await nft.deployed()
  console.log(`Contract deployed to address: ${nft.address}`)
})

task('mint', 'Mints from the NFT contract')
  .addParam('address', 'the address to receive a token')
  .setAction(async (taskArguments, hre) => {
    const contract = await getContract('NFT', hre)
    const tranactionResponse = await contract.mintTo(taskArguments.address, {
      gasLimit: 500_000
    })

    console.log(`Transaction Hash: ${tranactionResponse.hash}`)
  })
