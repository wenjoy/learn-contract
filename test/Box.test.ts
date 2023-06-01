import { expect } from 'chai'
import { artifacts } from 'hardhat'
// @ts-ignore
import { BN, expectEvent, expectRevert } from '@openzeppelin/test-helpers'

let Box = artifacts.require('Box')

// @ts-ignore
contract('Box', ([owner, other]) => {
  let box: any
  const value = new BN('42')

  beforeEach(async () => {
    box = await Box.new({ from: owner });
  })

  it('retrieve returns a value previously stored', async () => {
    await box.store(value, { from: owner })

    //@ts-ignore
    expect((await box.retrieve()).toString()).to.be.bignumber.equal('42')
  })

  it('store emits an event', async () => {
    const receipt = await box.store(value, { from: owner })
    expectEvent(receipt, 'ValueChanged', { value: value })
  })

  it('non owner cannot store a value', async () => {
    await expectRevert(
      box.store(value, { from: other }),
      'Ownable: caller is not the owner'
    )
  })

})