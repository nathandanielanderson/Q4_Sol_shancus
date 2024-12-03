import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DropParty } from "../target/types/drop_party";
import { assert } from "chai";
import BN from "bn.js";

describe("drop_party", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.DropParty as Program<DropParty>;
  const wallet = anchor.AnchorProvider.env().wallet;

  //~~~~~~~~Test arguments~~~~~~~~~~~~~
  const worldName = "test_world";
  const playerUsername = "test_player";
  const dropAmount = new BN(100);
  const MINT_ID = [
    0x2F, 0x67, 0x7A, 0x6D, 0x6C, 0x72, 0x50, 0x77, 0x44, 0x62, 0x61, 0x48, 0x41, 0x62, 0x44, 0x4A,
    0x68, 0x71, 0x34, 0x79, 0x68, 0x48, 0x6B, 0x54, 0x54, 0x55, 0x79, 0x58, 0x63, 0x39, 0x55, 0x41,
  ]; // Pubkey: 2Gz6trPwDbaHAbDJhq4yhHkTTUyXc9UAkfpEjFuRK5Si (test token mint)
  const MINT_DECIMALS = 9;
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  it("Initializes a world", async () => {

    // Derive the PDA for the world account
    const [worldPda, _worldBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("world"), Buffer.from(worldName)],
      program.programId
    );

    // Call the init_world instruction
    const tx = await program.methods
      .initWorld(worldName)
      .accountsStrict({
        admin: wallet.publicKey, // Wallet creating the player
        world: worldPda, // Derived PDA for the player account
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Transaction signature:", tx);

    // Fetch the world account to verify initialization
    const worldAccount = await program.account.world.fetch(worldPda);

    // Assertions to validate the state of the world account
    console.log("World account data:", worldAccount);
    assert.equal(worldAccount.authority.toBase58(), wallet.publicKey.toBase58());
    assert.equal(worldAccount.name, worldName);
    assert.ok(worldAccount.bump !== undefined); // Ensure bump is set
  });

  it("Initializes a drop", async () => {

    // Derive the PDA for the world account
    const [worldPda, _worldBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("world"), Buffer.from(worldName)],
      program.programId
    );

    // Derive admin and world associated token accounts
    const adminAta = await anchor.utils.token.associatedAddress({
      mint: new anchor.web3.PublicKey(MINT_ID), // Replace with actual MINT_ID
      owner: wallet.publicKey,
    });

    const worldAta = await anchor.utils.token.associatedAddress({
      mint: new anchor.web3.PublicKey(MINT_ID), // Replace with actual MINT_ID
      owner: worldPda,
    });

    // Call the init_drop instruction
    const tx = await program.methods
      .initDrop(worldName, dropAmount)
      .accountsStrict({
        admin: wallet.publicKey,
        mint: new anchor.web3.PublicKey(MINT_ID),
        world: worldPda,
        adminAta,
        worldAta,
        associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Transaction signature:", tx);

    // Fetch the player account to verify initialization
    const worldAccount = await program.account.world.fetch(worldPda);

    // Assertions to validate the state of the player account
    console.log("World account data:", worldAccount);
    assert.equal(worldAccount.authority.toBase58(), wallet.publicKey.toBase58());
    assert.equal(worldAccount.name, worldName);
    assert.ok(worldAccount.bump !== undefined); // Ensure bump is set
  });

  it("Initializes a player", async () => {

    // Derive the PDA for the player account
    const [playerPda, _playerBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("player"), Buffer.from(playerUsername)],
      program.programId
    );

    // Call the init_player instruction
    const tx = await program.methods
      .initPlayer(playerUsername)
      .accountsStrict({
        user: wallet.publicKey, // Wallet creating the player
        player: playerPda, // Derived PDA for the player account
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Transaction signature:", tx);

    // Fetch the player account to verify initialization
    const playerAccount = await program.account.player.fetch(playerPda);

    // Assertions to validate the state of the player account
    console.log("Player account data:", playerAccount);
    assert.equal(playerAccount.authority.toBase58(), wallet.publicKey.toBase58());
    assert.equal(playerAccount.username, playerUsername);
    assert.ok(playerAccount.bump !== undefined); // Ensure bump is set
  });

});