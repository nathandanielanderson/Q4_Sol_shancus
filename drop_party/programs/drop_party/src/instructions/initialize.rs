use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Mint, InitializeAccount};
use crate::state::config::*;

#[derive(Accounts)]
pub struct InitializeGame<'info> {
    #[account(mut)]
    signer: Signer<'info>,
    
}