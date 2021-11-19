/* eslint-disable */
import { getterTree, mutationTree, actionTree } from 'typed-vuex'

import { AccountInfo, ParsedAccountData, PublicKey } from '@solana/web3.js'

import { NATIVE_SOL } from '@/utils/tokens'
import { TOKEN_PROGRAM_ID } from '@/utils/ids'
import { TokenAmount, lt } from '@/utils/safe-math'
import { cloneDeep } from 'lodash-es'
import logger from '@/utils/logger'
import { GetTokenVault } from '@/utils/vault'
const anchor = require("@project-serum/anchor");

const AUTO_REFRESH_TIME = 60

export const state = () => ({
  initialized: false,
  loading: false,
  modalShow: false,

  autoRefreshTime: AUTO_REFRESH_TIME,
  countdown: 0,
  lastSubBlock: 0,
  solbalance: 0,
  vault: '',
  token_vault: '',

  connected: false,
  address: '',

  tokenAccounts: '',
  balances: {},
})

export const getters = getterTree(state, {})

export const mutations = mutationTree(state, {
  setModal(state, show: boolean) {
    state.modalShow = show
  },

  setConnected(state, address: string) {
    state.connected = true
    state.address = address
  },

  setDisconnected(state) {
    state.connected = false
    state.address = ''
  },

  setInitialized(state) {
    state.initialized = true
  },

  setLoading(state, loading: boolean) {
    if (loading) {
      state.countdown = AUTO_REFRESH_TIME
    }

    state.loading = loading

    if (!loading) {
      state.countdown = 0
    }
  },

  setTokenAccounts(state, tokenAccounts: string) {
    state.tokenAccounts = tokenAccounts
  },

  setBalances(state, balances: { }) {
    state.balances = balances
  },

  setCountdown(state, countdown: number) {
    state.countdown = countdown
  },

  setLastSubBlock(state, lastSubBlock: number) {
    state.lastSubBlock = lastSubBlock
  },

  setSolBalance(state, solBalance: number) {
    state.solbalance = solBalance
  },

  setTokenVault(state, solBalance: number) {
    state.solbalance = solBalance
  },

  setVault(state, solBalance: number) {
    state.solbalance = solBalance
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    openModal({ commit }) {
      commit('setModal', true)
    },

    closeModal({ commit }) {
      return new Promise((resolve) => {
        commit('setModal', false)
        setTimeout(() => {
          resolve(true)
        }, 500)
      })
    },

    setVaultID({ commit }) {
      return new Promise((resolve) => {
        commit('setModal', false)
        setTimeout(() => {
          resolve(true)
        }, 500)
      })
    },

    async getTokenAccounts({ commit }) {
      const conn = this.$web3
      const wallet = (this as any)._vm.$wallet

      if (wallet && wallet.connected) {
        commit('setLoading', true)

        conn
          .getParsedTokenAccountsByOwner(
            new anchor.web3.PublicKey(this.$accessor.wallet.address),
            {
              programId: TOKEN_PROGRAM_ID
            },
            'confirmed'
          )
          .then(async (parsedTokenAccounts: any) => {
            const tokenAccounts: any = {}

            parsedTokenAccounts.value.forEach(
              (tokenAccountInfo: { pubkey: PublicKey; account: AccountInfo<ParsedAccountData> }) => {
                const tokenAccountAddress = tokenAccountInfo.pubkey.toBase58()
                const parsedInfo = tokenAccountInfo.account.data.parsed.info
                const mintAddress = parsedInfo.mint
                const balance = new TokenAmount(parsedInfo.tokenAmount.amount, parsedInfo.tokenAmount.decimals)
                if (Object.prototype.hasOwnProperty.call(tokenAccounts, mintAddress)) {
                  if (lt(tokenAccounts[mintAddress].balance.wei.toNumber(), balance.wei.toNumber())) {
                    tokenAccounts[mintAddress] = {
                      tokenAccountAddress,
                      balance
                    }
                  }
                } else {
                  tokenAccounts[mintAddress] = {
                    tokenAccountAddress,
                    balance
                  }
                }
              }
            )

            const solBalance = await conn.getBalance(new anchor.web3.PublicKey(this.$accessor.wallet.address), 'confirmed')


            tokenAccounts[NATIVE_SOL.mintAddress] = {
              tokenAccountAddress: wallet.publicKey.toBase58(),
              balance: new TokenAmount(solBalance, NATIVE_SOL.decimals)
            }
            localStorage.setItem('tokenBalances', JSON.stringify(tokenAccounts))
            commit('setBalances', tokenAccounts)

            commit('setTokenAccounts', JSON.stringify(tokenAccounts))
            commit('setSolBalance', solBalance)
            logger('Wallet TokenAccounts updated')
          })
          .catch()
          .finally(() => {
            commit('setInitialized')
            commit('setLoading', false)
          })
      }
    }
  }
)
