 export enum INSTRUCTION {
    INIIT_SOL_STREAM = 0,
    WITHDRAW_SOL_STREAM,
    CANCEL_SOL_STREAM,
    INIT_TOKEN_STREAM,
    PAUSE_SOL_STREAM,
    RESUME_SOL_STREAM,
    WITHDRAW_TOKEN_STREAM,
    DEPOSIT_SOL,
    CANCEL_TOKEN_STREAM,
    PAUSE_TOKEN_STREAM,
    RESUME_TOKEN_STREAM,
    DEPOSIT_TOKEN,
    FUND_SOL,
    FUND_TOKEN,
    WITHDRAW_SOL,
    WITHDRAW_TOKEN,
    CREATE_WHITELIST,
    SWAP_SOL,
    SWAP_TOKEN,
    SIGNED_BY,
    INIT_SOL_STREAM_MULTISIG,
    WITHDRAW_SOL_STREAM_MULTISIG,
    CANCEL_SOL_STREAM_MULTISIG,
    PAUSE_SOL_STREAM_MULTISIG,
    RESUME_SOL_STREAM_MULTISIG,
    REJECT_SOL_STREAM_MULTISIG,
    INIT_TOKEN_STREAM_MULTISIG,
    WITHDRAW_TOKEN_STREAM_MULTISIG,
    CANCEL_TOKEN_STREAM_MULTISIG,
    PAUSE_TOKEN_STREAM_MULTISIG,
    RESUME_TOKEN_STREAM_MULTISIG,
    REJECT_TOKEN_STREAM_MULTISIG,
    SIGNED_BY_TOKEN_MULTISIG,
    INSTANT_SOL_TRANSFER,
    SIGNED_BY_TRANSER_SOL,
    INSTANT_TOKEN_TRANSFER,
    SIGNED_BY_TRANSER_TOKEN,
    REJECT_TRANSFER_SOL,
    REJECT_TRANSFER_TOKEN
}

export const FEE_ADDRESS = "EsDV3m3xUZ7g8QKa1kFdbZT18nNz8ddGJRcTK84WDQ7k"
export const TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
export const WITHDRAW_SOL_STRING = "withdraw_sol"
export const ZEBEC_PROGRAM_ID = "AknC341xog56SrnoK6j3mUvaD1Y7tYayx1sxUGpeYWdX"
export const A_TOKEN = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
export const SYSTEM_RENT = "SysvarRent111111111111111111111111111111111";
export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"

export enum RPC_ENDPOINTS {
    DEVNET = "https://api.devnet.solana.com",
    MAINNET = "https://api.mainnet-beta.solana.com",
    TESTNET = "https;//api.testnet.solana.com",
    DEFAULT = MAINNET
}