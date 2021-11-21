<template>
  <div>
    <div class="site-header">
      <div style="width: 15% !important;display: inline-block;padding-left: 5%">
        <a v-if="this.size !== 'small'" href="/" class="brand">
          <img style="height: 30px" src="../assets/icons/main_logo.png" alt=""/>
        </a>
      </div>
      <div
          v-if="this.$route.fullPath === '/' || this.$route.fullPath === '/deepdive' || this.$route.fullPath === '/community' || this.$route.fullPath === '/products' ||
        this.$route.fullPath === '/' || this.$route.fullPath === '/deepdive/' || this.$route.fullPath === '/community/' || this.$route.fullPath === '/products/' || this.$route.fullPath === '/connect/'  || this.$route.fullPath == '/connect'"
          style="width: 350px !important; justify-content: space-between;display: flex;align-items: center;flex-direction: unset;">
        <p v-if="this.$route.fullPath === '/'" class="antihighlight">Overview</p>
        <p class="highlight" v-else style="display: inline;color: rgb(166 166 166);cursor: pointer" @click="nav('/')">
          Overview
        </p>
        <p v-if="this.$route.fullPath === '/deepdive' || this.$route.fullPath === '/deepdive/'" class="antihighlight">
          Deep Dive
        </p>
        <p class="highlight" @click="nav('/deepdive')" v-else v-chakra="{':hover': { textColor: '#3fbbfe'},':focus': { fontColor: '#3fbbfe'}}">
          Deep Dive
        </p>
        <p v-if="this.$route.fullPath === '/products' || this.$route.fullPath === '/products/'" class="antihighlight">
          Products
        </p>
        <p class="highlight" @click="nav('/products')" v-else v-chakra="{':hover': { textColor: '#3fbbfe'},':focus': { fontColor: '#3fbbfe'}}">
          Products
        </p>

        <p v-if="this.$route.fullPath === '/community' || this.$route.fullPath === '/community/'" class="antihighlight">
          Community
        </p>
        <p class="highlight" @click="nav('/community')" v-else v-chakra="{':hover': { textColor: '#3fbbfe'},':focus': { fontColor: '#3fbbfe'}}">
          Community
        </p>

      </div>
      <div v-else style="width: 275px !important; justify-content: space-between;display: flex;align-items: center;flex-direction: unset;">
        <p v-if="this.$route.fullPath === '/portfolio' || this.$route.fullPath === '/portfolio/'" class="antihighlight">
          Portfolio
        </p>
        <p class="highlight" v-else @click="nav('/portfolio')">
          Portfolio
        </p>
        <!--        <p v-if="this.$route.fullPath == '/stats' || this.$route.fullPath == '/stats/'" class="antihighlight">ETF Stats</p>-->
        <!--        <p class="highlight" v-else style="display: inline;color: rgb(166 166 166);cursor: pointer" @click="nav('/stats')">-->
        <!--          ETF Stats</p>-->
<!--        <p v-if="this.$route.fullPath === '/purchase' || this.$route.fullPath === '/purchase/'" class="antihighlight">-->
<!--          Purchase-->
<!--        </p>-->
<!--        <p class="highlight" @click="nav('/purchase')" v-else v-chakra="{':hover': { textColor: '#3fbbfe'},':focus': { fontColor: '#3fbbfe'}}">-->
<!--          Purchase-->
<!--        </p>-->
<!--        <p v-if="this.$route.fullPath === '/create' || this.$route.fullPath === '/create/'" class="antihighlight">-->
<!--          Create-->
<!--        </p>-->
<!--        <p class="highlight" @click="nav('/create')" v-else v-chakra="{':hover': { textColor: '#3fbbfe'},':focus': { fontColor: '#3fbbfe'}}">-->
<!--          Create-->
<!--        </p>-->
<!--        <p v-if="this.$route.fullPath === '/redeem' || this.$route.fullPath === '/redeem/'" class="antihighlight">-->
<!--          Redeem-->
<!--        </p>-->
<!--        <p class="highlight" @click="nav('/redeem')" v-else v-chakra="{':hover': { textColor: '#3fbbfe'},':focus': { fontColor: '#3fbbfe'}}">-->
<!--          Redeem-->
<!--        </p>-->
<!--        <p v-if="this.$route.fullPath === '/faucet' || this.$route.fullPath === '/faucet/'" class="antihighlight">-->
<!--          Faucet-->
<!--        </p>-->
<!--        <p class="highlight" @click="nav('/faucet')" v-else v-chakra="{':hover': { textColor: '#3fbbfe'},':focus': { fontColor: '#3fbbfe'}}">-->
<!--          Faucet-->
<!--        </p>-->

      </div>

      <div
          v-if="this.$route.fullPath === '/' || this.$route.fullPath === '/deepdive' || this.$route.fullPath === '/community' || this.$route.fullPath === '/products' ||
        this.$route.fullPath === '/' || this.$route.fullPath === '/deepdive/' || this.$route.fullPath === '/community/' || this.$route.fullPath === '/products/' "
          style="width: 15%">
        <div class="wrapper">
          <div class="link_wrapper">
            <a class="arrowbtn" @click="nav('/connect')">Launch App</a>
          </div>
        </div>
      </div>
      <div v-else style="width: 15%;border-left: 1px solid white; height: 100%;cursor: pointer;">
        <div @click="$accessor.wallet.openModal" v-if="!this.$accessor.wallet.connected">
          <div style="margin-left: 15px;margin-top: 10px; width: 100%;float: left">
            <Wallet/>
            <p style="font-size: 10px"><span style="background-color: #cf1111;margin-right: 6px"
                                             class="dot"></span><strong>&nbsp;&nbsp;Not Connected</strong></p>
            <p style="font-size: 10px">
              <font-awesome-icon :icon="['fas', 'chevron-down']"/>
              Connect Wallet
            </p>
          </div>
        </div>
        <div @click="$accessor.wallet.openModal"
             style="width: 200px;border-left: 1px solid white; height: 100%;cursor: pointer;"
             v-if="this.$accessor.wallet.connected">
          <div style="margin-left: 15px;margin-top: 10px; width: 100%;float: left">
            <Wallet/>
            <p style="font-size: 10px"><span style="background-color: #28775a;margin-right: 6px"
                                             class="dot"></span><strong>&nbsp;&nbsp;Connected</strong></p>
            <p style="font-size: 10px">
              <font-awesome-icon :icon="['fas', 'chevron-down']"/>
              Disconnect Wallet
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  components: {},

  data() {
    return {
      open: false,
      size: 'large',
      account: false,
      selectedNav: '' as string,
      isMobile: false
    }
  },

  mounted() {
    if (window.innerWidth < 800) {
      this.size = 'small'
    } else if (window.innerWidth < 1500) {
      this.size = 'medium'
    }
  },

  updated() {
    if (window.innerWidth < 800) {
      this.size = 'small'
    } else if (window.innerWidth < 1500) {
      this.size = 'medium'
    }
  },

  methods: {
    setOpen() {
      this.open = !this.open
    },
    nav(url: string) {
      this.$router.push({path: url})
    },
  }
})
</script>

