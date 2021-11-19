<template>
  <div>
    <div style="margin-top: 25vh;">
      <div class="total">
        <div class="item">
          <span class="name">Create SOL5 Shares</span>
          <div class="item">
            <p>Balances: Solana: 0 | Raydium: 0 | Serum: 0 | Saber: 0 | Mango: 0</p>
            <p>Ratios: Solana: 40% | Raydium: 20% | Serum: 10% | Saber: 10% | Mango: 10%</p>
          </div>
          <div style="margin-left: auto;margin-right: auto;width: 330px">
            <div style="margin-left: auto;margin-right: auto">
              <input type="number" ref="amount" class="arrowbtn" v-model="shares"
                     style="text-align: center;font-size: 14px;width: 100%; padding-top: 1.5%; cursor: text; padding-bottom: 1.5%;background: transparent; color: white; border: 3px solid white; border-radius: 15px; outline: none !important"
                     placeholder="# of Shares"/>
            </div>
          </div>
          <div style="width: 330px; padding-top: 25px">
            <button class="arrowbtn" style="padding: 0 !important" @click="create_shares()">Confirm</button>
          </div>
          <!--            <div style="width: 330px; padding-top: 25px">-->
          <!--            <button class="arrowbtn" style="padding: 0 !important" @click="churn()">Churn ETF Weights</button>-->
          <!--          </div>-->
          <!--          <div style="width: 330px; padding-top: 25px">-->
          <!--            <button class="arrowbtn" style="padding: 0 !important" @click="get_etf_weights()">Get ETF Weights</button>-->
          <!--          </div>-->
          <!--          <div style="width: 330px; padding-top: 25px">-->
          <!--            <button class="arrowbtn" style="padding: 0 !important" @click="create_etf()">Create ETF</button>-->
          <!--          </div>-->
          <!--          <div style="width: 330px; padding-top: 25px">-->
          <!--            <button class="arrowbtn" style="padding: 0 !important" @click="add_assets()">Add Assets</button>-->
          <!--          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {mapState} from 'vuex'
import {Tooltip, Progress, Collapse, Spin, Icon, Row, Col, Button, Alert} from 'ant-design-vue'
import importIcon from '@/utils/import-icon'
import {TokenAmount, lt, lte, isNullOrZero} from '@/utils/safe-math'
import {formatToMoneyNum, getNumber} from '@/utils'
import BigNumber from 'bignumber.js'
import {CreateMultiSIG} from "@/utils/vault";
import {
  CreateExposureShares,
  getWeights,
  churnWeight,
  CreateETF,
  AddAsset,
  RedeemExposureShares
} from "@/utils/exposure";

const CollapsePanel = Collapse.Panel

export default Vue.extend({
  components: {},

  data() {
    return {
      isMobile: false,

      farms: [] as any,
      showFarm: null,
      currBtnType: 'deposit',
      lp: null,
      totalTvl: [] as any,
      totalFusionTvl: [] as any,
      allTotalTvl: [] as any,
      farmInfo: null as any,
      harvesting: false,
      stakeModalOpening: false,
      staking: false,
      unstakeModalOpening: false,
      unstaking: false,
      feeMessage: '0.5% fee for deposit within 3 days' as string,
      inputValue: '',
      shares: ''
    }
  },

  head: {
    title: 'Exposure | Purchase'
  },

  computed: {
    ...mapState(['app', 'wallet', 'farm', 'url', 'price', 'liquidity'])
  },

  watch: {},

  mounted() {
    console.log(this.$route.query.wallet)
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

    async create_shares() {
      const conn = this.$web3
      const wallet = (this as any).$wallet

      if (this.shares != '') {
        if (Number(this.shares) != 0) {
          console.log(this.shares)

          let amount = Number(this.shares) * 100000000;
          let create = await CreateExposureShares(conn, wallet, amount)
        } else {
          //error
        }

      }
    },

    async churn() {
      const conn = this.$web3
      const wallet = (this as any).$wallet
      let churn = await churnWeight(conn, wallet)
    },

    async get_etf_weights() {
      const conn = this.$web3
      const wallet = (this as any).$wallet

      let weights = await getWeights(conn, wallet);
      for (var i = 0; i < weights.length; i++) {
        console.log(weights[i].toString())
      }
    },

    async create_etf() {
      const conn = this.$web3
      const wallet = (this as any).$wallet

      let tx_1 = await CreateETF(conn, wallet)
    },

    async add_assets() {
      const conn = this.$web3
      const wallet = (this as any).$wallet


      for (var i = 0; i < 5; i++) {
        let tx = await AddAsset(conn, wallet, i)
      }
    },

    setCurrBtnType(btnType: any) {
      this.currBtnType = btnType
    },

  }
})
</script>

<style lang="less" scoped>
/* stylelint-disable */

.total {
  margin: 0 72px;
  margin-top: 40px;
  margin-bottom: 47px;
  flex-direction: row;
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

    .name {
      font-size: 28px;
      color: #fcfbfb;
      margin-top: 14px;
    }
  }


  .mainbtn:hover {
    background-color: rgba(145, 145, 145, 0.05);
    transition: 0.5s;
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

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 0;
}

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

    &.gray {
      background-color: #15161a !important;
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

    //&.select {
    //  background-color: #15161b;
    //
    //}

    &.gray {
      background-color: #15161a;
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
          background-color: #15161a;
          border: 2px solid transparent;
          border-image: linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
          -webkit-border-image: -webkit-linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
          border-image-slice: 1;
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
        flex-direction: row;
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

  .selected {
    border-bottom: transparent;
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

.fancymainbtn {
  background-color: #15161a;
  border: 2px solid transparent;
  border-image: linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
  -webkit-border-image: -webkit-linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
  border-image-slice: 1;
}

.mainbtn {
  background-color: #000;
  //border: 2px solid transparent;
  //border-image: linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
  //-webkit-border-image: -webkit-linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
  //border-image-slice: 1;
  border-radius: 5px;
  height: 50px;
  width: 330px;
  font-size: 20px;
  opacity: 1;
  transition: 0.5s;
  cursor: pointer;

}
</style>
