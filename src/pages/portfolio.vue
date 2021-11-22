<template>
  <div>
    <div>
      <div class="total" style="margin-top: 15vh;">
        <p class="title">Exposure Portfolio</p>
      </div>
      <div class="total">
        <div
            style=" background-color: #070707;display: grid; grid-template-columns:  45fr 55fr; margin-top: 5vh; border-radius: 5px">
          <div style="border-right: 1px solid white;">
            <div style="margin: 5%; padding: 5% 0">
              <div class="implode"
                   style="padding-top: 5%; padding-bottom: 5%; width: 50%; margin-left: auto; margin-right: auto;
                 border-radius: 5px; background-color: rgba(7,7,7,0.09)">
                <p style="text-align: center;font-size: 24px; line-height: 0.1; padding-bottom: 10%;">SOL5 ETF</p>
                <div style="height: 5%">
                  <pie-chart :data="chartData" :options="chartOptions"></pie-chart>
                </div>
              </div>
            </div>
          </div>
          <div style="width: 90%; margin-left: auto; margin-right: auto">
            <div style="width: 70%; margin: 0 10%; padding: 10% 0;">
              <!--              <p style="font-size: 14px; color: #959595; line-height: 0.1">USDC Balance</p>-->
              <!--              <p style="font-size: 24px">{{ this.SOL5Balances.USDC.toLocaleString() }}</p>-->
              <!--              <p style="font-size: 14px; color: #959595; line-height: 0.1">Wallet Value</p>-->

              <!--              <p style="font-size: 24px">${{ (this.ETFValue + this.SOL5Balances.USDC).toLocaleString() }}</p>-->
              <div>
                <div
                    style="width: 90%; display: grid; text-align: center; grid-template-columns: 1fr 1fr; ; margin-left: auto; margin-right: auto; padding-bottom: 1%">
                  <div>
                    <p style="font-size: 14px; color: #959595; line-height: 0.1">SOL5 Shares</p>
                    <p style="font-size: 24px">{{ (this.SOL5Balances.SOL5 / 100).toLocaleString() }}</p>
                  </div>
                  <div>
                    <p style="font-size: 14px; color: #959595; line-height: 0.1">SOL5 Equity</p>
                    <p style="font-size: 24px">{{
                        (this.SOL5Balances.SOL5 / this.etfSupply).toLocaleString()
                      }}%</p>
                  </div>
                </div>
                <div
                    style="width: 90%; display: grid; text-align: center; grid-template-columns: 1fr 1fr; margin-left: auto; margin-right: auto; padding-bottom: 1%">
                  <div>
                    <p style="font-size: 14px; color: #959595; line-height: 0.1">SOL5 Shares Value</p>
                    <p style="font-size: 24px">${{ this.ETFValue.toLocaleString() }}</p>
                  </div>
                  <div>
                    <p style="font-size: 14px; color: #959595; line-height: 0.1">Total SOL5 Value</p>
                    <p style="font-size: 24px">${{ this.sol5Value.toLocaleString() }}</p>
                  </div>
                </div>
              </div>
              <div style="margin-right:auto;margin-left:auto;width: 330px">
                <input type="number" ref="amount" class="arrowbtn" v-model="shares"
                       style="text-align: center;font-size: 14px;width: 100%; padding-top: 1.5%; cursor: text; padding-bottom: 1.5%;background: transparent; color: white; border: 3px solid white; border-radius: 15px; outline: none !important"
                       placeholder="Number of Shares"/>
              </div>
              <div style="margin-right:auto;margin-left:auto;width: 330px; padding-top: 25px">
                <button class="arrowbtn" style="display:inline-block;margin:0 auto;padding: 0 !important"
                        @click="create_shares()">Create
                </button>
              </div>
              <div style="margin-right:auto;margin-left:auto;width: 330px; padding-top: 25px">
                <button class="arrowbtn" style="display:inline-block;margin:0 auto;padding: 0 !important"
                        @click="redeem()">Redeem
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="total" style="margin-top: 10vh;">
        <p class="title">Underlying Asset Balances</p>
      </div>
      <div class="total" style="margin-top: 5vh;">
        <div style="background-color: #070707; margin-top: 5vh; border-radius: 5px">
          <div style="width: 100%; padding-top: 2.5%;border-bottom: 1px solid #959595;">
            <div
                style="width: 90%; display: grid;  grid-template-columns: 1fr 1fr 1fr 1fr 1fr; margin: 0 5%; padding-bottom: 1%">
              <p style="color: #959595; margin-bottom: 0">
                Symbol
              </p>
              <p style="color: #959595; margin-bottom: 0">
                Balance
              </p>
              <p style="color: #959595; margin-bottom: 0">
                Price
              </p>
              <p style="color: #959595; margin-bottom: 0">
                Allocation Value
              </p>
              <p style="color: #959595; margin-bottom: 0">
                Allocation %
              </p>
            </div>
          </div>
          <div style="width: 90%; margin: 0 5%; padding-top: 2.5%; padding-bottom: 2.55%">
            <div v-for="(item, index) in tokenList" :key="item.id"
                 style="display: grid;  grid-template-columns: 1fr 1fr 1fr 1fr 1fr">
              <p>
                {{ item }}
              </p>
              <p>
                <span>{{ (SOL5Balances[item] * (((SOL5Balances.SOL5 / 100) / etfSupply))).toFixed(2) }}</span>
              </p>
              <p>
                ${{ prices[item].toFixed(2).toLocaleString() }}
              </p>
              <p>
                ${{
                  ((SOL5Balances[item] * (((SOL5Balances.SOL5 / 100) / etfSupply)) * prices[item]).toFixed(2).toLocaleString())
                }}
              </p>
              <p>
                <span>{{ (weights[item] / 1e6).toFixed(2) }}</span>%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import Vue from 'vue'
