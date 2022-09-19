import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { signIn } from 'next-auth/react';
import { Connector, useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { useRouter } from 'next/router';

const wallets = [
  {
    name: 'Metamask',
    logoPath: '/assets/wallets/metamask.svg',
    connector: new MetaMaskConnector(),
    disabled: false
  },
  {
    name: 'Coinbase Wallet',
    logoPath: '/assets/wallets/coinbase.svg',
    disabled: true,
  },
  {
    name: 'WalletConnect',
    logoPath: '/assets/wallets/walletconnect.svg',
    connector: new WalletConnectConnector({
      options: { rpc: ['https://mainnet.infura.io/v3/84842078b09946638c03157f83405213'] },
    }),
  },
  {
    name: 'Injected',
    logoPath: '/assets/wallets/eth.svg',
    connector: new InjectedConnector(),
  },
];

import Button from '../ui/Button'
import styles from './SignInContent.module.css'
import apiPost from '../../utils/apiPost';


function SignInContent() {
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { push } = useRouter();

  // useEffect(() => {
  //   handleAuth(wallets[2]?.connector,wallets[2]?.disabled)
  // }, [])

  const handleAuth = async (connector?: Connector, disabled?: boolean) => {
    if (disabled) {
      alert('Setup it first in the Authentication.tsx');
      return;
    }

    if (isConnected) {
      await disconnectAsync();
    }

    const { account, chain } = await connectAsync({ connector });

    const userData = { address: account, chain: chain.id, network: 'evm' };

    const { message } = await apiPost('/auth/request-message', userData);

    const signature = await signMessageAsync({ message });

    try {
      await signIn('credentials', { message, signature, redirect: false });
      // redirects to main page
      push('/');
    } catch (e) {
      return;
    }
  };

  return (
    <div className={styles.content}>
      {wallets.map(({ name, logoPath, connector, disabled }) => (
        <div key={name} className={styles.btn}>
          <Button
            logoPath={logoPath}
            title={name}
            onClick={() => handleAuth(connector, disabled)}/>
        </div>))}
    </div>
  )
}

export default SignInContent