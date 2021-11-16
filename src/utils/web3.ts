import {
  Account,
  AccountInfo,
  Commitment,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionSignature,
  TransactionInstruction
} from '@solana/web3.js'
// @ts-ignore without ts ignore, yarn build will failed
import { Token } from '@solana/spl-token'

import { ACCOUNT_LAYOUT, MINT_LAYOUT } from '@/utils/layouts'
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, SYSTEM_PROGRAM_ID, RENT_PROGRAM_ID } from '@/utils/ids'
// eslint-disable-next-line
import assert from 'assert'
import { initializeAccount } from '@project-serum/serum/lib/token-instructions'
import { struct } from 'superstruct'
import { TOKENS } from '@/utils/tokens'

export const web3Config = {
  strategy: 'speed',
  rpcs: [
    { url: 'https://solana-api.projectserum.com', weight: 50 },
    // { url: 'https://raydium.rpcpool.com', weight: 40 },
    // { url: 'https://api.mainnet-beta.solana.com', weight: 100 }
  ]
}

// export const commitment: Commitment = 'processed'
export const commitment: Commitment = 'confirmed'
// export const commitment: Commitment = 'finalized'

export async function findProgramAddress(seeds: Array<Buffer | Uint8Array>, programId: PublicKey) {
  const [publicKey, nonce] = await PublicKey.findProgramAddress(seeds, programId)
  return { publicKey, nonce }
}

export async function createAmmAuthority(programId: PublicKey) {
  return await findProgramAddress(
      [new Uint8Array(Buffer.from('amm authority'.replace('\u00A0', ' '), 'utf-8'))],
      programId
  )
}

export async function createAssociatedId(infoId: PublicKey, marketAddress: PublicKey, bufferKey: string) {
  const { publicKey } = await findProgramAddress(
      [infoId.toBuffer(), marketAddress.toBuffer(), Buffer.from(bufferKey)],
      infoId
  )
  return publicKey
}

export async function findAssociatedTokenAddress(walletAddress: PublicKey, tokenMintAddress: PublicKey) {
  const { publicKey } = await findProgramAddress(
      [walletAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), tokenMintAddress.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
  )
  return publicKey
}

export async function createTokenAccountIfNotExist(
    connection: Connection,
    account: string | undefined | null,
    owner: PublicKey,
    mintAddress: string,
    lamports: number | null,

    transaction: Transaction,
    signer: Array<Account>
) {
  let publicKey

  if (account) {
    publicKey = new PublicKey(account)
  } else {
    publicKey = await createProgramAccountIfNotExist(
        connection,
        account,
        owner,
        TOKEN_PROGRAM_ID,
        lamports,
        ACCOUNT_LAYOUT,
        transaction,
        signer
    )

    transaction.add(
        initializeAccount({
          account: publicKey,
          mint: new PublicKey(mintAddress),
          owner
        })
    )
  }

  return publicKey
}

export async function createAssociatedTokenAccountIfNotExist(
    account: string | undefined | null,
    owner: PublicKey,
    mintAddress: string,

    transaction: Transaction,
    atas: string[] = []
) {
  let publicKey
  if (account) {
    publicKey = new PublicKey(account)
  }

  const mint = new PublicKey(mintAddress)
  // @ts-ignore without ts ignore, yarn build will failed
  const ata = await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, mint, owner, true)

  if (
      (!publicKey || !ata.equals(publicKey)) &&
      mintAddress !== TOKENS.WSOL.mintAddress &&
      !atas.includes(ata.toBase58())
  ) {
    transaction.add(
        Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            mint,
            ata,
            owner,
            owner
        )
    )
    atas.push(ata.toBase58())
  }

  return ata
}

export async function createProgramAccountIfNotExist(
    connection: Connection,
    account: string | undefined | null,
    owner: PublicKey,
    programId: PublicKey,
    lamports: number | null,
    layout: any,

    transaction: Transaction,
    signer: Array<Account>
) {
  let publicKey

  if (account) {
    publicKey = new PublicKey(account)
  } else {
    const newAccount = new Account()
    publicKey = newAccount.publicKey

    transaction.add(
        SystemProgram.createAccount({
          fromPubkey: owner,
          newAccountPubkey: publicKey,
          lamports: lamports ?? (await connection.getMinimumBalanceForRentExemption(layout.span)),
          space: layout.span,
          programId
        })
    )

    signer.push(newAccount)
  }

  return publicKey
}

