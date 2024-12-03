import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DropParty } from "../target/types/drop_party";
import { assert } from "chai";

describe("drop_party", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.DropParty as Program<DropParty>;
  const wallet = anchor.AnchorProvider.env().wallet;

  it("Initializes a world", async () => {
    const worldName = "test_player";

    // Derive the PDA for the player account
    const [worldPda, _worldBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("world"), Buffer.from(worldName)],
      program.programId
    );

    // Call the init_player instruction
    const tx = await program.methods
      .initWorld(worldName)
      .accountsStrict({
        admin: wallet.publicKey, // Wallet creating the player
        world: worldPda, // Derived PDA for the player account
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
    const playerUsername = "test_player";

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