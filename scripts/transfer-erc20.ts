import { ethers, network } from 'hardhat'
import { getAccount } from './helplers'

async function main() {
  const contractAddress = '0x0FB63Ab7354E08666A4bFb0051CEa797FB6E0154'
  const account = getAccount()
  const Token = await ethers.getContractFactory('ERC20', account)
  const token = await Token.attach(contractAddress)

  const address = account.getAddress(); //0xcfa368e00b917617F3d3eBF3b2e52c08A92f7Db5
  const address2 = '0x68E14BCB5a484AA86752ACFd5c2bdd0F34BfDaBa'

  console.log('===before transfer===')
  console.log('account balance: ', await token.balanceOf(address))
  console.log('account2 balance: ', await token.balanceOf(address2))

  await token.transfer(address2, 10)

  console.log('===after transfer===')
  console.log('account balance: ', await token.balanceOf(address))
  console.log('account2 balance: ', await token.balanceOf(address2))

}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})