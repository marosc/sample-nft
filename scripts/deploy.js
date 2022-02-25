// npx hardhat node (runs a blockchain)
// npx hardhat run --network localhost scripts/main.js  //in another console
const { deployContracts } = require('./helpers/deployContracts')

async function main() {
    const [owner] = await ethers.getSigners();
    await deployContracts(owner.address,"MyTestNFT", "MNFT");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
