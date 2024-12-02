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

    //TODO: Add the instructions here
}

#[derive(Accounts)]
pub struct Initialize {}
