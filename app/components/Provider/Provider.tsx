import {
  connectorsForWallets,
  getDefaultWallets,
  darkTheme,
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
  AuthenticationStatus
} from '@rainbow-me/rainbowkit';
import { SiweMessage } from 'siwe';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { configureChains, createClient, WagmiConfig, Chain } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
const goerliChain: Chain = {
  id: 420,
  name: 'Goerli Testnet',
  network: 'Optimistic Ethereum Testnet Goerli',
  nativeCurrency: {
    decimals: 18,
    name: 'Görli Ether',
    symbol: 'GOR',
  },
  rpcUrls: {
    default: 'https://goerli.optimism.io/',
  }
}

const mumbaiTesnet: Chain = {
  id: 80001,
  name: 'Mumbai Testnet',
  network: 'Mumbai Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MATIC',
    symbol: 'MATIC',
  },
  rpcUrls: {
    default: 'https://rpc-mumbai.maticvigil.com/',
  }
}

const { provider, chains } = configureChains(
  [goerliChain, mumbaiTesnet],
  [jsonRpcProvider({ rpc: chain => ({ http: chain.rpcUrls.default }) })]
);

const { wallets } = getDefaultWallets({
  appName: 'rainbowkit.com',
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const fetchingStatusRef = useRef(false);
const verifyingRef = useRef(false);
const [authStatus, setAuthStatus] = useState<AuthenticationStatus>('loading');
useEffect(() => {
  const fetchStatus = async () => {
    if (fetchingStatusRef.current || verifyingRef.current) return
    fetchingStatusRef.current = true;
    try {
      const response = await fetch('/api/me');
      const json = await response.json();
      setAuthStatus(json.address ? 'authenticated' : 'unauthenticated');
    } catch (_error) {
      setAuthStatus('unauthenticated');
    } finally {
      fetchingStatusRef.current = false;
    }
  };

  // 1. page loads
  fetchStatus();

  // 2. window is focused (in case user logs out of another window)
  window.addEventListener('focus', fetchStatus);
  return () => window.removeEventListener('focus', fetchStatus);
}, []);

const authAdapter = useMemo(() => {
  return createAuthenticationAdapter({
    getNonce: async () => {
      const response = await fetch('/api/nonce');
      return await response.text();
    },

    createMessage: ({ nonce, address, chainId }) => {
      return new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
      });
    },

    getMessageBody: ({ message }) => {
      return message.prepareMessage();
    },

    verify: async ({ message, signature }) => {
      verifyingRef.current = true;

      try {
        const response = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, signature }),
        });

        const authenticated = Boolean(response.ok);

        if (authenticated) {
          setAuthStatus(authenticated ? 'authenticated' : 'unauthenticated');
        }

        return authenticated;
      } catch (error) {
        return false;
      } finally {
        verifyingRef.current = false;
      }
    },

    signOut: async () => {
      setAuthStatus('unauthenticated');
      await fetch('/api/logout');
    },
  });
}, []);

export function Provider({ children }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitAuthenticationProvider
          adapter={authAdapter}
          status={authStatus}
        >
      <RainbowKitProvider
        showRecentTransactions={true}
        modalSize="compact"
        theme={darkTheme()} chains={chains}>
        {children}
      </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  )
}