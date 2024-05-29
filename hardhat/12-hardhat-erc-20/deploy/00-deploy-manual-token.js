const { network } = require('hardhat');
const { developmentChains, INITIAL_SUPPLY } = require('../helper-hardhat-config');
const { verify } = require('../helper-functions');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const manualToken = await deploy('ManualTokenERC20', {
        from: deployer,
        args: [INITIAL_SUPPLY, 'ManualToken', 'MTK'],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    });
    log(`ManualToken deployed at ${manualToken.address}`);

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(manualToken.address, [INITIAL_SUPPLY]);
    }
};

module.exports.tags = ['all', 'token'];
