require('dotenv').config();

require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-waffle');
require('hardhat-gas-reporter');
require('solidity-coverage');
require('hardhat-deploy');

const { env } = require('./utils/env');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    // solidity: '0.8.8',
    solidity: {
        compilers: [
            {
                version: '0.6.6',
            },
            {
                version: '0.8.8',
            },
        ],
    },
    defaultNetwork: 'hardhat',
    networks: {
        sepolia: {
            url: env.SEPOLIA_RPC_URL || '',
            accounts: env.PRIVATE_KEY !== undefined ? [env.PRIVATE_KEY] : [],
            chainId: 11155111,
            blockConfirmations: 6,
        },
    },
    gasReporter: {
        currency: 'USD',
        enabled: env.REPORT_GAS !== undefined,
        noColors: true,
        coinmarketcap: env.COINMARKETCAP_API_KEY,
    },
    etherscan: {
        apiKey: {
            sepolia: env.ETHERSCAN_API_KEY,
        },
        customChains: [
            {
                network: 'sepolia',
                chainId: 11155111,
                urls: {
                    apiURL: 'https://api-sepolia.etherscan.io/api',
                    browserURL: 'https://sepolia.etherscan.io',
                },
            },
        ],
    },

    namedAccounts: {
        deployer: {
            default: 0,
        },
        users: {
            default: 1,
        },
    },
};
