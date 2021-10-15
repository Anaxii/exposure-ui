// https://github.com/project-serum/serum-ts/blob/master/packages/serum/src/markets.json
// .forEach(m => {if (!m.deprecated) {console.log(`// ${m.name}\n`, `'${m.address}',`)}})

import { MARKETS as SERUM_MARKETS } from '@project-serum/serum/lib/tokens_and_markets'

const MARKETS: Array<string> = []

for (const market of SERUM_MARKETS) {
  const address = market.address.toBase58()
  if (!market.deprecated && !(address in MARKETS)) {
    MARKETS.push(address)
  }
}


export { MARKETS }
