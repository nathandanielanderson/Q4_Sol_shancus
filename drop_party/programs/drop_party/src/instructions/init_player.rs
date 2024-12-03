use anchor_lang::prelude::*;
use crate::state::config::*;

#[derive(Accounts)]
#[instruction(player_name: String )]
pub struct InitPlayer<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init_if_needed,
        payer = user,
        space = Player::LEN,
        seeds = [b"player", player_name.as_bytes()],
        bump,
    )]
    pub player: Account<'info, Player>,

    pub system_program: Program<'info, System>,
}

impl<'info> InitPlayer<'info> {
    pub fn initialize_player(&mut self, player_name: String, bumps: &InitPlayerBumps) -> Result<()> {
       
        msg!("Initializing player: {}", player_name);
        msg!("Player PDA: {}", self.player.key());

        self.player.set_inner(Player {
            authority: *self.user.key,
            username: player_name,
            x_pos: 0,
            y_pos: 0,
            z_pos: 0,
            coins: 0,
            bump: bumps.player,
        });
        
        Ok(())
    }
}
