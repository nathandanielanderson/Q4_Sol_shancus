use anchor_lang::prelude::*;
use crate::state::config::*;

#[derive(Accounts)]
pub struct InitializeGame<'info> {
    #[account(mut)]
    signer: Signer<'info>,
    #[account(
        init,
        payer = signer,
        seeds = [b"game".as_ref()],
        bump
    )]
    game_pda: Account<'info, GamePDA>,
}