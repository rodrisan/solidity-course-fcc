const { ethers, getNamedAccounts, network } = require('hardhat');
const { networkConfig } = require('../helper-hardhat-config');
const { getWeth, AMOUNT } = require('../scripts/getWeth');

const BORROW_MODE = 2; // Variable borrow mode. Stable was disabled.
const PERCENT_TO_BORROW = 0.95; // 95%

async function main() {
    await getWeth();
    const { deployer } = await getNamedAccounts();
    const lendingPool = await getLendingPool(deployer);
    const wethTokenAddress = networkConfig[network.config.chainId].wethToken;
    await approveERC20(wethTokenAddress, lendingPool.address, AMOUNT, deployer);
    console.log('Depositing WETH...');
    await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0);
    console.log('Desposited!');
    // Getting your borrowing stats
    let { availableBorrowsETH } = await getBorrowUserData(lendingPool, deployer);
    const daiPrice = await getDaiPrice();
    const amountDaiToBorrow =
        availableBorrowsETH.toString() * PERCENT_TO_BORROW * (1 / daiPrice.toNumber());
    console.log(`You can borrow ${amountDaiToBorrow} DAI`);

    const amountDaiToBorrowWei = ethers.utils.parseEther(amountDaiToBorrow.toString());
    const daiTokenAddress = networkConfig[network.config.chainId].daiToken;
    await borrowDai(daiTokenAddress, lendingPool, amountDaiToBorrowWei, deployer);
    // const { totalDebtETH } = await getBorrowUserData(lendingPool, deployer);
    await getBorrowUserData(lendingPool, deployer);

    // How to repay all the debt incluing interests at this time?
    // const totalDebtWei = ethers.utils.parseEther(totalDebtETH.toString());
    // console.log('totalDebtWei', totalDebtWei);

    await repay(amountDaiToBorrowWei, daiTokenAddress, lendingPool, deployer);
    await getBorrowUserData(lendingPool, deployer);
}

async function repay(amount, daiAddress, lendingPool, account) {
    await approveERC20(daiAddress, lendingPool.address, amount, account);
    const repayTx = await lendingPool.repay(daiAddress, amount, BORROW_MODE, account);
    repayTx.wait(1);
    console.log('Repaid!');
}

async function borrowDai(daiAddress, lendingPool, amountDaiToBorrow, account) {
    const borrowTx = await lendingPool.borrow(
        daiAddress,
        amountDaiToBorrow,
        BORROW_MODE,
        0,
        account
    );
    await borrowTx.wait(1);
    console.log("You've borrowed!");
}

async function getDaiPrice() {
    const daiEthPriceFeed = await ethers.getContractAt(
        'AggregatorV3Interface',
        networkConfig[network.config.chainId].daiEthPriceFeed
    );
    const price = (await daiEthPriceFeed.latestRoundData())[1];
    console.log(`The DAI/ETH price is ${price.toString()}`);
    return price;
}

async function getBorrowUserData(lendingPool, account) {
    const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
        await lendingPool.getUserAccountData(account);
    console.log(`You have ${totalCollateralETH} worth of ETH deposited.`);
    console.log(`You have ${totalDebtETH} worth of ETH borrowed.`);
    console.log(`You can borrow ${availableBorrowsETH} worth of ETH.`);
    return { availableBorrowsETH, totalDebtETH };
}

async function getLendingPool(account) {
    const lendingPoolAddressProvider = await ethers.getContractAt(
        'ILendingPoolAddressesProvider',
        '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5',
        account
    );

    const lendingPoolAddress = await lendingPoolAddressProvider.getLendingPool();
    const lendingPool = await ethers.getContractAt('ILendingPool', lendingPoolAddress, account);

    return lendingPool;
}

async function approveERC20(ec20Address, spenderAddress, amountToSpend, account) {
    const erc20Token = await ethers.getContractAt('IERC20', ec20Address, account);
    const tx = await erc20Token.approve(spenderAddress, amountToSpend);
    console.log('Approved!');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