<style lang="less" scoped>
@import '../styles/variables';
/* stylelint-disable */

* {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";

}

.loginbtn {
  background: rgb(54, 109, 241);
  border-radius: 5px;
  height: 80%;
  width: 50%;
  font-size: 14px;
  opacity: 1;
  cursor: pointer;
  color: #fff;
  border: 2px solid white;
  transition: background-color 0.5s ease;

}

.loginbtn:hover {
  transition: background-color 0.5s ease;
  background-color: #ba70fb;
  //border: 2px solid #2c2d30;

}

.highlight {
  transition: color 0.5s ease;
  display: inline;
  color: rgb(166 166 166);
  cursor: pointer
}

.highlight:hover {
  color: #ffffff !important;
  transition: color 0.5s ease;
}

div {
  display: flex;
  flex-direction: column;
}

input,
textarea,
div,
view {
  box-sizing: border-box;
}

.site-header {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: unset;
  overflow: hidden;
  position: fixed;
  top: 0;
  z-index: 1;
  background-color: #000000 !important;
  box-shadow: 0 4px 6px -6px #626262;
}

.loading-wrap-wrap {
  .loading-wrap {
    position: fixed;
    top: 16px;
    right: 30px;
    color: #fff;
    border-radius: 20px;
    padding: 5px 20px 5px 20px;
    box-shadow: inset 0 0 10px 5px #000;
    flex-direction: row;

    // border       : 1px solid #82C44D;
    // box-shadow      : inset 0 0 10px 5px #000;
    // border-radius: 20px;
    align-items: center;

    .loading-text {
      margin-left: 10px;
      display: inline-block;
      font-size: 14px;
    }
  }
}

.antihighlight {
  display: inline;
  color: #fff;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  border-image: rgb(54, 109, 241);
  border-image: linear-gradient(90deg, rgba(186, 112, 251, 1) 0%, rgba(54, 109, 241, 1) 100%);
  border-image-slice: 1;
}

.header {
  width: 100%;
  background-color: #2c2d30;
  border-bottom: 1px solid white;
  border-image-slice: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .child {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    // padding-left   : 192px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1;
    position: relative;

    .logoText {
      font-size: 50px;
      color: #fff;
      background: none;
      position: relative;
      left: -70px;
    }

    .logo {
      width: 120px;
      // height: 37px;
      position: relative;
      left: -70px;
      margin-right: 5px;
    }

  }
}

@media (max-width: 1280px) {
  .logo {
    //left: 0 !important;
  }

  .loading-wrap-wrap {
    .loading-wrap {
      position: fixed;
      top: 86px;
      right: 10px;
      color: #fff;
      z-index: 9999999;
      background: #000;
    }
  }
}

.announcement {
  display: inline-block;
  height: 28px;
  text-align: center;
  width: 100%;
  background: rgb(186, 112, 251);
  background: linear-gradient(90deg, rgba(186, 112, 251, 1) 0%, rgba(54, 109, 241, 1) 100%);
  color: white;
  margin-top: 50px;
  padding: 0;
  vertical-align: middle;
  font-size: 0.8em;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
}

.announcement a {
  color: #ffffff;
}

.announcement a:hover {
  color: #ccc;
}

.wrapper {
  width: 50%;
}

.link_wrapper {
  position: relative;
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
