const { network } = require('hardhat');
const {
    developmentChains,
    DECIMALS,
    INITIAL_PRICE,
} = require('../helper-hardhat-config');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const deployer = (await getNamedAccounts()).deployer;
    const chainId = network.config.chainId;
    // If we are on a local development network, we need to deploy mocks!
    if (developmentChains.includes(network.name)) {
        log('Local network detected! Deploying mocks...');
        await deploy('MockV3Aggregator', {
            contract: 'MockV3Aggregator',
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        });
        log('Mocks Deployed!');
        log('------------------------------------------------');
        log(
            "You are deploying to a local network, you'll need a local network running to interact"
        );
        log(
            'Please run `npx hardhat console` to interact with the deployed smart contracts!'
        );
        log('------------------------------------------------');
    }
};
module.exports.tags = ['all', 'mocks'];