import {mapState} from 'vuex'
import {Alert} from 'ant-design-vue'
import {getTokenByMintAddress} from "@/utils/tokens";
import PieChart from "@/chart/PieChart";
import {
  getSupply,
  getWeights,
  getUnderlyingAssetsInVault,
  WEIGHTS,
  ETFSUPPLY,
  getPrice,
  CreateExposureShares,
  RedeemExposureShares, ETFVALUE
} from "@/utils/exposure";

export default Vue.extend({
  components: {
    Alert,
    PieChart
  },

  data() {
    return {
      USDCBalance: 0,
      tokenAccounts: [] as any,
      tokenBalances: {} as any,
      USDValue: 0,
      ETFValue: 0,
      etfSupply: 0,
      shares: '',
      sol5Value: 0,
      SOL5Balances: {
        USDC: 0,
        SOL5: 0,
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0
      },
      prices: {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0
      },
      SOL5Allocation: {
        USDC: 0,
        SOL5: 0,
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0
      },
      SOL5Value: {
        USDC: 0,
        SOL5: 0,
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0
      },
      tokenList: [
        'A',
        'B',
        'C',
        'D',
        'E'
      ],
      assets: {},
      tokenPrices: {} as any,
      ready: false,
      weights: {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0
      },
      totalWeight: 0,
      chartOptions: {
        hoverBorderWidth: 20,
        defaultFontColor: "#fff",
        legend: {
          display: false
        },

      },
      chartData: {
        hoverBackgroundColor: "red",
        hoverBorderWidth: 10,
        labels: ["A", "B", "C", "D", "E"],
        datasets: [
          {
            label: "Data One",
            backgroundColor: ["#a37bff", "#b400ff", "#7c1fff", "#DC1FFF", "#c67bff"],
            data: [(Number(WEIGHTS[0]) / 1e6).toFixed(4), (Number(WEIGHTS[1]) / 1e6).toFixed(4), (Number(WEIGHTS[2]) / 1e6).toFixed(4), (Number(WEIGHTS[3]) / 1e6).toFixed(4), (Number(WEIGHTS[4]) / 1e6).toFixed(4)]
          }
        ]
      }
    }
  },

  head: {
    title: 'Exposure | Portfolio'
  },

  computed: {
    ...mapState(['app', 'wallet', 'farm', 'url', 'price', 'liquidity'])
  },

  watch: {},

  mounted() {
    console.log('ETF', ETFSUPPLY)
    let _weight = {}
    for (let i = 0; i < WEIGHTS.length; i++) {
      //@ts-ignore
      _weight[this.tokenList[i]] = Number(WEIGHTS[i])
    }
    //@ts-ignore
    this.weights = _weight

    // this.$accessor.price.requestPrices()
    this.$accessor.wallet.getTokenAccounts()
    this.updateBalances()

    this.ready = true
    setInterval(this.getBalances, 10000)
  },

  methods: {
    async create_shares() {
      //handle estimated max shares based on weights

      const conn = this.$web3
      const wallet = (this as any).$wallet

      if (this.shares != '') {
        if (Number(this.shares) != 0) {

          let amount = Number(this.shares) * 100000000;
          let create = await CreateExposureShares(conn, wallet, amount)
        } else {
          //error
        }

      }
    },
    async redeem() {
      // if (this.shares > this.SOL5Balances.SOL5) {
        //handle greater than max
      //   return
      // }
      if (this.shares !== '') {
        const conn = this.$web3
        const wallet = (this as any).$wallet
        let amount = Number(this.shares) * 100000000;
        let tx = await RedeemExposureShares(conn, wallet, amount)
      }
    },
    updateBalances() {
      const SOL5 = [
        'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        '8f2YCqTRCwqMmmifmeB5qDkaduZfPQmfDWZZU5bqf1En',
        'HipXwn3m4XRaEVP4ak82rGD1AR8wHQBGNkcAsjXizXqJ',
        '4yjrobNPWfwK9PkPQQ3HsiNhjKRAEi2gBxMtth7UTa3t',
        '3a3fDgsnhydFTksXoAjHWec4iDR7ZNApAppkCG4gbJ4n',
        'DvxzkaiZdnzMYC9aLpNYueVuWHydfW8BcfiAt8hMFVUu',
        '8ZS9wiKSx1eVpgB67fzFqSTyNTbHKyLmeK7A6nQWf1am'
      ]
      let prices = this.$accessor.price.prices
      if (prices['SOL'] == undefined) {
        prices = {
          A: 0,
          B: 0,
          C: 0,
          D: 0,
          E: 0
        }
      }

      this.tokenPrices = prices

      let balances = this.$accessor.wallet.balances
      if (balances != null) {
        this.tokenBalances = balances
        this.tokenAccounts = Object.keys(balances)
        for (let i = 0; i < this.tokenAccounts.length; i++) {
          if (!SOL5.includes(this.tokenAccounts[i]))
            continue
          let tokenInfo = getTokenByMintAddress(this.tokenAccounts[i])
          if (tokenInfo != null) {
            //@ts-ignore
            if (tokenInfo.symbol == 'SOL5' || tokenInfo.symbol == 'USDC')
                //@ts-ignore
              this.SOL5Balances[tokenInfo.symbol] = this.tokenBalances[this.tokenAccounts[i]].balance.wei / 10 ** 6
          }
        }
      }

      const conn = this.$web3
      const wallet = (this as any).$wallet

      getSupply(conn, wallet, 5).then((result) => {
        let r = (Number(result) / 1e8).toString()
        this.etfSupply = Number(r)
      })

      let totVal = 0
      let check = 0
      for (let i = 0; i < this.tokenList.length; i++) {
        getPrice(conn, wallet, i).then((result) => {
          //@ts-ignore
          this.prices[this.tokenList[i]] = Number(result)
          for (let i = 0; i < this.tokenList.length; i++) {
            getUnderlyingAssetsInVault(conn, wallet, i).then((result) => {
              //@ts-ignore
              this.SOL5Balances[this.tokenList[i]] = Number((Number(result) / 1e8).toString())
              //@ts-ignore
              totVal += (this.SOL5Balances[this.tokenList[i]] * (((this.SOL5Balances.SOL5 / 100) / this.etfSupply)) * this.prices[this.tokenList[i]])
              check++
              if (check === this.tokenList.length * 5) {
                this.ETFValue = totVal
                this.sol5Value = this.ETFValue / (this.SOL5Balances.SOL5 / this.etfSupply / 100)
              }
            })
          }
        })
      }

    },

    get_etf_weights() {
      const conn = this.$web3
      const wallet = (this as any).$wallet

      let weights = getWeights(conn, wallet).then((weights) => {
        let total = 0
        for (let i = 0; i < weights.length; i++) {
          total += Number(weights[i])
          //@ts-ignore
          this.weights[this.tokenList[i]] = Number(weights[i])
        }
        this.totalWeight = total
      })
    },

    getBalances() {
      if (this.ready) {
        this.$accessor.wallet.getTokenAccounts()
        this.updateBalances()
      }
    },
  }
})
</script>

