import * as anchor from "@project-serum/anchor";
import * as assert from "assert";
import { Program } from "@project-serum/anchor";
import { SolanaMessenger } from "../target/types/solana_messenger";
const { SystemProgram } = anchor.web3;

describe("solana-messenger", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env()
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaMessenger as Program<SolanaMessenger>;
  const baseAccount  = anchor.web3.Keypair.generate();


  it("Is initialized!", async function() {
    await program.rpc.initialize("This message will live forever on the blockchain", {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount]
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    //console.log('Data: ', account.data);
    assert.ok(account.data === "This message will live forever on the blockchain");

  });
  
  it("Updating initialized account", async function() {
    await program.rpc.update("My second message", {
      accounts: {
        baseAccount: baseAccount.publicKey,
      }
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    assert.ok(account.data === "My second message");
    assert.ok(account.dataList.length === 2);

  });
});


