// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "./IERC165.sol";

contract ERC165 is IERC165 {
    function supportsInterface(
        bytes4 interfaceId
    ) external view returns (bool) {
        console.logBytes4(type(IERC165).interfaceId);
        console.logBytes4(interfaceId);
        return interfaceId == type(IERC165).interfaceId;
    }
}