export async function createAssociatedTokenAccount(
    tokenMintAddress: PublicKey,
    owner: PublicKey,
    transaction: Transaction
) {
  const associatedTokenAddress = await findAssociatedTokenAddress(owner, tokenMintAddress)

  const keys = [
    {
      pubkey: owner,
      isSigner: true,
      isWritable: true
    },
    {
      pubkey: associatedTokenAddress,
      isSigner: false,
      isWritable: true
    },
    {
      pubkey: owner,
      isSigner: false,
      isWritable: false
    },
    {
      pubkey: tokenMintAddress,
      isSigner: false,
      isWritable: false
    },
    {
      pubkey: SYSTEM_PROGRAM_ID,
      isSigner: false,
      isWritable: false
    },
    {
      pubkey: TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false
    },
    {
      pubkey: RENT_PROGRAM_ID,
      isSigner: false,
      isWritable: false
    }
  ]

  transaction.add(
      new TransactionInstruction({
        keys,
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([])
      })
  )

  return associatedTokenAddress
}

export async function getFilteredProgramAccounts(
    connection: Connection,
    programId: PublicKey,
    filters: any
): Promise<{ publicKey: PublicKey; accountInfo: AccountInfo<Buffer> }[]> {
  // @ts-ignore
  const resp = await connection._rpcRequest('getProgramAccounts', [
    programId.toBase58(),
    {
      commitment: connection.commitment,
      filters,
      encoding: 'base64'
    }
  ])
  if (resp.error) {
    throw new Error(resp.error.message)
  }
  // @ts-ignore
  return resp.result.map(({ pubkey, account: { data, executable, owner, lamports } }) => ({
    publicKey: new PublicKey(pubkey),
    accountInfo: {
      data: Buffer.from(data[0], 'base64'),
      executable,
      owner: new PublicKey(owner),
      lamports
    }
  }))
}

export async function getMultipleAccounts(
    connection: Connection,
    publicKeys: PublicKey[],
    commitment?: Commitment
): Promise<Array<null | { publicKey: PublicKey; account: AccountInfo<Buffer> }>> {
  const keys: string[][] = []
  let tempKeys: string[] = []

  publicKeys.forEach((k) => {
    if (tempKeys.length >= 100) {
      keys.push(tempKeys)
      tempKeys = []
    }
    tempKeys.push(k.toBase58())
  })
  if (tempKeys.length > 0) {
    keys.push(tempKeys)
  }

  const accounts: Array<null | {
    executable: any
    owner: PublicKey
    lamports: any
    data: Buffer
  }> = []

  for (const key of keys) {
    const args = [key, { commitment }]

    // @ts-ignore
    const unsafeRes = await connection._rpcRequest('getMultipleAccounts', args)
    const res = GetMultipleAccountsAndContextRpcResult(unsafeRes)
    if (res.error) {
      throw new Error(
          'failed to get info about accounts ' + publicKeys.map((k) => k.toBase58()).join(', ') + ': ' + res.error.message
      )
    }

    assert(typeof res.result !== 'undefined')

    for (const account of res.result.value) {
      let value: {
        executable: any
        owner: PublicKey
        lamports: any
        data: Buffer
      } | null = null
      if (account === null) {
        accounts.push(null)
        continue
      }
      if (res.result.value) {
        const { executable, owner, lamports, data } = account
        assert(data[1] === 'base64')
        value = {
          executable,
          owner: new PublicKey(owner),
          lamports,
          data: Buffer.from(data[0], 'base64')
        }
      }
      if (value === null) {
        throw new Error('Invalid response')
      }
      accounts.push(value)
    }
  }

  return accounts.map((account, idx) => {
    if (account === null) {
      return null
    }
    return {
      publicKey: publicKeys[idx],
      account
    }
  })
}



function jsonRpcResult(resultDescription: any) {
  const jsonRpcVersion = struct.literal('2.0')
  return struct.union([
    struct({
      jsonrpc: jsonRpcVersion,
      id: 'string',
      error: 'any'
    }),

    struct({
      jsonrpc: jsonRpcVersion,
      id: 'string',
      error: 'null?',
      result: resultDescription
    })
  ])
}

function jsonRpcResultAndContext(resultDescription: any) {
  return jsonRpcResult({
    context: struct({
      slot: 'number'
    }),
    value: resultDescription
  })
}

const AccountInfoResult = struct({
  executable: 'boolean',
  owner: 'string',
  lamports: 'number',
  data: 'any',
  rentEpoch: 'number?'
})

const GetMultipleAccountsAndContextRpcResult = jsonRpcResultAndContext(
    struct.array([struct.union(['null', AccountInfoResult])])
)

// transaction
export async function signTransaction(
    connection: Connection,
    wallet: any,
    transaction: Transaction,
    signers: Array<Account> = []
) {
  transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash
  transaction.setSigners(wallet.publicKey, ...signers.map((s) => s.publicKey))
  if (signers.length > 0) {
    transaction.partialSign(...signers)
  }
  return await wallet.signTransaction(transaction)
}

