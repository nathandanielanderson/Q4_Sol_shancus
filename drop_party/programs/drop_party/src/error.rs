use anchor_lang::error_code;

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid token mint provided.")]
    InvalidMint,
    #[msg("Invalid amount.")]
    InvalidAmount,
    #[msg("The account does not have sufficient balance to complete the operation.")]
    InsufficientBalance,
    #[msg("The transfer amount must be greater than zero.")]
    ZeroBalance,
    #[msg("Unauthorized access.")]
    UnauthorizedAccess,
    #[msg("Failed to decode the provided Pubkey string")]
    FailedToDecodePubkey,
}