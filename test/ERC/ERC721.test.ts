import { expect } from 'chai'
import { artifacts, contract } from 'hardhat'
// @ts-ignore
import { BN, expectRevert, expectEvent } from '@openzeppelin/test-helpers'

const ERC721 = artifacts.require("contracts/ERC/ERC721/ERC721.sol:ERC721")

const ERC721ReceiverMock = artifacts.require("ERC721ReceiverMock")

contract.skip("ERC721", ([owner, receipt]) => {
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

contract('ERC721', ([owner, other]) => {
  // test case from openzepplin
  context('with minted tokens', () => {
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
    const FIRST_TOKEN_ID = BN(1)
    const SECOND_TOKEN_ID = BN(2)
    const NON_EXIST_TOKEN_ID = BN(9999)
    let token: any;

    beforeEach(async () => {
      token = await ERC721.new('MyToken', 'MTK');
    })

    beforeEach(async () => {
      await token.mint(owner, FIRST_TOKEN_ID)
      await token.mint(owner, SECOND_TOKEN_ID)
    })

    describe('name', () => {
      it('return name of contract', async () => {
        expect(await token.name()).to.be.equal('MyToken')
      })
    })

    describe('balanceOf', () => {
      context('when the given address owns some tokens', () => {
        it('returns the amount of tokens owned by the given address', async () => {
          expect(await token.balanceOf(owner)).to.equal(2)
        })
      })

      context('when thie given address doenot own any tokens', () => {
        it('returns 0', async () => {
          expect(await token.balanceOf(other)).to.equal(0)
        })
      })

      context('when query the zero address', () => {
        it('throws', async () => {
          await expectRevert(token.balanceOf(ZERO_ADDRESS), 'ERC721: address zero is not a valid owner')
        })
      })
    })

    describe('ownerOf', () => {
      context('when the given token ID was tracked by this token', () => {
        it('returns the owner of the given token ID', async () => {
          expect(await token.ownerOf(FIRST_TOKEN_ID)).to.be.equal(owner)
        })
      })

      context('when the given token ID was not tracked by this token', () => {
        it('reverts', async () => {
          await expectRevert(token.ownerOf(NON_EXIST_TOKEN_ID), 'ERC721: invalid token ID')
        })
      })
    })

    describe('transfers', () => {
      describe('vis transferFrom', () => {
        let receipt: any
        context('when called by the owner', () => {
          beforeEach(async () => {
            receipt = await token.transferFrom(owner, other, FIRST_TOKEN_ID)
          })

          it('transfer the ownership of the given token ID to the given address', async () => {
            expect(await token.ownerOf(FIRST_TOKEN_ID)).to.be.equal(other)
          })

          it('emits a Transfer event', async () => {
            expectEvent(receipt, 'Transfer', { from: owner, to: other, tokenId: FIRST_TOKEN_ID })
          })

          it('clears the approval for the token ID', async () => {
            expect(await token.getApproved(FIRST_TOKEN_ID)).to.be.equal(ZERO_ADDRESS)
          })

          it('adjust owners balances', async () => {
            expect(await token.balanceOf(owner)).to.be.equal(1)
          })

          // it('adjust owners tokens by index')
        })

        // context('when called by the approved individual')
      })

      describe('via safeTransferFrom', () => {
        describe('with data', () => {
          const data = '0x42';
          describe('to a user account', () => {
            context('when called by the owern', () => {
              it('transfer the ownership of the given token ID to the given address', async () => {
                const receipt = await token.safeTransferFrom(owner, other, FIRST_TOKEN_ID, data)
                expect(await token.ownerOf(FIRST_TOKEN_ID)).to.be.equal(other)
              })
            })
          })

          describe('to a valid receiver contract', () => {
            it('calls onERC721Received', async () => {
              const RECEIVER_MAGIC_VALUE = '0x150b7a02';
              const ERROR_NONE = 0;
              const receiver = await ERC721ReceiverMock.new(RECEIVER_MAGIC_VALUE, ERROR_NONE);
              // const receipt = await token.safeTransferFrom(owner, other, FIRST_TOKEN_ID, data, { from: owner })
              // Then only valid way to call overload function is below
              const receipt = await token.methods['safeTransferFrom(address,address,uint256,bytes)'](owner, receiver.address, FIRST_TOKEN_ID, data, { from: owner })

              await expectEvent.inTransaction(receipt.tx, ERC721ReceiverMock, 'Received', {
                operator: owner,
                from: owner,
                tokenId: FIRST_TOKEN_ID,
                data: data,
              })
            })

            it('doesnot call onERC721Received', async () => {
              const receipt = await token.methods['safeTransferFrom(address,address,uint256,bytes)'](owner, other, FIRST_TOKEN_ID, data, { from: owner })
              await expectEvent.notEmitted.inTransaction(receipt.tx, ERC721ReceiverMock, 'Received', {
                operator: owner,
                from: owner,
                tokenId: FIRST_TOKEN_ID,
                data: data,
              })
            })
          })
        })
      })
    })

    describe('support ERC165', () => {
      it('should detect that support ERC721 interface', async () => {
        expect(await token.supportsInterface('0x80ac58cd')).to.be.true;
      })
    })
  });
})