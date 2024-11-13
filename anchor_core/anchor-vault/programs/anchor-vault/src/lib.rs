use anchor_lang::prelude::*;

declare_id!("D2NTmxojNp1cZtFsEJQR2xh8wohsrWEDDDYmYyxjZE1V");

#[program]
pub mod anchor_vault {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
