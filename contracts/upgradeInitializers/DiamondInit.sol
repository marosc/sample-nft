// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { LibDiamond } from "../libraries/LibDiamond.sol";
import { IDiamondLoupe } from "../interfaces/IDiamondLoupe.sol";
import { IDiamondCut } from "../interfaces/IDiamondCut.sol";
import { IERC173 } from "@solidstate/contracts/access/IERC173.sol";
import { IERC165 } from "@solidstate/contracts/introspection/IERC165.sol";
import { IERC721 } from "@solidstate/contracts/token/ERC721/IERC721.sol";
import { ERC721MetadataStorage } from '@solidstate/contracts/token/ERC721/metadata/ERC721Metadata.sol';
import { IERC721Metadata } from '@solidstate/contracts/token/ERC721/metadata/IERC721Metadata.sol';
import { IERC721Enumerable } from '@solidstate/contracts/token/ERC721/enumerable/IERC721Enumerable.sol';


contract DiamondInit {

    function init(string calldata name, string calldata symbol) external {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();

        ds.supportedInterfaces[type(IDiamondCut).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondLoupe).interfaceId] = true;

        ds.supportedInterfaces[type(IERC165).interfaceId] = true;
        ds.supportedInterfaces[type(IERC173).interfaceId] = true;
        ds.supportedInterfaces[type(IERC721).interfaceId] = true;
        ds.supportedInterfaces[type(IERC721Metadata).interfaceId] = true;
        ds.supportedInterfaces[type(IERC721Enumerable).interfaceId] = true;


        ERC721MetadataStorage.Layout storage l = ERC721MetadataStorage.layout();
        l.name = name;
        l.symbol = symbol;
    }
}
