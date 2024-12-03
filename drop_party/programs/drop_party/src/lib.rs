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
    pub fn init_player(ctx: Context<InitPlayer>, player_name: String) -> ProgramResult {
        let bumps = InitPlayerBumps::get(ctx.accounts.system_program, &player_name);
        ctx.accounts
            .player
            .initialize_player(player_name, &bumps)?;
        Ok(())
    }
}