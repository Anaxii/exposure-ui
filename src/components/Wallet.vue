<template>
  <div style="margin-right: 7.5%;" >
<!--    <span class="value" v-if="!wallet.connected" ghost ><span class="iconfont">&#58905;</span> Connect Wallet</span>-->
<!--    <span class="value" v-else ghost @click="$accessor.wallet.openModal">-->
<!--      {{ wallet.address.substr(0, 4) }}-->
<!--      ...-->
<!--      {{ wallet.address.substr(wallet.address.length - 4, 4) }}-->
<!--    </span>-->
    <Modal
      :title="!wallet.connected ? 'Connect to a wallet' : 'Your wallet'"
      :visible="wallet.modalShow"
      :footer="null"
      centered
      @cancel="$accessor.wallet.closeModal"
    >
      <div v-if="!wallet.connected" class="select-wallet">
        <Button v-for="(providerUrl, name) in wallets" :key="name" ghost @click="connect(name)">
          <span>{{ name }}</span>
          <img :src="importIcon(`/wallets/${name.replace(' ', '-').toLowerCase()}.png`)" />
        </Button>
      </div>
      <div v-else class="wallet-info">
        <p class="address">{{ wallet.address }}</p>

        <Button ghost @click="disconnect"> DISCONNECT </Button>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Button, Modal, Icon } from 'ant-design-vue'
import { AccountInfo, Context } from '@solana/web3.js'
// @ts-ignore
import SolanaWalletAdapter from '@project-serum/sol-wallet-adapter'

import importIcon from '@/utils/import-icon'
import logger from '@/utils/logger'
import { getRandomEndpoint, commitment } from '@/utils/web3'
import {
  WalletAdapter,
  SolongWalletAdapter,
  MathWalletAdapter,
  PhantomWalletAdapter,
  LedgerWalletAdapter
} from '@/wallets'

// fix: Failed to resolve directive: ant-portal
Vue.use(Modal)

interface Wallets {
  [key: string]: string
}

@Component({
  components: {
    Button,
    Modal,
    Icon
  }
})
export default class Wallet extends Vue {
  /* ========== DATA ========== */
  wallets = {
    Ledger: '',
    'Sollet Extension': '',
    Solong: '',
    // TrustWallet: '',
    MathWallet: '',
    Phantom: '',
    Sollet: 'https://www.sollet.io',
    // Solflare: 'https://solflare.com/access-wallet',
    Bonfida: 'https://bonfida.com/wallet'
    // https://docs.coin98.app/coin98-extension/developer-guide
    // Coin98: ''
    // ezDeFi: '',
  } as Wallets

  // auto refresh
  walletTimer: number | undefined = undefined
  priceTimer: number | undefined = undefined

  // web3 listener
  walletListenerId = null as number | null

  /* ========== COMPUTED ========== */
  get wallet() {
    return this.$accessor.wallet
  }

  get price() {
    return this.$accessor.price
  }

  /* ========== LIFECYCLE ========== */
  async beforeMount() {
    await this.$accessor.price.requestPrices()

    this.setWalletTimer()
    this.setPriceTimer()

  }

  updated() {

  }

  beforeDestroy() {
    window.clearInterval(this.walletTimer)
    window.clearInterval(this.priceTimer)
  }

  /* ========== WATCH ========== */

  /* ========== METHODS ========== */
  importIcon = importIcon

  connect(walletName: string) {
    let wallet: WalletAdapter
    const endpoint = getRandomEndpoint()

    switch (walletName) {
      case 'Ledger': {
        wallet = new LedgerWalletAdapter()
        break
      }
      case 'Sollet Extension': {
        if ((window as any).sollet === undefined) {
          this.$notify.error({
            message: 'Connect wallet failed',
            description: 'Please install and initialize Sollet wallet extension first'
          })
          return
        }

        wallet = new SolanaWalletAdapter((window as any).sollet, endpoint)
        break
      }
      case 'Solong': {
        if ((window as any).solong === undefined) {
          this.$notify.error({
            message: 'Connect wallet failed',
            description: 'Please install and initialize Solong wallet extension first'
          })
          return
        }

        wallet = new SolongWalletAdapter()
        break
      }
      case 'MathWallet': {
        if ((window as any).solana === undefined || !(window as any).solana.isMathWallet) {
          this.$notify.error({
            message: 'Connect wallet failed',
            description: 'Please install and initialize Math wallet extension first'
          })
          return
        }

        wallet = new MathWalletAdapter()
        break
      }
      case 'Phantom': {
        if ((window as any).solana === undefined || !(window as any).solana.isPhantom) {
          this.$notify.error({
            message: 'Connect wallet failed',
            description: 'Please install and initialize Phantom wallet extension first'
          })
          return
        }

        wallet = new PhantomWalletAdapter()
        break
      }
      default: {
        wallet = new SolanaWalletAdapter(this.wallets[walletName], endpoint)
        break
      }
    }

    wallet.on('connect', () => {
      this.$accessor.wallet.closeModal().then(() => {
        if (wallet.publicKey) {
          Vue.prototype.$wallet = wallet
          this.$accessor.wallet.setConnected(wallet.publicKey.toBase58())

          this.subWallet()
          this.$notify.success({
            message: 'Wallet connected',
            description: ''
          })
        }
      })
    })

    wallet.on('disconnect', () => {
      this.disconnect()
    })

    try {
      wallet.connect()
    } catch (error) {
      this.$notify.error({
        message: 'Connect wallet failed',
        description: error.message
      })
    }
  }

