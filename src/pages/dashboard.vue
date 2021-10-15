<template>
  <div>
    <div style="justify-content: space-between;display: flex">
      <div style="width: 40%;margin-left: auto;margin-right: auto;display: inline">
        <div>
          <h2>Token Portfolio</h2>
          <div style="margin-top: 5%;">
            <div style="width: 50%;margin-left: auto;margin-right: auto;">
              <pie-chart :data="chartData" :options="chartOptions"></pie-chart>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 40%;margin-left: auto;margin-right: auto;display: inline">
        <div>
          <h2>Portfolio</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {mapState} from 'vuex'
import {Tooltip, Progress, Collapse, Spin, Icon, Row, Col, Button, Alert} from 'ant-design-vue'
import PieChart from "@/chart/PieChart";

import {get, cloneDeep} from 'lodash-es'
import importIcon from '@/utils/import-icon'
import {TokenAmount, lt, lte, isNullOrZero} from '@/utils/safe-math'
import {getUnixTs, formatToMoneyNum, getNumber} from '@/utils'
import BigNumber from 'bignumber.js'
import {PublicKey} from '@solana/web3.js'
import {getTokenByMintAddress} from "@/utils/tokens"
import {SPL_Transfer} from "@/utils/vault";

const CollapsePanel = Collapse.Panel

export default Vue.extend({
  components: {
    Tooltip,
    Progress,
    Collapse,
    CollapsePanel,
    Spin,
    Icon,
    Row,
    Col,
    Button,
    Alert,
    PieChart,
  },

  data() {
    return {
      isMobile: false,
      tokenAccounts: [] as any,
      tokenBalances: {} as any,
      chartOptions: {
        hoverBorderWidth: 20,
        defaultFontColor: "#fff",
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false
        }
      },
      chartData: {
        hoverBackgroundColor: "red",
        hoverBorderWidth: 10,
        labels: ["Private/Seed (6%)", "IDO (4%)", "Team (14%)", "Marketing (1%)", "Staking Rewards (73%)", "Liquidity (2%)"],
        datasets: [
          {
            label: "Data One",
            labels: ["Private/Seed (6%)", "IDO (4%)", "Team (14%)", "Marketing (1%)", "Staking Rewards (73%)", "Liquidity (2%)"],

            backgroundColor: ["#866bff", "#b539ff", "#f70fff", "#e213fe", "#5421d3", "#efa3ff"],
            data: [60000, 40000, 140000, 10000, 730000, 20000]
          }
        ]
      }
    }
  },

  head: {
    title: 'Parea Dashboard'
  },

  computed: {
    ...mapState(['app', 'wallet', 'farm', 'url', 'price', 'liquidity'])
  },

  watch: {},

  mounted() {
    // console.log(this.$route.query.wallet)
    let balances = localStorage.getItem('tokenBalances')
    if (balances != null) {
      this.tokenBalances = JSON.parse(balances.toString())
      this.tokenAccounts = Object.keys(JSON.parse(balances.toString()))

      for (let i = 0; i < this.tokenAccounts.length; i++) {
        let tokenInfo = getTokenByMintAddress(this.tokenAccounts[i])
        if (tokenInfo != null) {
          // this.tokenBalances[i].symbol = tokenInfo.symbol
          // this.tokenBalances[i].name = tokenInfo.name
          this.tokenBalances[tokenInfo.mintAddress].symbol = tokenInfo.symbol
          this.tokenBalances[tokenInfo.mintAddress].name = tokenInfo.name
          console.log(tokenInfo)
        } else {

        }
      }
    }
  },

  methods: {
    lt,
    lte,
    isNullOrZero,
    formatToMoneyNum,
    BigNumber,
    getNumber,
    importIcon,
    TokenAmount,

    async transfer(token: string) {
      const conn = this.$web3
      const wallet = (this as any).$wallet
      let amount = this.$refs.amount

      if (this.$refs.destination != undefined) {
        let _dest = this.$refs.destination.toString();
        const tx = await SPL_Transfer(conn, wallet, localStorage.getItem('vault'), token, _dest, Number(amount))
      }

      // this.$notify.success({
      //     message: 'Transaction Created: ' + tx,
      //   })
    },

  }
})
</script>

