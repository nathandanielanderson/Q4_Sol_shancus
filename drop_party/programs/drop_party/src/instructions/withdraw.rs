use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token_interface::{Mint, TokenAccount, TokenInterface, TransferChecked, transfer_checked}};
use crate::state::config::*;
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub player: Signer<'info>,
    pub game: Account<'info, Game>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(
    mut,
    associated_token::mint = mint,
    associated_token::authority = player,
    )]
    pub player_ata: InterfaceAccount<'info, TokenAccount>,
    #[account(
    mut,
    associated_token::mint = mint,
    associated_token::authority = game,
    )]
    pub game_ata: InterfaceAccount<'info, TokenAccount>,

    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

impl<'info> Withdraw<'info> {
    pub fn withdraw_to_game(&mut self, amount: u64) -> Result<()> {

         // Check that the amount is greater than zero
        require!(amount > 0, ErrorCode::ZeroBalance);

        // Ensure player has enough balance in their ATA
        require!(
            self.player_ata.amount >= amount,
            ErrorCode::InsufficientBalance
        );

        let cpi_program = self.token_program.to_account_info();

        let cpi_accounts = TransferChecked {
            from: self.player_ata.to_account_info(),
            mint: self.mint.to_account_info(),
            to: self.game_ata.to_account_info(),
            authority: self.player.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        transfer_checked(cpi_ctx, amount, self.mint.decimals)?;

        Ok(())
    }
}