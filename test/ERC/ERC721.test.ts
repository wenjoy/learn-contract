import { expect } from 'chai'
import { artifacts, contract } from 'hardhat'

const ERC721 = artifacts.require("ERC721")

contract("ERC721", ([owner, receipt]) => {
  let erc721: any

  beforeEach(async () => {
    erc721 = await ERC721.new("MyToken", "MTK")
  })

  it('should mint an ERC721 token', async () => {
    await erc721.mint(owner, 1)
    const tokenOwner = await erc721.ownerOf(1)
    expect(tokenOwner).to.equal(owner)
  })

  it('should transfer an ERC721 token', async () => {
    await erc721.mint(owner, 1)
    await erc721.transferFrom(owner, receipt, 1, { from: owner })

    const newOwner = await erc721.ownerOf(1)
    expect(newOwner).to.equal(receipt)
  })

  it('should burn an ERC721 token', async () => {
    await erc721.mint(owner, 1)
    expect(await erc721.ownerOf(1)).to.equal(owner)

    await erc721.burn(1)
    expect(await erc721.ownerOf(1)).to.equal('0x0000000000000000000000000000000000000000')
  })

  it('should query balance of ERC721 token', async () => {
    await erc721.mint(owner, 1)
    expect(await erc721.balanceOf(owner)).to.equal(1)

    await erc721.mint(owner, 2)
    expect(await erc721.balanceOf(owner)).to.equal(2)
  })
})