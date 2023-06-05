/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./IERC721.sol";
import "./IERC721Receiver.sol";

contract ERC721 is IERC721 {
    struct NFT {
        uint256 tokenId;
        address owner;
        address approved;
    }
    mapping(address => NFT[]) entries;
    mapping(address => mapping(address => bool)) approval;
    mapping(uint256 => NFT) tokens;

    constructor() {}

    modifier validAddress(address _owner) {
        require(
            _owner != address(0),
            "ERC721: address zero is not a valid owner"
        );
        _;
    }

    modifier valideToken(uint256 _tokenId) {
        NFT memory nft = tokens[_tokenId];
        require(nft.tokenId != 0, "ERC721: invalid token ID");
        _;
    }

    function mint(address _owner, uint256 _tokenId) internal {
        //TODO: authentication
        NFT memory newNFT = NFT({
            tokenId: _tokenId,
            owner: _owner,
            approved: _owner
        });
        tokens[_tokenId] = newNFT;
        entries[_owner].push(newNFT);
        //TODO:emit event
    }

    function burn(uint256 _tokenId) internal {
        delete tokens[_tokenId];
    }

    /// @notice Count all NFTs assigned to an owner
    /// @dev NFTs assigned to zero address are considered invalid
    /// @param _owner an address for whom to query the balance
    /// @return the number of NFTs owned by `_owner`
    function balanceOf(
        address _owner
    ) external view validAddress(_owner) returns (uint256) {
        NFT[] memory nfts = entries[_owner];
        return nfts.length;
    }

    /// @notice find owner of NFT
    function ownerOf(
        uint256 _tokenId
    ) external view valideToken(_tokenId) returns (address) {
        return tokens[_tokenId].owner;
    }

    function _transferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory data
    ) internal {
        address owner = tokens[_tokenId].owner;
        //require(owner != '', "invalid tokenId");
        require(owner == _from, "You don't have authority");
        //TODO approver check
        tokens[_tokenId].owner = _to;
        tokens[_tokenId].approved = address(0);

        NFT[] storage fromNFTs = entries[_from];
        NFT[] storage toNFTs = entries[_to];

        uint i = fromNFTs.length;

        while (i > 0) {
            NFT storage fromNFT = fromNFTs[i - 1];
            fromNFTs.pop();

            if (fromNFT.tokenId == _tokenId) {
                toNFTs.push(fromNFT);
            } else {
                fromNFTs.push(fromNFT);
            }
            i--;
        }

        emit Transfer(_from, _to, _tokenId);
    }

    function _checkOnERC721Received(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) private returns (bool) {
        if (to.code.length > 0) {
            try
                IERC721Receiver(to).onERC721Received(
                    msg.sender,
                    from,
                    tokenId,
                    data
                )
            returns (bytes4 retval) {
                return retval == IERC721Receiver.onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert(
                        "ERC721: transfer to non ERC721Receiver implementer"
                    );
                } else {
                    /// @solidity memory-safe-assembly
                    // assembly {
                    //   revert(add(32, reason), mload(reason))
                    // }
                    return false;
                }
            }
        } else {
            return true;
        }
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory data
    ) external payable validAddress(_to) {
        _transferFrom(_from, _to, _tokenId, data);
        require(
            _checkOnERC721Received(_from, _to, _tokenId, data),
            "ERC721: transfer to non ERC721Receiver implements"
        );
    }

    /// @notice Overload of above one
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable {
        _transferFrom(_from, _to, _tokenId, bytes(""));
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable {
        _transferFrom(_from, _to, _tokenId, bytes(""));
    }

    function approve(
        address _approved,
        uint256 _tokenId
    ) external payable valideToken(_tokenId) {
        NFT memory nft = tokens[_tokenId];
        require(
            nft.owner == msg.sender || nft.approved == msg.sender,
            "you are not authorized"
        );
        nft.approved = _approved;
    }

    function setApprovaleForAll(address _operator, bool _approved) external {
        //TODO: authorized?
        approval[msg.sender][_operator] = _approved;

        // emit ApprovaleForAll();
    }

    function getApproved(
        uint256 _tokenId
    ) external view valideToken(_tokenId) returns (address) {
        NFT memory nft = tokens[_tokenId];
        return nft.approved;
    }

    function isApprovedForAll(
        address _owner,
        address _operator
    ) external view returns (bool) {
        return approval[_owner][_operator];
    }
}
