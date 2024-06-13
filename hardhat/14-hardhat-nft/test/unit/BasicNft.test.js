const { assert, expect } = require('chai');
const { network, deployments, ethers } = require('hardhat');
const { developmentChains } = require('../../helper-hardhat-config');

!developmentChains.includes(network.name)
    ? describe.skip
    : describe('All the tests', function () {
          describe('My BasicNft tests', function () {
              let basicNft = null;
              beforeEach(async () => {
                  const BasicNft = await ethers.getContractFactory('BasicNft');
                  basicNft = await BasicNft.deploy();
                  await basicNft.deployed();
              });

              it('Should deploy BasicNft', async function () {
                  expect(await basicNft.name()).to.equal('BasicNft');
              });

              it('Should start with a getTokenCounter in zero', async () => {
                  expect(await basicNft.getTokenCounter()).to.equal('0');
              });

              it('Should have the correct name', () => {
                  expect(basicNft.name() === 'BasicNft');
              });

              it('Should have the correct symbol', () => {
                  expect(basicNft.symbol() === 'RBNFT');
              });

              it('Should return the correct value for tokenURI', () => {
                  expect(
                      basicNft.tokenURI() ===
                          'ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json'
                  );
              });

              it('Should Mint correctly', async () => {
                  basicNft.mintNft();
                  expect(await basicNft.getTokenCounter()).to.equal('1');
              });
          });

          describe('From the VIDEO: Basic NFT Unit Tests', function () {
              let basicNft, deployer;

              beforeEach(async () => {
                  accounts = await ethers.getSigners();
                  deployer = accounts[0];
                  await deployments.fixture(['basicnft']);
                  basicNft = await ethers.getContract('BasicNft');
              });

              describe('Constructor', () => {
                  it('Initializes the NFT Correctly.', async () => {
                      const name = await basicNft.name();
                      const symbol = await basicNft.symbol();
                      const tokenCounter = await basicNft.getTokenCounter();
                      assert.equal(name, 'BasicNft');
                      assert.equal(symbol, 'RBNFT');
                      assert.equal(tokenCounter.toString(), '0');
                  });
              });

              describe('Mint NFT', () => {
                  beforeEach(async () => {
                      const txResponse = await basicNft.mintNft();
                      await txResponse.wait(1);
                  });
                  it('Allows users to mint an NFT, and updates appropriately', async function () {
                      const tokenURI = await basicNft.tokenURI(0);
                      const tokenCounter = await basicNft.getTokenCounter();

                      assert.equal(tokenCounter.toString(), '1');
                      assert.equal(tokenURI, await basicNft.TOKEN_URI());
                  });
                  it('Show the correct balance and owner of an NFT', async function () {
                      const deployerAddress = deployer.address;
                      const deployerBalance = await basicNft.balanceOf(deployerAddress);
                      const owner = await basicNft.ownerOf('0');

                      assert.equal(deployerBalance.toString(), '1');
                      assert.equal(owner, deployerAddress);
                  });
              });
          });
      });
