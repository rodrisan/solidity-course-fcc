const { deployments, ethers, getNamedAccounts } = require('hardhat');
const { assert, expect } = require('chai');

describe('FundMe', () => {
    let fundMe;
    let deployer;
    let mockV3Aggregator;
    const sendValue = ethers.utils.parseEther('1.0'); // 1000000000000000000
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

    describe('fund', () => {
        it("fails if we don't send enought ETH", async () => {
            await expect(fundMe.fund()).to.be.revertedWith(
                'You need to spend more ETH!'
            );
        });

        it('update the amount funded data structure', async () => {
            await fundMe.fund({ value: sendValue });
            const response = await fundMe.getAddressToAmountFunded(deployer);
            assert.equal(response.toString(), sendValue.toString());
        });

        it('adds funder to array of funders', async () => {
            await fundMe.fund({ value: sendValue });
            const funder = await fundMe.s_funders(0);
            assert.equal(funder, deployer);
        });
    });
});
