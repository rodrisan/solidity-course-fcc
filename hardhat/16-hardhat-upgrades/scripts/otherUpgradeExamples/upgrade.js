const { ethers, upgrades } = require("hardhat")

async function main() {
    const BoxV2 = await ethers.getContractFactory("BoxV2")
    let box = await upgrades.upgradeProxy("0xa513E6E4b8f2a923D98304ec87F64353C4D5C853", BoxV2)
    console.log("Your upgraded proxy is done!", box.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
