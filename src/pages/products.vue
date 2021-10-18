<template>
  <div>
    <div :style="{'padding-bottom': '5%','padding-top': '5%'}" class="app">
      <div v-bind:style="{'margin-left': 'auto','margin-right': 'auto', 'width':'100% !important'}">
<!--      <div v-bind:style="{'width': minorWidth}"-->
<!--           style="margin-left: auto;margin-right:auto;padding-bottom: 15px; margin-top: 25vh">-->
<!--        <h2 class="head" v-bind:style="{'font-size': '80px'}" style="text-align: center !important;">-->
<!--          DeFi meets TradFi.</h2>-->
<!--      </div>-->

      <div v-bind:style="{'width': minorWidth}"
           style="margin-left: auto;margin-right:auto;padding-bottom: 15px; margin-top: 10vh">
        <h2 class="head" v-bind:style="{'font-size': headerSize}" style="text-align: center !important;">The Exposure
          Portal.</h2>
        <h3 class="subhead" style="text-align: center !important;">
          The Exposure Portal makes purchasing a crypto ETF easy. To get started, all you need is a Solana wallet,
          some Solana, and a desire to get involved in the cryptocurrency market.
          <br/>
          <br/>
        </h3>
        <div style="border: 1px solid white;" v-if="size != 'small'">
          <img src="../assets/images/exposureportal.png" style="width: 90%"/>
        </div>
<!--        <div style="width: 25%;margin-left: auto;margin-right: auto;border-radius: 15px; padding-top: 5%">-->
<!--          <button @click="nav('/connect')" class="arrowbtn">Launch App</button>-->
<!--        </div>-->
        <div style="width: 25%;margin-left: auto;margin-right: auto;border-radius: 15px; padding-top: 5vh" v-if="size != 'small'">
          <button class="arrowbtn" style="cursor: not-allowed;">Coming Soon</button>
        </div>
      </div>

      <div v-bind:style="{'width': minorWidth}"
           style="margin-left: auto;margin-right:auto;padding-bottom: 15px; margin-top: 10vh">
        <h2 class="head" v-bind:style="{'font-size': headerSize}" style="text-align: center !important;">The Pro
          Portal.</h2>
        <h3 class="subhead" style="text-align: center !important;">
          Exposure Pro is designed to help institutions and market makers create and redeem exposure shares. Users can
          offer
          directly to the primary market to help increase liquidity and lower fees for regular users.

        </h3>
        <div style="width: 25%;margin-left: auto;margin-right: auto;border-radius: 15px; padding-top: 5vh" v-if="size != 'small'">
          <button class="arrowbtn" style="cursor: not-allowed;">Coming Soon</button>
        </div>

      </div>


      <div v-if="this.size != 'large'" style="padding-bottom: 50px"/>

    </div>

  </div>
  <!--    <Footer/>-->

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PieChart from "@/chart/PieChart";

import {Tooltip, Progress, Collapse, Spin, Icon, Row, Col, Button, Alert} from 'ant-design-vue'


const CollapsePanel = Collapse.Panel

export default Vue.extend({
  components: {
  },

  data() {
    return {
      size: '',
      mainWidth: '70%',
      minorWidth: '50%',
      headerSize: '60px',
      featureSize: '20px',
      topTimer: 0,
      topInterval: 0 as any,
      windowHeight: window.innerHeight,
      txt: '',
    }
  },

  head: {
    title: 'Exposure'
  },

  computed: {},

  watch: {},

  mounted() {

    if (window.innerWidth < 800) {
      this.size = 'small'
      this.minorWidth = '90%'
      this.headerSize = '30px'
      this.mainWidth = '100%'
      this.featureSize = '14px'
    } else if (window.innerWidth < 1500) {
      this.size = 'medium'
    } else {
      this.size = 'large'
    }
    let currentTime = new Date
    this.topTimer = Number(currentTime.getTime())
    this.startInterval()
  },

  methods: {
    startInterval() {
      this.topInterval = setInterval(() => {
        this.phase()
      }, 249);
    },
    nav(page: string) {
      this.$router.push({path: page})
    },
    phase() {
      let getTime = new Date
      let currentTime = getTime.getTime()
      console.log(this.topTimer, Number(currentTime) - this.topTimer, currentTime, this.size)
      if (Number(currentTime) - this.topTimer > 12200) {
        return 3
      } else if (Number(currentTime) - this.topTimer > 8050) {
        this.$forceUpdate()
        return 3
      } else if (Number(currentTime) - this.topTimer > 4050) {
        this.$forceUpdate()
        return 2
      } else {
        return 1
      }
    }
  },
})
</script>


