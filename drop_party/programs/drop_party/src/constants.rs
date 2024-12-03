use anchor_lang::prelude::*;

pub const PUBKEY_L: usize = 32;
pub const U64_L: usize = 8;
pub const U16_L: usize = 2;
pub const BOOL_L: usize = 1;
pub const OPTION_L: usize = 1;
pub const U8_L: usize = 1;
pub const MAX_NAME_L: usize = 4 + 32; // 4 bytes for length, 32 bytes for string
pub const MINT_ID: Pubkey = Pubkey::new_from_array([
    0x12, 0xF3, 0xF6, 0xCD, 0x56, 0x86, 0xF1, 0xB3, 0x4A, 0xD9, 0x14, 0x09, 0xEC, 0x2C, 0x57, 0x94,
    0x59, 0x40, 0xF0, 0xFC, 0x73, 0xEB, 0x8C, 0x9F, 0xCB, 0xCE, 0x00, 0xEF, 0x3A, 0x84, 0x92, 0xB3
]); // Pubkey: 2Gz6trPwDbaHAbDJhq4yhHkTTUyXc9UAkfpEjFuRK5Si (test token mint)
pub const MINT_DECIMALS: u8 = 9;