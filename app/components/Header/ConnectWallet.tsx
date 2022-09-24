import Image from "next/image"
import { useEffect, useState } from "react"
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { Connector, useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { signIn } from 'next-auth/react';
import apiPost from '../../utils/apiPost';
import styles from './Nav.module.css'

const wallets = [
  {
    name: 'Metamask',
    logoPath: '/assets/wallets/metamask.svg',
    connector: new MetaMaskConnector(),
    disabled: false
  },
];

const ConnectWallet = () => {
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount()
  const [ newAdress, setNewAdress ] = useState('')

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
    address !== undefined && setNewAdress(`${address?.slice(0, 6)}...${address?.slice(address?.length - 4, address?.length)}`)
  }, [address])

  return (
    !newAdress ?
      <div className={styles.wallet} onClick={() => handleAuth(wallets[0]?.connector)}>
        <span>Connect Wallet</span>
      </div> : 
      <div className={styles.user}>
        <span>{newAdress}</span>
        <Image src="/icons/iconsDashboard/avatar.png" width={24} height={24} alt='wallet'/>
      </div>
  )
}

export default ConnectWallet