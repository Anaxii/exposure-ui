<template>
  <div>
    <div :style="{'padding-bottom': '5%'}" class="app">
      <div v-bind:style="{'margin-left': 'auto','margin-right': 'auto'}">
        <div style=" position: absolute; top: 50%; left: 0; right: 0; margin: 0 !important">

          <div style="position: relative">
            <!--            <-->
            <div class="main"></div>
            <h2 class="head fade-in-text-main" style="text-align: center;line-height: 0 !important">EXPOSURE</h2>
            <h2 class="fade-in-text-main"
                style="font-size: 3.373vw; line-height: 0.2;text-align: center;padding: 0 !important; margin: 0 !important">
              INCREASE EXPOSURE, DECREASE RISK</h2>
            <div v-if="this.size != 'small'" class="scrolldiv">
              <div class='scrolldown' style="--color: white">
              </div>
            </div>

          </div>
        </div>
        <div v-bind:style="{'width': minorWidth}"
             style="margin-left: auto;margin-right:auto; margin-top: 100vh; margin-bottom: 20vh">
          <h2 class="head" v-bind:style="{'font-size': headerSize, 'text-align':'left'}">Simplify your investment
            strategy.</h2>
          <h3 class="subhead" style="text-align: left">
            Exposure has designed the worlds first <strong class="underlinehighlight">Automated
            Crypto ETF</strong>, making it easy for long-term investors to gain
            exposure to the overall cryptocurrency market. All shares are mintable, redeemable, tradeable, and represent
            real underlying assets.
          </h3>
          <div style="width: 25%;margin-right: auto;border-radius: 15px" v-if="size != 'small'">
            <button class="arrowbtn" style="cursor: not-allowed">Coming Soon</button>
          </div>
          <div style="width: 50%; margin-left: auto; margin-right: auto;margin-top: 15vh" v-if="size != 'small'">
            <img src="../assets/bkgd/2.svg"/>
          </div>

        </div>
        <div style="margin-left: auto;margin-right:auto;margin-top: 2.5vh; padding-bottom: 15px"
             v-bind:style="{'width': minorWidth}">
          <h2 class="head" v-bind:style="{'font-size': headerSize, 'text-align':'left'}">Borrow from your
            investment.</h2>
          <h3 class="subhead" style="text-align: left">
            Owners of Exposure shares have access to a credit line that allows users to borrow against their shares with
            low interest.
          </h3>


        </div>
        <div style="width: 50%; margin-left: auto;margin-right: auto;">
          <div class="joinus" v-if="this.size == 'large'">
            <div style="width: 20%;margin-right: auto; float: left">
              <a href="/" class="brand"><img style="width: 120px;" src="@/assets/icons/white_logo.png"
                                             alt="brand"/></a>
            </div>
            <div style="height: 100%;width: 50%;margin-right: auto; float: left">
              <p style="text-align: left;padding-top: 45px;font-size: 35px;line-height: 0;margin-bottom: 20px"><strong>Join
                the Community</strong></p>
              <p style="text-align: left;"><strong>Become one of the very first cETF investors</strong></p>
            </div>
            <a href="https://t.me/exposurefi" target="_blank">
              <div style="width: 20%; margin-left: auto;margin-right: 7.5%;margin-top: 35px;">
                <button class="joinbtn bouncy" @mouseover="$event.target.classList.remove('bouncy')"
                        @mouseout="removeBounce"><strong>Join</strong></button>
              </div>
            </a>
          </div>
        </div>

        <!--        <div v-else>-->
        <!--          <div style="margin-left: auto; margin-right: auto">-->
        <!--            <h2 style="text-align: center;font-size: 40px; margin-bottom: 0">Join the Community</h2>-->
        <!--            <h3 style="text-align: center;font-size: 20px">Become one of the very first ACTF investors</h3>-->
        <!--            <a href="https://t.me/pareafinance" target="_blank">-->
        <!--              <div style="width: 100%; margin-left: auto;margin-top: 35px;">-->
        <!--                <button class="joinbtn bouncy" v-bind:name="test"-->
        <!--                        @mouseover="$event.target.classList.remove('bouncy')"-->
        <!--                        @mouseout="removeBounce"><strong>Click Here</strong></button>-->
        <!--              </div>-->
        <!--            </a>-->
        <!--          </div>-->
        <!--        </div>-->
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
      size: 'large',
      mainWidth: '70%',
      minorWidth: '50%',
      headerSize: '60px',
      featureSize: '20px',
      windowHeight: window.innerHeight,
      txt: '',

    }
  },

  head: {
    title: 'Exposure'
  },

  computed: {},

  watch: {},

  updated() {
    if (window.innerWidth < 800) {
      this.size = 'small'
      this.minorWidth = '90%'
      this.headerSize = '30px'
      this.mainWidth = '100%'
      this.featureSize = '14px'
    } else if (window.innerWidth < 1500) {
      this.size = 'medium'
    }
  },

  mounted() {
    if (window.innerWidth < 800) {
      this.size = 'small'
    } else if (window.innerWidth < 1500) {
      this.size = 'medium'
    }
  },

  methods: {
    nav(page: string) {
      this.$router.push({path: page})
    },
    removeBounce() {
      // if (event.relatedTarget.toString() != "[object HTMLElement]" && event.relatedTarget.toString() != "[object HTMLButtonElement]") {
      // event.target.classList.add('bouncy')
    }
  },

  // isMobile() {
  //   if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.outerWidth < 600) {
  //     return true
  //   } else {
  //     return false
  //   }
  // },

  // nav(url: string) {
  //   this.$router.push({path: url})
  // }
  // }
})
</script>


<style lang="less" scoped>

.featureTitle {
  font-size: 40px;
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

.feature {
  padding-top: 10px;
  margin-left: 25px;
  margin-right: 25px;
  flex: 1 1 0px;
  text-align: center;
  border-radius: 15px;
  background-color: #050505;
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
  box-shadow: 0 4px 6px -6px #a5a5a5;
}

.feature:hover {
  background-color: #131313;
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
  cursor: default;
  box-shadow: 4px 4px 6px -6px #e5e5e5;

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

.arrowbtn {
  display: block;
  height: 45px;
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
  cursor: pointer;
}

.arrowbtn:hover {
  width: 100%;
  color: rgb(186, 112, 251);
  border: 3px solid rgb(186, 112, 251);
  background: transparent;
}

.underlinehighlight {
  border-bottom: 2px solid transparent;
  border-image: rgb(54,109,241);
  border-image: linear-gradient(90deg, rgba(54,109,241,1) 0%, rgba(186,112,251,1) 100%);
  border-image-slice: 1;
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
    font-size: 18px;
    margin-bottom: 0;
  }


  .feature {
    padding-bottom: 10px !important;
    margin-bottom: 20px;
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

.fade-in-text-main {
  color: white;
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
  100% {
    opacity: 1;
  }
}

@-moz-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-webkit-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-o-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-ms-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.fade-in-text2 {
  color: white;
  animation: fadeIn linear 3s;
  -webkit-animation: fadeIn linear 3s;
  -moz-animation: fadeIn linear 3s;
  -o-animation: fadeIn linear 3s;
  -ms-animation: fadeIn linear 3s;
}

@keyframes fadeIn2 {
  0% {
    opacity: 0;
  }
  50% {
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
  50% {
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
  50% {
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
  50% {
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
  50% {
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

</style>
