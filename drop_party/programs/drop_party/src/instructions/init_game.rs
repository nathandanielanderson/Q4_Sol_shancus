use anchor_lang::prelude::*;
use crate::state::config::*;

#[derive(Accounts)]
#[instruction(game_name: String, world_name: String)]
pub struct InitGame<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        space = Game::LEN,
        seeds = [b"game", game_name.as_bytes()],
        bump,
    )]
    pub game: Account<'info, Game>,
    #[account(
        init,
        payer = user,
        space = World::LEN,
        seeds = [b"world", game.key().as_ref(), world_name.as_bytes()],
        bump,
    )]
    pub world: Account<'info, World>,

    pub system_program: Program<'info, System>,
}

impl<'info> InitGame<'info> {
    pub fn initialize_game(&mut self, game_name: String, world_name: String, bumps: &InitGameBumps) -> Result<()> {
       let (wallet, wallet_bump) = Pubkey::find_program_address(
        &[
            b"wallet",
            self.game.key().as_ref(),
        ],
        &crate::id(),
    );
        self.game.set_inner(Game {
            authority: *self.user.key,
            name: game_name,
            wallet: wallet,
            wallet_bump: wallet_bump,
            bump: bumps.game
        });

        self.world.set_inner(World {
            authority: self.game.key(),
            name: world_name,
            bump: bumps.world 
        });

        Ok(())
    }
}
