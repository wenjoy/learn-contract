import { ethers } from 'hardhat'

const { expect } = require('chai')

describe('Box', () => {
  let Box: any
  let box: any

  before(async () => {
    Box = await ethers.getContractFactory('Box')
  })

  beforeEach(async () => {
    box = await Box.deploy();
    await box.deployed()
  })

  it('retrieve returns a value previously stored', async () => {
    await box.store(42)

    expect((await box.retrieve()).toString()).to.equal('42')
  })
})