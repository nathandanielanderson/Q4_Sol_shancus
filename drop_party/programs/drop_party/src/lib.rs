pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("37yRf2iJ11DyNyreMCbGxLGhzWSTpr5MRZAJmK8JdCzx");
#[program]
pub mod drop_party {
    use super::*;
    pub fn init_world(ctx: Context<InitWorld>, world_name: String) -> Result<()> {
        ctx.accounts.initialize_world(world_name, &InitWorldBumps::default())
    }
}