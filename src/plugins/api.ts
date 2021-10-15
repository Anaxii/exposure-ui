import {Plugin} from '@nuxt/types'
import {NuxtApiInstance} from '@/types/api'

const apiPlugin: Plugin = (ctx, inject) => {
    const api: NuxtApiInstance = {
        getPrices: (coins) =>
            ctx.$axios.get('https://api.raydium.io/coin/price', {
                params: {
                    coins
                }
            }),
        getInfo: () => ctx.$axios.get('https://api.raydium.io/info'),
        getPairs: () => ctx.$axios.get('https://api.raydium.io/pairs'),
        getBondfidaPrices: (coin) => ctx.$axios.get('https://serum-api.bonfida.com/trades/' + coin)

    }

    ctx.$api = api
    inject('api', api)
}

export default apiPlugin
