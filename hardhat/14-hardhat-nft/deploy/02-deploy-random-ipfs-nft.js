const { network } = require('hardhat');
const { networkConfig } = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');
const { storeImages } = require('../scripts/uploadToPinata');

const imagesLocations = 'images/randomNft';

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    // Get the IPFS hashes for the images
    let tokenUris;
    if (process.env.UPLOAD_TO_PINATA === 'true') {
        tokenUris = await handleTokenUris();
    }

    let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock;

    if (chainId == 31337) {
        // create VRFV2 Subscription
        vrfCoordinatorV2Mock = await ethers.getContract('VRFCoordinatorV2Mock');
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
        const transactionReceipt = await transactionResponse.wait(1);
        subscriptionId = transactionReceipt.events[0].args.subId;
        // Fund the subscription
        // Our mock makes it so we don't actually have to worry about sending fund
        // await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT);
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]['vrfCoordinatorV2'];
        subscriptionId = networkConfig[chainId]['subscriptionId'];
    }
    // const waitBlockConfirmations = networkConfig.includes(network.name)
    //     ? 1
    //     : VERIFICATION_BLOCK_CONFIRMATIONS;

    log('----------------------------------------------------');

    await storeImages(imagesLocations);

    const arguments = [
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId]['gasLane'],
        networkConfig[chainId]['keepersUpdateInterval'],
        networkConfig[chainId]['callbackGasLimit'],
        // tokenUris
        networkConfig[chainId]['mintFee'],
    ];
};

async function handleTokenUris() {
    let tokenUris = [];

    return tokenUris;
}

module.exports.tags = ['all', 'randomipfs', 'main'];
