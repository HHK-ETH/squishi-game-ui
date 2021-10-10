import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

const POLLING_INTERVAL = 12000
const RPC_URLS: { [chainId: number]: string } = {
    1: 'https://polygon-mainnet.g.alchemy.com/v2/hpZ8Nnnjhr2UZj2J3ey57Ej7tIyc3e8-',
}

export const injected = new InjectedConnector({ supportedChainIds: [137] })

export const walletconnect = new WalletConnectConnector({
    rpc: { 137:  RPC_URLS[1] },
    qrcode: true,
    pollingInterval: POLLING_INTERVAL
})