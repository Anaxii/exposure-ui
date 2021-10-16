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
  import {idl} from './programs/multisig'
  const { Market } = require("@project-serum/serum");
  const DEX_PID = new PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin");

  var TOKEN_A_VAULT = new anchor.web3.PublicKey("");
  var TOKEN_B_VAULT = new anchor.web3.PublicKey("");
  var TOKEN_C_VAULT = new anchor.web3.PublicKey("");
  var TOKEN_D_VAULT = new anchor.web3.PublicKey("");
  var TOKEN_E_VAULT = new anchor.web3.PublicKey("");

  var TOKEN_A_MINT = new anchor.web3.PublicKey("");
  var TOKEN_B_MINT = new anchor.web3.PublicKey("");
  var TOKEN_C_MINT = new anchor.web3.PublicKey("");
  var TOKEN_D_MINT = new anchor.web3.PublicKey("");
  var TOKEN_E_MINT = new anchor.web3.PublicKey("");

  var TOKEN_A_MARKET = new anchor.web3.PublicKey("");
  var TOKEN_B_MARKET = new anchor.web3.PublicKey("");
  var TOKEN_C_MARKET = new anchor.web3.PublicKey("");
  var TOKEN_D_MARKET = new anchor.web3.PublicKey("");
  var TOKEN_E_MARKET = new anchor.web3.PublicKey("");

  var TOKEN_A_MARKET_BIDS = new anchor.web3.PublicKey("");
  var TOKEN_B_MARKET_BIDS = new anchor.web3.PublicKey("");
  var TOKEN_C_MARKET_BIDS = new anchor.web3.PublicKey("");
  var TOKEN_D_MARKET_BIDS = new anchor.web3.PublicKey("");
  var TOKEN_E_MARKET_BIDS = new anchor.web3.PublicKey("");


  var ETF_TOKEN = new anchor.web3.PublicKey("");


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

    async function getMarketClient(
        conn: any, 
        wallet: any | undefined | null,
        market: PublicKey,
      ) {
        if (!conn || !wallet) throw new Error('Missing connection')

        const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())

        const program = new anchor.Program(idl, programId, provider);
    
        return await Market.load(
            program.provider.connection,
            market,
            { commitment: "recent" },
            DEX_PID
          );
      }

  export async function CreateETF(
    conn: any, 
    wallet: any | undefined | null,
  ) {
    if (!conn || !wallet) throw new Error('Missing connection')
    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())

    const program = new anchor.Program(idl, programId, provider);

    let account_etf = anchor.web3.Keypair.generate();
    let etf_public = account_etf.publicKey

    let [_etfSigner, nonce] = await anchor.web3.PublicKey.findProgramAddress(
      [account_etf.publicKey.toBuffer()],
      program.programId
    );
    let etfNonce = nonce

    const tx = await program.rpc.createEtf(etfNonce,
    {
        accounts: {
        etf: account_etf.publicKey,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY
        },
        instructions: [
        await program.account.exposureEtf.createInstruction(account_etf,1000),
        ],
        signers:[account_etf],
    })

    console.log(etf_public.toString())
  }

  export async function AddAsset(
    conn: any, 
    wallet: any | undefined | null,
    market: PublicKey,
    mint: PublicKey,
    etfSigner: PublicKey,
    bids: PublicKey,
    etf: PublicKey
  ) {
    if (!conn || !wallet) throw new Error('Missing connection')
    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())

    const program = new anchor.Program(idl, programId, provider);

    let marketClient = getMarketClient(conn, wallet, market)
  
      let associatedPubkey = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mint, 
        etfSigner,
      )
  
      let asset = anchor.web3.Keypair.generate();
      let asset_pub = asset.publicKey
  
      let [_assetSigner, _nonce] = await anchor.web3.PublicKey.findProgramAddress(
        [asset.publicKey.toBuffer()],
        program.programId
      );
      const tx = await program.rpc.addAsset(mint, bids, market,
      {
        accounts: {
          etf: etf,
          asset: asset_pub,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY
        },
        instructions: [
          await program.account.asset.createInstruction(asset,300),
          Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            mint,
            associatedPubkey,
            etfSigner,
            program.provider.wallet.publicKey
          )
        ],
        signers:[asset],
      })
  }

  export async function CreateExposureShares(
    conn: Connection | undefined | null,
    wallet: any | undefined | null,
    amount: any,
    etf: any,
    mints: []
  ) {
    if (!conn || !wallet) throw new Error('Missing connection')

    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())

    const program = new anchor.Program(idl, programId, provider);

    let token_a_vault = await getVaultAccount(conn, wallet, TOKEN_A_VAULT, TOKEN_A_MINT);
    let token_b_vault = await getVaultAccount(conn, wallet, TOKEN_B_VAULT, TOKEN_B_MINT);
    let token_c_vault = await getVaultAccount(conn, wallet, TOKEN_C_VAULT, TOKEN_C_MINT);
    let token_d_vault = await getVaultAccount(conn, wallet, TOKEN_D_VAULT, TOKEN_D_MINT);
    let token_e_vault = await getVaultAccount(conn, wallet, TOKEN_E_VAULT, TOKEN_E_MINT);

    let token_a_user = await getVaultAccount(conn, wallet, TOKEN_A_VAULT, TOKEN_A_MINT);
    let token_b_user = await getVaultAccount(conn, wallet, TOKEN_B_VAULT, TOKEN_B_MINT);
    let token_c_user = await getVaultAccount(conn, wallet, TOKEN_C_VAULT, TOKEN_C_MINT);
    let token_d_user = await getVaultAccount(conn, wallet, TOKEN_D_VAULT, TOKEN_D_MINT);
    let token_e_user = await getVaultAccount(conn, wallet, TOKEN_E_VAULT, TOKEN_E_MINT);

    let etf_token_user = await getVaultAccount(conn, wallet, TOKEN_E_VAULT, ETF_TOKEN);

    let creationAccounts = [
        { pubkey: token_a_user.address, isWritable: true, isSigner: false },
        { pubkey: token_a_vault.address, isWritable: true, isSigner: false },
        { pubkey: token_b_user.address, isWritable: true, isSigner: false },
        { pubkey: token_b_vault.address, isWritable: true, isSigner: false },
        { pubkey: token_c_user.address, isWritable: true, isSigner: false },
        { pubkey: token_c_vault.address, isWritable: true, isSigner: false },
        { pubkey: token_d_user.address, isWritable: true, isSigner: false },
        { pubkey: token_d_vault.address, isWritable: true, isSigner: false },
        { pubkey: token_e_user.address, isWritable: true, isSigner: false },
        { pubkey: token_e_vault.address, isWritable: true, isSigner: false },
      ]
      
      let [_etfSigner, nonce] = await anchor.web3.PublicKey.findProgramAddress(
        [etf.publicKey.toBuffer()],
        program.programId
      );

      const tx = await program.rpc.create(new anchor.BN(10),
      {
        accounts: {
          user: program.provider.wallet.publicKey,
          exposureEtf: etf.publicKey,
          exposureEtfSigner: _etfSigner,
          exposureEtfToken: ETF_TOKEN,
          exposureEtfTokenUser: etf_token_user.address,
          tokenProgram: TOKEN_PROGRAM_ID,
          //rent
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },
        signers: [program.provider.wallet.payer],
        remainingAccounts: creationAccounts
      })

  }