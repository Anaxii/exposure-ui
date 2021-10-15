
const anchor = require("@project-serum/anchor");
import { Account, Connection, LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction, SystemProgram } from '@solana/web3.js'
import { sendTransaction, createAssociatedTokenAccount,   createTokenAccountIfNotExist,
} from './web3'
const programId = new anchor.web3.PublicKey('3bW4tyCM7UsN7dw3LrAijMzTH3cECBSJHJFyMs4FX3en');
import {idl} from './programs/multisig'
import { TOKEN_PROGRAM_ID, MEMO_PROGRAM_ID, SYSTEM_PROGRAM_ID } from './ids'
// @ts-ignore
import { nu64, struct, u8, blob, union } from 'buffer-layout'
import { NATIVE_SOL } from '@/utils/tokens'
const serumCmn = require("@project-serum/common");
const TokenInstructions = require("@project-serum/serum").TokenInstructions;
import { TokenAmount, lt } from '@/utils/safe-math'
import { sleep } from '.';

async function getTokenAccount(provider: any, addr: any) {
  return await serumCmn.getTokenAccount(provider, addr);
}

export async function CreateMultiSIG(
    conn: Connection | undefined | null,
    wallet: any | undefined | null,
    owners: string[],
    threshold: Number
)
{
if (!conn || !wallet) throw new Error('Missing connection')

const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())

const program = new anchor.Program(idl, programId, provider);
let bn_threshold = new anchor.BN(threshold)

let vault_owners:string[] = []


if(owners != null || owners != undefined)
{
    for(let i = 0; i < owners.length;i++) {
        let temp_owner = new anchor.web3.PublicKey(owners[i])
        vault_owners.push(temp_owner)
    }
}

let multisig_pubkey = anchor.web3.Keypair.generate();
// let multisigAccount = await program.account.multisig.fetch(multisig_pubkey.publicKey);
// console.log(multisigAccount)
const [_multisigSigner, nonce] = await anchor.web3.PublicKey.findProgramAddress(
    [multisig_pubkey.publicKey.toBuffer()],
    program.programId,
);

let multisigSize = 200;
const tx = await program.rpc.createMultisig(
    vault_owners, bn_threshold, nonce, {
        accounts: {
            multisig: multisig_pubkey.publicKey,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY
        },
        instructions: [
            await program.account.multisig.createInstruction(
                multisig_pubkey,
                multisigSize
            )
        ],
        signers: [multisig_pubkey]
    }


);
    await sleep(5000)
    let msigAccount = await program.account.multisig.fetch(multisig_pubkey.publicKey);
    return {"multisig_address" :multisig_pubkey.publicKey, "multisig_vault":_multisigSigner};
}

export async function GetTokenVault
(
    conn: Connection | undefined | null,
    wallet: any | undefined | null,
    multisig_id: string | undefined | null
)
{
    if (!conn || !wallet) throw new Error('Missing connection')
    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())

    const program = new anchor.Program(idl, programId, provider);
    let _multisig = new anchor.web3.PublicKey(multisig_id);

    const [_multisigSigner, nonce] = await anchor.web3.PublicKey.findProgramAddress(
        [_multisig.toBuffer()],
        program.programId,
    );

    return _multisigSigner;
}


export async function ApproveTransaction(
    conn: Connection | undefined | null,
    wallet: any | undefined | null,
    txid: any,
    multisig_id: any,
)
{
    if (!conn || !wallet) throw new Error('Missing connection')
    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())

    const program = new anchor.Program(idl, programId, provider);
    let _multisig = new anchor.web3.PublicKey(multisig_id);
    let _txid = new anchor.web3.PublicKey(txid);

    const [_multisigSigner, nonce] = await anchor.web3.PublicKey.findProgramAddress(
        [_multisig.toBuffer()],
        program.programId,
    );

    const tx = await program.rpc.approve({
        accounts: {
            multisig: multisig_id,
            transaction: _txid,
            owner: wallet.publicKey,
        },
    })
    console.log(tx)
}

