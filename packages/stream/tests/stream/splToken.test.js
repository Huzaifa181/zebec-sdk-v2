// global.TextEncoder = require("util").TextEncoder;
// // const { TokenStream, TokenStream } = require("@zebec-protocol/stream");
// const { TokenStream } = require("../../src/stream");
// const { Connection, Keypair, LAMPORTS_PER_SOL } = require("@solana/web3.js");
// const { decode } = require("bs58");
// const {
//   getZebecAsociatedWalletAddress,
//   validateSolAddress,
//   PDA,
//   getBalanceOfSplToken,
// } = require("../utils/utils");
// const {
//   SENDER_SECRET_KEY,
//   RECEIVER_SECRET_KEY,
//   SPL_AMOUNT,
//   SPL_TOKEN_ADDRESS,
//   RECEIVER_ADDRESS,
//   NATIVE_STREAMED_AMOUNT,
//   START_TIME_NATIVE_TOKEN_STREAM,
//   END_TIME_NATIVE_TOKEN_STREAM,
// } = require("../utils/constants");
// jest.setTimeout(300000);
// let keyPair;
// let connection;
// let stream;

// beforeAll(async () => {
//   keyPair = Keypair.fromSecretKey(decode(SENDER_SECRET_KEY));
//   connection = new Connection("https://api.devnet.solana.com");
//   stream = await new TokenStream(keyPair, connection.rpcEndpoint);
// });
// describe("Test Native token functions Normal Stream", () => {
//   test("check sender and associated wallet balance after deposit", async () => {
//     let associtedWalletAddress = await getZebecAsociatedWalletAddress(
//       keyPair.publicKey
//     );
//     let senderBalanceBeforeTx = await getBalanceOfSplToken(
//       SPL_TOKEN_ADDRESS,
//       connection,
//       keyPair.publicKey
//     );

//     let associtedWalletAddressBalanceBeforeTx = await getBalanceOfSplToken(
//       SPL_TOKEN_ADDRESS,
//       connection,
//       associtedWalletAddress
//     );

//     let response = await stream.deposit({
//       sender: keyPair.publicKey, //signer
//       amount: SPL_AMOUNT,
//       token: SPL_TOKEN_ADDRESS,
//     });
//     if (response.status == "error") {
//       console.log("deposit spl token error", response);
//       throw new Error(response);
//     }
//     let senderBalanceAfterTx = await getBalanceOfSplToken(
//       SPL_TOKEN_ADDRESS,
//       connection,
//       keyPair.publicKey
//     );
//     let associtedWalletAddressBalanceAfterTx = await getBalanceOfSplToken(
//       SPL_TOKEN_ADDRESS,
//       connection,
//       associtedWalletAddress
//     );
//     console.log(
//       "associtedWalletAddressBalanceAfterTx",
//       associtedWalletAddressBalanceAfterTx
//     );
//     let expectedSenderBalanceAfterTx = senderBalanceBeforeTx - SPL_AMOUNT;
//     let expectedAssocitedWalletAddressBalanceAfterTx =
//       associtedWalletAddressBalanceBeforeTx + SPL_AMOUNT;
//     //check expected sender balance before and after deposit
//     expect(senderBalanceAfterTx.toFixed(5)).toBe(
//       expectedSenderBalanceAfterTx.toFixed(5)
//     );
//     //check expected associated zebec wallet balance before and after deposit
//     expect(associtedWalletAddressBalanceAfterTx.toFixed(5)).toBe(
//       expectedAssocitedWalletAddressBalanceAfterTx.toFixed(5)
//     );
//   });
//   test("check sender and associated wallet balance after withdraw", async () => {
//     let associtedWalletAddress = await getZebecAsociatedWalletAddress(
//       keyPair.publicKey
//     );
//     let senderBalanceBeforeTx = await getBalanceOfSplToken(
//       SPL_TOKEN_ADDRESS,
//       connection,
//       keyPair.publicKey
//     );
//     let associtedWalletAddressBalanceBeforeTx = await getBalanceOfSplToken(
//       SPL_TOKEN_ADDRESS,
//       connection,
//       associtedWalletAddress
//     );

