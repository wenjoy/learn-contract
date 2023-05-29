import { ethers } from "hardhat";

async function main() {
  const Box = await ethers.getContractFactory('Box')
  console.log('deploy-5', 'deploying box')
  const box: any = await Box.deploy()
  await box.deployed()

  console.log(
    `Box deployed to :${box.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
