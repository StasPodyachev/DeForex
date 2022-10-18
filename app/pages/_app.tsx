import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { WagmiConfig, createClient, chain, Chain } from 'wagmi';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../apolloClient'
const goerliChain: Chain = {
  id: 420,
  name: 'Optimistic Ethereum Testnet Goerli',
  network: 'Optimistic Ethereum Testnet Goerli',
  nativeCurrency: {
    decimals: 18,
    name: 'Görli Ether',
    symbol: 'GOR',
  },
  rpcUrls: {
    default: 'https://goerli.optimism.io/',
  },
  testnet: true
}

const client = createClient(
  getDefaultClient({
    appName: 'ConnectKit Next.js demo',
    infuraId: process.env.NEXT_PUBLIC_REACT_APP_INFURA_KEY,
    alchemyId:  process.env.NEXT_PUBLIC_REACT_APP_ALCHEMY_KEY,
    chains: [goerliChain],
  })
);

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps)
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider 
        customTheme={{
          "--ck-font-family": "'Source Code Pro','Poppins', 'sans-serif', 'monospace'"
        }}
      theme="midnight">
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;