async function covertToProgramWalletTransaction(
    connection: Connection,
    wallet: any,
    transaction: Transaction,
    signers: Array<Account> = []
) {
  transaction.recentBlockhash = (await connection.getRecentBlockhash(commitment)).blockhash
  transaction.feePayer = wallet.publicKey
  if (signers.length > 0) {
    transaction = await wallet.convertToProgramWalletTransaction(transaction)
    transaction.partialSign(...signers)
  }
  return transaction
}

export async function sendTransaction(
    connection: Connection,
    wallet: any,
    transaction: Transaction,
    signers: Array<Account> = []
) {
  if (wallet.isProgramWallet) {
    const programWalletTransaction = await covertToProgramWalletTransaction(connection, wallet, transaction, signers)
    return await wallet.signAndSendTransaction(programWalletTransaction)
  } else {
    const signedTransaction = await signTransaction(connection, wallet, transaction, signers)
    return await sendSignedTransaction(connection, signedTransaction)
  }
}

export async function sendSignedTransaction(connection: Connection, signedTransaction: Transaction): Promise<string> {
  const rawTransaction = signedTransaction.serialize()

  const txid: TransactionSignature = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
    preflightCommitment: commitment
  })

  return txid
}

export function mergeTransactions(transactions: (Transaction | undefined)[]) {
  const transaction = new Transaction()
  transactions
      .filter((t): t is Transaction => t !== undefined)
      .forEach((t) => {
        transaction.add(t)
      })
  return transaction
}

function throwIfNull<T>(value: T | null, message = 'account not found'): T {
  if (value === null) {
    throw new Error(message)
  }
  return value
}

export async function getMintDecimals(connection: Connection, mint: PublicKey): Promise<number> {
  const { data } = throwIfNull(await connection.getAccountInfo(mint), 'mint not found')
  const { decimals } = MINT_LAYOUT.decode(data)
  return decimals
}

export async function getFilteredTokenAccountsByOwner(
    connection: Connection,
    programId: PublicKey,
    mint: PublicKey
): Promise<{ context: {}; value: [] }> {
  // @ts-ignore
  const resp = await connection._rpcRequest('getTokenAccountsByOwner', [
    programId.toBase58(),
    {
      mint: mint.toBase58()
    },
    {
      encoding: 'jsonParsed'
    }
  ])
  if (resp.error) {
    throw new Error(resp.error.message)
  }
  return resp.result
}

import * as base58 from 'bs58';
import {ClockLayout } from '@/utils/layouts'
import logger from '@/utils/logger'
// eslint-disable-next-line
import nacl from 'tweetnacl';
import { hmacSha256 } from '@/utils/solana'
import { Numberu64 } from './solana'
export const endpoints = [
  { url: 'https://api.devnet.solana.com/', weight: 90 },
  { url: 'https://api.devnet.solana.com/', weight: 10 },
]

export function getRandomEndpoint() {
  let pointer = 0
  const random = Math.random() * 100
  let api = endpoints[0].url

  for (const endpoint of endpoints) {
    if (random > pointer + endpoint.weight) {
      pointer += pointer + endpoint.weight
    } else if (random >= pointer && random < pointer + endpoint.weight) {
      api = endpoint.url
      break
    } else {
      // logger(`${random} using ${endpoint.url}`)
      api = endpoint.url
      break
    }
  }

  // logger(`using ${api}`)
  return api
}

export async function loadAccount(
    connection: Connection,
    address: PublicKey,
    programId: PublicKey,
): Promise<any> {
  const accountInfo = await connection.getAccountInfo(address);
  if (accountInfo === null) {
    return false;
  }

  return Buffer.from(accountInfo.data);
}



export async function loadClockAccount(
    connection: Connection,
    programId: PublicKey,
): Promise<Object> {
  let clockId = new PublicKey('SysvarC1ock11111111111111111111111111111111');
  const data = await loadAccount(connection, clockId, programId);
  if (!data) {
    return {};
  }
  const tokenClockData = ClockLayout.decode(data);
  if (!tokenClockData.slot) {
    return {};
  }

  let tokenClockInfo = {} as any;

  tokenClockInfo['currSlot'] = tokenClockData.slot;
  return tokenClockInfo;
}

export function createUniqueAssociatedAccount(user: PublicKey, pool_id: PublicKey): Account {
  let user_info_account_seed = hmacSha256(user.toBase58(), pool_id.toBase58());
  let b = Buffer.from(user_info_account_seed);
  let keyPair = nacl.sign.keyPair.fromSeed(b.subarray(0, 32));
  return new Account(keyPair.secretKey);
}

