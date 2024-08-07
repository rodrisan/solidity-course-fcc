const { assert, expect } = require('chai');
const { deployments, ethers, getNamedAccounts } = require('hardhat');

const { developmentChains } = require('../../helper-hardhat-config');

!developmentChains.includes(network.name)
    ? describe.skip
    : describe('FundMe', () => {
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
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  );
                  assert.equal(response.toString(), sendValue.toString());
              });

              it('adds funder to array of funders', async () => {
                  await fundMe.fund({ value: sendValue });
                  const funder = await fundMe.getFunder(0);
                  assert.equal(funder, deployer);
              });
          });

          describe('withdraw', function () {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue });
              });
              it('withdraws ETH from a single funder', async () => {
                  // Arrange
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address);
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);

                  // Act
                  const transactionResponse = await fundMe.withdraw();
                  const transactionReceipt = await transactionResponse.wait();
                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const gasCost = gasUsed.mul(effectiveGasPrice);

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);

                  // Assert
                  // Maybe clean up to understand the testing
                  assert.equal(endingFundMeBalance, 0);
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  );
              });

              // this test is overloaded. Ideally we'd split it into multiple tests
              // but for simplicity we left it as one
              it('is allows us to withdraw with multiple funders', async () => {
                  // Arrange
                  const accounts = await ethers.getSigners();
                  for (i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      );
                      await fundMeConnectedContract.fund({ value: sendValue });
                  }
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address);
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);

                  // Act
                  const transactionResponse = await fundMe.cheaperWithdraw();
                  // Let's comapre gas costs :)
                  // const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait();
                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const withdrawGasCost = gasUsed.mul(effectiveGasPrice);
                  console.log(`GasCost: ${withdrawGasCost}`);
                  console.log(`GasUsed: ${gasUsed}`);
                  console.log(`GasPrice: ${effectiveGasPrice}`);
                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);
                  // Assert
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(withdrawGasCost).toString()
                  );
                  // Make a getter for storage variables
                  await expect(fundMe.getFunder(0)).to.be.reverted;

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      );
                  }
              });

              it('only allows the owner to withdraw', async () => {
                  const accounts = await ethers.getSigners();
                  const notOwner = accounts[1];
                  const attackerConnectedContract = await fundMe.connect(
                      notOwner
                  );
                  await expect(
                      attackerConnectedContract.withdraw()
                  ).to.be.revertedWith('FundMe__NotOwner');
              });
          });

          describe('getVersion', function () {
              it('returns the version of the contract', async () => {
                  const response = await fundMe.getVersion();
                  assert.equal(response, '0');
              });
          });

          describe('getOwner', function () {
              it('returns the owner of the contract', async () => {
                  const response = await fundMe.getOwner();
                  assert.equal(response, deployer);
              });
          });
      });
