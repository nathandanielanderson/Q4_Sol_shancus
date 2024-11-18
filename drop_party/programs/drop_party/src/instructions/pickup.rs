use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token_interface::{Mint, TokenAccount, TokenInterface, TransferChecked, transfer_checked}};
use crate::state::config::*;
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct Pickup<'info> {
    #[account(
        mut,
        seeds = [b"player", player.username.as_bytes()],
        bump,
    )]
    pub player: Account<'info, Player>,
    #[account(
        seeds = [b"game", game.name.as_bytes()],
        bump
    )]
    pub game: Account<'info, Game>,
    #[account(
        mut,
        seeds = [b"world",game.key().as_ref(), world.name.as_bytes()],
        bump,
    )]
    pub world: Account<'info, World>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(
    init_if_needed,
    payer = player,
    associated_token::mint = mint,
    associated_token::authority = player,
    )]
    pub player_ata: InterfaceAccount<'info, TokenAccount>,
    #[account(
    mut,
    associated_token::mint = mint,
    associated_token::authority = player,
    )]
    pub world_ata: InterfaceAccount<'info, TokenAccount>,

    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

impl<'info> Pickup<'info> {
    pub fn pickup_token(&mut self, amount: u64) -> Result<()> {
       
       
         // Check that the amount is greater than zero
        require!(amount > 0, ErrorCode::ZeroBalance);

        // Ensure world has enough balance in its ATA
        require!(
            self.world_ata.amount >= amount,
            ErrorCode::InsufficientBalance
        );

        let cpi_program = self.token_program.to_account_info();

        let cpi_accounts = TransferChecked {
            from: self.world_ata.to_account_info(),
            mint: self.mint.to_account_info(),
            to: self.player_ata.to_account_info(),
            authority: self.world.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        transfer_checked(cpi_ctx, amount, self.mint.decimals)?;

        Ok(())
    }
}