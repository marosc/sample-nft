const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts } = require('./../scripts/helpers/deployContracts.js');
const { BigNumber } = require("ethers");

// Start test block
describe('NFT diamond', function() {
    this.timeout(0);

    const BASE_URI = "https://my.base.uri/";
    const NAME = "MyNFT";
    const SYMBOL = "MNFT";

    let owner, bob;
    let nft, erc165, erc173, diamondLoupe, diamondCut;

    before(async () => {
        [owner, bob] = await ethers.getSigners();
        [nft, erc165, erc173, diamondLoupe, diamondCut] = await deployContracts(owner.address, NAME, SYMBOL);

        await nft.setBaseURI(BASE_URI);
    });

    describe("MyTestNFT", async () => {

        it("should support interfaces", async () => {
            expect(await erc165.supportsInterface("0x80ac58cd")).to.be.equal(true); // IERC721
            expect(await erc165.supportsInterface("0x5b5e139f")).to.be.equal(true); // IERC721Metadata
            expect(await erc165.supportsInterface("0x780e9d63")).to.be.equal(true); // IERC721Enumerable
            expect(await erc165.supportsInterface("0x01ffc9a7")).to.be.equal(true); // IERC165
            expect(await erc165.supportsInterface("0x7f5828d0")).to.be.equal(true); // IERC173
        })

        it("should resolve base info", async () => {
            expect(await nft.baseTokenURI()).to.be.equal(BASE_URI);
            expect(await nft.name()).to.be.equal(NAME);
            expect(await nft.symbol()).to.be.equal(SYMBOL);
        })

        it("should mint tokens", async () => {
            await expect(
                nft.connect(bob).mintTokens(0, { value: ethers.utils.parseEther("0.06") })
            ).to.be.reverted;

            await nft.connect(bob).mintTokens(0, { value: ethers.utils.parseEther("0.07") });

            expect(await nft.balanceOf(bob.address)).to.be.equal(BigNumber.from(1));
        })

        it("Should not withdraw", async () => {
            await expect(
                nft.connect(bob).withdraw()
            ).to.be.revertedWith("LibDiamond: Must be contract owner")
        })

        it("Should withdraw", async () => {
            await nft.withdraw();
        })
    })
});
