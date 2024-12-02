use std::char::MAX;

use anchor_lang::prelude::*;
use crate::constants::*;

#[account]
pub struct Game {
    pub authority: Pubkey,
    pub wallet: Pubkey,
    pub wallet_bump: u8,
    pub name: String,
    pub bump: u8,
    
}
#[account]
pub struct World {
    pub authority: Pubkey,
    pub wallet: Pubkey,
    pub wallet_bump: u8,
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
    pub bump: u8,
} 

impl Game {
    pub const LEN: usize = 
    8 + 
    PUBKEY_L + 
    PUBKEY_L + 
    MAX_NAME_L;
}

impl World {
    pub const LEN: usize = 
    8 +          // discriminator
    PUBKEY_L +   // authority
    PUBKEY_L +   // wallet
    1 +          // wallet_bump 
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
    1;  // bump
}