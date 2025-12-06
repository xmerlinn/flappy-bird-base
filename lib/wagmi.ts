import { http, createConfig, createStorage, cookieStorage } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    // Injected wallets (MetaMask, Rabby, Brave, etc.)
    injected(),
    // Coinbase Wallet - 'all' preference to support both Smart Wallet and EOA
    coinbaseWallet({
      appName: "Flappy Bird",
      preference: "all",
    }),
  ],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [base.id]: http("https://mainnet.base.org"),
  },
});
