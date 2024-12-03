use anchor_lang::prelude::*;

pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;
pub mod helpers;

use constants::*;
use instructions::*;
use state::*;
use helpers::*;

declare_id!("HtsLnBqBUVb1NXezotn7kyx1R97KvmMiCbosXpFe3UWx");

#[program]
pub mod anchor_amm {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, seed: u64, fee: u16) -> Result<()> {
        Ok(())
    }
}