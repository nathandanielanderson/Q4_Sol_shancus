
use anchor_lang::prelude::*;
use crate::constants::*;

#[account]
pub struct World {
    pub authority: Pubkey,
    pub name: String,
    pub bump: u8,
}
#[account]
pub struct Player {
    pub authority: Pubkey,
    pub username: String,
    pub x_pos: u64, // Unity uses 6 decimal places
    pub y_pos: u64,
    pub z_pos: u64,
    pub coins: u64, // The amount of coins the player has in-game
    pub bump: u8,
} 

impl World {
    pub const LEN: usize = 
    8 +          // discriminator
    PUBKEY_L +   // authority
    MAX_NAME_L + // name
    1;           // bump
}

impl Player {
    pub const LEN: usize = 
    8 + 
    PUBKEY_L + 
    MAX_NAME_L+
    8 + // x_pos
    8 + // y_pos
    8 + // z_pos
    8 + // coins
    1;  // bump
}