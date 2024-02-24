// /* eslint-disable sort-keys-fix/sort-keys-fix */
import { getWalletConnectConnector } from '@rainbow-me/rainbowkit';
import { InjectedConnector } from 'wagmi/connectors/injected';

export const okxWallet = ({ chains }) => {
  // `isOkxWallet` or `isOKExWallet` needs to be added to the wagmi `Ethereum` object
  const isOKXInjected =
    typeof window !== 'undefined' &&
    // @ts-expect-error
    typeof window.okxwallet !== 'undefined';

  const shouldUseWalletConnect = !isOKXInjected;

  return {
    id: 'okx',
    name: 'OKX Wallet',
    iconUrl: '/icons/okx.png',
    iconAccent: '#000',
    iconBackground: '#000',
    downloadUrls: {
      browserExtension:
        'https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge',
      android:
        'https://play.google.com/store/apps/details?id=com.okinc.okex.gp',
      ios: 'https://itunes.apple.com/app/id1327268470?mt=8',
      qrCode: 'https://www.okx.com/web3',
    },
    createConnector: () => {
      const connector = shouldUseWalletConnect
        ? getWalletConnectConnector({ chains })
        : new InjectedConnector({
            chains,
            options: {
              getProvider: () => window.okxwallet,
            },
          });
      const getUri = async () => (await connector.getProvider()).connector.uri;
      return {
        connector,
        mobile: {
          getUri: shouldUseWalletConnect ? getUri : undefined,
        },
        qrCode: shouldUseWalletConnect
          ? {
              getUri,
              instructions: {
                learnMoreUrl: 'https://www.okx.com/web3/'
              },
            }
          : undefined,
        extension: {
          learnMoreUrl: 'https://www.okx.com/web3/',
          instructions: {
            steps: [
              {
                description:
                  'We recommend pinning OKX Wallet to your taskbar for quicker access to your wallet.',
                step: 'install',
                title: 'Install the OKX Wallet extension',
              },
              {
                description:
                  'Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.',
                step: 'create',
                title: 'Create or Import a Wallet',
              },
              {
                description:
                  'Once you set up your wallet, click below to refresh the browser and load up the extension.',
                step: 'refresh',
                title: 'Refresh your browser',
              },
            ],
          },
        },
      };
    },
  };
};
