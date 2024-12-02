use anchor_lang::prelude::*;
use crate::state::config::*;

#[derive(Accounts)]
#[instruction(world_name: String)]
pub struct InitWorld<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        init,
        payer = admin,
        space = World::LEN,
        seeds = [b"world", world_name.as_bytes()],
        bump,
    )]
    pub world: Account<'info, World>,

    pub system_program: Program<'info, System>,
}

impl<'info> InitWorld<'info> {
    pub fn initialize_world(&mut self, world_name: String, bumps: &InitWorldBumps) -> Result<()> {
       let (wallet, wallet_bump) = Pubkey::find_program_address(
        &[
            b"wallet",
            self.world.key().as_ref(),
        ],
        &crate::id(),
    ); 
        self.world.set_inner(World {
            authority: *self.admin.key,
            name: world_name,
            wallet: wallet,
            wallet_bump: wallet_bump,
            bump: bumps.world
        });

        Ok(())
    }
}
