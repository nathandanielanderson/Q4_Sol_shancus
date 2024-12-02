use anchor_lang::prelude::*;
use crate::state::config::*;

#[derive(Accounts)]
#[instruction(x_pos: u64, y_pos: u64, z_pos: u64, coins: u64)]
pub struct PlayerLogout<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        has_one = authority @ ErrorCode::UnauthorizedAccess,
    )]
    pub player: Account<'info, Player>,

    pub system_program: Program<'info, System>,
}

impl<'info> PlayerLogout<'info> {
    pub fn player_logout(&mut self, logout_x_pos: u64, logout_y_pos: u64, logout_z_pos: u64, logout_coins: u64) -> Result<()> {
       
        msg!("Player {} logout initiated...", self.player.username);

        self.player.x_pos = logout_x_pos;
        self.player.y_pos = logout_y_pos;
        self.player.z_pos = logout_z_pos;
        self.player.coins = logout_coins;

        msg!(
            "Player {} logged out with position ({}, {}, {}) and {} coins",
            self.player.username,
            logout_x_pos,
            logout_y_pos,
            logout_z_pos,
            logout_coins
        );


        Ok(())
    }
}
