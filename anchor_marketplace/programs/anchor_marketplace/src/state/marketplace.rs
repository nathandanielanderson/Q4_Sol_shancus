us anchor_lang::prelude::*;

#[account]

pub struct Marketplace {
    pub admin: Pubkey,
    pub fee: u16,
    pub bump: u8,
    pub treasury_bump: u8,
    pub reward_bump: u8,
    pub name: String,
}

impl Space for Marketplace {
    const LEN: usize = 8 + 32 + 2 + 1 + 1 + 1 + (4 + 32); // 4bytes for string length + 32bytes for string
}