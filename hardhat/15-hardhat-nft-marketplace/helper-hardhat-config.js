const networkConfig = {
    default: {
        name: 'hardhat',
        keepersUpdateInterval: '30',
    },
    31337: {
        callbackGasLimit: '500000', // 500,000 gas
        ethUsdPriceFeed: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
        gasLane: '0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c', // 30 gwei
        keepersUpdateInterval: '30',
        mintFee: '10000000000000000', // 0.01 ETH
        name: 'localhost',
        subscriptionId: '588',
    },
    11155111: {
        callbackGasLimit: '500000', // 500,000 gas
        ethUsdPriceFeed: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
        gasLane: '0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c', // 30 gwei
        keepersUpdateInterval: '30',
        mintFee: '10000000000000000', // 0.01 ETH
        name: 'sepolia',
        subscriptionId: '11802', // from VRF Subscription v2.0, see the README (3.2)
        vrfCoordinatorV2: '0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625',
    },
    1: {
        name: 'mainnet',
        keepersUpdateInterval: '30',
    },
};

const developmentChains = ['hardhat', 'localhost'];
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;
const frontEndContractsFile = '../nextjs-nft-marketplace-moralis-fcc/constants/networkMapping.json';
const frontEndContractsFile2 =
    '../nextjs-nft-marketplace-thegraph-fcc/constants/networkMapping.json';
const frontEndAbiLocation = '../nextjs-nft-marketplace-moralis-fcc/constants/';
const frontEndAbiLocation2 = '../nextjs-nft-marketplace-thegraph-fcc/constants/';

module.exports = {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    frontEndContractsFile,
    frontEndContractsFile2,
    frontEndAbiLocation,
    frontEndAbiLocation2,
};
