import wallet from "../wba-wallet.json"
import bs58 from 'bs58';
import { PublicKey, Connection, Keypair, SystemProgram } from '@solana/web3.js';
import { publicKey as publicKeySerializer, string } from '@metaplex-foundation/umi/serializers';
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import {
    createMetadataAccountV3,
    CreateMetadataAccountV3InstructionAccounts,
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";

// Define our Mint address
const mint = publicKey("As1ct77Qd8w5Uz1BrwSbHQnNsqJmp1NRFbuGxwyXgY9L");

// Define SystemPrgram as PublickKey
const sysProg = publicKey(SystemProgram.programId);

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {

        const tokenMetadataProgramId = publicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
        const metadata = umi.eddsa.findPda(tokenMetadataProgramId, [
            string({ size: 'variable' }).serialize('metadata'),
            publicKeySerializer().serialize(tokenMetadataProgramId),
            publicKeySerializer().serialize(mint),
        ]);

        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            metadata, // The PDA we just derived
            mint, // The pubkey of the mint
            mintAuthority: signer, // Pubkey with mint authority
            payer: signer, // The payer for transaction fees
            updateAuthority: signer, // Authority to update the metadata
            systemProgram: sysProg // System program to create new accounts
        };

        let data: DataV2Args = {
            name: "Turbin3 Shancus", // Token name
            symbol: "NDA", // Token symbol
            uri: "",
            sellerFeeBasisPoints: 0, // Secondary sales royalty (0%)
            creators: null,
            collection: null,
            uses: null,
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data, // Metadata we defined above
            isMutable: true, // Allow future updates to the metadata
            collectionDetails: null,
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
