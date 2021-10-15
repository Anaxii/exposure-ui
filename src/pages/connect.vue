<template>
  <div style="width: 100%;">
    <div style="text-align: center;margin-top:150px ;;">
      <h2>You must connect your wallet to use Exposure <Tooltip placement="bottomRight" style="background-color: transparent" >
        <template slot="title">
            <span class="tooltiptext">
              Exposure requires you to connect your wallet to the app in order to properly communicate with the Solana blockchain. Your security is our priority, and all of our code can be audited on <a href="https://github.com/anaxii" target="_blank">https://github.com/anaxii</a>
            </span>
        </template>
        <font-awesome-icon size="sm" :icon="['fas', 'info-circle']"/>
      </Tooltip >
      </h2>
    </div>
    <div class="container" @click="doAnimation">
      <div class="arrowbtn box " style="width: 15%;  vertical-align: middle;" :class="{'boxanimation': clicked}"><span class="value" style="font-size: 14px" v-if="!wallet.connected && !clicked" ghost>
        <span
          class="iconfont">&#58905;</span> Connect Wallet
      </span>
        <div>
          <div style="margin-left: auto;margin-right: auto;visibility: hidden"
               class="select-wallet" :class="{'isvisible' : clicked}">
            <Button style="margin-left: auto;margin-right: auto"
                    v-for="(providerUrl, name) in wallets" :key="name"
                    ghost @click="connect(name)">
              <span>{{ name }}</span>
              <img :src="importIcon(`/wallets/${name.replace(' ', '-').toLowerCase()}.png`)"/>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component} from 'nuxt-property-decorator'
import {Button, Modal, Icon, Tooltip} from 'ant-design-vue'
import {AccountInfo, Context} from '@solana/web3.js'
//@ts-ignore
import SolanaWalletAdapter from '@project-serum/sol-wallet-adapter'

import importIcon from '@/utils/import-icon'
import logger from '@/utils/logger'
import {getRandomEndpoint, commitment} from '@/utils/web3'
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
    Icon,
    Tooltip,
  }
})
export default class Wallet extends Vue {
  /* ========== DATA ========== */
  wallets = {
    Ledger: '',
    'Sollet Extension': '',
    Solong: '',
    MathWallet: '',
    Phantom: '',
    Sollet: 'https://www.sollet.io',
    Bonfida: 'https://bonfida.com/wallet'
  } as Wallets


  // auto refresh
  walletTimer: number | undefined = undefined
  priceTimer: number | undefined = undefined
  clicked = false

  // web3 listener
  walletListenerId = null as number | null

  /* ========== COMPUTED ========== */
  get wallet() {
    return this.$accessor.wallet
  }

  get price() {
    return this.$accessor.price
  }

  updated() {
    if (this.wallet.connected) {

      this.$router.push({path: '/loading'})
    }
  }

  /* ========== LIFECYCLE ========== */
  async beforeMount() {
    await this.$accessor.price.requestPrices()

    this.setWalletTimer()
    this.setPriceTimer()

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

    const {slot} = context

    if (slot !== this.wallet.lastSubBlock) {
      this.$accessor.wallet.setLastSubBlock(slot)
      this.$accessor.wallet.getTokenAccounts()

    }
  }

  doAnimation() {
    this.clicked = true
    this.$forceUpdate()
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

.container {
  //background: #f0f0f0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 20%;
}

.box {
  text-decoration: none;
  cursor: pointer;
  width: 160px;
  height: 75px;
  border-radius: 15px;
  font-size: 18px;
  border: 2px solid white;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 2px;
}

.box:hover {
  transition: background-color 0.5s ease;
}

.boxanimation {
  animation: boxAnimation 2.5s cubic-bezier(0.16, 1, 0.3, 1) 0s normal forwards;
  padding-top: 30px;

}

@keyframes boxAnimation {

  33% {
    width: 160px;
    height: 460px;
    background: #050505;
    //box-shadow: 10px 10px 10px #cccccc,
    //10px 10px 10px #ffffff,
    //0 0 0 #cccccc inset,
    //0 0 0 #ffffff inset;
  }
  100% {
    width: 480px;
    height: 460px;
    background: #050505;
    //box-shadow: 40px 40px 40px #cccccc,
    //0 0 0 #ffffff,
    //0 0 0 #cccccc inset,
    //2px 2px 2px #ffffff inset;
  }


  .primarybtn {
    text-decoration: none;
    cursor: pointer;
    width: 160px;
    height: 50px;
    border-radius: 15px;
    font-size: 18px;
    background-color: #1c1c1c;
    border: 2px solid white;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;

  }
}

.isvisible {
  animation: isvisible 2.5s normal forwards;
  visibility: visible !important;
  opacity: 0;
}

@keyframes isvisible {
  0% {
    opacity: 0;
  }
  30% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.primarybtn:hover {
  transition: color 0.5s ease;
  color: #2c2d30;
}

.tooltip {
  position: relative;
  display: inline-block;
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  width: 240px;
  background-color: #35363a;
  color: #fff;
  font-size: 12px;
  text-align: center;
  padding: 10px 10px;
  border-radius: 6px;
  border: 2px solid white;

  /* Position the tooltip text */
  position: absolute;
  z-index: 1;
  Top: 125%;
  left: 50%;
  margin-left: -60px;

  /* Fade in tooltip */
  opacity: 0;
  transition: opacity 0.3s;
}

/* Tooltip arrow */
//.tooltip .tooltiptext::after {
//  content: "";
//  position: absolute;
//  bottom: 100%;
//  left: 50%;
//  margin-left: -5px;
//  border-width: 5px;
//  border-style: solid;
//  border-color: #212224 transparent transparent transparent;
//  transform: rotate(180deg);
//}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}

.connectbtn {
  background-color: transparent !important;
  border: 2px solid transparent;
  border-radius: 10px;
  border-image: linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
  -webkit-border-image: -webkit-linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
  border-image-slice: 1;
  align-items: center;
  text-align: center;
  justify-content: space-between;
  opacity: 1;
  transition: 0.5s;
  cursor: pointer;
  width: 20%;
  margin-top: 50%;
  margin-left: auto;
  margin-right: auto;

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
  border-color: transparent;
  border-radius: 15px;
  background-color: #000 !important;
  transition: 0.2s ease border-color !important;

  img {
    background: #fff;
  }
}

button.ant-btn-background-ghost:hover {

  border: 3px solid rgba(54, 109, 241, 1) !important;
  color: white !important;

  img {
    background: #fff;
  }
}

button.ant-btn-background-ghost:active {
  border-color: white;
  background-color: rgba(17, 18, 19, 0.5) !important;
  color: white !important;

  img {
    background: #fff;
  }
}

button.ant-btn-background-ghost:focus {
  border-color: white;
  background-color: rgba(17, 18, 19, 0.5) !important;
  color: white !important;

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
    width: 85%;
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
    border-image: linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
    -webkit-border-image: -webkit-linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
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

.arrowbtn {
  display: block;
  height: 35px;
  line-height: 32.5px;
  text-decoration: none;
  text-align: center;
  letter-spacing: 1px;
  border-radius: 25px;
  border: 3px solid rgba(54, 109, 241, 1);
  background: transparent;
  font-weight: bold;
  color: rgb(217, 217, 217);
  transition: all .35s;
  width: 100%;
}

.arrowbtn:hover {
  width: 100%;
  color: rgb(186, 112, 251);
  border: 3px solid rgb(186, 112, 251);
  background: transparent;
}
</style>
