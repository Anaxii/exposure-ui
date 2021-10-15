export interface PricesData {
  [key: string]: number
}

export interface InfoData {
  tvl: number
  volume24h: number
  totalvolume: number
}

export interface PairData {}

export interface NuxtApiInstance {
  getPrices: (coins: string) => Promise<PricesData>
  getInfo: () => Promise<InfoData>
  getPairs: () => Promise<PairData[]>,
  getBondfidaPrices: (coins: string) => Promise<PricesData>
}

export interface Rpc {
  url: string
  weight: number
}

export interface ConfigData {
  success: boolean
  strategy: 'speed' | 'weight'
  rpcs: Rpc[]
}

export interface EpochInfo {}