<style lang="less" scoped>

.featureTitledeep {
  font-size: 24px;
  margin-bottom: 0;
}

.text1 {
  font-size: 15px;
  text-align: left;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  color: #e2e2e2;

}

.joinbtn {
  text-decoration: none;
  cursor: pointer;
  width: 100%;
  height: 50px;
  border-radius: 15px;
  font-size: 18px;
  background: #c38cff;
  border: 2px solid white;
  transition: background 0.5s linear;
  color: white !important;

}

.joinbtn:hover {
  background-color: #ba70fb;
  transition: background 0.5s linear;
  color: white !important;
}

.bouncy {
  animation: bouncy 3s infinite linear;
  position: relative;
}

@keyframes bouncy {
  0% {
    top: 0em
  }
  40% {
    top: 0em
  }
  43% {
    top: -0.9em
  }
  46% {
    top: 0em
  }
  48% {
    top: -0.4em
  }
  50% {
    top: 0em
  }
  100% {
    top: 0em;
  }
}

.rightparagraph {
  margin-top: 10%;
  text-align: left;
  width: 40%;
  margin-left: auto;
}

.featuredeep {
  padding-top: 10px;
  margin-left: 25px;
  margin-right: 25px;
  flex: 1 1 0px;
  text-align: center;
  border-radius: 15px;
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
}

.featuredeep:hover {
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
  cursor: default;

}


.joinus {
  margin-top: 75px;
  padding-top: 15px;

  text-align: center;
  border-radius: 15px;
  background: rgb(159, 49, 255);
  background: linear-gradient(90deg, rgba(159, 49, 255, 1) 0%, rgba(186, 112, 251, 1) 100%);
  height: 150px;
}

.leftparagraph {
  margin-top: 10%;
  text-align: left;
  width: 40%;
  margin-right: auto;
}

a {
  color: #fff;
}

.app {
  width: 100%;
  //background: rgb(28, 31, 50);
  //background: linear-gradient(90deg, rgba(28, 31, 50, 1) 25%, rgba(22, 13, 74, 1) 100%);
  background-color: #000000;
  //background-color: #160d4a;
  //background-image: url('~@/assets/background/pexels-david-selbert-6468238.png');
  background-repeat: no-repeat;
  //background-position: center center;
  background-size: cover;
  object-position: top center;

}

.logo {
  width: 75px;
  height: 75px;
  margin-right: 40px;
  border-radius: 50%;
  padding: 0;
  display: inline-block;
}


