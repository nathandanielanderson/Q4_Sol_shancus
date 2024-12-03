using System;
using System.Text;
using System.Threading.Tasks;
using Solana.Unity.Rpc;
using Solana.Unity.Rpc.Builders;
using Solana.Unity.Rpc.Models;
using Solana.Unity.Rpc.Types;
using Solana.Unity.Wallet;
using UnityEngine;

namespace Solana.Unity.Scripts
{
    public class SayHello : Web3BaseScript
    {
        // Program ID of the deployed program
        private const string ProgramId = "2r9AvbDhiTq9dcAojVmJgnxZX3AH7nsycL6WXtPPqNW4";

        protected override void Awake()
        {
            base.Awake();
        }

        private async void Start()
        {
            await CheckBalance(); // Example to check the balance
            await SendLogMessage("Hello Solana! This is Unity Speaking."); // Call the log_message program
        }

        private async Task SendLogMessage(string message)
        {
            if (wallet == null || wallet.Account == null)
            {
                Debug.LogError("Wallet not connected or no account available.");
                return;
            }

            try
            {
                // Retrieve the latest blockhash
                var blockHashResult = await rpc.GetLatestBlockHashAsync(Commitment.Confirmed);
                if (!blockHashResult.WasSuccessful)
                {
                    Debug.LogError("Failed to retrieve recent block hash.");
                    return;
                }

                string recentBlockHash = blockHashResult.Result.Value.Blockhash;

                // Prepare instruction data for `log_message`
                byte[] instructionData = BuildLogMessageData(message);

                // Define the transaction instruction to call `log_message`
                var logMessageInstruction = new TransactionInstruction
                {
                    ProgramId = new PublicKey(ProgramId),
                    Keys = new System.Collections.Generic.List<AccountMeta>
                    {
                        AccountMeta.Writable(wallet.Account.PublicKey, isSigner: true) 
                    },
                    Data = instructionData
                };

                // Build the transaction with Compute Budget and Log Message instructions
                byte[] transactionBytes = new TransactionBuilder()
                    .SetRecentBlockHash(recentBlockHash)
                    .SetFeePayer(wallet.Account)
                    .AddInstruction(logMessageInstruction) // Then add the log_message instruction
                    .Build(wallet.Account);

                // Convert transaction to base64 for RPC submission
                string transactionBase64 = Convert.ToBase64String(transactionBytes);

                // Send the transaction and log the result
                var txResult = await rpc.SendTransactionAsync(transactionBase64, true, Commitment.Finalized);

                if (txResult.WasSuccessful)
                {
                    Debug.Log($"log_message sent successfully with transaction signature: {txResult.Result}");
                }
                else
                {
                    Debug.LogError($"Transaction failed with reason: {txResult.Reason}");
                }
            }
            catch (Exception ex)
            {
                Debug.LogError($"Error sending log_message transaction: {ex.Message}");
            }
        }

private byte[] BuildLogMessageData(string message)
{
    // Use 8-byte discriminator for the `logMessage` instruction
    var discriminator = new byte[] { 148, 4, 44, 34, 202, 5, 83, 115 };

    // Convert the message to UTF-8 byte array
    var messageBytes = Encoding.UTF8.GetBytes(message);

    // Calculate the length of the message and encode it as a 4-byte little-endian integer
    int messageLength = messageBytes.Length;
    var lengthPrefix = BitConverter.GetBytes(messageLength);

    if (BitConverter.IsLittleEndian == false)
    {
        Array.Reverse(lengthPrefix);
    }

    // Combine the discriminator, length prefix, and message
    var data = new System.Collections.Generic.List<byte>(discriminator);
    data.AddRange(lengthPrefix); // Adding the 4-byte message length prefix
    data.AddRange(messageBytes); // Adding the actual message bytes

    return data.ToArray();
}
    }
}