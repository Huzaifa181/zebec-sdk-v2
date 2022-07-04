jest.setTimeout(300000);
global.TextEncoder = require("util").TextEncoder;
const { NativeStream } = require("../../src/stream");
const { Connection, Keypair, LAMPORTS_PER_SOL } = require("@solana/web3.js");
const { decode } = require("bs58");
const {
  getZebecAsociatedWalletAddress,
  validateSolAddress,
  PDA,
} = require("../utils/utils");

const {
  SENDER_SECRET_KEY,
  RECEIVER_SECRET_KEY,
  NATIVE_AMOUNT,
  RECEIVER_ADDRESS,
  NATIVE_STREAMED_AMOUNT,
  START_TIME_NATIVE_TOKEN_STREAM,
  END_TIME_NATIVE_TOKEN_STREAM,
  DEVNET_CONNECTION_LINK,
  ZEBEC_FEE_IN_PERCENT,
  WITHDRAW_NATIVE_STREAMED_TOKEN_AMOUNT,
} = require("../utils/constants");

let depositNativeTokenEstimatedFee;
let withdrawNativeTokenEstimatedFee;
let pauseStreamTxTime = 0;
let resumeStreamTxTime = 0;

const setDepositNativeTokenEstimatedFee = (estimatedFee) => {
  depositNativeTokenEstimatedFee = estimatedFee;
};

const setWithdrawNativeTokenEstimatedFee = (estimatedFee) => {
  withdrawNativeTokenEstimatedFee = estimatedFee;
};

