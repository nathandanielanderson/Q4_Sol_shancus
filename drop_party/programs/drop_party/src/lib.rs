use anchor_lang::prelude::*;

declare_id!("37yRf2iJ11DyNyreMCbGxLGhzWSTpr5MRZAJmK8JdCzx");

#[program]
pub mod drop_party {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
