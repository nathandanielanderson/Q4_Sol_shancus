use anchor_lang::prelude::*;

declare_id!("2r9AvbDhiTq9dcAojVmJgnxZX3AH7nsycL6WXtPPqNW4");

#[program]
pub mod dp_test_cpi {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
