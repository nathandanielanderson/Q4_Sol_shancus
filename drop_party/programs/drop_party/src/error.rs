use anchor_lang::error_code;

#[error_code]
pub enum ErrorCode {
    #[msg("The account does not have sufficient balance to complete the operation.")]
    InsufficientBalance,
    #[msg("The transfer amount must be greater than zero.")]
    ZeroBalance,
}