//     let response = await stream.withdrawDepositedToken({
//       sender: keyPair.publicKey, //signer
//       amount: SPL_AMOUNT,
//       token: SPL_TOKEN_ADDRESS,
//     });
//     if (response.status == "error") {
//       console.log("withdraw deposited spl token error", response);
//       throw new Error(response);
//     }
//     let senderBalanceAfterTx = await getBalanceOfSplToken(
//       SPL_TOKEN_ADDRESS,
//       connection,
//       keyPair.publicKey
//     );
//     let associtedWalletAddressBalanceAfterTx = await getBalanceOfSplToken(
//       SPL_TOKEN_ADDRESS,
//       connection,
//       associtedWalletAddress
//     );
//     let expectedSenderBalanceAfterTx = senderBalanceBeforeTx + SPL_AMOUNT;
//     let exectedAssocitedWalletAddressBalanceAfterTx =
//       associtedWalletAddressBalanceBeforeTx - SPL_AMOUNT;
//     //check expected sender balance before and after withdraw
//     expect(senderBalanceAfterTx.toFixed(5)).toBe(
//       expectedSenderBalanceAfterTx.toFixed(5)
//     );
//     //check expected associated zebec wallet balance before and after withdraw
//     expect(associtedWalletAddressBalanceAfterTx.toFixed(5)).toBe(
//       exectedAssocitedWalletAddressBalanceAfterTx.toFixed(5)
//     );
//   });
//   // start the stream
//   test("check successfully start the stream", async () => {
//     const response = await stream.init({
//       sender: keyPair.publicKey,
//       receiver: RECEIVER_ADDRESS,
//       start_time: START_TIME_NATIVE_TOKEN_STREAM,
//       end_time: END_TIME_NATIVE_TOKEN_STREAM,
//       amount: NATIVE_STREAMED_AMOUNT,
//       token: SPL_TOKEN_ADDRESS,
//     });
//     if (response.status == "error") {
//       console.log("start stream spl token error", response);
//       throw new Error(response);
//     }
//     //check response status to be success
//     expect(response.status).toBe("success");
//     let isSolAddress = validateSolAddress(response.data.pda);
//     //check pda is a valid sol address
//     expect(isSolAddress).toBe(true);
//     new PDA(response.data.pda);
//   });

