import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("As1ct77Qd8w5Uz1BrwSbHQnNsqJmp1NRFbuGxwyXgY9L");

// Recipient address
const to = new PublicKey("5X39uByHSMasDzri4GGMUyJENq6LftPJQbLqZczp66Kd");

(async () => {
    try {
        // Create a fromATA
        const fromAta = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        );
        console.log(`Your fromAta is: ${fromAta.address.toBase58()}`);

        // Create a toATA
        const toAta = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to
        );
        console.log(`Your toAta is: ${toAta.address.toBase58()}`);

        const amount = 1 * (10 ** 6) // 1 token = 1,000,000 lamports

        // Transfer the new token to the "toTokenAccount" we just created
        const signature = await transfer(
            connection,
            keypair, // Payer & sender
            fromAta.address, // From token account
            toAta.address,  // To token account
            keypair.publicKey, // Owner of source token account
            amount // Number of tokens to send
        );

        console.log(`Transfer successful: https://explorer.solana.com/tx/${signature}?cluster=devnet`);

    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();