  disconnect() {
    this.$accessor.wallet.closeModal()

    Vue.prototype.$wallet.disconnect()
    Vue.prototype.$wallet = null

    this.unsubWallet()

    this.$accessor.wallet.setDisconnected()
    this.$notify.warning({
      message: 'Wallet disconnected',
      description: ''
    })
    this.$router.push({path: '/connect'})

  }

  onWalletChange(_accountInfo: AccountInfo<Buffer>, context: Context): void {
    logger('onAccountChange')

    const { slot } = context

    if (slot !== this.wallet.lastSubBlock) {
      this.$accessor.wallet.setLastSubBlock(slot)
      this.$accessor.wallet.getTokenAccounts()

    }
  }

  subWallet() {
    const wallet = this.$wallet
    if (wallet && wallet.publicKey) {
      this.walletListenerId = this.$web3.onAccountChange(wallet.publicKey, this.onWalletChange, commitment)

      this.$accessor.wallet.getTokenAccounts()
    }
  }

  unsubWallet() {
    if (this.walletListenerId) {
      this.$web3.removeAccountChangeListener(this.walletListenerId)
    }
  }

  setWalletTimer() {
    this.walletTimer = window.setInterval(async () => {
      if (this.wallet.connected && !this.wallet.loading) {
        // vuex is connected but $wallet not, meaning window closed
        if (this.$wallet && this.$wallet.connected) {
          if (this.wallet.countdown < this.wallet.autoRefreshTime) {
            this.$accessor.wallet.setCountdown(this.$accessor.wallet.countdown + 1)
            if (this.wallet.countdown === this.wallet.autoRefreshTime) {
              await this.$accessor.wallet.getTokenAccounts()
            }
          }
        } else {
          this.disconnect()
        }
      }
    }, 1000)
  }

  setPriceTimer() {
    this.priceTimer = window.setInterval(async () => {
      if (!this.price.loading) {
        if (this.price.countdown < this.price.autoRefreshTime) {
          this.$accessor.price.setCountdown(this.$accessor.price.countdown + 1)
          if (this.price.countdown === this.price.autoRefreshTime) {
            await this.$accessor.price.requestPrices()
          }
        }
      }
    }, 1000)
  }
}
</script>

<style lang="less">
@import '../styles/variables';

.key {
  background-color: transparent !important;
  border: 2px solid transparent;
  border-radius: 10px;
  border-image: linear-gradient(355deg, rgba(63,187,254,1) 11%, rgba(165,65,255,1) 87%);
  -webkit-border-image: -webkit-linear-gradient(355deg, rgba(63,187,254,1) 11%, rgba(165,65,255,1) 87%);
  border-image-slice: 1;
  flex-direction: row;
  align-items: center;
  text-align: center;
  justify-content: space-between;
  opacity: 1;
  transition: 0.5s;
  cursor: pointer;
  width: 7.5%;

  .icon {
    font-size: 18px;
    color: #fff;
  }

  .value {
    flex: 1;
    font-size: 14px;
    color: #fff;
    margin-left: 2%;
    margin-right: 2%;
    margin-top: 2%;
    margin-bottom: 2%;
  }

  .setting {
    color: #fff;
    font-size: 14px;
  }
}

.key:hover {
  opacity: 0.8;
}
button.ant-btn-background-ghost {
  border-color: #333766;
  img {
    background: #fff;
  }
}
.ant-modal-header {
  background-color: #0a0b0e;
}
.ant-modal-content {
  background-color: #0a0b0e;
  box-shadow: #000 0 0 10px 5px inset;

  .ant-modal-close {
    color: @text-color;
  }
}

.select-wallet {
  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    width: 100%;
    height: 48px;
    text-align: left;

    img {
      height: 32px;
      width: 32px;
      border-radius: 50%;
    }
  }

  .mainbtn {
    background-color: transparent;
    border: 2px solid transparent;
    border-image: linear-gradient(355deg, rgba(63,187,254,1) 11%, rgba(165,65,255,1) 87%);
    -webkit-border-image: -webkit-linear-gradient(355deg, rgba(63,187,254,1) 11%, rgba(165,65,255,1) 87%);
    border-image-slice: 1;
    border-radius: 5px;
    height: 20px;
    width: 250px;
    font-size: 20px;
    opacity: 1;
    transition: 0.5s;
    cursor: pointer;

  }

  .mainbtn:hover {
    opacity: 0.9;
    transition: 0.5s;
  }

  button:not(:first-child) {
    margin-top: 10px;
  }
}
</style>

<style lang="less" scoped>
@import url('../assets/font/iconfont.css');
.wallet-info {
  text-align: center;

  .address {
    font-size: 17px;
  }
}
</style>
