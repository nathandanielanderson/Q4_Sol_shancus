import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorVault } from "../target/types/anchor_vault";
import { assert } from "chai";

describe("anchor-vault initialization", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();// sets provider from Anchor.toml
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorVault as Program<AnchorVault>; // loads methods and Program ID

  // Define the user/vault owner. The test wallet.
  const user = provider.wallet.publicKey;

  // Define PDA accounts
  let vaultStatePda: anchor.web3.PublicKey;
  let vaultPda: anchor.web3.PublicKey;
  let vaultBump: number;
  let stateBump: number;

  // Amount to deposit (1 SOL = 1,000,000,000 lamports) and withdraw (.5 SOL = 500,000,000 lamports)
  const depositAmount = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);
  const withdrawAmount = new anchor.BN(0.5 * anchor.web3.LAMPORTS_PER_SOL);
  before(async () => {
    // Derive PDA for vault_state
    [vaultStatePda, stateBump] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("state"), user.toBuffer()],
      program.programId
    );

    // Derive PDA for vault
    [vaultPda, vaultBump] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), vaultStatePda.toBuffer()],
      program.programId
    );
  });

  it("Initializes the vault and vault_state", async () => {
    // Perform initialization transaction
    const tx = await program.methods
      .initialize()
      .accounts({
        user: user,
        vault_state: vaultStatePda,
        vault: vaultPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      }).rpc();

    console.log("Initialized Vault with transaction signature", tx);

    // Fetch the vault state account to check if the bumps are stored correctly
    const vaultState = await program.account.vaultState.fetch(vaultStatePda);

    // Assertions to ensure the vault state was correctly initialized
    assert.equal(vaultState.vaultBump, vaultBump, "vault bump mismatch");
    assert.equal(vaultState.stateBump, stateBump, "vault bump mismatch");

  });

  it("Deposits SOL into the vault", async () => {

    // Deposit
    const tx = await program.methods
      .deposit(depositAmount)
      .accounts({
        user: user,
        vault: vaultPda,
        vault_state: vaultStatePda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Deposited 1 SOL (" + depositAmount.toNumber() + " lamports) with transaction signature:" + tx);

    // Fetch vault account info after deposit
    const vaultAccount = await provider.connection.getAccountInfo(vaultPda);

    // Assert that the vault balance increased by the deposit amount
    assert.ok(vaultAccount.lamports >= depositAmount.toNumber(), "Vault balance mismatch after deposit");

  });

  it("Withdraws SOL from the vault", async () => {
    // Perform the withdrawal transaction
    const tx = await program.methods
      .withdraw(withdrawAmount)
      .accounts({
        user: user,
        vault: vaultPda,
        vault_state: vaultStatePda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Withdrew .5 SOL (" + withdrawAmount.toNumber() + " lamports) with transaction signature:" + tx);

    // Fetch vault account info after deposit
    const vaultAccount = await provider.connection.getAccountInfo(vaultPda);

    // Assert that the vault balance decreased by the withdraw amount
    assert.ok(vaultAccount.lamports <= depositAmount.toNumber() - withdrawAmount.toNumber(), "Vault balance mismatch after withdraw");

  });

  it("Closes the vault", async () => {
    const tx = await program.methods
      .close()
      .accounts({
        user: user,
        vault: vaultPda,
        vault_state: vaultStatePda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Closed vault with transaction signature:", tx);

    // Verify the vault state account is closed (should throw an error if closed)
    try {
      await program.account.vaultState.fetch(vaultStatePda);
      assert.fail("Vault state account should be closed, but it was not");
    } catch (err) {
      assert.ok(err.message.includes("Account does not exist"), "Expected vault_state to be closed");
    }
  });

});
