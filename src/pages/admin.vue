<template>
  <div>

    <div style="margin-top: 25vh;">
      <div class="total">
        <div class="item">

          <span class="name">Admin Page</span>
          <div style="margin-left: auto;margin-right: auto;width: 330px; padding: 2vh 0">
            <div style="margin-left: auto;margin-right: auto">
              <input type="number" v-on:keyup.enter="" ref="spl" class="arrowbtn"
                     style="text-align: center;font-size: 14px;width: 100%; padding-top: 1.5%; cursor: text; padding-bottom: 1.5%;background: transparent; color: white; border: 3px solid white; border-radius: 15px; outline: none !important"
                     placeholder="SPL"/>
            </div>
          </div>
          <div style="margin-left: auto;margin-right: auto;width: 330px; padding: 2vh 0">
            <div style="margin-left: auto;margin-right: auto">
              <input type="number" v-on:keyup.enter="" ref="market" class="arrowbtn"
                     style="text-align: center;font-size: 14px;width: 100%; padding-top: 1.5%; cursor: text; padding-bottom: 1.5%;background: transparent; color: white; border: 3px solid white; border-radius: 15px; outline: none !important"
                     placeholder="Market"/>
            </div>
          </div>
          <div style="margin-left: auto;margin-right: auto;width: 330px; padding: 2vh 0">
            <div style="margin-left: auto;margin-right: auto">
              <input type="number" v-on:keyup.enter="" ref="bid" class="arrowbtn"
                     style="text-align: center;font-size: 14px;width: 100%; padding-top: 1.5%; cursor: text; padding-bottom: 1.5%;background: transparent; color: white; border: 3px solid white; border-radius: 15px; outline: none !important"
                     placeholder="Bid"/>
            </div>
          </div>
          <div style="margin-left: auto;margin-right: auto;width: 330px; padding: 2vh 0">
            <div style="margin-left: auto;margin-right: auto">
              <input type="number" v-on:keyup.enter="" ref="exposure" class="arrowbtn"
                     style="text-align: center;font-size: 14px;width: 100%; padding-top: 1.5%; cursor: text; padding-bottom: 1.5%;background: transparent; color: white; border: 3px solid white; border-radius: 15px; outline: none !important"
                     placeholder="Exposure"/>
            </div>
          </div>
          <div style="width: 330px">

            <button class="arrowbtn" @click="createETF()" style="padding: 0 !important">Create ETF</button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {mapState} from 'vuex'
import {Tooltip, Progress, Collapse, Spin, Icon, Row, Col, Button, Alert} from 'ant-design-vue'
import Vue from 'vue';

const CollapsePanel = Collapse.Panel

export default Vue.extend({
  components: {
  },

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
      inputValue: ''
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

    createETF() {
      // @ts-ignore
      let spl: string = this.$refs.spl.value
      // @ts-ignore
      let market: string = this.$refs.market.value
      // @ts-ignore
      let bid: string = this.$refs.bid.value
      // @ts-ignore
      let exposure = this.$refs.exposure.value

      console.log(spl, market, bid, exposure)
    }

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
  justify-content: space-between;

  .item {
    align-items: center;
    display: flex;
    flex-direction: column;
    padding-top: 25px;
    width: 50%;
    margin-left: auto;
    margin-right: auto;

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

input:focus {
  border: none !important;
}
</style>

<style lang="less">


.fancymainbtn {
  background-color: #15161a;
  border: 2px solid transparent;
  border-image: linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
  -webkit-border-image: -webkit-linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
  border-image-slice: 1;
}

</style>

<style lang="scss">


</style>
