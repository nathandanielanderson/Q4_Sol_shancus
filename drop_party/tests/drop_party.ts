import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DropParty } from "../target/types/drop_party";
import { assert } from "chai";
import BN from "bn.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, createInitializeMintInstruction, createAssociatedTokenAccountInstruction } from "@solana/spl-token";


describe("drop_party", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.DropParty as Program<DropParty>;
  const wallet = anchor.AnchorProvider.env().wallet;

  //~~~~~~~~Test arguments~~~~~~~~~~~~~
  const worldName = "new_world";

  const dropAmount = 100;
  const dropAmountBN = new BN(dropAmount);
  // Pubkey: 2Gz6trPwDbaHAbDJhq4yhHkTTUyXc9UAkfpEjFuRK5Si (test token mint)
  const MINT_DECIMALS = 9;
  const mint = new anchor.web3.PublicKey("2Gz6trPwDbaHAbDJhq4yhHkTTUyXc9UAkfpEjFuRK5Si");


  const playerUsername = "test_player";
  const logout_x = new BN(10);    // initial x = 0;
  const logout_y = new BN(20);    // initial y = 0;
  const logout_z = new BN(30);    // initial z = 0;
  const logoutCoins = 50;
  const logoutCoinsBN = new BN(logoutCoins); // initialCoins = 0;

  const withdrawAmount = 10;
  const withdrawAmountBN = new anchor.BN(withdrawAmount).mul(
    new anchor.BN(Math.pow(10, MINT_DECIMALS))
  );
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
    console.log("Starting initDrop test...");

    // Validate mint ownership
    const mintInfo = await program.provider.connection.getAccountInfo(mint);
    console.log("Mint Owner (Program ID):", mintInfo?.owner?.toBase58());
    assert.equal(mintInfo?.owner?.toBase58(), TOKEN_PROGRAM_ID.toBase58(), "Mint should be owned by the SPL Token Program");

    // Derive the PDA for the world account
    const [worldPda, _worldBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("world"), Buffer.from(worldName)],
      program.programId
    );

    const adminAta = await anchor.utils.token.associatedAddress({
      mint,
      owner: wallet.publicKey,
    });

    const worldAta = await anchor.utils.token.associatedAddress({
      mint,
      owner: worldPda,
    });

    // Check Admin ATA
    const adminAtaBalance = await program.provider.connection.getTokenAccountBalance(adminAta);
    console.log("Admin ATA Balance:", adminAtaBalance?.value?.amount); // Integer amount in lamports

    // Check World ATA
    const worldAtaBalanceBefore = await program.provider.connection.getTokenAccountBalance(worldAta);
    console.log("World ATA Balance Before:", worldAtaBalanceBefore?.value?.amount); // Integer amount in lamports

    // Adjust dropAmount for decimals
    const dropAmountAdjusted = dropAmount * Math.pow(10, MINT_DECIMALS); // Convert to lamports

    // Call initDrop
    const tx = await program.methods
      .initDrop(worldName, new anchor.BN(dropAmountAdjusted))
      .accountsStrict({
        admin: wallet.publicKey,
        mint,
        world: worldPda,
        adminAta,
        worldAta,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("initDrop Transaction Signature:", tx);

    // Validate balances
    const worldAtaBalanceAfter = await program.provider.connection.getTokenAccountBalance(worldAta);
    console.log("World ATA Balance After:", worldAtaBalanceAfter?.value?.amount); // Integer amount in lamports

    const expectedWorldAtaBalance =
      parseInt(worldAtaBalanceBefore?.value?.amount || "0") + dropAmountAdjusted;

    assert.equal(
      parseInt(worldAtaBalanceAfter?.value?.amount),
      expectedWorldAtaBalance,
      "World ATA balance should match the expected transferred amount"
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
    assert.isTrue(playerAccount.xPos.eq(logout_x), "X position should be updated");
    assert.isTrue(playerAccount.yPos.eq(logout_y), "Y position should be updated");
    assert.isTrue(playerAccount.zPos.eq(logout_z), "Z position should be updated");
    assert.isTrue(playerAccount.coins.eq(logoutCoinsBN), "Coins should be updated");
  });

  it("Withdraws player's coins", async () => {
    console.log("Starting playerWithdraw test...");

    // Derive the PDA for the player account
    const [playerPda, _playerBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("player"), Buffer.from(playerUsername)],
      program.programId
    );

    // Fetch the original player account
    const pretestPlayerAccount = await program.account.player.fetch(playerPda);
    console.log("Pretest Player Account:", pretestPlayerAccount);

    // Derive the PDA for the world account
    const [worldPda, _worldBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("world"), Buffer.from(worldName)],
      program.programId
    );

    // Derive user and world associated token accounts
    const userAta = await anchor.utils.token.associatedAddress({
      mint: mint,
      owner: wallet.publicKey,
    });

    const worldAta = await anchor.utils.token.associatedAddress({
      mint: mint,
      owner: worldPda,
    });

    // Fetch and log the pretest balances in raw integer amounts
    const pretestUserAtaBalanceRaw = await program.provider.connection.getTokenAccountBalance(userAta);
    const pretestWorldAtaBalanceRaw = await program.provider.connection.getTokenAccountBalance(worldAta);

    const pretestUserAtaBalance = parseInt(pretestUserAtaBalanceRaw.value.amount, 10) || 0; // Use lamports
    const pretestWorldAtaBalance = parseInt(pretestWorldAtaBalanceRaw.value.amount, 10) || 0; // Use lamports


    // Call the playerWithdraw instruction
    const tx = await program.methods
      .playerWithdraw(worldName, withdrawAmountBN)
      .accountsStrict({
        user: wallet.publicKey,
        mint: mint,
        world: worldPda,
        userAta,
        worldAta,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Transaction signature:", tx);

    // Fetch and log the post-test balances in raw integer amounts
    const posttestUserAtaBalanceRaw = await program.provider.connection.getTokenAccountBalance(userAta);
    const posttestWorldAtaBalanceRaw = await program.provider.connection.getTokenAccountBalance(worldAta);

    const posttestUserAtaBalance = parseInt(posttestUserAtaBalanceRaw.value.amount, 10) || 0; // Use lamports
    const posttestWorldAtaBalance = parseInt(posttestWorldAtaBalanceRaw.value.amount, 10) || 0; // Use lamports


    // Calculate expected balances
    const withdrawAmountInLamports = withdrawAmountBN.toNumber(); // Convert to integer lamports
    const expectedUserAtaBalance = pretestUserAtaBalance + withdrawAmountInLamports;
    const expectedWorldAtaBalance = pretestWorldAtaBalance - withdrawAmountInLamports;


    // Assertions
    assert.equal(
      posttestUserAtaBalance,
      expectedUserAtaBalance,
      "User ATA balance should match expected balance"
    );

    assert.equal(
      posttestWorldAtaBalance,
      expectedWorldAtaBalance,
      "World ATA balance should match expected balance"
    );
  });

});

