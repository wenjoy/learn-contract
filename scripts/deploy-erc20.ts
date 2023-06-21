import { ethers, network } from 'hardhat'
import { getAccount } from './helplers'

async function main() {
  const account = getAccount()

  const address = account.getAddress(); //0xcfa368e00b917617F3d3eBF3b2e52c08A92f7Db5
  const address2 = '0x68E14BCB5a484AA86752ACFd5c2bdd0F34BfDaBa'
  const Token = await ethers.getContractFactory("ERC20", account)
  const token = await Token.deploy("Wenjoy Token", "WJTK", 18)
  await token.deployed()
  console.log('deployed to: ', token.address)

  console.log('name: ', await token.name())
  console.log('symbol: ', await token.symbol())


  console.log('===before mint===')
  console.log('account balance: ', await token.balanceOf(address))
  console.log('account2 balance: ', await token.balanceOf(address2))

  await token._mint(address, 100)

  console.log('===after mint===')
  console.log('account balance: ', await token.balanceOf(address))
  console.log('account2 balance: ', await token.balanceOf(address2))

  await token.transfer(address2, 50)

  console.log('===after transfer===')
  console.log('account balance: ', await token.balanceOf(address))
  console.log('account2 balance: ', await token.balanceOf(address2))

}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})