<style lang="less" scoped>
/* stylelint-disable */

.arrowbtn {
  display: block;
  height: 35px;
  cursor: pointer;
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

.arrowbtn:focus {
  width: 100%;
  border: 3px solid rgb(186, 112, 251) !important;
  background: transparent;
}


p {
  font-size: 14px
}

.title {
  font-size: 40px;
  color: #fff;
  text-align: left;
  margin-top: 14px;
}

.total {
  margin: 0 15%;
  margin-bottom: 47px;
  flex-direction: row;
  border-radius: 20px;
  //display: flex;
  justify-content: space-between;

  .item {
    align-items: center;
    display: flex;
    flex-direction: column;
    padding-top: 25px;

    .value {
      font-size: 25px;
      font-weight: bold;
      color: #fff;
      //text-shadow: 0px 0px 3px rgba(79, 88, 193, 0.69);
    }
  }
}


.nav-comp {
  height: 55px;
  background-color: #2a2e62;
  border-radius: 10px;
  flex-direction: row;
  display: flex;
  align-items: center;

  .item {
    flex: 1;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    color: #fcfbfb;
    text-align: center;
    cursor: pointer;

  }
}

</style>

<style lang="less">
.farm {
  .farm-head {
    padding: 24px 32px !important;
  }

  .ant-collapse-header {
    padding: 0 !important;

    .farm-head {
      padding: 24px 32px !important;
    }
  }

  .ant-collapse-content {
    border-top: 1px solid #1c274f;
  }
}

.search-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 25px;

  label {
    position: absolute;
    font-size: 18px;
    color: #fff;
    top: 8px;
    left: 12px;
    z-index: -1;
    transition: .15s all ease-in-out;
  }

  input {
    width: 100%;
    padding: 4px 12px;
    height: 50px;
    color: #fff;
    transition: .15s all ease-in-out;
    background-color: #15161a;
    border: 2px solid transparent;
    border-image: linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
    -webkit-border-image: -webkit-linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
    border-image-slice: 1;

    &:focus {
      outline: none;
      transform: scale(1.05);

      & + label {
        font-size: 10px;
        transform: translateY(-24px) translateX(-12px);
      }
    }

    &::-webkit-input-placeholder {
      font-size: 12px;
      color: #c4c4c4;
      font-weight: 100;
    }
  }
}

.ant-alert-warning {
  width: 500px;
  margin-top: 30px;
  background-color: transparent;
  border: 1px solid #85858d;

  .anticon-close {
    color: #fff;
  }
}
</style>
