import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import wallet from "../dev-wallet.json";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

//import keypair from wallet
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

console.log("Public Key:", keypair.publicKey.toBase58()); // Check if the public key is correct
//create a Solana devnet connection to devnet SOL tokens
const connection = new Connection(process.env.HELIUS_RPC_URL || '');

(async () => {
    try {
        // We're going to claim 2 devnet SOL tokens
        const txhash = await connection.requestAirdrop(keypair.publicKey, 2 * LAMPORTS_PER_SOL);
        console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();