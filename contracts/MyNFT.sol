// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;
import "./ERC/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private currentTokenId;

    constructor() ERC721("WenjoyOwnNFT1", "NFT") {}

    function mintTo(address to) public returns (uint256) {
        currentTokenId.increment();
        uint256 newItemId = currentTokenId.current();
        mint(to, newItemId);
        return newItemId;
    }
}
