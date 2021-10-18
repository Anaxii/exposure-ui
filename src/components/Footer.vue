<template>
  <div class="foot">
    <div style="justify-content: space-between;display: flex;
  flex-direction: unset; margin-left: auto; margin-right: auto;" v-bind:style="{'width': w}">
      <div class="liner">
        <div class="foottext">
          <p>
            Copyright © 2021 Anaxii Ltd |
            All rights reserved.
          </p>
        </div>
      </div>
      <div class="liner" v-if="size != 'small'">
        <p class="headtext">Pages</p>
        <p class="highlight" @click="nav('/')">
          Overview
        </p>
        <p class="highlight" @click="nav('/deepdive')">
          Deep Dive
        </p>
        <p class="highlight" @click="nav('/products')">
          Products
        </p>
        <p class="highlight" @click="nav('/community')">
          Community
        </p>
      </div>
      <div class="liner">
        <p class="headtext">Socials</p>
        <p class="highlight">
          Twitter
        </p>
        <p class="highlight">
          Discord
        </p>
        <p class="highlight">
          Telegram
        </p>
        <p class="highlight">
          Medium
        </p>
      </div>
      <div class="liner" v-if="size != 'small'">
        <p class="headtext">Products</p>
        <p class="highlight" @click="nav('/connect')">
          Exposure Portal
        </p>
        <p class="highlight" style="cursor: not-allowed">
          Exposure Pro
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Icon} from 'ant-design-vue'

import importIcon from '@/utils/import-icon'
import {lt} from '@/utils/safe-math'

export default Vue.extend({
  components: {},
  data() {
    return {
      size: 'large',
      w: '55%'
    }
  },
  model: {},
  updated() {
    if (window.innerWidth < 800) {
      this.size = 'small'
    } else if (window.innerWidth < 1500) {
      this.size = 'medium'
    }
  },

  mounted() {
    if (window.innerWidth < 800) {
      this.size = 'small'
      this.w = '90%'
    } else if (window.innerWidth < 1500) {
      this.size = 'medium'
    }
  },

  methods: {
    nav(page: string) {
      this.$router.push({path: page})
    },
  }
})
</script>

<style lang="less" scoped>
@import '../styles/variables';

.foottext {
  margin-left: 5%;
  margin-right: 25%;
  float: left;
  width: 100%;
  padding-top: 25px;
}

.foot {
  padding-top: 1%;
  background-color: black;
  border-top: 2px solid transparent;
  border-image: rgb(186, 112, 251);
  border-image: linear-gradient(90deg, rgba(186, 112, 251, 1) 0%, rgba(54, 109, 241, 1) 100%);
  border-image-slice: 1;
  padding-bottom: 1%;
  left: 0;
  bottom: 0;
  height: auto;
  width: 100%;
  float: left;
}

.footerlogo {
  width: 50px;
  height: 50px;
  margin-right: 40px;
  border-radius: 50%;
  display: inline-block;
}

@media (max-width: 800px) {
  .foottext {
    font-size: 8px;
  }
}

.liner {
  display: inline
}

.highlight {
  transition: color 0.5s ease;
  border-image: rgb(54, 109, 241);
  cursor: pointer;
}

.headtext {
  color: white;
}

.highlight:hover {
  color: rgb(186, 112, 251) !important;
  transition: color 0.5s ease;
}
</style>