export async function createProgramAccountByLenIfNotExist(
    connection: Connection,
    pool_id: PublicKey,
    owner: PublicKey,
    programId: PublicKey,
    lamports: number | null,
    len: any,
    transaction: Transaction,
    signer: Array<Account>
) {
  const newAccount = createUniqueAssociatedAccount(owner, pool_id);
  let exist = await loadAccount(connection, newAccount.publicKey, programId);
  if (exist) {
    return newAccount.publicKey;
  }
  let publicKey = newAccount.publicKey
  transaction.add(
      SystemProgram.createAccount({
        fromPubkey: owner,
        newAccountPubkey: publicKey,
        lamports: lamports ?? (await connection.getMinimumBalanceForRentExemption(len)),
        space: len,
        programId
      })
  )

  signer.push(newAccount)
  return publicKey
}

export function parseTokenAccountData(data: any): any {
  const { mint, owner, amount } = ACCOUNT_LAYOUT.decode(data);
  const a = {
    mint,
    owner,
    amount,
  };
  return a;
}

export async function createAssociatedTokenAccountByFeeIfNotExist(
    connection: Connection,
    feeAddr: PublicKey,
    tokenMintAddress: PublicKey,
    owner: PublicKey,
    transaction: Transaction
): Promise<PublicKey> {

  const destinationSplTokenAccount = (
      await getOwnedTokenAccounts(connection, owner, tokenMintAddress)
  ) // @ts-ignore
      .map(({ publicKey, accountInfo }) => {
        const a = parseTokenAccountData(accountInfo.data);
        return { publicKey, parsed: a };
      }) // @ts-ignore
      .filter(({ parsed }) => {
        return parsed.mint.equals(tokenMintAddress)
      }) // @ts-ignore
      .sort((a, b) => {
        return b.parsed.amount - a.parsed.amount;
      })[0];
  if (destinationSplTokenAccount) {
    return destinationSplTokenAccount.publicKey;
  }

  const associatedTokenAddress = await findAssociatedTokenAddress(owner, tokenMintAddress)

  const keys = [
    {
      pubkey: feeAddr,
      isSigner: true,
      isWritable: true
    },
    {
      pubkey: associatedTokenAddress,
      isSigner: false,
      isWritable: true
    },
    {
      pubkey: owner,
      isSigner: false,
      isWritable: false
    },
    {
      pubkey: tokenMintAddress,
      isSigner: false,
      isWritable: false
    },
    {
      pubkey: SYSTEM_PROGRAM_ID,
      isSigner: false,
      isWritable: false
    },
    {
      pubkey: TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false
    },
    {
      pubkey: RENT_PROGRAM_ID,
      isSigner: false,
      isWritable: false
    }
  ]

  transaction.add(
      new TransactionInstruction({
        keys,
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([])
      })
  )

  return associatedTokenAddress
}

export function getOwnedAccountsFilters(publicKey: PublicKey) {
  return [
    {
      memcmp: {
        offset: ACCOUNT_LAYOUT.offsetOf('owner'),
        bytes: publicKey.toBase58(),
      },
    },
    {
      dataSize: ACCOUNT_LAYOUT.span,
    },
  ];
}

export async function getOwnedTokenAccounts(
    connection: Connection,
    publicKey: PublicKey,
    programId: PublicKey
): Promise<any> {
  const filters = getOwnedAccountsFilters(publicKey);
  // @ts-ignore
  const resp = await connection._rpcRequest('getProgramAccounts', [
    TOKEN_PROGRAM_ID.toBase58(),
    {
      commitment: connection.commitment,
      filters,
    },
  ]);
  if (resp.error) {
    throw new Error(
        'failed to get token accounts owned by ' +
        publicKey.toBase58() +
        ': ' +
        resp.error.message,
    );
  }

  return resp.result   // @ts-ignore
      .map(({ pubkey, account: { data, executable, owner, lamports } }) => ({
        publicKey: new PublicKey(pubkey),
        accountInfo: {
          data: base58.decode(data),
          executable,
          owner: new PublicKey(owner),
          lamports,
        },
      }))   // @ts-ignore
      .filter(({ accountInfo }) => {
        // TODO: remove this check once mainnet is updated
        return filters.every((filter) => {
          if (filter.dataSize) {
            return accountInfo.data.length === filter.dataSize;
          } else if (filter.memcmp) {
            const filterBytes = base58.decode(filter.memcmp.bytes);
            return accountInfo.data
                .slice(
                    filter.memcmp.offset,
                    filter.memcmp.offset + filterBytes.length,
                )
                .equals(filterBytes);
          }
          return false;
        });
      });
}
