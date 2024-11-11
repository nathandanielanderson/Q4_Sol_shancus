pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;  

declare_id!("87bHnPFsX9n9ZESyPv9pquPiEwtJemBi6n2s6373s2Bi");

#[program]
pub mod anchor_marketplace {
    use anchor_spl::{token::close_account, token_interface::spl_token_metadata_interface::instruction::Initialize};

    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.init(name, fee, &ctx.bumps)
    }

    pub fn list(ctx:Context<List>, price: u64) -> Result<()> {
        ctx.accounts.create_listing(price, &ctx.bumps)?;
        ctx.accounts.deposit_nft()
    }

    pub fn purchase(ctx: Context<Purchase>) -> Result<()> {
        ctx.accounts.send_sol()?;
        ctx.accounts.send_nft()?;
        ctx.accounts.close_mint_vault()
    }

    pub fn delist(ctx: Context<Delist>) -> Result<()> {
        ctx.accounts.withdraw_nft();
        ctx.close_accounts();
    }   

}