export async function ExecuteTransaction(
    conn: Connection | undefined | null,
    wallet: any | undefined | null,
    multisig_id: any,
    txid: any,
)
{
    if (!conn || !wallet) throw new Error('Missing connection')

    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())

    const program = new anchor.Program(idl, programId, provider);

    let _multisig = new anchor.web3.PublicKey(multisig_id);
    let _txid = new anchor.web3.PublicKey(txid);

    const [_multisigSigner, nonce] = await anchor.web3.PublicKey.findProgramAddress(
        [_multisig.toBuffer()],
        program.programId,
    );

    const txAccount = await program.account.transaction.fetch(_txid);
    console.log(txAccount.programId.toString())
    let keys = txAccount.accounts;
    keys[0].isSigner = false
    console.log(keys)
    keys.push({pubkey:txAccount.programId,isSigner:false,isWritable: false})
    keys.push({pubkey:_multisig,isSigner:false,isWritable: false})

  console.log(keys)

    let tx =   await program.rpc.executeTransaction({
        accounts: {
          multisig: _multisig,
          multisigSigner: _multisigSigner,
          transaction: _txid,
        },
        remainingAccounts: keys,
      });

    return tx;
}

export async function CreateTransction(
    conn: Connection | undefined | null,
    wallet: any | undefined | null,
    pid: string | undefined | null,
    accounts: any | undefined | null,
    data: any | undefined | null,
    multisig_id: string | undefined | null
)
{
    if (!conn || !wallet) throw new Error('Missing connection')
    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())
    const program = new anchor.Program(idl, programId, provider);
    const _pid = new anchor.web3.PublicKey(pid)
    const transaction = anchor.web3.Keypair.generate();

    let _multisig = new anchor.web3.PublicKey(multisig_id);
    const txSize = 1000; // Big enough, cuz I'm lazy.
    const tx = await program.rpc.createTransaction(_pid,accounts,data,{
        accounts: {
            multisig: _multisig,
            transaction: transaction.publicKey,
            proposer: wallet.publicKey,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },
        instructions: [
            await program.account.transaction.createInstruction(
                transaction,
                txSize
            ),
        ],
        signers: [transaction]
    });
    await sleep(5000)
    const txAccount = await program.account.transaction.fetch(transaction.publicKey);
    console.log(transaction.publicKey.toString())
    return transaction.publicKey.toString()
}

export async function SetOwners(
    conn: Connection | undefined | null,
    wallet: any | undefined | null,
    owners: string[],
    multisig_id: string
)
{
    if (!conn || !wallet) throw new Error('Missing connection')

    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())

    const program = new anchor.Program(idl, programId, provider);
    let _multisig = new anchor.web3.PublicKey(multisig_id);

    const [_multisigSigner, nonce] = await anchor.web3.PublicKey.findProgramAddress(
        [_multisig.toBuffer()],
        program.programId,
    );

    const accounts = [
        {
          pubkey: _multisig,
          isWritable: true,
          isSigner: false,
        },
        {
          pubkey: _multisigSigner,
          isWritable: false,
          isSigner: true,
        },
      ];

    let vault_owners:string[] = []

    if(owners != undefined || owners != null)
    {
        for(let i = 0; i < owners.length;i++)
        {
            let temp_owner = new anchor.web3.PublicKey(owners[i])
            vault_owners.push(temp_owner)
        }
    }


    let data = program.coder.instruction.encode('set_owners',
    {owners: vault_owners});

    await CreateTransction(conn, wallet, program.programId, accounts, data, multisig_id)
}

export async function SetThreshold(
    conn: Connection | undefined | null,
    wallet: any | undefined | null,
    threshold: number | undefined | null,
    multisig_id: string | undefined | null
)
{
    if (!conn || !wallet) throw new Error('Missing connection')
    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())

    const program = new anchor.Program(idl, programId, provider);

    let bn_threshold = new anchor.BN(threshold)
    let _multisig = new anchor.web3.PublicKey(multisig_id);

    const [_multisigSigner, nonce] = await anchor.web3.PublicKey.findProgramAddress(
        [_multisig.toBuffer()],
        program.programId,
    );
    const accounts =
        [
            {
                pubkey: _multisig,
                isWritable: true,
                isSigner: false,
            },
            {
                pubkey: _multisigSigner,
                isWritable: false,
                isSigner: true,
            },
        ];
      let ixCoder = new anchor.InstructionCoder(idl)
    let data = ixCoder.encode('change_threshold',
    {threshold: bn_threshold});

    await CreateTransction(conn, wallet, program.programId, accounts, data, multisig_id)
}

