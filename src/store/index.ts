import * as url from './url'
import * as route from './route'
import * as price from './price'
import * as setting from './setting'
import * as wallet from './wallet'
import * as transaction from './transaction'
import * as liquidity from './liquidity'

import { getAccessorType, mutationTree, actionTree } from 'typed-vuex'

import enquireJs from 'enquire.js'

function enquireScreen(call: Function) {
  const handler = {
    match() {
      call && call(true)
    },
    unmatch() {
      call && call(false)
    }
  }

  enquireJs.register('only screen and (max-width: 922.99px)', handler)
}

export const state = () => ({
  isMobile: false
})

export type RootState = ReturnType<typeof state>

export const getters = {}

export const mutations = mutationTree(state, {
  setIsMobile(state, isMobile: boolean) {
    state.isMobile = isMobile
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    queryIsMobile({ commit }) {
      enquireScreen((isMobile: boolean) => commit('setIsMobile', isMobile))
    },

    copy(_vuexContext, text: string) {
      ;(this as any)._vm
        .$copyText(text)
        .then(() => {
          this.$notify.success({
            message: 'Copy success',
            description: ''
          })
        })
        .catch(() => {
          this.$notify.error({
            message: 'Copy failed',
            description: ''
          })
        })
    }
  }
)

// @ts-ignore
// @ts-ignore
// @ts-ignore
// @ts-ignore
export const accessorType = getAccessorType({
  actions,
  getters,
  mutations,
  state,
  modules: {
    url,
    route,
    setting,
    price,
    wallet,
    transaction,
    //@ts-ignore
    liquidity
  }
})
