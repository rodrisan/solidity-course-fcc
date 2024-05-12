const { network } = require('hardhat');
const {
    networkConfig,
    developmentChains,
} = require('../helper-hardhat-config');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const deployer = (await getNamedAccounts()).deployer;
    const chainId = network.config.chainId;

    let ethUsdPriceFeedAddress;
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get('MockV3Aggregator');
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]['ethUsdPriceFeed'];
    }

    log('----------------------------------------------------');
    log('Deploying FundMe and waiting for confirmations...');
    const fundMe = await deploy('FundMe', {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    });
    log(`FundMe deployed at ${fundMe.address}`);
    log('// ------------------------------------------- //');
};

module.exports.tags = ['all', 'fundme'];