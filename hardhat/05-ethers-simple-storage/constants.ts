const rpcUrl = process.env.RPC_URL!;
const privateKey = process.env.PRIVATE_KEY!;
const privateKeyPassword = process.env.PRIVATE_KEY_PASSWORD!;
const env = { privateKey, privateKeyPassword, rpcUrl };

export { env };
