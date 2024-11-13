use std::char::MAX;

use anchor_lang::prelude::*;
use crate::constants::*;

#[account]
pub struct Game {
    pub authority: Pubkey,
    pub name: String,
}
#[account]
pub struct World {
    pub authority: Pubkey,
    pub name: String,
}
#[account]
pub struct Player {
    pub authority: Pubkey,
    pub username: String,
    pub x_pos: u64, // Unity uses 6 decimal places
    pub y_pos: u64,
    pub z_pos: u64,
} 

impl Game {
    pub const LEN: usize = 
    8 + 
    PUBKEY_L + 
    MAX_NAME_L;
}

impl World {
    pub const LEN: usize = 
    8 + 
    PUBKEY_L + 
    MAX_NAME_L;
}

impl Player {
    pub const LEN: usize = 
    8 + 
    PUBKEY_L + 
    MAX_NAME_L+
    8 + // x_pos
    8 + // y_pos
    8;  // z_pos
}