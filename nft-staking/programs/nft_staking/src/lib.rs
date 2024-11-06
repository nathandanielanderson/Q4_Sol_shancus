use anchor_lang::prelude::*;

declare_id!("4KrjC383tEj1bhuh4uvQXnExDYmgsvqPPKZgmnwvNVPg");

#[program]
pub mod nft_staking {
    use super::*;

    // pub fn initialize_config(ctx: Context<InitializeConfig>)
}
pub mod instructions;

#[derive(Accounts)]
pub struct Initialize {}
