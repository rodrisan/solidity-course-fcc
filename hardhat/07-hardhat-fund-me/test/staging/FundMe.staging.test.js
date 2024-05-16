const { assert } = require('chai');
const { network, ethers, getNamedAccounts } = require('hardhat');

const { developmentChains } = require('../../helper-hardhat-config');

/*
 TODO: Check why this test is failing with Sepolia

 Error: insufficient funds for intrinsic transaction cost
 [ See: https://links.ethers.org/v5-errors-INSUFFICIENT_FUNDS ]
 (error={"name":"ProviderError","_stack":"ProviderError:
 insufficient funds for gas * price + value: balance 105202940963963169,
 tx cost 783440955887173656, overshot 678238014923210487
*/
developmentChains.includes(network.name)
    ? describe.skip
    : describe('FundMe Staging Tests', function () {
          let deployer;
          let fundMe;
          const sendValue = ethers.utils.parseEther('0.02');
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer;
              fundMe = await ethers.getContract('FundMe', deployer);
          });

          it('allows people to fund and withdraw', async function () {
              const fundTxResponse = await fundMe.fund({
                  value: sendValue,
              });
              await fundTxResponse.wait(1);
              const withdrawTxResponse = await fundMe.withdraw();
              await withdrawTxResponse.wait(1);

              const endingFundMeBalance = await fundMe.provider.getBalance(
                  fundMe.address
              );
              console.log(
                  endingFundMeBalance.toString() +
                      ' should equal 0, running assert equal...'
              );
              assert.equal(
                  endingBalance.toString(),
                  ethers.utils.parseEther('0')
              );
          });
      });
