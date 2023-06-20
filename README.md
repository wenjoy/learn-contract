# Implement my own ERC contract

## ERC20
## ERC721
## ERC165

# How to use
## test
adapt `@nomiclabs/hardhat-truffle5` plugin to enable truffle style test, easy deploy contract in test, no need to compile

### run one special test
`npx hardhat test test/ERC/ERC20.test.ts`

## deploy 
ERC721 can run `npx hardhat deploy` to deploy directly, thanks to costumize script `scripts/nft.ts`
`mint` need to change contract address in `.env`