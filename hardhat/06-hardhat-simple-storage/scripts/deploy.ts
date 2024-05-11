// imports
import { ethers, run, network } from 'hardhat';
import { ETHERSCAN_API_KEY } from '../utils/env';

// async main
async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        'SimpleStorage'
    );
    console.log('Deploying contract...');
    const simpleStorage = await SimpleStorageFactory.deploy();

    // Not functionable in version 6^ ethers

    await simpleStorage.deployed();
    console.log(`Deployed contract to: ${simpleStorage.address}`);

    // ______________________________________________

    // what happens when we deploy to our hardhat network?
    if (network.config.chainId === 11155111 && ETHERSCAN_API_KEY) {
        console.log('Waiting for block confirmations...');

        // Not functionable in version 6^ ethers ----->
        await simpleStorage.deployTransaction.wait(6);
        // const deploymentReceipt = await simpleStorage.deploymentTransaction().wait(2); // For ethers v6

        await verify(simpleStorage.address, []);

        // ______________________________________________
    }

    const currentValue = await simpleStorage.retrieve();
    console.log(`Current value is: ${currentValue.toString()}`);

    // Update the current value
    const transactionResponse = await simpleStorage.store(7);
    await transactionResponse.wait(1);
    const updatedValue = await simpleStorage.retrieve();
    console.log(`Updated value is ${updatedValue.toString()}`);
}

const verify = async (contractAddress: string, args: undefined[]) => {
    console.log('Verifying contract...');
    try {
        await run('verify:verify', {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e: any) {
        if (e.message.toLowerCase().includes('already verified')) {
            console.log('Already Verified!');
        } else {
            console.log(e);
        }
    }
};

// main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