const LAYOUT = union(u8('instruction'));
LAYOUT.addVariant(
    12,
    struct([nu64('amount'), u8('decimals')]),
    'transferChecked',
  );
const instructionMaxSpan = Math.max(
    ...Object.values(LAYOUT.registry).map((r: any) => r.span),
  );

function encodeTokenInstructionData(instruction: unknown) {
    const b = Buffer.alloc(instructionMaxSpan);
    const span = LAYOUT.encode(instruction, b);
    return b.slice(0, span);
  }

  function tokenTransfer(
    mint: PublicKey,
    owner: PublicKey,
    source: PublicKey,
    dest: PublicKey,
    programId: PublicKey,
    amount: number,
    decimals: number
  ): TransactionInstruction {

    const keys = [
      { pubkey: source, isSigner: false, isWritable: true },
      { pubkey: mint, isSigner: false, isWritable: false },
      { pubkey: dest, isSigner: false, isWritable: true },
      { pubkey: owner, isSigner: true, isWritable: false }
    ]
    return new TransactionInstruction({
      keys,
      programId,
      data: encodeTokenInstructionData({
        transferChecked: { amount, decimals },
      }),
    })
  }

  async function createTokenAccount(connection: Connection, wallet: any, mintAddress: string, owner: PublicKey) {
    const transaction = new Transaction()
    const signers: Account[] = []

    const account = await createTokenAccountIfNotExist(connection, '', owner, mintAddress, null, transaction, signers)
    console.log(account.toString())
    return await sendTransaction(connection, wallet, transaction, signers)
  }

export async function SPL_Transfer(
    conn: Connection | undefined | null,
    wallet: any | undefined | null,
    multisig_id: string | undefined | null,
    mint_addy: string | undefined | null,
    dest: string | undefined | null,
    amount: number | undefined | null
){
    if (!conn || !wallet) throw new Error('Missing connection')
    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())
    const program = new anchor.Program(idl, programId, provider);
    console.log(multisig_id)
    let _multisig = new anchor.web3.PublicKey(multisig_id);
    let _mintPk = new anchor.web3.PublicKey(mint_addy)
    const [_multisigSigner, nonce] = await anchor.web3.PublicKey.findProgramAddress(
        [_multisig.toBuffer()],
        program.programId,
    );

    //Change to import from known token accounts.
    let _source = new anchor.web3.PublicKey('GESrhFmS5ZPANubCmDd86fiB8i7tnN1GGLQkffxZKqbz');
    let _dest = new anchor.web3.PublicKey(dest);

    if(_dest == undefined || _source == undefined || amount == undefined)
        return "Error: Transfer Failed!"

    let transfer_ix = tokenTransfer(_mintPk, _multisigSigner, _source,_dest,TOKEN_PROGRAM_ID,amount,9)

    const tx = await CreateTransction(conn, wallet,TOKEN_PROGRAM_ID.toString(),transfer_ix.keys,transfer_ix.data,multisig_id)
    return tx
}

export async function SOL_Transfer(
    conn: Connection | undefined | null,
    wallet: any | undefined | null,
    multisig_id: string | undefined | null,
    dest: string| undefined | null,
){
    if (!conn || !wallet) throw new Error('Missing connection')
    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())
    const program = new anchor.Program(idl, programId, provider);
    let _multisig = new anchor.web3.PublicKey(multisig_id);
    const [_multisigSigner, nonce] = await anchor.web3.PublicKey.findProgramAddress(
        [_multisig.toBuffer()],
        program.programId,
    );


    let _dest = new anchor.web3.PublicKey(dest);

    let transfer_ix = SystemProgram.transfer({
        fromPubkey: _multisigSigner,
        toPubkey: _dest,
        lamports: 10000
      })



    await CreateTransction(conn, wallet,SYSTEM_PROGRAM_ID.toString(),transfer_ix.keys,transfer_ix.data,multisig_id)
}

