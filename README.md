# Drop Party Protocol
## Devnet Program Address: `37yRf2iJ11DyNyreMCbGxLGhzWSTpr5MRZAJmK8JdCzx`
The Drop Party Protocol governs the interactions between players, the world, and the Solana blockchain. 

```
    ├── Q4_Sol_shancus  
      ├── drop_party  
        ├── programs  
            ├── drop_party 
                ├── src  
                    ├── instructions  
                        ├── init_drop.rs        # Handles drop initialization  
                        ├── init_player.rs      # Handles player initialization  
                        ├── init_world.rs       # Handles world initialization  
                        ├── mod.rs              # Instruction module declaration  
                        ├── player_logout.rs    # Handles player logout logic  
                        └── player_withdraw.rs  # Handles player token withdrawals  
                    ├── state  
                        ├── config.rs           # Stores global configuration  
                        ├── mod.rs              # State module declaration  
                        ├── constants.rs        # Defines project-wide constants  
                        ├── error.rs            # Error handling for the program  
                        └── lib.rs              # Program library entry point
```

Below is a high-level summary of the protocol flow:

### World Initialization
The Admin Wallet initializes the world by creating:
- A World PDA: The world’s unique on-chain account for storing state.


### Drop Initialization
- A World ATA: The token account associated with the world for managing its balance.
- Tokens are transferred to the World ATA, establishing the total token supply available for gameplay.
- Coins rain down in the game, instantiating as many coins as token were made available until World ATA is empty.

### Player Initialization
When a player joins:
- A Player PDA is created, linked to their User Wallet, and initialized with:
  - Username: The player’s chosen name.
  - Position: Starting coordinates in the game world.
  - Coins: Initial token balance (0).

### Player Logout
- The player’s PDA is updated to record their position and token balance before they leave the game.

### Player Withdrawal
Players can withdraw tokens from the game into their connected wallet:
- A token transfer occurs from the World ATA to the User Wallet ATA.
- The in-game state tracks the remaining in-game tokens a player has.


