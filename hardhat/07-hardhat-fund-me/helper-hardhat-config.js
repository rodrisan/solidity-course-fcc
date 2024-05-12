const networkConfig = {
    11155111: {
        name: 'sepolia',
        ethUsdPriceFeed: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
        blockConfirmations: 1,
    },
    137: {
        name: 'polygon',
        ethUsdPriceFeed: '0xF9680D99D6C9589e2a93a78A04A279e509205945',
        blockConfirmations: 1,
    },
    // 31337
};

const developmentChains = ['hardhat', 'localhost'];

const DECIMALS = 8;
const INITIAL_PRICE = '200000000000'; // 2000

module.exports = { networkConfig, developmentChains, DECIMALS, INITIAL_PRICE };
