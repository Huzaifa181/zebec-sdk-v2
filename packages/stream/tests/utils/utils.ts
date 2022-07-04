import { GetProgramAccountsFilter, PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "./constants";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
// import axios from "axios";
export const getZebecAsociatedWalletAddress = async (
  publicKey: string
): Promise<PublicKey> => {
  let base58publicKey = new PublicKey(PROGRAM_ID);
  const senderaddress = new PublicKey(publicKey);
  let escrow = await PublicKey.findProgramAddress(
    [senderaddress.toBuffer()],
    base58publicKey
  );
  return escrow[0];
};

export const getBalanceOfSplToken = async (
  splTokenAddress,
  connection,
  wallet
) => {
  const filters: GetProgramAccountsFilter[] = [
    {
      dataSize: 165, //size of account (bytes)
    },
    {
      memcmp: {
        offset: 32, //location of our query in the account (bytes)
        bytes: wallet,
      },
    },
  ];
  const accounts = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
    filters: filters,
  });
  let tokenBalance = 0;
  accounts.forEach((account, i) => {
    const parsedAccountInfo: any = account.account.data;
    const mintAddress: string = parsedAccountInfo["parsed"]["info"]["mint"];
    if (splTokenAddress == mintAddress) {
      tokenBalance =
        parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
      return;
    }
  });
  return tokenBalance;
};

export function validateSolAddress(address: string) {
  try {
    let pubkey = new PublicKey(address);
    let isSolana = PublicKey.isOnCurve(pubkey.toBuffer());
    return isSolana;
  } catch (error) {
    return false;
  }
}

export class PDA {
  static pda = "";
  constructor(pda: string) {
    PDA.pda = pda;
  }
}
