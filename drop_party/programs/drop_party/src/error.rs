use anchor_lang::error_code;

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient balance.")]
    InsufficientBalance,
    #[msg("Zero balance.")]
    ZeroBalance,
}