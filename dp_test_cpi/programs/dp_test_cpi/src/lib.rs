use anchor_lang::prelude::*;

declare_id!("2r9AvbDhiTq9dcAojVmJgnxZX3AH7nsycL6WXtPPqNW4");

#[program]
pub mod dp_test_cpi {
    use anchor_lang::solana_program::message;

    use super::*;

    pub fn log_message(_ctx:Context<LogMessage>, message: String) -> Result<()> {
        msg!("Unity says: {}", message);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct LogMessage<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
}
