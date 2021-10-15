<template>
  <CThemeProvider>
    <Layout  style="background-color: #000">
      <Header/>
      <div class="page-root">
        <div class="right-main">
          <div class="right">
            <Content>
              <Nuxt/>
            </Content>
          </div>
        </div>
      </div>
      <Footer/>
    </Layout>
  </CThemeProvider>
</template>

<script lang="ts">
import {Vue, Component} from 'nuxt-property-decorator'
import {Layout} from 'ant-design-vue'
import Header from '@/components/Header.vue'

import {
  CThemeProvider, CBadge, CButton, CMenu,
  CMenuButton,
  CMenuList,
  CMenuItem,
  CMenuGroup,
  CMenuDivider,
  CMenuOptionGroup,
  CMenuItemOption,
} from '@chakra-ui/vue'

const {Content} = Layout

@Component({
  components: {
    Layout,
    Content,
    Header,
    CThemeProvider,
    CBadge,
    CButton,
    CMenu,
    CMenuButton,
    CMenuList,
    CMenuItem,
    CMenuGroup,
    CMenuDivider,
    CMenuOptionGroup,
    CMenuItemOption,
  }
})
export default class Default extends Vue {
  mounted() {
    if (this.$route.fullPath != '/' && this.$route.fullPath != '/deepdive' && this.$route.fullPath != '/community' && this.$route.fullPath != '/products' && this.$route.fullPath != '/admin' &&
        this.$route.fullPath != '/' && this.$route.fullPath != '/deepdive/' && this.$route.fullPath != '/community/' && this.$route.fullPath != '/products/') {

      if (!this.$accessor.wallet.connected){
        this.$router.push({path: '/connect'})
      }

    }
  }
}
</script>

<style lang="less">

* {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

.ant-layout-content {
  min-height: calc(100vh - 64px);
}

.page-root {
  display: flex;
  flex-direction: row;
  margin: 0;

  .left-ment {
    width: 10%;
    margin-right: 50px;
  }

  .right-main {
    flex: 1;
  }

  .right {
    //background: rgba(0, 0, 0, 0.1);
  }
}

@media (max-width: 37.5rem) {
  .page-root {
    display: flex;
    flex-direction: row;
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";

    div,
    input {
      box-sizing: border-box;
    }

    .left-ment {
      display: none;
    }

    .right-main {
      margin-top: 40px;
    }

    .right {
      width: auto;
    }
  }
}
</style>
