use anchor_lang::prelude::*;

declare_id!("HtsLnBqBUVb1NXezotn7kyx1R97KvmMiCbosXpFe3UWx");

#[program]
pub mod anchor_amm {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
