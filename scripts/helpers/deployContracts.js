
const {FacetCutAction, getSelectors} = require('./diamond.js');

async function deployContracts(owner, name, symbol) {

    const DiamondCutFacet = await ethers.getContractFactory('DiamondCutFacet');
    const diamondCutFacet = await DiamondCutFacet.deploy();
    await diamondCutFacet.deployed();

    const Diamond = await ethers.getContractFactory('Diamond');
    const diamond = await Diamond.deploy(owner, diamondCutFacet.address);
    await diamond.deployed();

    const DiamondInit = await ethers.getContractFactory('DiamondInit');
    const diamondInit = await DiamondInit.deploy();
    await diamondInit.deployed();

    const FacetNames = [
        'DiamondLoupeFacet',
        'OwnershipFacet',
        'NFTFacet'
    ];

    const cut = [];
    for (const FacetName of FacetNames) {
        const Facet = await ethers.getContractFactory(FacetName);
        const facet = await Facet.deploy();
        await facet.deployed();

        let functionSelectors = getSelectors(facet);
        // Remove supportsInterface from MyTestFacet defined in ERC721 because of DiamondLoupeFacet
        if (FacetName === 'NFTFacet') {
            functionSelectors = functionSelectors.remove(['supportsInterface']);
        }

        cut.push({
            facetAddress: facet.address,
            action: FacetCutAction.Add,
            functionSelectors: functionSelectors
        });
    }

    let init = diamondInit.interface.encodeFunctionData('init', [name, symbol]);

    const diamondCut = await ethers.getContractAt('IDiamondCut', diamond.address);
    let tx = await diamondCut.diamondCut(cut, diamondInit.address, init);
    let receipt = await tx.wait();
    if (!receipt.status) {
        throw Error(`Diamond upgrade failed: ${tx.hash}`);
    }

    const nft = await ethers.getContractAt('NFTFacet', diamond.address);
    const erc165 = await ethers.getContractAt('IERC165', diamond.address);
    const erc173 = await ethers.getContractAt('IERC173', diamond.address);
    const diamondLoupe = await ethers.getContractAt('IDiamondLoupe', diamond.address);


    return [nft, erc165, erc173, diamondLoupe, diamondCut];
}

exports.deployContracts = deployContracts;
