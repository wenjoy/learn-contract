import { artifacts, contract, expect } from 'hardhat';

const ERC165 = artifacts.require('contracts/ERC/ERC165/ERC165.sol:ERC165')

contract('ERC165', () => {
  let erc165: any
  beforeEach(async () => {
    erc165 = await ERC165.new()
  })

  describe('ERC165', () => {
    it('all interfaces are reported as supported', async () => {
      //bytes4(keccak256("supportsInterface(bytes4)")) == 0x01ffc9a7
      expect(await erc165.supportsInterface('0x01ffc9a7')).to.be.true
    })
    it('supportsInterface uses less than 30k gas', async () => {
      expect(await erc165.supportsInterface.estimateGas('0x01ffc9a7')).to.be.lte(30000)
    })
  })
})