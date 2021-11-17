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
  const programId = new anchor.web3.PublicKey('56GhY3o3fZh5dZ1bU4vbxC5mxBfpjCjakDCsUQBxwqjN');
  import {idl} from './programs/exposure_etf'
  const { Market } = require("@project-serum/serum");
  const DEX_PID = new PublicKey("DESVgJVGajEgKGXhb6XmqDHGz3VjdgP7rEVESBgxmroY");

  var ETF_TOKEN = new anchor.web3.PublicKey("8f2YCqTRCwqMmmifmeB5qDkaduZfPQmfDWZZU5bqf1En");
  var etf = new anchor.web3.PublicKey("CfV6JkALiizjKLVjPVWVGuShZ7pb7uoF5F9WjD88T2FZ");

  var TOKEN_A_VAULT = new anchor.web3.PublicKey("7tgLyXdbHAbyB45VuFNkXjD3jbEofn5cb2jxwURNss3U");
  var TOKEN_B_VAULT = new anchor.web3.PublicKey("DGi1WbbF6Td8aZA4nUMy7WLbWgajikR3nP1UVPEggMxf");
  var TOKEN_C_VAULT = new anchor.web3.PublicKey("dpzBKbS88hCuAHuMnCrRqVKorwnCsSNa939RBRN83Yq");
  var TOKEN_D_VAULT = new anchor.web3.PublicKey("DN574bSVKD8GMsvRKankyiKCMVutw7rgy8EHEbqP2NyB");
  var TOKEN_E_VAULT = new anchor.web3.PublicKey("Aha5iYNuqnY8UZMC3wUjzpFwbQ6iWYS7XVfiMGTU2Ygi");

  var TOKEN_A_MINT = new anchor.web3.PublicKey("HipXwn3m4XRaEVP4ak82rGD1AR8wHQBGNkcAsjXizXqJ");
  var TOKEN_B_MINT = new anchor.web3.PublicKey("4yjrobNPWfwK9PkPQQ3HsiNhjKRAEi2gBxMtth7UTa3t");
  var TOKEN_C_MINT = new anchor.web3.PublicKey("3a3fDgsnhydFTksXoAjHWec4iDR7ZNApAppkCG4gbJ4n");
  var TOKEN_D_MINT = new anchor.web3.PublicKey("DvxzkaiZdnzMYC9aLpNYueVuWHydfW8BcfiAt8hMFVUu");
  var TOKEN_E_MINT = new anchor.web3.PublicKey("8ZS9wiKSx1eVpgB67fzFqSTyNTbHKyLmeK7A6nQWf1am");

  var TOKEN_A_MARKET = new anchor.web3.PublicKey("2pgEbgdU1fCCTzea7J8jB5HuifYeydmpxzrYQsHdPNAV");
  var TOKEN_B_MARKET = new anchor.web3.PublicKey("3d5e1X6wXNjHFFFhuaP3PKQBvazhPceDTAxjYUXn2Uup");
  var TOKEN_C_MARKET = new anchor.web3.PublicKey("8aRgrCFRTUdAk12XgQGWgeRRXD1X3CsnYeVxEMWZx7MA");
  var TOKEN_D_MARKET = new anchor.web3.PublicKey("5wteRyV3jEBUjaStJcJk3CwwQSenqxWL94JKSPdWcFvM");
  var TOKEN_E_MARKET = new anchor.web3.PublicKey("Ft2odaXbuNNsVZAHXcdi9h8KRjZzbPiLRaWLKNF3Q1aS");

  var TOKEN_A_MARKET_BIDS = new anchor.web3.PublicKey("pyyFcEbzNmufAY3BxUpbTcZeSLuasEZFR53oyKKAkXB");
  var TOKEN_B_MARKET_BIDS = new anchor.web3.PublicKey("AeYAJtU6pn5XxgLW4A1M5n8ZJPWdLv3PpYzknbxSDFY");
  var TOKEN_C_MARKET_BIDS = new anchor.web3.PublicKey("GKpQnowoXmJTXATnpaZ4qF81Cbns8vPvkd3J1iLkDGXW");
  var TOKEN_D_MARKET_BIDS = new anchor.web3.PublicKey("3EJ6UwvAvk2daXpqDuPJjy4ErKpHK36LdQLfUKxKyCTG");
  var TOKEN_E_MARKET_BIDS = new anchor.web3.PublicKey("FJa3oLeAKyFdhpNE7js9LKnSbeFBdhnY7bBTxknAjW3w");

  var ETF_PROGRAM = new anchor.web3.PublicKey("56GhY3o3fZh5dZ1bU4vbxC5mxBfpjCjakDCsUQBxwqjN");

  function getTokenClient(
    conn: any,
    wallet: any | undefined | null,
    mint: PublicKey) {
    if (!conn || !wallet) throw new Error('Missing connection')

    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())

    const program = new anchor.Program(idl, programId, provider);

    const token_client = new Token(
        conn,
        mint,
        TOKEN_PROGRAM_ID,
        wallet.payer
        
      );
      return token_client;
  }

  export async function getPrice(
    conn: any,
    wallet: any,
    number: any,
  )
  {
    if (!conn || !wallet) throw new Error('Missing connection')

    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())

    const program = new anchor.Program(idl, programId, provider);

    let token_market = [TOKEN_A_MARKET, TOKEN_B_MARKET, TOKEN_C_MARKET,TOKEN_D_MARKET,TOKEN_E_MARKET]


    let market = await Market.load(conn, token_market[number], {},new anchor.web3.PublicKey("DESVgJVGajEgKGXhb6XmqDHGz3VjdgP7rEVESBgxmroY"));

    // Fetching orderbooks
    let bids = await market.loadBids(conn);

    return bids[0][0];
  }

  export async function getSupply(
    conn: any,
    wallet: any,
    number: any,
  )
  {
    if (!conn || !wallet) throw new Error('Missing connection')

    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())

    let token_mints = [TOKEN_A_MINT, TOKEN_B_MINT, TOKEN_C_MINT,TOKEN_D_MINT,TOKEN_E_MINT, ETF_TOKEN]

    let token_client = await getTokenClient(conn, wallet, token_mints[number]);

    let mint_data = await token_client.getMintInfo();

    return mint_data.supply;
  }

  export async function churnWeight
  (conn: any,
   wallet: any | undefined | null)
  {

    if (!conn || !wallet) throw new Error('Missing connection')

    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())

    const program = new anchor.Program(idl, programId, provider);

   let assetAccounts = [
     //A
      { pubkey: TOKEN_A_MINT,isWritable: false, isSigner: false },
      { pubkey: TOKEN_A_MARKET, isWritable: false, isSigner: false },
      { pubkey: TOKEN_A_MARKET_BIDS, isWritable: false, isSigner: false },
      //B
      { pubkey: TOKEN_B_MINT,isWritable: false, isSigner: false },
      { pubkey: TOKEN_B_MARKET, isWritable: false, isSigner: false },
      { pubkey: TOKEN_B_MARKET_BIDS, isWritable: false, isSigner: false },
      //C
      { pubkey: TOKEN_C_MINT,isWritable: false, isSigner: false },
      { pubkey: TOKEN_C_MARKET, isWritable: false, isSigner: false },
      { pubkey: TOKEN_C_MARKET_BIDS, isWritable: false, isSigner: false },
      
      { pubkey: TOKEN_D_MINT,isWritable: false, isSigner: false },
      { pubkey: TOKEN_D_MARKET, isWritable: false, isSigner: false },
      { pubkey: TOKEN_D_MARKET_BIDS, isWritable: false, isSigner: false },

      { pubkey: TOKEN_E_MINT,isWritable: false, isSigner: false },
      { pubkey: TOKEN_E_MARKET, isWritable: false, isSigner: false },
      { pubkey: TOKEN_E_MARKET_BIDS, isWritable: false, isSigner: false },
    ]

    const tx = await program.rpc.etfPriceWeightSubmit(DEX_PID,
      {
        accounts: {
          exposureEtf: etf
        },
        signers: [],
        remainingAccounts: assetAccounts
      })
  }

  export async function getWeights
  (
    conn: any,
    wallet: any | undefined | null
  )
  {
    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())

    const program = new anchor.Program(idl, programId, provider);
    console.log(conn)
    let data = await program.account.exposureEtf.fetch(etf);

    return data.weights;
  }


  async function getVaultAccount(
    conn: any, 
    wallet: any | undefined | null,
    account:PublicKey,
    mint:PublicKey
    )
    {
        if (!conn || !wallet) throw new Error('Missing connection')

        let token_client = await getTokenClient(conn, wallet, mint)
        return await token_client.getAccountInfo(account);
    }

    async function getMarketClient(
        conn: any, 
        wallet: any | undefined | null,
        market: PublicKey,
    )
    {
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
  )
  {
    if (!conn || !wallet) throw new Error('Missing connection')
    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())

    const program = new anchor.Program(idl, programId, provider);

    let account_etf = anchor.web3.Keypair.generate();
    let etf_public = account_etf.publicKey
    let etf_token = anchor.web3.Keypair.generate();

    let [_etfSigner, nonce] = await anchor.web3.PublicKey.findProgramAddress(
      [account_etf.publicKey.toBuffer()],
      program.programId
    );
    let etfNonce = nonce
    let ix = await Token.createInitMintInstruction(TOKEN_PROGRAM_ID,etf_token.publicKey,8,_etfSigner, _etfSigner)

    const balanceNeeded = await Token.getMinBalanceRentForExemptMint(
      conn,
    );
    let token_id: PublicKey = SYSTEM_PROGRAM_ID
    let ix_2 = await SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: etf_token.publicKey,
      lamports: balanceNeeded,
      space: MINT_LAYOUT.span,
      programId: TOKEN_PROGRAM_ID,
    });

    const tx = await program.rpc.createEtf(etfNonce,
    {
        accounts: {
        etf: account_etf.publicKey,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY
        },
        instructions: [
        await program.account.exposureEtf.createInstruction(account_etf,1000),
        ix_2,
        ix
        ],
        signers:[account_etf, etf_token],
    })
    console.log("ETF Token Public Key")
    console.log(etf_token.publicKey.toString())
    console.log("ETF ID")
    console.log(etf_public.toString())
  }

  export async function AddAsset(
    conn: any, 
    wallet: any | undefined | null,
    number: any
    // market: PublicKey,
    // mint: PublicKey,
    // etfSigner: PublicKey,
    // bids: PublicKey,
    // etf: PublicKey
  ) {
    if (!conn || !wallet) throw new Error('Missing connection')
    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())

    const program = new anchor.Program(idl, programId, provider);


    let token_mints = [TOKEN_A_MINT, TOKEN_B_MINT, TOKEN_C_MINT,TOKEN_D_MINT,TOKEN_E_MINT]
    let token_market = [TOKEN_A_MARKET, TOKEN_B_MARKET, TOKEN_C_MARKET,TOKEN_D_MARKET,TOKEN_E_MARKET]
    let token_bids = [TOKEN_A_MARKET_BIDS, TOKEN_A_MARKET_BIDS, TOKEN_A_MARKET_BIDS,TOKEN_A_MARKET_BIDS,TOKEN_A_MARKET_BIDS]

    let marketClient = getMarketClient(conn, wallet, token_market[number])
  
    let [etfSigner, nonce] = await anchor.web3.PublicKey.findProgramAddress(
      [etf.toBuffer()],
      program.programId
    );

      let asset = anchor.web3.Keypair.generate();
      let asset_pub = asset.publicKey
  
      let [_assetSigner, _nonce] = await anchor.web3.PublicKey.findProgramAddress(
        [asset.publicKey.toBuffer()],
        program.programId
      );

      let asset_vault = anchor.web3.Keypair.generate();

      let ix = await Token.createInitAccountInstruction(TOKEN_PROGRAM_ID,token_mints[number],asset_vault.publicKey,etfSigner);

      const balanceNeeded = await Token.getMinBalanceRentForExemptAccount(
        conn,
      );
      let ix_2 = await SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: asset_vault.publicKey,
        lamports: balanceNeeded,
        space: ACCOUNT_LAYOUT.span,
        programId: TOKEN_PROGRAM_ID,
      });
  

      const tx = await program.rpc.addAsset(token_mints[number], token_bids[number], token_market[number],
      {
        accounts: {
          etf: etf,
          asset: asset_pub,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY
        },
        instructions: [
          await program.account.asset.createInstruction(asset,300),
          ix_2,
          ix,
        ],
        signers:[asset, asset_vault],
      })

      console.log(asset_vault.publicKey.toString())
  }

  export async function CreateExposureShares(
    conn: Connection | undefined | null,
    wallet: any | undefined | null,
    amount: any,
  ) {
    if (!conn || !wallet) throw new Error('Missing connection')

    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())

    const program = new anchor.Program(idl, programId, provider);

    let token_a_vault = await getVaultAccount(conn, wallet, TOKEN_A_VAULT, TOKEN_A_MINT);
    let token_b_vault = await getVaultAccount(conn, wallet, TOKEN_B_VAULT, TOKEN_B_MINT);
    let token_c_vault = await getVaultAccount(conn, wallet, TOKEN_C_VAULT, TOKEN_C_MINT);
    let token_d_vault = await getVaultAccount(conn, wallet, TOKEN_D_VAULT, TOKEN_D_MINT);
    let token_e_vault = await getVaultAccount(conn, wallet, TOKEN_E_VAULT, TOKEN_E_MINT);
    
    let token_mints = [TOKEN_A_MINT, TOKEN_B_MINT, TOKEN_C_MINT,TOKEN_D_MINT,TOKEN_E_MINT, ETF_TOKEN]
    let token_clients = []
    let token_accounts = []
    for (var i = 0; i < token_mints.length;i++)
    {
        let tca = await getTokenClient(conn, wallet,token_mints[i])
        let account = await tca.getOrCreateAssociatedAccountInfo(wallet.publicKey)
        token_accounts.push(account)
        console.log(account)
    }

    let creationAccounts = [
        { pubkey: token_accounts[0].address, isWritable: true, isSigner: false },
        { pubkey: token_a_vault.address, isWritable: true, isSigner: false },
        { pubkey: token_accounts[1].address, isWritable: true, isSigner: false },
        { pubkey: token_b_vault.address, isWritable: true, isSigner: false },
        { pubkey: token_accounts[2].address, isWritable: true, isSigner: false },
        { pubkey: token_c_vault.address, isWritable: true, isSigner: false },
        { pubkey: token_accounts[3].address, isWritable: true, isSigner: false },
        { pubkey: token_d_vault.address, isWritable: true, isSigner: false },
        { pubkey: token_accounts[4].address, isWritable: true, isSigner: false },
        { pubkey: token_e_vault.address, isWritable: true, isSigner: false },
      ]
      
      let [_etfSigner, nonce] = await anchor.web3.PublicKey.findProgramAddress(
        [etf.toBuffer()],
        program.programId
      );

      const tx = await program.rpc.create(new anchor.BN(amount),
      {
        accounts: {
          user: program.provider.wallet.publicKey,
          exposureEtf: etf,
          exposureEtfSigner: _etfSigner,
          exposureEtfToken: ETF_TOKEN,
          exposureEtfTokenUser: token_accounts[5].address,
          tokenProgram: TOKEN_PROGRAM_ID,
          //rent
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },
        signers: [program.provider.wallet.payer],
        remainingAccounts: creationAccounts
      })

      return tx;
  }

  export async function RedeemExposureShares(
    conn: Connection | undefined | null,
    wallet: any | undefined | null,
    amount : any
  ) {
    if (!conn || !wallet) throw new Error('Missing connection')

    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions())

    const program = new anchor.Program(idl, programId, provider);

    let token_a_vault = await getVaultAccount(conn, wallet, TOKEN_A_VAULT, TOKEN_A_MINT);
    let token_b_vault = await getVaultAccount(conn, wallet, TOKEN_B_VAULT, TOKEN_B_MINT);
    let token_c_vault = await getVaultAccount(conn, wallet, TOKEN_C_VAULT, TOKEN_C_MINT);
    let token_d_vault = await getVaultAccount(conn, wallet, TOKEN_D_VAULT, TOKEN_D_MINT);
    let token_e_vault = await getVaultAccount(conn, wallet, TOKEN_E_VAULT, TOKEN_E_MINT);

    let token_mints = [TOKEN_A_MINT, TOKEN_B_MINT, TOKEN_C_MINT,TOKEN_D_MINT,TOKEN_E_MINT, ETF_TOKEN]
    let token_clients = []
    let token_accounts = []
    for (var i = 0; i < token_mints.length;i++)
    {
        let tca = await getTokenClient(conn, wallet,token_mints[i])
        let account = await tca.getOrCreateAssociatedAccountInfo(wallet.publicKey)
        token_accounts.push(account)
        console.log(account)
    }

    let creationAccounts = [
      { pubkey: token_accounts[0].address, isWritable: true, isSigner: false },
      { pubkey: token_a_vault.address, isWritable: true, isSigner: false },
      { pubkey: token_accounts[1].address, isWritable: true, isSigner: false },
      { pubkey: token_b_vault.address, isWritable: true, isSigner: false },
      { pubkey: token_accounts[2].address, isWritable: true, isSigner: false },
      { pubkey: token_c_vault.address, isWritable: true, isSigner: false },
      { pubkey: token_accounts[3].address, isWritable: true, isSigner: false },
      { pubkey: token_d_vault.address, isWritable: true, isSigner: false },
      { pubkey: token_accounts[4].address, isWritable: true, isSigner: false },
      { pubkey: token_e_vault.address, isWritable: true, isSigner: false },
    ]
      
      let [_etfSigner, nonce] = await anchor.web3.PublicKey.findProgramAddress(
        [etf.toBuffer()],
        program.programId
      );
      
   const tx = await program.rpc.redeem(new anchor.BN(amount),
    {
      accounts: {
        user: program.provider.wallet.publicKey,
        exposureEtf: etf,
        exposureEtfSigner: _etfSigner,
        exposureEtfToken: ETF_TOKEN,
        exposureEtfTokenUser: token_accounts[5].address,
        tokenProgram: TOKEN_PROGRAM_ID,
        //rent
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      },
      signers: [],
      remainingAccounts: creationAccounts
    })

    return tx;

  }