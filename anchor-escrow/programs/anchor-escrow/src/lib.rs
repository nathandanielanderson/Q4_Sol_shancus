use anchor_lang::prelude::*;

mod state;
mod instructions;

use instructions::*;

declare_id!("5grjR5uBxTkVDJwDTxz4TjrXhs1RHyDiDUe5mYmV6woV");

#[program]
pub mod anchor_escrow {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
