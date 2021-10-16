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
  const anchor = require("@project-serum/anchor");
  const programId = new anchor.web3.PublicKey('3bW4tyCM7UsN7dw3LrAijMzTH3cECBSJHJFyMs4FX3en');
  import {idl} from './programs/faucet'
  const { Market } = require("@project-serum/serum");
  const DEX_PID = new PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin");

  var TOKEN_A_VAULT = new anchor.web3.PublicKey("");
  var TOKEN_B_VAULT = new anchor.web3.PublicKey("");
  var TOKEN_C_VAULT = new anchor.web3.PublicKey("");
  var TOKEN_D_VAULT = new anchor.web3.PublicKey("");
  var TOKEN_E_VAULT = new anchor.web3.PublicKey("");

  function getTokenClient(
    conn: any,
    wallet: any | undefined | null,
    mint: PublicKey) {
    if (!conn || !wallet) throw new Error('Missing connection')

    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())

    const program = new anchor.Program(idl, programId, provider);

    const token_client = new Token(
        program.provider.connection,
        mint,
        TOKEN_PROGRAM_ID,
        wallet.payer
        
      );
      return token_client;
  }


  async function getVaultAccount(
    conn: any, 
    wallet: any | undefined | null,
    account:PublicKey,
    mint:PublicKey
    ) {
        if (!conn || !wallet) throw new Error('Missing connection')

        let token_client = await getTokenClient(conn, wallet, mint)
        return await token_client.getAccountInfo(account);
    }


  export async function faucet(
    conn: any,
    wallet: any, 
    mint: PublicKey,
    vault: PublicKey
  ) {

    if (!conn || !wallet) throw new Error('Missing connection')

    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())

    const program = new anchor.Program(idl, programId, provider);

    let user_account = await getVaultAccount(conn,wallet, wallet.publicKey, mint);

    let vault_account = await getVaultAccount(conn,wallet, vault, mint);

    const tx = await program.rpc.faucet(
    {
        accounts: {
        user: user_account,
        vault: vault_account,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        tokenProgram: anchor.web3.TOKEN_PROGRAM_ID
        },
        signers:[],
    })

  }