//   test("check successfully pause the stream", async () => {
//     const response = await stream.pause({
//       sender: keyPair.publicKey,
//       receiver: RECEIVER_ADDRESS,
//       pda: PDA.pda,
//     });
//     if (response.status == "error") {
//       console.log("pause stream spl token error", response);
//       throw new Error(response);
//     }
//     expect(response.status).toBe("success");
//   });
//   test("check successfully resume the stream", async () => {
//     // await new Promise((r) => setTimeout(r, 1000));
//     const response = await stream.resume({
//       sender: keyPair.publicKey,
//       receiver: RECEIVER_ADDRESS,
//       pda: PDA.pda,
//     });
//     if (response.status == "error") {
//       console.log("resume stream spl token error", response);
//       throw new Error(response);
//     }
//     expect(response.status).toBe("success");
//   });
//   //   test("check successfully cancelled the stream", async () => {
//   //     let associtedWalletAddress = await getZebecAsociatedWalletAddress(
//   //       keyPair.publicKey
//   //     );
//   //     let associtedWalletAddressBalanceBeforeTx =
//   //       (await connection.getBalance(associtedWalletAddress)) / LAMPORTS_PER_SOL;
//   //     console.log(
//   //       "associtedWalletAddressBalanceBeforeTx",
//   //       associtedWalletAddressBalanceBeforeTx
//   //     );
//   //     let receiverKeyPair = Keypair.fromSecretKey(decode(RECEIVER_SECRET_KEY));
//   //     let receiverBalanceBeforeTx =
//   //       (await connection.getBalance(receiverKeyPair.publicKey)) /
//   //       LAMPORTS_PER_SOL;
//   //     console.log("receiverBalanceBeforeTx", receiverBalanceBeforeTx);
//   //     let currentTime = Math.floor(Date.now() / 1000);
//   //     const response = await stream.cancel({
//   //       sender: keyPair.publicKey,
//   //       receiver: RECEIVER_ADDRESS,
//   //       pda: PDA.pda,
//   //       token: SPL_TOKEN_ADDRESS,
//   //     });
//   // if (response.status == "error") {
//   //   console.log("cancel stream spl token error", response);
//   //   throw new Error(response);
//   // }
//   //     console.log("cancel response", response);
//   //     let isCancelAfterStartTime = currentTime > START_TIME_NATIVE_TOKEN_STREAM;
//   //     let isCancelAfterEndTime = currentTime > END_TIME_NATIVE_TOKEN_STREAM;
//   //     let perSecondAmount =
//   //       NATIVE_STREAMED_AMOUNT /
//   //       (END_TIME_NATIVE_TOKEN_STREAM - START_TIME_NATIVE_TOKEN_STREAM);
//   //     let totalStreamedAmount =
//   //       perSecondAmount *
//   //       (END_TIME_NATIVE_TOKEN_STREAM - START_TIME_NATIVE_TOKEN_STREAM);
//   //     let streamedAmountWithOutZebecFee =
//   //       perSecondAmount * (currentTime - START_TIME_NATIVE_TOKEN_STREAM);
//   //     let zebecFeeOnCancel = (streamedAmountWithOutZebecFee / 100) * 0.25;
//   //     console.log(
//   //       "START_TIME_NATIVE_TOKEN_STREAM",
//   //       START_TIME_NATIVE_TOKEN_STREAM
//   //     );
//   //     console.log("END_TIME_NATIVE_TOKEN_STREAM", END_TIME_NATIVE_TOKEN_STREAM);
//   //     console.log("currentTime", currentTime);
//   //     console.log("perSecondAmount", perSecondAmount);
//   //     console.log("totalStreamedAmount", totalStreamedAmount);
//   //     console.log("zebecFeeOnCancel", zebecFeeOnCancel);
//   //     console.log("isCancelAfterStartTime", isCancelAfterStartTime);
//   //     console.log("isCancelAfterEndTime", isCancelAfterEndTime);
//   //     console.log("streamedAmountWithOutZebecFee", streamedAmountWithOutZebecFee);
//   //     let streamedAmountOnCancel = 0;
//   //     if (isCancelAfterStartTime) {
//   //       streamedAmountOnCancel = streamedAmountWithOutZebecFee - zebecFeeOnCancel;
//   //     }
//   //     console.log("streamedAmountOnCancel", streamedAmountOnCancel);
//   //     let receiverBalanceAfterTx =
//   //       (await connection.getBalance(receiverKeyPair.publicKey)) /
//   //       LAMPORTS_PER_SOL;
//   //     console.log("receiverBalanceAfterTx", receiverBalanceAfterTx);
//   //     console.log(
//   //       "deducted balance after cancel",
//   //       receiverBalanceAfterTx - receiverBalanceBeforeTx
//   //     );
//   //     let associtedWalletAddressBalanceAfterTx =
//   //       (await connection.getBalance(associtedWalletAddress)) / LAMPORTS_PER_SOL;
//   //     console.log(
//   //       "associtedWalletAddressBalanceAfterTx",
//   //       associtedWalletAddressBalanceAfterTx
//   //     );
//   //     // let expectedReceiverBalanceAfterTx =
//   //     //   receiverBalanceAfterTx + SPL_AMOUNT - response.data.estimatedFee;
//   //     // console.log(
//   //     //   "expectedReceiverBalanceAfterTx",
//   //     //   expectedReceiverBalanceAfterTx
//   //     // );
//   //     // if (isCancelAfterStartTime && !isCancelAfterEndTime) {
//   //     //   isCancelable =
//   //     //     SPL_AMOUNT <= perSecondAmount * currentTime - START_TIME_NATIVE_TOKEN_STREAM;
//   //     // } else if (isCancelAfterStartTime && isCancelAfterEndTime) {
//   //     //   isCancelable = SPL_AMOUNT <= perSecondAmount * END_TIME_NATIVE_TOKEN_STREAM - START_TIME_NATIVE_TOKEN_STREAM;
//   //     // }
//   //     // let associtedWalletAddressAfterTx =
//   //     //   (await connection.getBalance(associtedWalletAddress)) / LAMPORTS_PER_SOL;
//   //     // let expectedAssociatedWalletBalanceAfterTx =
//   //     //   associtedWalletBalanceBeforeTx - SPL_AMOUNT;
//   //     expect(response.status).toBe("success");
//   //   });
//   //   withdraw;
//   // test("check successfully withdraw the stream streamed token", async () => {
//   //   await new Promise((r) => setTimeout(r, 2000));
//   //   let associtedWalletAddress = await getZebecAsociatedWalletAddress(
//   //     keyPair.publicKey
//   //   );
//   //   let associtedWalletAddressBalanceBeforeTx =
//   //     (await connection.getBalance(associtedWalletAddress)) / LAMPORTS_PER_SOL;
//   //   let receiverKeyPair = Keypair.fromSecretKey(decode(RECEIVER_SECRET_KEY));
//   //   let receiverBalanceBeforeTx =
//   //     (await connection.getBalance(receiverKeyPair.publicKey)) /
//   //     LAMPORTS_PER_SOL;
//   //   console.log(
//   //     "associtedWalletAddressBalanceBeforeTx",
//   //     associtedWalletAddressBalanceBeforeTx
//   //   );
//   //   console.log("receiverBalanceBeforeTx", receiverBalanceBeforeTx);
//   //   let currentTime = Math.floor(Date.now() / 1000);
//   //   const response = await stream.withdraw({
//   //     sender: keyPair.publicKey,
//   //     amount: SPL_AMOUNT,
//   //     receiver: receiverKeyPair,
//   //     pda: "9d4AVwZERjbkTkxUAUpbojZchvgM8F52N59KDnwnYYyu",
//   //     token: SPL_TOKEN_ADDRESS,
//   //   });
//   //   if (response.status == "error") {
//   //     console.log("withdraw streamed spl token error", response);
//   //     throw new Error(response);
//   //   }
//   //   let isCancelAfterStartTime = currentTime > START_TIME_NATIVE_TOKEN_STREAM;
//   //   let isCancelAfterEndTime = currentTime > END_TIME_NATIVE_TOKEN_STREAM;
//   //   let perSecondAmount =
//   //     NATIVE_STREAMED_AMOUNT /
//   //     (END_TIME_NATIVE_TOKEN_STREAM - START_TIME_NATIVE_TOKEN_STREAM);
//   //   let totalStreamedAmount =
//   //     perSecondAmount *
//   //     (END_TIME_NATIVE_TOKEN_STREAM - START_TIME_NATIVE_TOKEN_STREAM);
//   //   let streamedAmountWithOutZebecFee =
//   //     perSecondAmount * (currentTime - START_TIME_NATIVE_TOKEN_STREAM);
//   //   let zebecFeeOnWithdraw = (streamedAmountWithOutZebecFee / 100) * 0.25;
//   //   console.log(
//   //     "START_TIME_NATIVE_TOKEN_STREAM",
//   //     START_TIME_NATIVE_TOKEN_STREAM
//   //   );
//   //   console.log("END_TIME_NATIVE_TOKEN_STREAM", END_TIME_NATIVE_TOKEN_STREAM);
//   //   console.log("currentTime", currentTime);
//   //   console.log("perSecondAmount", perSecondAmount);
//   //   console.log("totalStreamedAmount", totalStreamedAmount);
//   //   console.log("zebecFeeOnWithdraw", zebecFeeOnWithdraw);
//   //   console.log("isCancelAfterStartTime", isCancelAfterStartTime);
//   //   console.log("isCancelAfterEndTime", isCancelAfterEndTime);
//   //   console.log("streamedAmountWithOutZebecFee", streamedAmountWithOutZebecFee);
//   //   let streamedAmountOnWithdraw = 0;
//   //   if (isCancelAfterStartTime) {
//   //     streamedAmountOnWithdraw = SPL_AMOUNT - zebecFeeOnWithdraw;
//   //   }
//   //   console.log("streamedAmountOnWithdraw", streamedAmountOnWithdraw);
//   //   let receiverBalanceAfterTx =
//   //     (await connection.getBalance(receiverKeyPair.publicKey)) /
//   //     LAMPORTS_PER_SOL;
//   //   console.log("receiverBalanceAfterTx", receiverBalanceAfterTx);
//   //   console.log(
//   //     "deducted balance after withdraw",
//   //     receiverBalanceAfterTx - receiverBalanceBeforeTx
//   //   );
//   //   let expectedReceiverBalanceAfterTx =
//   //     receiverBalanceBeforeTx + streamedAmountOnWithdraw;
//   //   console.log(
//   //     "expectedReceiverBalanceAfterTx",
//   //     expectedReceiverBalanceAfterTx
//   //   );
//   //   let associtedWalletAddressBalanceAfterTx =
//   //     (await connection.getBalance(associtedWalletAddress)) / LAMPORTS_PER_SOL;
//   //   console.log(
//   //     "associtedWalletAddressBalanceAfterTx",
//   //     associtedWalletAddressBalanceAfterTx
//   //   );
//   //   console.log("response", response);
//   //   expect(response.status).toBe("success");
//   //   expect(associtedWalletAddressBalanceAfterTx).toBe(
//   //     associtedWalletAddressBalanceBeforeTx - SPL_AMOUNT
//   //   );
//   // });
// });