<style lang="less" scoped>
.total {
  margin: 0 72px;
  margin-top: 40px;
  margin-bottom: 47px;
  flex-direction: row;
  display: flex;
  justify-content: space-between;

  .item {
    align-items: center;
    display: flex;
    flex-direction: column;

    .value {
      font-size: 44px;
      color: #fff;
    }

    .name {
      font-size: 18px;
      color: #fcfbfb;
      margin-top: 14px;
    }
  }
}

@media (max-width: 600px) {
  .total {
    margin: 0;
    margin-top: 40px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    justify-content: center;
    flex-direction: column;

    .item-1 {
      margin-top: 5px;
    }

    .value {
      font-size: 30px !important;
    }

    .name {
      margin-top: 0px !important;
    }
  }
}

.container {
  justify-content: space-between;
  align-items: center;
  flex-direction: unset;
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

    &.select {
      background-color: #5260ff;
      border-radius: 10px;
      height: 100%;
      display: flex;
    }
  }
}

@media (max-width: 37.5rem) {
  .nav-comp {
    height: 2.75rem;
    flex-shrink: 0;

    .item {
      font-size: 1.0625rem;
    }
  }
}

.farm.container {
  max-width: 1200px;
  cursor: pointer;

  .row-row {
    padding: 10px 40px 10px 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    // background-image   : url(../assets/images/bg.jpg);
    background-repeat: repeat;
    background-size: 15%;
    background-color: #15161a;
    border: 2px solid transparent;
    border-image: linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
    -webkit-border-image: -webkit-linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
    border-image-slice: 1;
    border-radius: 10px;
    color: #fff;
    // background-color: #15161b;
    margin-top: 14px;

    div {
      display: flex;
      flex-direction: column;
    }

    &.select {
      border: solid 1px #5260ff;
    }

    &.gray {
      background-color: #15161b !important;
      background-image: none;
    }

    .icon {
      width: 50px;
      height: 50px;
      position: relative;
      margin-right: 13px;
      align-items: center;
      justify-content: center;
    }

    .bg {
      width: 32px;
    }

    .bg1 {
      position: absolute;
      left: 12px;
      top: 16px;
      width: 20px;
      height: 20px;
    }

    .bg2 {
      position: absolute;
      left: 20px;
      top: 4px;
      width: 20px;
      height: 20px;
    }

    .logo {
      width: 30px;
      height: 30px;
      margin-right: 13px;
      border-radius: 50%;
    }

    .name {
      font-size: 16px;
      color: #fcfbfb;
      flex: 1;
    }

    .size-24 {
      font-size: 24px;
    }

    .size-16 {
      font-size: 16px;
    }

    .size-14 {
      font-size: 14px;
    }

    .color-blue {
      color: #5260ff;
    }

    .color-gray {
      color: #b5b5b5;
    }

    span {
      line-height: 1.6;
    }

    .line-1 {
      min-width: 200px;
      align-items: center;
      position: relative;
      padding-right: 20px;

      .iconfont {
        position: absolute;
        top: 7px;
        right: 20px;
      }
    }

    .line-2 {
      // width: 120px;
    }

    .line-3 {
      width: 176px;
      align-items: flex-end;
    }
  }

  .row-phone {
    padding: 1.4375rem;
    background-color: #15161a;
    border: 2px solid transparent;
    border-image: linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
    -webkit-border-image: -webkit-linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
    border-image-slice: 1;
    border-radius: 0.625rem;
    color: #fff;
    margin-top: 0.875rem;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;

    div {
      display: flex;
      flex-direction: column;
    }

    &.select {
      border: solid 1px #5260ff;
    }

    &.gray {
      background-color: #15161b;
    }

    .line-1 {
      flex-direction: row;
      align-items: center;
      margin-bottom: 0.375rem;

      .icon {
        width: 2.625rem;
        height: 2.625rem;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      .bg {
        position: absolute;
        left: 0.875rem;
        top: 0;
        width: 1.625rem;
      }

      .bg2 {
        position: absolute;
        left: 0;
        top: 0.875rem;
        width: 1.625rem;
      }

      .logo {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 50%;
      }

      .name {
        flex: 1;
        font-size: 0.875rem;
        font-weight: 800;
        color: #fcfbfb;
        margin-left: 0.625rem;
      }

      .line-1-rigth {
        align-items: flex-end;
      }
    }

    .line-2 {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .size-24 {
      font-size: 1.5rem;
    }

    .size-16 {
      font-size: 1rem;
    }

    .size-14 {
      font-size: 0.875rem;
    }

    .color-blue {
      color: #5260ff;
    }

    .color-gray {
      color: #b5b5b5;
    }
  }

  .row-detail {
    padding: 24px 50px 23px 34px;
    background-color: #15161a;
    border: 2px solid transparent;
    border-top: transparent;
    border-image: linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
    -webkit-border-image: -webkit-linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
    border-image-slice: 1;

    // background   : #131419;
    border-radius: 10px;

    div {
      display: flex;
      flex-direction: column;
    }

    .row-total {
      flex-direction: row;
      align-items: stretch;
      justify-content: space-between;
      padding-bottom: 31px;

      .names {
        height: 70px;
        justify-content: space-between;

        span {
          font-size: 14px;
          font-weight: 500;
          color: #999999;
        }

        &:nth-child(1) {
          position: relative;
          top: 4px;
        }
      }

      .values {
        align-items: center;

        span {
          font-size: 16px;
          font-weight: 500;
          color: #5260ff;

          &:nth-child(2) {
            margin-top: 29px;
          }
        }
      }

      .info {
        align-items: flex-end;

        i {
          font-size: 15px;
          color: #fff;
        }

        div {
          width: 79px;
          height: 35px;
          background: linear-gradient(90deg, #535eff, #6138ff);
          border-radius: 18px;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          color: #f3f3f3;
          margin-top: 30px;
        }
      }
    }

    .line {
      height: 1px;
      background: #424242;
    }

    .nav-main {
      padding: 20px 0;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;

      .nav {
        flex-direction: row;
        align-items: center;

        & > span {
          font-size: 16px;
          font-weight: bold;
          color: #c8c8c8;
          padding: 0 10px;
          position: relative;

          &::before {
            content: ' ';
            width: 1px;
            height: 11px;
            background: #c8c8c8;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }

          &:nth-child(1) {
            &::before {
              display: none;
            }
          }

          &.select {
            color: #5260ff;
          }
        }
      }

      & > span {
        color: #999999;
        font-size: 15px;
        font-weight: 800;
        text-align: right;
      }
    }

    .input {
      flex-direction: row;
      align-items: center;
      height: 40px;
      background: #2b2c30;
      border-radius: 20px;
      padding: 0 10px;
      position: relative;

      .input-box {
        flex: 1;
        border: none;
        background-color: transparent;
        padding: 10px;
        // padding-right: 150px;
        text-align: right;

        > input {
          outline: none;
          text-align: right;
          width: 100%;
          border: none;
          background-color: transparent;
          padding: 10px;
        }
      }

      & > span {
        font-size: 18px;
        font-weight: bold;
        color: #b6b5b5;
        flex-shrink: 0;
        // position   : absolute;
        // right      : 95px;
      }

      & > div {
        width: 65px;
        height: 33px;
        background: #403a8d;
        border-radius: 17px;
        font-size: 16px;
        font-weight: 800;
        color: #f3f3f3;
        align-items: center;
        justify-content: center;
        margin-left: 20px;
        flex-shrink: 0;
        // position       : absolute;
        // right          : 10px;
      }
    }

    .tip {
      font-size: 14px;
      font-weight: 800;
      color: #c8c8c8;
      text-align: right;
      margin-top: 17px;
      margin-bottom: 17px;
    }

    .bottom {
      padding-top: 23px;
      align-items: center;

      .name {
        color: #c8c8c8;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      .value {
        font-size: 24px;
        margin-top: 5px;
        font-weight: 800;
        color: #5260ff;
      }

      .btns {
        //flex-direction: row;
        align-items: center;
        margin-top: 15px;

        & > div {
          background: linear-gradient(90deg, #535eff, #6138ff);
          border-radius: 30px;
          padding: 5px 20px;
          font-size: 13px;
          font-weight: 800;
          color: #fdfcfc;
          margin: 0 10px;
        }
      }
    }
  }

  .card {
    .card-body {
      padding: 0;

      .ant-collapse {
        border: 0;

        .ant-collapse-item {
          border-bottom: 0;
        }

        .ant-collapse-item:not(:last-child) {
          border-bottom: 1px solid #d9d9d9;
        }
      }
    }
  }

  .harvest {
    .reward {
      .token {
        font-weight: 600;
        font-size: 20px;
      }

      .value {
        font-size: 12px;
      }
    }

    button {
      padding: 0 30px;
    }
  }

  .start {
    .unstake {
      width: 48px;
      margin-right: 10px;
    }

    button {
      width: 100%;
    }
  }

  .harvest,
  .start {
    padding: 16px;
    border: 2px solid #1c274f;
    border-radius: 4px;

    .title {
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    button {
      height: 48px;
    }
  }

  .farm-head {
    display: flex;
    align-items: center;

    .lp-icons {
      .icons {
        margin-right: 8px;
      }
    }

    .state {
      display: flex;
      flex-direction: column;
      text-align: left;

      .title {
        font-size: 12px;
        text-transform: uppercase;
      }

      .value {
        font-size: 16px;
        line-height: 24px;
      }
    }
  }

  .farm-head.is-mobile {
    padding: 24px 16px !important;
  }

  .is-mobile {
    .harvest,
    .start {
      margin-top: 16px;
    }
  }

  p {
    margin-bottom: 0;
  }

  .can-be-click {
    cursor: pointer;
  }
}

@media (min-width: 37.5rem) {
  .farm.container {
    .row-phone {
      display: none;
    }
  }
}

@media (max-width: 37.5rem) {
  .farm.container {
    padding: 0;

    .row-row {
      display: none;
    }

    .row-detail {
      padding: 10px 15px;
      border: solid 1px #5260ff;
      margin-top: 10px;

      .row-total {
        padding-bottom: 13px;
      }

      .tip {
        margin-top: 8px;
        margin-bottom: 8px;
        padding-left: 0;
        text-align: left;
        font-size: 13px;
      }

      .info {
        & > div {
          // width        : 50px;
          height: 22px;
          border-radius: 10px;
          font-size: 12px;
        }
      }

      .nav-main {
        padding: 15px 0 5px;

        & > span {
          width: 100%;
          font-size: 12px;
          margin-top: 5px;
        }

        .nav {
          span {
            font-size: 14px;
          }
        }
      }

      .input {
        & > div {
          width: 54px;
          height: 28px;
          font-size: 14px;
        }

        span {
          font-size: 14px;
        }
      }

      .bottom {
        padding-top: 15px;

        .name {
          font-size: 13px;
        }

        .value {
          font-size: 18px;
        }

        .btns {
          margin-top: 5px;

          & > div {
            padding: 4px 10px;
            font-size: 12px;
          }
        }
      }
    }
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

.ant-alert-warning {
  width: 500px;
  margin-top: 30px;
  background-color: transparent;
  border: 1px solid #85858d;

  .anticon-close {
    color: #fff;
  }
}

.mainbtn {
  background-color: #15161a;
  border: 2px solid transparent;
  border-image: linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
  -webkit-border-image: -webkit-linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
  border-image-slice: 1;
  border-radius: 35px;
  height: 35px;
  width: 150px;
  font-size: 14px;
  opacity: 1;
  transition: 0.5s;
  cursor: pointer;

}

.mainbtn:hover {
  opacity: 0.9;
  transition: 0.5s;
}
</style>
