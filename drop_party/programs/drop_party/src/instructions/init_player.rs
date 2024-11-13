use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Mint, InitializeAccount};
use crate::state::config::*;

#[derive(Accounts)]
pub struct InitPlayer<'info> {
    #[account(mut)]
    player: Account<'info, Player>,
    
}

impl<'info> InitPlayer<'info> {
    pub fn initialize_player(&self) -> Result<()> {
        
        Ok(())
    }
}