const setPauseStreamTxTime = (blockTime) => {
  pauseStreamTxTime = blockTime;
};
const setResumeStreamTxTime = (blockTime) => {
  resumeStreamTxTime = blockTime;
};
let keyPair;
let connection;
let native;
beforeAll(async () => {
  keyPair = Keypair.fromSecretKey(decode(SENDER_SECRET_KEY));
  connection = new Connection(DEVNET_CONNECTION_LINK);
  native = await new NativeStream(keyPair, connection.rpcEndpoint);
});
describe("Test Native token functions Normal Stream", () => {
  //deposited token
  test("check sender and associated wallet balance after deposit", async () => {
    let associtedWalletAddress = await getZebecAsociatedWalletAddress(
      keyPair.publicKey
    );
    let senderBalanceBeforeTx =
      (await connection.getBalance(keyPair.publicKey)) / LAMPORTS_PER_SOL;
    let associtedWalletAddressBalanceBeforeTx =
      (await connection.getBalance(associtedWalletAddress)) / LAMPORTS_PER_SOL;
    let response = await native.deposit({
      sender: keyPair.publicKey, //signer
      amount: NATIVE_AMOUNT,
    });
    if (response.status == "error") {
      console.log("deposit native token error", response);
      throw new Error(response);
    }
    let senderBalanceAfterTx =
      (await connection.getBalance(keyPair.publicKey)) / LAMPORTS_PER_SOL;
    let associtedWalletAddressBalanceAfterTx =
      (await connection.getBalance(associtedWalletAddress)) / LAMPORTS_PER_SOL;
    console.log(
      "depositNativeTokenEstimatedFee",
      depositNativeTokenEstimatedFee
    );
    let expectedSenderBalanceAfterTx =
      senderBalanceBeforeTx - depositNativeTokenEstimatedFee - NATIVE_AMOUNT;
    let expectedAssocitedWalletAddressBalanceAfterTx =
      associtedWalletAddressBalanceBeforeTx + NATIVE_AMOUNT;
    //check expected sender balance before and after deposit
    expect(senderBalanceAfterTx.toFixed(6)).toBe(
      expectedSenderBalanceAfterTx.toFixed(6)
    );
    //check expected associated zebec wallet balance before and after deposit
    expect(associtedWalletAddressBalanceAfterTx.toFixed(6)).toBe(
      expectedAssocitedWalletAddressBalanceAfterTx.toFixed(6)
    );
  });

  // //withdraw deposited token
  // test("check sender and associated wallet balance after withdraw", async () => {
  //   let associtedWalletAddress = await getZebecAsociatedWalletAddress(
  //     keyPair.publicKey
  //   );
  //   let senderBalanceBeforeTx =
  //     (await connection.getBalance(keyPair.publicKey)) / LAMPORTS_PER_SOL;
  //   let associtedWalletAddressBalanceBeforeTx =
  //     (await connection.getBalance(associtedWalletAddress)) / LAMPORTS_PER_SOL;
  //   let response = await native.withdrawDepositedSol({
  //     sender: keyPair.publicKey, //signer
  //     amount: NATIVE_AMOUNT,
  //   });
  //   if (response.status == "error") {
  //     console.log("withdraw deposited native token error", response);
  //     throw new Error(response);
  //   }
  //   let senderBalanceAfterTx =
  //     (await connection.getBalance(keyPair.publicKey)) / LAMPORTS_PER_SOL;
  //   let associtedWalletAddressBalanceAfterTx =
  //     (await connection.getBalance(associtedWalletAddress)) / LAMPORTS_PER_SOL;
  //   let expectedSenderBalanceAfterTx =
  //     senderBalanceBeforeTx + NATIVE_AMOUNT - withdrawNativeTokenEstimatedFee;
  //   let exectedAssocitedWalletAddressBalanceAfterTx =
  //     associtedWalletAddressBalanceBeforeTx - NATIVE_AMOUNT;
  //   //check expected sender balance before and after withdraw
  //   expect(senderBalanceAfterTx.toFixed(6)).toBe(
  //     expectedSenderBalanceAfterTx.toFixed(6)
  //   );
  //   //check expected associated zebec wallet balance before and after withdraw
  //   expect(associtedWalletAddressBalanceAfterTx.toFixed(6)).toBe(
  //     exectedAssocitedWalletAddressBalanceAfterTx.toFixed(6)
  //   );
  // });

  // start the stream
  test("check successfully start the stream", async () => {
    const response = await native.init({
      sender: keyPair.publicKey,
      receiver: RECEIVER_ADDRESS,
      start_time: START_TIME_NATIVE_TOKEN_STREAM,
      end_time: END_TIME_NATIVE_TOKEN_STREAM,
      amount: NATIVE_STREAMED_AMOUNT,
    });
    if (response.status == "error") {
      console.log("start stream native token error", response);
      throw new Error(response);
    }
    //check response status to be success
    expect(response.status).toBe("success");
    let isSolAddress = validateSolAddress(response.data.pda);
    //check pda is a valid sol address
    expect(isSolAddress).toBe(true);
    new PDA(response.data.pda);
  });

  // //pause the stream
  // test("check successfully pause the stream", async () => {
  //   const response = await native.pause({
  //     sender: keyPair.publicKey,
  //     receiver: RECEIVER_ADDRESS,
  //     pda: PDA.pda,
  //   });
  //   if (response.status == "error") {
  //     console.log("pause stream native token error", response);
  //     throw new Error(response);
  //   }
  //   let { blockTime } = await connection.getConfirmedTransaction(
  //     response.data.transactionHash
  //   );
  //   setPauseStreamTxTime(blockTime);
  //   //check response status to be success
  //   expect(response.status).toBe("success");
  // });

  // //resume the stream
  // test("check successfully resume the stream", async () => {
  //   // await new Promise((r) => setTimeout(r, 51000));
  //   const response = await native.resume({
  //     sender: keyPair.publicKey,
  //     receiver: RECEIVER_ADDRESS,
  //     pda: PDA.pda,
  //   });
  //   if (response.status == "error") {
  //     console.log("resume stream native token error", response);
  //     throw new Error(response);
  //   }
  //   let { blockTime } = await connection.getConfirmedTransaction(
  //     response.data.transactionHash
  //   );
  //   setResumeStreamTxTime(blockTime);
  //   expect(response.status).toBe("success");
  // });

  // withdraw

  test("check successfully withdraw the native streamed token", async () => {
    await new Promise((r) => setTimeout(r, 6000));
    let associtedWalletAddress = await getZebecAsociatedWalletAddress(
      keyPair.publicKey
    );
    let associtedWalletAddressBalanceBeforeTx =
      (await connection.getBalance(associtedWalletAddress)) / LAMPORTS_PER_SOL;
    let receiverKeyPair = Keypair.fromSecretKey(decode(RECEIVER_SECRET_KEY));
    let receiverBalanceBeforeTx =
      (await connection.getBalance(receiverKeyPair.publicKey)) /
      LAMPORTS_PER_SOL;
    const response = await native.withdraw({
      sender: keyPair.publicKey,
      amount: WITHDRAW_NATIVE_STREAMED_TOKEN_AMOUNT,
      receiver: receiverKeyPair,
      pda: PDA.pda,
    });
    if (response.status == "error") {
      console.log("withdraw streamed native token error", response);
      throw new Error(response);
    }
    let { blockTime } = await connection.getConfirmedTransaction(
      response.data.transactionHash
    );
    let currentTime = blockTime;
    let isCancelAfterStartTime = currentTime > START_TIME_NATIVE_TOKEN_STREAM;

    let zebecFeeOnWithdraw =
      (WITHDRAW_NATIVE_STREAMED_TOKEN_AMOUNT / 100) * ZEBEC_FEE_IN_PERCENT;

    let withdrawAmountWithDeductedZebecFee = 0;
    if (isCancelAfterStartTime) {
      withdrawAmountWithDeductedZebecFee =
        WITHDRAW_NATIVE_STREAMED_TOKEN_AMOUNT - zebecFeeOnWithdraw;
    }
    let receiverBalanceAfterTx =
      (await connection.getBalance(receiverKeyPair.publicKey)) /
      LAMPORTS_PER_SOL;
    let expectedReceiverBalanceAfterTx =
      receiverBalanceBeforeTx + withdrawAmountWithDeductedZebecFee;
    let associtedWalletAddressBalanceAfterTx =
      (await connection.getBalance(associtedWalletAddress)) / LAMPORTS_PER_SOL;
    let expectedAssociatedWalletAfterTx =
      associtedWalletAddressBalanceBeforeTx -
      WITHDRAW_NATIVE_STREAMED_TOKEN_AMOUNT;
    //check response status to be success
    expect(response.status).toBe("success");
    //check associated wallet balance is equal to the expected amount
    expect(associtedWalletAddressBalanceAfterTx.toFixed(6)).toBe(
      expectedAssociatedWalletAfterTx.toFixed(6)
    );
    //check receiver balance is equal to the expected amount
    expect(receiverBalanceAfterTx.toFixed(6)).toBe(
      expectedReceiverBalanceAfterTx.toFixed(6)
    );
  });

  // cancel the stream
  test("check successfully cancelled the stream", async () => {
    let associtedWalletAddress = await getZebecAsociatedWalletAddress(
      keyPair.publicKey
    );
    let associtedWalletAddressBalanceBeforeTx =
      (await connection.getBalance(associtedWalletAddress)) / LAMPORTS_PER_SOL;
    let receiverKeyPair = Keypair.fromSecretKey(decode(RECEIVER_SECRET_KEY));
    let receiverBalanceBeforeTx =
      (await connection.getBalance(receiverKeyPair.publicKey)) /
      LAMPORTS_PER_SOL;
    const response = await native.cancel({
      sender: keyPair.publicKey,
      receiver: RECEIVER_ADDRESS,
      pda: PDA.pda,
    });
    if (response.status == "error") {
      console.log("cancel stream native token error", response);
      throw new Error(response);
    }
    let { blockTime } = await connection.getConfirmedTransaction(
      response.data.transactionHash
    );
    let currentTime = blockTime;
    let isCancelAfterStartTime = currentTime > START_TIME_NATIVE_TOKEN_STREAM;
    let perSecondAmount =
      NATIVE_STREAMED_AMOUNT /
      (END_TIME_NATIVE_TOKEN_STREAM - START_TIME_NATIVE_TOKEN_STREAM);
    let streamedAmountWithOutZebecFee =
      perSecondAmount * (currentTime - START_TIME_NATIVE_TOKEN_STREAM);
    let zebecFeeOnCancel =
      (streamedAmountWithOutZebecFee / 100) * ZEBEC_FEE_IN_PERCENT;
    let expectedStreamedAmountOnCancel = 0;

    if (isCancelAfterStartTime) {
      expectedStreamedAmountOnCancel =
        streamedAmountWithOutZebecFee - zebecFeeOnCancel;
    }
    let receiverBalanceAfterTx =
      (await connection.getBalance(receiverKeyPair.publicKey)) /
      LAMPORTS_PER_SOL;
    let addedAmountInReceiverWallet =
      receiverBalanceAfterTx - receiverBalanceBeforeTx;
    let associtedWalletAddressBalanceAfterTx =
      (await connection.getBalance(associtedWalletAddress)) / LAMPORTS_PER_SOL;
    let deductedBalanceInAssocitedWallet =
      associtedWalletAddressBalanceBeforeTx -
      associtedWalletAddressBalanceAfterTx;
    //check response status to be success
    expect(response.status).toBe("success");
    //check the deducted balance in associted wallet is equal to the expected amount
    expect(streamedAmountWithOutZebecFee.toFixed(6)).toBe(
      deductedBalanceInAssocitedWallet.toFixed(6)
    );
    //check the amount added in receiver wallet is equal to the expected amount
    expect(addedAmountInReceiverWallet.toFixed(6)).toBe(
      expectedStreamedAmountOnCancel.toFixed(6)
    );
  });
});

exports.setDepositNativeTokenEstimatedFee = setDepositNativeTokenEstimatedFee;
exports.setWithdrawNativeTokenEstimatedFee = setWithdrawNativeTokenEstimatedFee;
