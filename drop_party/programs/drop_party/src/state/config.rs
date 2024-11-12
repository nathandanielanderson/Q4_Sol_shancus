use anchor_lang::prelude::*;
use crate::constants::*;

#[account]
pub struct GamePDA {
    pub authority: Pubkey,
}
#[account]
pub struct PlayerPDA {
    pub authority: Pubkey,
} 

impl GamePDA {
    pub const LEN: 8 + PUBKEY_L;
}