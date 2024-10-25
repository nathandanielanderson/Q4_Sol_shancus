use anchor_lang::prelude::*;


#[account]
#[derive(InitSpace)]
pub struct Escrow {
    pub seed: u64,
    pub maker: Pubkey,
    pub mint_a: Pubkey, // Mint user is offering
    pub mint_b: Pubkey, // Mint user asks in return
    pub receive: u64,
    pub bump: u8,
}
