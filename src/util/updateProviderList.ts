
import providerList from '../providers.json'
import fs from 'fs'
import axios from "axios";

async function main() {
  let { data: chainData} = await axios('https://chainid.network/chains.json')
  const existingChainIds = new Set(Object.values(providerList).map(i => i.chainId))
  const existingChainNames = new Set(Object.keys(providerList).map(i => i.toLowerCase()))
  chainData = chainData
    .filter((i: any) => i.rpc.length)
    .filter((i: any) => !i.status || i.status === 'active')
    .filter((i: any) => i.shortName)
    .filter((i: any) => !existingChainIds.has(i.chainId))
    .filter((i: any) => !existingChainNames.has(i.shortName.toLowerCase()))
  chainData.forEach((i: any) => {
    i.rpc = i.rpc.filter((j: any) => !/wss:/.test(j))
  })
  const newList = {...providerList} as any
  chainData.forEach((i: any) => {
    newList[i.shortName.toLowerCase()] = {
      rpc: i.rpc,
      chainId: i.chainId
    }
  })
  fs.writeFileSync(__dirname+'/../providers.json', JSON.stringify(newList))
}

main()