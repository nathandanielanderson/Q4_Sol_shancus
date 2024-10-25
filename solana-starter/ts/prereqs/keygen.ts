import { Keypair } from "@solana/web3.js";

//Generate new keypair
let kp = Keypair.generate();
console.log(`You've generated a new Solana wallet: ${kp.publicKey.toBase58()}`);

console.log(`secretKey: [${kp.secretKey}]`);