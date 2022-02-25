// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { LibDiamond } from "../libraries/LibDiamond.sol";
import { ERC721 } from "@solidstate/contracts/token/ERC721/ERC721.sol";
import { ERC721MetadataStorage } from "@solidstate/contracts/token/ERC721/metadata/ERC721MetadataStorage.sol";
import { ERC721BaseStorage } from "@solidstate/contracts/token/ERC721/base/ERC721BaseStorage.sol";
import { UintUtils } from '@solidstate/contracts/utils/UintUtils.sol';

contract NFTFacet is ERC721 {
    using ERC721MetadataStorage for ERC721MetadataStorage.Layout;
    using ERC721BaseStorage for ERC721BaseStorage.Layout;
    using UintUtils for uint256;

    function withdraw() public {
        LibDiamond.enforceIsContractOwner();
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function setBaseURI(string memory newURI) public {
        LibDiamond.enforceIsContractOwner();
        ERC721MetadataStorage.layout().baseURI = newURI;
    }

    function tokenURI(uint256 tokenId) public override view returns (string memory) {
        require(
            ERC721BaseStorage.layout().exists(tokenId),
            'ERC721Metadata: URI query for nonexistent token'
        );

        string memory baseURI = ERC721MetadataStorage.layout().baseURI;

        // Deployer should make sure that the selected base has a trailing '/'
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(
                baseURI, (tokenId).toString(),".json")
        ) : "";
    }

    function baseTokenURI() public view returns (string memory) {
        return ERC721MetadataStorage.layout().baseURI;
    }

    function _mintTokens(uint id, address sender) internal {
        _safeMint(sender, id);
    }

    function mintTokens(uint id) public payable {
        require(msg.value == 0.07 ether);
        _mintTokens(id, msg.sender);
    }
}
