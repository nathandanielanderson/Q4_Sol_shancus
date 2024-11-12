use crate::error::AmmError;
use crate::state::config::Config;
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{Mint, TokenAccount, TokenInterface},
};

#[derive(Accounts)]
#[instruction(seed: u64)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub mint_x: Box<InterfaceAccount<'info, Mint>>,
    pub mint_y: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        init,
        payer = initializer,
        associated_token::mint = mint_x,
        associated_token::authority = auth,
    )]
    pub vault_x: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(
        init,
        payer = initializer,
        associated_token::mint = mint_y,
        associated_token::authority = auth,
    )]
    pub vault_y: Box<InterfaceAccount<'info, TokenAccount>>,

    // CHECK: this is safe
    #[account(
        seeds = [b"auth"],
        bump,
    )]
    pub auth: UncheckedAccount<'info>,

    #[account(
        init,
        payer = initializer,
        seeds = [b"config", seed.to_le_bytes().as_ref()],
        bump,
        space = Config::LEN,
    )]
    pub config: Account<'info, Config>,

    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
pub fn init(
    &mut self,
    bumps: &InitializeBumps,
    seed: u64,
    fee: u16,
) -> Result<()> {
    
    require!(fee<=10000, AmmError::FeePercentError);
    
    self.set_inner(Config{
        mint_x: self.mint_x.key(),
        mint_y: self.mint_y.key(),
        authority: self.auth.key(),
        seed,
        fee,
        locked: false,
        auth_bump: bumps.auth,
        config_bump: bumps.config,
    });

    Ok(())
}
}