import { ethers } from 'ethers';
import * as fs from 'fs-extra';
import 'dotenv/config';

import { env } from './constants';
import { SimpleStorage_sol_SimpleStorage } from './SimpleStorage_sol_SimpleStorage';

async function main() {
    const ABI = fs.readFileSync(
        './SimpleStorage_sol_SimpleStorage.abi',
        'utf8'
    );
    const PRIVATE_KEY = env.privateKey;
    const provider = new ethers.JsonRpcProvider(env.rpcUrl);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    const ct = new ethers.Contract(
        '0xE390BA08b14020CCAf3a18d272AC0f52824b54A7',
        ABI
    );

    const contract = ct.connect(wallet) as SimpleStorage_sol_SimpleStorage;

    const addPerson = await contract.addPerson('Rod', '2024');

    console.log('Please wait...');
    await addPerson.wait(1);
    console.log('Person', await contract.people('0'));

    console.log('\nPlease wait, obtaining the favorite number...');
    console.log(
        '\n[Favourite number]: ',
        (await contract.retrieve()).toString()
    );
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch((e) => {
        console.log('[ERROR]: ', e);
        process.exit(1);
    });
