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
import { sleep } from './sleep';

// Replace to your wallet private key. DO NOT SHARE PRIVATE KEY.
const SECRET_KEY_BASE58 = 'qkT6L2d7CY3TP1idkij8UNhzwcfQJfdjvU8NMu4FKHokkPrTeXfhooeeqUsQr5rL8rhZrcroMr4T2CFxanvezgQ';

// Replace to fund SOL(not Lamports) including transaction fee what you need.
const FUND_SOL = 0.000905;

// Number of creation TipLink URLs.
const NUMBER_OF_TIPLINK_URL = 1; // e.g. 3: create three TipLink URLs

// Replace to your custom RPC URL(e.g. QuickNode).
const RPC_URL = 'https://api.devnet.solana.com';
// const RPC_URL = 'https://api.mainnet-beta.solana.com';
const connection = new Connection(RPC_URL, 'confirmed');

const ReadMyKeypair = async () => {
  const sourceKeypair = Keypair.fromSecretKey(bs58.decode(SECRET_KEY_BASE58));
  return sourceKeypair;
}

const fundTipLink = async (sourceKeypair: Keypair, destinationTipLink: TipLink) => {
  /* TipLink.create() should not be able to generate invalid addresses
   * this check is purely for demonstrational purposes
   */
  const isValidAddress = await PublicKey.isOnCurve(destinationTipLink.keypair.publicKey);
  if (!isValidAddress) {
    throw 'Invalid TipLink';
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
    { commitment: 'confirmed' }
  );
  if (transactionSignature === null) {
    throw "Unable to fund TipLink's public key";
  }
  return transactionSignature;
};

const createAndFundTipLink = async () => {
  const sourceKeypair = await ReadMyKeypair();

  for (let i = 0; i < NUMBER_OF_TIPLINK_URL; i++) {
    const destinationTipLink = await TipLink.create();
    await fundTipLink(sourceKeypair, destinationTipLink);

    // TipLink available for Mainnet-beta.
    console.log(destinationTipLink.url.toString());

    sleep(500);
  }
};

createAndFundTipLink();

/*
% ts-node <THIS FILE>
https://tiplink.io/i#45XDbbdHgutwaeSNv
*/