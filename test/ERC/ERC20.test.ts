import { contract, artifacts, expect } from 'hardhat';
//@ts-ignore
import { BN, expectRevert, expectEvent } from '@openzeppelin/test-helpers';

const ERC20 = artifacts.require('contracts/ERC/ERC20/ERC20.sol:ERC20')

contract('ERC20', function (accounts) {
  const [initialHolder, recipient, anotherAcount] = accounts
  const name = 'My Token'
  const symbol = 'MTK'

  const initialSupply = new BN(100);

  beforeEach(async function () {
    this.token = await ERC20.new(name, symbol, 18)
  })

  describe('metadata', async function () {
    it('has a name', async function () {
      expect(await this.token.name()).to.eq(name)
    })
    it('has a symbol', async function () {
      expect(await this.token.symbol()).to.eq(symbol)
    })
    it('has 18 decimals', async function () {
      expect(await this.token.decimals()).to.be.eq(18)
    })

    it('get total supply zero', async function () {
      expect(await this.token.totalSupply()).to.eq(0)
    })
  })

  describe('interact', async function () {
    beforeEach(async function () {
      await this.token._mint(initialHolder, initialSupply)
    })
    it('get total supply 100', async function () {
      expect(await this.token.totalSupply()).to.eq(initialSupply)
    })

    describe('get balance of account', async function () {
      it('get 0', async function () {
        expect(await this.token.balanceOf(anotherAcount)).to.eq(0)
      })
      it('get 100', async function () {
        expect(await this.token.balanceOf(initialHolder)).to.eq(initialSupply)
      })
    })

    describe('transfer token', async function () {
      it('revert if insufficient', async function () {
        await expectRevert(this.token.transfer(initialHolder, 200), 'ERC20: balance is insufficient')
      })

      it('transfer token to another account', async function () {
        expect(await this.token.balanceOf(initialHolder)).to.eq(initialSupply)
        expect(await this.token.balanceOf(anotherAcount)).to.eq(0)

        await this.token.transfer(anotherAcount, 50, { from: initialHolder })

        expect(await this.token.balanceOf(initialHolder)).to.eq(50)
        expect(await this.token.balanceOf(anotherAcount)).to.eq(50)
      })

      it('should emit event', async function () {
        const receipt = await this.token.transfer(anotherAcount, 50, { from: initialHolder })
        await expectEvent(receipt, 'Transfer', {
          _from: initialHolder,
          _to: anotherAcount,
          _value: new BN(50)
        })
      })
    })
  })
})