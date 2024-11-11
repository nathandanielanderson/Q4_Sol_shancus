import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DpTestCpi } from "../target/types/dp_test_cpi";

describe("dp_test_cpi", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.DpTestCpi as Program<DpTestCpi>;

  it("Logs a message to Solana!", async () => {
    // Add your test here.
    const message = "Hello from Typescript!";
    const tx = await program.methods
      .logMessage(message)
      .accounts({
        signer: provider.wallet.publicKey,
      })
      .rpc();

    console.log("Your transaction signature", tx);
  });
});
