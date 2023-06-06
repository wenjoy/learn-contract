// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

///@title interface of ERC721
///@dev 3 events, 9 functions
///@author Wen Jun
interface IERC721 {
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );
    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );
    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool approved
    );

    /// @notice Count all NFTs assigned to an owner
    /// @dev NFTs assigned to zero address are considered invalid
    /// @param _owner an address for whom to query the balance
    /// @return the number of NFTs owned by `_owner`
    function balanceOf(address _owner) external view returns (uint256);

    /// @notice find owner of NFT
    function ownerOf(uint256 _tokenId) external view returns (address);

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory data
    ) external payable;

    /// @notice Overload of above one
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable;

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable;

    function approve(address _approved, uint256 _tokenId) external payable;

    function setApprovalForAll(address _operator, bool _approved) external;

    function getApproved(uint256 _tokenId) external view returns (address);

    function isApprovedForAll(
        address _owner,
        address _operator
    ) external view returns (bool);
}
