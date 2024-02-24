import { createContext, useState } from "react";

const AppContext = createContext({
  address: "",
  setAddress: (val) => {},
  netowk: "",
  setNetwork: (val) => {},
  usdcBalance: 0,
  setUsdcBalance: (val) => {},
  ethBalance: 0,
  setEthBalance: (val) => {},
  coinPrice: 0,
  setCoinPrice: (val) => {},

  passNftSoldOut: false,
  setPassNftSoldOut: () => {},
  tokensAlreadyMinted: 0,
  setTokensAlreadyMinted: () => {},
});
const { Provider } = AppContext;

const AppContextProvider = ({ children }) => {
  const [passNftSoldOut, setPassNftSoldOut] = useState(false);
  const [tokensAlreadyMinted, setTokensAlreadyMinted] = useState(0);
  const [address, setAddress] = useState("");
  const [netowk, setNetwork] = useState("");
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);
  const [coinPrice, setCoinPrice] = useState(0);

  const obj = {
    passNftSoldOut,
    setPassNftSoldOut: (val) => setPassNftSoldOut(val),
    tokensAlreadyMinted,
    setTokensAlreadyMinted: (val) => setTokensAlreadyMinted(val),
    address,
    setAddress: (val) => setAddress(val),
    netowk,
    setNetwork: (val) => setNetwork(val),
    usdcBalance,
    setUsdcBalance: (val) => setUsdcBalance(val),
    ethBalance,
    setEthBalance: (val) => setEthBalance(val),
    coinPrice,
    setCoinPrice: (val) => setCoinPrice(val),
  };

  return <Provider value={obj}>{children}</Provider>;
};

export { AppContext, AppContextProvider };
