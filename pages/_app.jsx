import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, goerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { appWithTranslation } from "next-i18next";
import { MusicProvider } from "../context/music-context";
import { AppContextProvider } from "../context/app-context";
import { ModalsProvider } from "../context/Modals-context";

import {
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { okxWallet } from "../components/OkxWallet";
import { rainbowWeb3AuthConnector } from "../public/helpers/Web3AuthConfig";

const { chains, provider } = configureChains(
  [goerli, mainnet],
  [
    alchemyProvider({ apiKey: "SJZDVSj2V0UuBpLKySEWJh6RrB2fUR2j" }),
    alchemyProvider({ apiKey: "cDk0rvslgdb3cdwTV-RfQXns6BdKXYks" }),
    publicProvider(),
  ]
);
const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({ chains }),
      rainbowWeb3AuthConnector({ chains }),
      okxWallet({ chains }),
      walletConnectWallet({ chains }),
    ],
  },
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider modalSize="compact" chains={chains}>
        <MusicProvider>
          <AppContextProvider>
            <ModalsProvider>
              <Component {...pageProps} />
            </ModalsProvider>
          </AppContextProvider>
        </MusicProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
export default appWithTranslation(MyApp);
