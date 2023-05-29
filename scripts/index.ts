import { ethers } from 'hardhat'

async function main() {
  const accounts = await ethers.provider.listAccounts()
  console.log('index-5-accounts', accounts)
  const address = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
  const Box = await ethers.getContractFactory('Box')
  const box = await Box.attach(address)
  const value = await box.retrieve()
  console.log('index-10', value)

  await box.store(23)
  console.log('index-13', await box.retrieve())
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })