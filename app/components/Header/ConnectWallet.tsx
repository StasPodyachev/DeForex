import Image from "next/image"
import { useEffect, useState } from "react"
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { Connector, useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { signIn } from 'next-auth/react';
import apiPost from '../../utils/apiPost';
import styles from './Nav.module.css'
import useWindowSize from "./useWindowSize";
import { useRouter } from "next/router";

const wallets = [
  // {
  //   name: 'WalletConnect',
  //   logoPath: '/assets/wallets/walletconnect.svg',
  //   connector: new WalletConnectConnector({
  //     options: { rpc: ['https://opt-kovan.g.alchemy.com/v2/GAcaN3sfNl9B_d_Ef86aQBa62lh7tCdV'] },
  //   }),
  // },
  {
    name: 'Injected',
    logoPath: '/assets/wallets/metamask.svg',
    connector: new MetaMaskConnector(),
    disabled: false
  },
];

const ConnectWallet = () => {
  const { width } = useWindowSize()
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount()
  const [ newAdress, setNewAdress ] = useState('')
  const { push } = useRouter()

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
    } catch (e) {
      return;
    }
  };

  useEffect(() => {
    if (!(address)) {
      setNewAdress('')
    }
    if (address) {
      address !== undefined && setNewAdress(`${address?.slice(0, 6)}...${address?.slice(address?.length - 4, address?.length)}`)
    }
  }, [address])

  if (!newAdress.length) {
    return (
      <div className={styles.wallet} onClick={() => handleAuth(wallets[0]?.connector)}>
        <span>Connect Wallet</span>
      </div>
    )
  }
  
  return (
      newAdress ?
      <div className={styles.user} onClick={() => push('/dashboard')}>
        <span>{newAdress}</span>
        <Image src="/icons/iconsDashboard/avatar.png" width={24} height={24} alt='wallet'/>
      </div> : null
  )
}

export default ConnectWallet