require('@nomiclabs/hardhat-waffle');
require('dotenv').config();
require('solidity-coverage');
require('@nomicfoundation/hardhat-verify');
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
    defaultNetwork: 'hardhat',
    networks: {
        hardhat: {},
        localhost: {
            url: 'http://localhost:8545',
            chainId: 31337,
        },
    },
    solidity: '0.8.8',
};
