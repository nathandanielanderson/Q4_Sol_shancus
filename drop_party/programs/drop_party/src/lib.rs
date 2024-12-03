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
        ctx.accounts.initialize_world(world_name, &ctx.bumps)
    }

    pub fn init_drop(ctx: Context<InitDrop>,world_name: String, amount: u64) -> Result<()> {
        ctx.accounts.initialize_drop(world_name, amount)
    }

    pub fn init_player(ctx: Context<InitPlayer>, player_username: String) -> Result<()> {
        ctx.accounts.initialize_player(player_username, &ctx.bumps)
    }

    pub fn player_logout(ctx: Context<PlayerLogout>, logout_x_pos: u64, logout_y_pos: u64, logout_z_pos: u64, logout_coins: u64) -> Result<()> {
        ctx.accounts.player_logout(logout_x_pos, logout_y_pos, logout_z_pos, logout_coins)  
    }

    pub fn player_withdraw(ctx: Context<PlayerWithdraw>,world_name: String, amount: u64) -> Result<()> {
        ctx.accounts.player_withdraw(world_name, amount)
    }
}