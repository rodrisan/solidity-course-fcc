const { deployments, ethers, getNamedAccounts } = require('hardhat');
const { assert } = require('chai');

describe('FundMe', () => {
    let fundMe;
    let deployer;
    let mockV3Aggregator;
    beforeEach(async () => {
        const accounts = await ethers.getSigners();

        // Deploy fund me contract using hardhat-deploy
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(['all']);

        fundMe = await ethers.getContract('FundMe', deployer);
        mockV3Aggregator = await ethers.getContract(
            'MockV3Aggregator',
            deployer
        );
    });

    describe('Constructor', () => {
        it('sets the aggregator addresses correctly', async () => {
            const response = await fundMe.getPriceFeed();
            assert.equal(response, mockV3Aggregator.address);
        });
    });
});
