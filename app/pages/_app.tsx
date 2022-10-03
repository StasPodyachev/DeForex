import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { WagmiConfig, createClient, chain } from 'wagmi';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';

const client = createClient(
  getDefaultClient({
    appName: 'ConnectKit Next.js demo',
    infuraId: process.env.NEXT_PUBLIC_REACT_APP_INFURA_KEY,
    alchemyId:  process.env.NEXT_PUBLIC_REACT_APP_ALCHEMY_KEY,
    chains: [chain.optimismKovan, chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum, chain.kovan],
  })
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider 
        customTheme={{
          "--ck-font-family": "'Source Code Pro','Poppins', 'sans-serif', 'monospace'"
        }}
      theme="midnight">
        <Component {...pageProps} />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;