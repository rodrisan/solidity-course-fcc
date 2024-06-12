const networkConfig = {
    default: {
        name: 'hardhat',
        keepersUpdateInterval: '30',
    },
    31337: {
        name: 'localhost',
        subscriptionId: '588',
        gasLane: '0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c', // 30 gwei
        keepersUpdateInterval: '30',
        raffleEntranceFee: ethers.utils.parseEther('0.01'), // 0.01 ETH
        callbackGasLimit: '500000', // 500,000 gas
        mintFee: '10000000000000000', // 0.01 ETH
    },
    11155111: {
        name: 'sepolia',
        subscriptionId: '11802', // from VRF Subscription v2.0, see the README (3.2)
        gasLane: '0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c', // 30 gwei
        keepersUpdateInterval: '30',
        raffleEntranceFee: ethers.utils.parseEther('0.01'), // 0.01 ETH
        callbackGasLimit: '500000', // 500,000 gas
        vrfCoordinatorV2: '0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625',
        mintFee: '10000000000000000', // 0.01 ETH
    },
    1: {
        name: 'mainnet',
        keepersUpdateInterval: '30',
    },
};

const DECIMALS = "18";
const INITIAL_PRICE = "200000000000000000000";
const developmentChains = ["hardhat", "localhost"];

module.exports = {
  networkConfig,
  developmentChains,
  DECIMALS,
  INITIAL_PRICE,
};
