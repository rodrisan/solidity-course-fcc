const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const RPC_URL = process.env.RPC_URL || 'http://localhost:8545';
const PRIVATE_KEY_PASSWORD = process.env.PRIVATE_KEY_PASSWORD || '';

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || '';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';
const REPORT_GAS = process.env.REPORT_GAS === 1;

const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY || '';
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || '';

const env = {
    PRIVATE_KEY,
    RPC_URL,
    PRIVATE_KEY_PASSWORD,
    COINMARKETCAP_API_KEY,
    ETHERSCAN_API_KEY,
    REPORT_GAS,
    SEPOLIA_PRIVATE_KEY,
    SEPOLIA_RPC_URL,
};

module.exports = { env };
