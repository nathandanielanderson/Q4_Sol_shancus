use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;
pub mod helpers;
pub mod error;
pub mod constants;

use instructions::*;

declare_id!("37yRf2iJ11DyNyreMCbGxLGhzWSTpr5MRZAJmK8JdCzx");

#[program]
pub mod drop_party {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        Deposit::deposit_token(ctx, amount)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
