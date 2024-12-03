import { Transaction, SystemProgram, Connection, Keypair, LAMPORTS_PER_SOL, sendAndConfirmTransaction, PublicKey } from "@solana/web3.js";
import wallet from "../dev-wallet.json";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Import keypair from wallet
const from = Keypair.fromSecretKey(new Uint8Array(wallet));

// Define Turbin3 public key
const to = new PublicKey("B7XdPS3HfCFt5RS3RH1t8xeH6XsaFL8Hj8wdWhNSLkWe");

// Create a Solana devnet connection
const connection = new Connection(process.env.HELIUS_RPC_URL || '');

// (async () => {
//     try {
//         //create txn for transferring SOL
//         const transaction = new Transaction().add(
//             SystemProgram.transfer({
//                 fromPubkey: from.publicKey,
//                 toPubkey: to,
//                 lamports: LAMPORTS_PER_SOL / 100, //0.01 SOL
//             }));
//         //get latest blockhash and set it in the transaction
//         transaction.recentBlockhash = (await
//             connection.getLatestBlockhash('confirmed')).blockhash;
//         transaction.feePayer = from.publicKey;
//         //sign, send, and confirm the transaction
//         const signature = await sendAndConfirmTransaction(
//             connection,
//             transaction,
//             [from]);
//         console.log(`Success! Check out your TX here:
//         https://explorer.solana.com/tx/${signature}?cluster=devnet`);
//     } catch (e) {
//         console.error(`Oops, something went wrong: ${e}`)
//     }
// })();

(async () => {
    try {

        // Get balance of dev wallet
        const balance = await connection.getBalance(from.publicKey)

        // Create a test transaction to calculate fees
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey, // Sender's public key
                toPubkey: to,               // Recipient's public key
                lamports: balance,          // Transfer full balance (note: transaction fees will prevent full transfer)
            }));

        // Set the latest blockhash in the transaction for transaction validity on the network
        transaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;

        // Set the fee payer for the transaction (who will cover the transaction cost)
        transaction.feePayer = from.publicKey;

        // Calculate exact fee rate to transfer entire SOL amount out of account minus fees
        const fee = (await connection.getFeeForMessage(
            transaction.compileMessage(), // Prepare the transaction message
            'confirmed' // Block confirmation level ('confirmed is usually safe but 'finalized' is more secure)
        )).value || 0;  // If no value is returned, default to 0 (edge case but safe handling) 

        // Remove our transfer instruction to replace it
        transaction.instructions.pop();

        // Now add the instruction back with correct amount of lamports (balance minus fees)
        transaction.add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey, // Sender's public key
                toPubkey: to,               // Recipient's public key
                lamports: balance - fee,    // Transfer the balance minus the fee to avoid overdraw
            }));

        // Sign transaction, broadcast, and confirm
        const signature = await sendAndConfirmTransaction(
            connection,  // Solana network connection
            transaction, // Transaction object
            [from]       // Array of signers (in this case, just the sender)
        );
        // Log the transaction signature 
        console.log(`Success! Check out your TX here:
        https://explorer.solana.com/tx/${signature}?cluster=devnet`)

    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`) // Catch any errors that occured during the process and log them
    }
})();
