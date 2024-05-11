import { ethers } from 'ethers';
import * as fs from 'fs-extra';
import 'dotenv/config';

import { env } from './constants';

async function main() {
    const wallet = new ethers.Wallet(env.privateKey);

    const encryptedJsonKey = await wallet.encrypt(env.privateKeyPassword);
    console.log(encryptedJsonKey);
    fs.writeFileSync('./.encryptedKey.json', encryptedJsonKey);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
