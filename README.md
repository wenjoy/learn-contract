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
### ERC721
ERC721 can run `npx hardhat deploy` to deploy directly, thanks to costumize script `scripts/nft.ts`
`mint` need to change contract address in `.env`

### ERC20
- deploy
`npx hardhat run --network localhost scripts/deploy-erc20.ts`
- verify
after verify, can be indentified as ERC20 token on Etherscan and display Token name
`npx hardhat verify 0x0FB63Ab7354E08666A4bFb0051CEa797FB6E0154 "Wenjoy Token" "WJTK" 18 --network sepolia`