.head {
  font-size: 12vw;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

.infoDiv {
  width: 45%;
}

.centerDiv {
  width: 100%;
}

.subhead {
  font-size: 20px;
}

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

@media (max-width: 800px) {

  .foottext {
    margin-left: 25%;
    margin-right: 25%;
    text-align: center;
  }


  .subhead {
    font-size: 15px !important;
    padding-bottom: 20px;
  }

  .featureTitle {
    font-size: 20px;
    margin-bottom: 0;
  }


  .featuredeep {
    padding-bottom: 10px !important;
    margin-bottom: 16px;
  }

  .app {
    text-align: center;
    padding-bottom: 1000px;

  }

  .logo {
    margin-right: 5px;
  }

  .padder {
    padding-bottom: 300px;
  }


  .infoDiv {
    width: 100%;
  }

  .subhead {
    font-size: 20px;
  }

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
  background-color: #000;
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

.primarybtn {
  background-color: #3EB489;
  //border: 2px solid transparent;
  //border-image: linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
  //-webkit-border-image: -webkit-linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
  //border-image-slice: 1;
  border-radius: 5px;
  height: 100%;
  padding-top: 5px;
  padding-bottom: 5px;
  width: 15%;
  font-size: 14px;
  opacity: 1;
  cursor: pointer;
  color: #fff;
  border: 2px solid white;

}

.primarybtn:hover {
  transition: color 0.5s ease;
  color: #2c2d30;
  //border: 2px solid #2c2d30;

}

a:hover {
  transition: color 0.5s ease;
  color: #2c2d30;
}

.mainbtn {
  background-color: transparent;
  border: 2px solid transparent;
  border-image: linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
  -webkit-border-image: -webkit-linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
  border-image-slice: 1;
  border-radius: 5px;
  height: 50px;
  width: 250px;
  font-size: 20px;
  opacity: 1;
  transition: 0.5s;
  cursor: pointer;
  position: absolute;

}

.mainbtn:hover {
  background-color: rgba(145, 145, 145, 0.05);
  transition: 0.5s;
}

.mainbtnoff {
  background-color: transparent;
  border: 2px solid transparent;
  border-image: linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
  -webkit-border-image: -webkit-linear-gradient(355deg, rgba(63, 187, 254, 1) 11%, rgba(165, 65, 255, 1) 87%);
  border-image-slice: 1;
  border-radius: 5px;
  height: 50px;
  width: 250px;
  font-size: 20px;
  opacity: 1;
  transition: 0.5s;
  cursor: pointer;
}

html, body {
  max-width: 100%;
  overflow-x: hidden;
}

.fade-in-text {
  color: white;
  opacity: 0;
  animation: fadeIn linear 4s;
  -webkit-animation: fadeIn linear 4s;
  -moz-animation: fadeIn linear 4s;
  -o-animation: fadeIn linear 4s;
  -ms-animation: fadeIn linear 4s;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@-moz-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@-webkit-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@-o-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@-ms-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.fade-in-text2 {
  color: white;
  animation: fadeIn2 linear 2s;
  -webkit-animation: fadeIn2 linear 2s;
  -moz-animation: fadeIn2 linear 2s;
  -o-animation: fadeIn2 linear 2s;
  -ms-animation: fadeIn2 linear 2s;
}

@keyframes fadeIn2 {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-moz-keyframes fadeIn2 {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-webkit-keyframes fadeIn2 {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-o-keyframes fadeIn2 {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-ms-keyframes fadeIn2 {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.scrolldown {
  --color: white;
  --sizeX: 30px;
  --sizeY: 50px;
  position: relative;
  width: var(--sizeX);
  height: var(--sizeY);
  margin-left: var(sizeX / 2);
  border: calc(var(--sizeX) / 10) solid var(--color);
  border-radius: 50px;
  box-sizing: border-box;
  margin-bottom: 16px;
}

.scrolldown::before {
  content: "";
  position: absolute;
  bottom: 30px;
  left: 50%;
  width: 6px;
  height: 6px;
  margin-left: -3px;
  background-color: var(--color);
  border-radius: 100%;
  animation: scrolldown-anim 2s infinite;
  box-sizing: border-box;
  box-shadow: 0px -5px 3px 1px #ffffff66;
}

@keyframes scrolldown-anim {
  0% {
    opacity: 0;
    height: 6px;
  }
  40% {
    opacity: 1;
    height: 10px;
  }
  80% {
    transform: translate(0, 20px);
    height: 10px;
    opacity: 0;
  }
  100% {
    height: 3px;
    opacity: 0;
  }
}

@keyframes pulse {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.5;
  }
}

/*copy until here */

.scrolldiv {
  display: flex;
  height: 35vh;
  width: 99.5vw;
  max-width: 100vw;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  overflow-x: hidden;
}
.arrowbtn{
  display: block;
  height: 45px;
  line-height: 32.5px;
  text-decoration: none;
  text-align: center;
  letter-spacing: 1px;
  border-radius: 25px;
  border: 3px solid rgba(54,109,241,1);
  background: transparent;
  font-weight: bold;
  color: rgb(217, 217, 217);
  transition: all .35s;
  width: 100%;
  cursor: pointer;
}

.arrowbtn:hover{
  width: 100%;
  color: rgb(186,112,251);
  border: 3px solid rgb(186,112,251);
  background: transparent;
}
</style>
