<template>
  <div>
    <div>
      <div class="total" style="margin-top: 15vh;">
        <p class="title">Exposure Portfolio</p>
      </div>
      <div class="total">
        <div style=" background-color: #070707;display: grid; grid-template-columns:  45fr 55fr; margin-top: 5vh; border-radius: 5px">
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
          <div >
            <div style="width: 70%; margin: 0 10%; padding: 10% 0;">
              <p style="font-size: 14px; color: #959595; line-height: 0.1">USDC Balance</p>
              <p style="font-size: 24px">{{ this.SOL5Balances.USDC.toLocaleString() }}</p>
<!--              <p style="font-size: 14px; color: #959595; line-height: 0.1">Wallet Value</p>-->
<!--              <p style="font-size: 24px">${{ (this.ETFValue + this.SOL5Balances.USDC).toLocaleString() }}</p>-->
              <p style="font-size: 14px; color: #959595; line-height: 0.1">SOL5 Shares</p>
              <p style="font-size: 24px">1,000</p>
              <p style="font-size: 14px; color: #959595; line-height: 0.1">ETF Shares Value</p>
              <p style="font-size: 24px">${{ this.ETFValue.toLocaleString() }}</p>
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
                Value
              </p>
              <p style="color: #959595; margin-bottom: 0">
                Allocation
              </p>
            </div>
          </div>
          <div style="width: 90%; margin: 0 5%; padding-top: 2.5%; padding-bottom: 2.55%">
            <div v-for="item in tokenList" :key="item.id" style="display: grid;  grid-template-columns: 1fr 1fr 1fr 1fr 1fr">
              <p>
                {{ item }}
              </p>
              <p>
                {{ SOL5Balances[item].toFixed(6) }}
              </p>
              <p>
                ${{ tokenPrices[item] }}
              </p>
              <p>
                ${{ SOL5Value[item].toLocaleString() }}
              </p>
              <p>
                {{ SOL5Allocation[item].toFixed(2) }}%
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
import {getWeights} from "@/utils/exposure";

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
      SOL5Balances: {
        USDC: 0,
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0
      },
      SOL5Allocation: {
        USDC: 0,
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0
      },
      SOL5Value: {
        USDC: 0,
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
      tokenPrices: {} as any,
      ready: false,
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
            data: [50, 25, 2.5, 15, 7.5]
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
    this.$accessor.price.requestPrices()
    this.$accessor.wallet.getTokenAccounts()
    this.updateBalances()
    this.ready = true
    this.get_etf_weights()
    setInterval(this.getBalances, 10000)
  },

  updated() {
    this.getBalances()
  },

  methods: {
    updateBalances() {
      const SOL5 = [
        'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
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
      let totalValue = 0

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
            this.SOL5Balances[tokenInfo.symbol] = this.tokenBalances[this.tokenAccounts[i]].balance.wei / 10 ** 6
            if (prices['SOL'] != undefined && tokenInfo.symbol != 'USDC') {
              //@ts-ignore
              totalValue += this.SOL5Balances[tokenInfo.symbol] * prices[tokenInfo.symbol]
              //@ts-ignore
              this.SOL5Value[tokenInfo.symbol] = this.SOL5Balances[tokenInfo.symbol] * prices[tokenInfo.symbol]
            }
            // this.tokenBalances[tokenInfo.mintAddress].symbol = tokenInfo.symbol
            // this.tokenBalances[tokenInfo.mintAddress].name = tokenInfo.name
          }
        }
      }

      this.ETFValue = totalValue

      let tokens = Object.keys(this.SOL5Balances)
      for (let i = 1; i < tokens.length; i++) {
        //@ts-ignore
        if (this.SOL5Balances[i] == 0)
          continue
        //@ts-ignore
        this.SOL5Allocation[tokens[i]] = ((this.SOL5Balances[tokens[i]] * prices[tokens[i]]) / totalValue) * 100
      }

    },

    async get_etf_weights() {
      const conn = this.$web3
      const wallet = (this as any).$wallet

      let weights = await getWeights(conn, wallet);
      let total = 0
      for (let i = 0; i < weights.length; i++)
      {
        total += Number(weights[i])
        console.log(weights[i].toString())
      }
      console.log('tot', total)
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
