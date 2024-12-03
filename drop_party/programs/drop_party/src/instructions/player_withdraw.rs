use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{Mint, TokenAccount, TokenInterface, TransferChecked, transfer_checked},
};
use crate::{constants::MINT_ID, state::config::*};
use crate::error::ErrorCode;

#[derive(Accounts)]
#[instruction(world_name: String, amount: u64)]
pub struct PlayerWithdraw<'info> {
    // User remains as the account payer for ATA initialization
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        constraint = mint.key() == MINT_ID @ ErrorCode::InvalidMint,
    )]
    pub mint: InterfaceAccount<'info, Mint>,    

    #[account(
        mut,
        seeds = [b"world", world_name.as_bytes()],
        bump = world.bump,
    )]
    pub world: Account<'info, World>,

    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = mint,
        associated_token::authority = user,
    )]
    pub user_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = world,
    )]
    pub world_ata: InterfaceAccount<'info, TokenAccount>,

    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

impl<'info> PlayerWithdraw<'info> {
    pub fn player_withdraw(&mut self, world_name: String, amount: u64) -> Result<()> {
        // Validate withdrawal amount
        if amount == 0 {
            return Err(error!(ErrorCode::InvalidAmount));
        }

        // Validate World ATA has enough balance
        if self.world_ata.amount < amount {
            return Err(error!(ErrorCode::InsufficientBalance));
        }

        msg!("Player withdrawal initiated for world: {}", world_name);
        msg!("Amount to withdraw: {}", amount);

        // Derive PDA seeds and signer directly from `world`
        let bump = self.world.bump;
        let seeds = [b"world", world_name.as_bytes(), &[bump]];
        let signer_seeds = &[&seeds[..]];

        let cpi_accounts = TransferChecked {
            from: self.world_ata.to_account_info(),
            to: self.user_ata.to_account_info(),
            authority: self.world.to_account_info(), // `world` signs directly
            mint: self.mint.to_account_info(),
        };

        let cpi_program = self.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        // Execute the token transfer
        transfer_checked(cpi_ctx, amount, self.mint.decimals)?;

        // Debugging message for successful transfer
        msg!(
            "Successfully transferred {} tokens from World ATA to User ATA",
            amount
        );

        Ok(())
    }
}