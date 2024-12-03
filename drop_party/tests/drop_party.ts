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

  const dropAmount = 100;
  const dropAmountBN = new BN(dropAmount);
  const MINT_ID = [0x2F, 0x67, 0x7A, 0x6D, 0x6C, 0x72, 0x50, 0x77, 0x44, 0x62, 0x61, 0x48, 0x41, 0x62, 0x44, 0x4A,
    0x68, 0x71, 0x34, 0x79, 0x68, 0x48, 0x6B, 0x54, 0x54, 0x55, 0x79, 0x58, 0x63, 0x39, 0x55, 0x41,];
  // Pubkey: 2Gz6trPwDbaHAbDJhq4yhHkTTUyXc9UAkfpEjFuRK5Si (test token mint)
  const MINT_DECIMALS = 9;

  const playerUsername = "test_player";
  const logout_x = new BN(10);    // initial x = 0;
  const logout_y = new BN(20);    // initial y = 0;
  const logout_z = new BN(30);    // initial z = 0;
  const logoutCoins = 50;
  const logoutCoinsBN = new BN(logoutCoins); // initialCoins = 0;

  const withdrawAmount = 10;
  const withdrawAmountBN = new BN(withdrawAmount);
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
      .initDrop(worldName, dropAmountBN)
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

    // Fetch and verify the world_ata balance
    const worldAtaAccount = await program.provider.connection.getTokenAccountBalance(worldAta);
    console.log("World ATA balance:", worldAtaAccount.value.uiAmount);

    // Assertions
    assert.equal(
      worldAtaAccount.value.uiAmount,
      dropAmount / Math.pow(10, MINT_DECIMALS), // Adjust for decimals
      "World ATA balance should match the transferred amount"
    );
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

  it("Logs player out and updates state", async () => {

    // Derive the PDA for the player account
    const [playerPda, _playerBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("player"), Buffer.from(playerUsername)],
      program.programId
    );

    // Update the player's position and coins via logout
    const tx = await program.methods
      .playerLogout(
        logout_x,
        logout_y,
        logout_z,
        logoutCoinsBN
      )
      .accountsStrict({
        user: wallet.publicKey,
        player: playerPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Transaction signature:", tx);

    // Fetch the updated player account
    const playerAccount = await program.account.player.fetch(playerPda);

    // Assertions
    console.log("Player account data after logout:", playerAccount);
    assert.equal(playerAccount.xPos, logout_x, "X position should be updated");
    assert.equal(playerAccount.yPos, logout_y, "Y position should be updated");
    assert.equal(playerAccount.zPos, logout_z, "Z position should be updated");
    assert.equal(playerAccount.coins, logoutCoinsBN, "Coins should be updated");
  });

  it("Withdraws player's coins", async () => {


    // Derive the PDA for the player account
    const [playerPda, _playerBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("player"), Buffer.from(playerUsername)],
      program.programId
    );

    // Fetch the original player account
    const pretestPlayerAccount = await program.account.player.fetch(playerPda);

    // Derive the PDA for the world account
    const [worldPda, _worldBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("world"), Buffer.from(worldName)],
      program.programId
    );

    // Derive user and world associated token accounts
    const userAta = await anchor.utils.token.associatedAddress({
      mint: new anchor.web3.PublicKey(MINT_ID), // Replace with actual MINT_ID
      owner: wallet.publicKey,
    });

    const worldAta = await anchor.utils.token.associatedAddress({
      mint: new anchor.web3.PublicKey(MINT_ID), // Replace with actual MINT_ID
      owner: worldPda,
    });

    // Call the init_drop instruction
    const tx = await program.methods
      .playerWithdraw(worldName, withdrawAmountBN)
      .accountsStrict({
        user: wallet.publicKey,
        mint: new anchor.web3.PublicKey(MINT_ID),
        world: worldPda,
        userAta,
        worldAta,
        associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Transaction signature:", tx);

    // Fetch and verify the user_ata balance
    const userAtaAccount = await program.provider.connection.getTokenAccountBalance(userAta);
    console.log("User ATA balance:", userAtaAccount.value.uiAmount);

    // Fetch the updated player account
    const playerAccount = await program.account.player.fetch(playerPda);

    // Assertions
    assert.equal(playerAccount.coins, pretestPlayerAccount - playerAccount.coins, "Coins should be updated");

  });

});
