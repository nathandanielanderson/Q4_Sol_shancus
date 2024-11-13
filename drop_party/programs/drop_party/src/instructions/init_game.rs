use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Mint, InitializeAccount};
use crate::state::config::*;

#[derive(Accounts)]
pub struct InitGame<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    
}

impl<'info> InitGame<'info> {
    pub fn initialize_game(&self) -> Result<()> {
        
        Ok(())
    }
    pub fn initialize_world_0(&self) -> Result<()> {
        
        Ok(())
    }
}
