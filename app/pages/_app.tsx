
import '../styles/globals.css'
import { createClient, configureChains, defaultChains, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { SessionProvider } from 'next-auth/react';
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../apolloClient'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
const { provider, chains } = configureChains(defaultChains, [publicProvider()]);
const client = createClient({
  provider,
  autoConnect: true,
  connectors: [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
  ],
});

function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps)
  return (
    <WagmiConfig client={client}>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}

export default MyApp;