use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token_interface::{Mint, TokenAccount, TokenInterface, TransferChecked, transfer_checked}};
use crate::{constants::MINT_ID, state::config::*};
use crate::error::ErrorCode;

#[derive(Accounts)]
#[instruction(world_name: String, amount: u64)]
pub struct InitDrop<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

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
        mut,
        associated_token::mint = mint,
        associated_token::authority = world,
    )]
    pub admin_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = admin,
        associated_token::mint = mint,
        associated_token::authority = world,
    )]
    pub world_ata: InterfaceAccount<'info, TokenAccount>,

    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitDrop<'info> {
    pub fn initialize_drop(&mut self, world_name: String, amount: u64) -> Result<()> {
        if amount <= 0 {
            return Err(ErrorCode::ZeroBalance.into());
        }

        // Debugging log
        msg!("Initializing drop for world: {}", world_name);
        msg!("Amount to transfer: {}", amount);

        // Token program ID
        let cpi_program = self.token_program.to_account_info(); 

        // Transfer tokens from admin to world
        let cpi_accounts = TransferChecked {
            from: self.admin_ata.to_account_info(),
            to: self.world_ata.to_account_info(),
            authority: self.admin.to_account_info(),
            mint: self.mint.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        // Execute the transfer
        transfer_checked(cpi_ctx, amount, self.mint.decimals)?;

        
        Ok(())
    }
}