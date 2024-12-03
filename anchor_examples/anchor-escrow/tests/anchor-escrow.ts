import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorEscrow } from "../target/types/anchor_escrow";

describe("anchor-escrow initialization", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();// sets provider from Anchor.toml
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorEscrow as Program<AnchorEscrow>; // loads methods and Program ID

  // Define the Escrow maker. The test wallet.
  const maker = provider.wallet.publicKey;

  // Seed to enable maker to create more than one Escrow
  const seed = new anchor.BN(Date.now()).toArrayLike(Buffer, "le", 8);  // Using current timestamp for uniqueness

  // Define SPL Mints
  let mint_a: anchor.web3.PublicKey;
  let mint_b: anchor.web3.PublicKey;

  // Amounts for transaction


  it("Make Escrow", async () => {
    const tx = await program.methods.initialize().rpc();


    console.log("Your transaction signature", tx);
  });
});
