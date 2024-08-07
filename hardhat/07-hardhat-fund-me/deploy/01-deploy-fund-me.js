const { network } = require('hardhat');
const {
    networkConfig,
    developmentChains,
} = require('../helper-hardhat-config');

const { verify } = require('../utils/verify');

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
    const args = [ethUsdPriceFeedAddress];
    const fundMe = await deploy('FundMe', {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });
    log(`FundMe deployed at ${fundMe.address}`);

    if (!developmentChains.includes(network.name)) {
        await verify(fundMe.address, args);
    }

    log('// ------------------------------------------- //');
};

module.exports.tags = ['all', 'fundme'];
