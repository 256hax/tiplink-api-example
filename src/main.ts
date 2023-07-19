import * as bs58 from 'bs58';
import {
  PublicKey,
  Keypair,
  Connection,
  clusterApiUrl,
  sendAndConfirmTransaction,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { TipLink } from '@tiplink/api';

// Replace to your wallet private key. DO NOT SHARE PRIVATE KEY.
const SECRET_KEY_BASE58 = 'qkT6L2d7CY3TP1idkij8UNhzwcfQJfdjvU8NMu4FKHokkPrTeXfhooeeqUsQr5rL8rhZrcroMr4T2CFxanvezgQ';

// Replace to fund SOL(not Lamports) including transaction fee what you need.
const FUND_SOL = 0.000905;

// Replace to your custom RPC URL(e.g. QuickNode).
// const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const createAndFundKeypair = async () => {
  const sourceKeypair = Keypair.fromSecretKey(bs58.decode(SECRET_KEY_BASE58));
  return sourceKeypair;
}

const fundTipLink = async (sourceKeypair: Keypair, destinationTipLink: TipLink) => {
  /* TipLink.create() should not be able to generate invalid addresses
   * this check is purely for demonstrational purposes
   */
  const isValidAddress = await PublicKey.isOnCurve(destinationTipLink.keypair.publicKey);
  if (!isValidAddress) {
    throw "Invalid TipLink";
  }

  let transaction = new Transaction();

  transaction.add(
    SystemProgram.transfer({
      fromPubkey: sourceKeypair.publicKey,
      toPubkey: destinationTipLink.keypair.publicKey,
      lamports: LAMPORTS_PER_SOL * FUND_SOL,
    }),
  );

  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [sourceKeypair],
    { commitment: "confirmed" }
  );
  if (transactionSignature === null) {
    throw "Unable to fund TipLink's public key";
  }
  return transactionSignature;
};

const createAndFundTipLink = async () => {
  const sourceKeypair = await createAndFundKeypair();
  const destinationTipLink = await TipLink.create();
  await fundTipLink(sourceKeypair, destinationTipLink);

  // TipLin available for Mainnet-beta
  console.log(destinationTipLink.url.toString());
};

createAndFundTipLink();

/*
% ts-node <THIS FILE>
https://tiplink.io/i#45XDbbdHgutwaeSNv
*/