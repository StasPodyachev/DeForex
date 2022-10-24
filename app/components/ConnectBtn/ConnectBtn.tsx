import { ConnectButton } from '@rainbow-me/rainbowkit';
export const ConnectBtn = () => {
  return (
    <ConnectButton
      chainStatus="icon"
      showBalance={false}
      accountStatus={{ largeScreen: 'full', smallScreen: "address" }} />
  )
}