import axios from "axios";
import { ethers } from "ethers";
import erc20ABI from "./erc20ABI.json";
import { desiredChainId } from "../../pages/_app.jsx";

let lastTime;
let price = {
  ethereum: {
    usd: 0,
  },
  "usd-coin": {
    usd: 0,
  },
};
export const fetchPrice = async (coin) => {
  if (lastTime && new Date().getTime() - lastTime < 2000) {
    return price;
  }
  try {
    const fetchIt = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coin}%2Cusd-coin&vs_currencies=usd`,
      {}
    );
    price = fetchIt.data;
    lastTime = new Date().getTime();
  } catch (error) {
    console.log("fetch coin price error", error);
  }
  return price;
};

export const USDCToWEIConverter = async (usdcAmount) => {
  const prices = await fetchPrice("ethereum");
  if (prices.ethereum.usd == 0)
    throw new Error("price error in format conversion");
  const ethToUSD = prices?.ethereum.usd;
  const usdcToUSD = prices["usd-coin"].usd;
  const usdcToUSDPrice = +usdcAmount * usdcToUSD;
  const valInEth = usdcToUSDPrice / ethToUSD;
  const parsed = utils.parseEther(valInEth.toString());
  return parsed.toString();
};

const PRODUCTION = process.env.PRODUCTION === "true" ? true : false;

let nftAddress;
let stakeAddress;
let usdcAddress;
let passAddress;
export const tokensAvailable=500;
export const mintClosed=new Date().getTime() > 1678838400000;
export const mintNotStarted = new Date().getTime() < 1677628800000;
let rpcUrl;
if (process.env.PRODUCTION === "true")
  rpcUrl = `https://mainnet.infura.io/v3/${process.env.infura_key}`;
else rpcUrl = `https://goerli.infura.io/v3/${process.env.infura_key}`;
export const RPC_URL=rpcUrl;

if (PRODUCTION) {
  nftAddress = "0x502818ec5767570F7fdEe5a568443dc792c4496b";
  stakeAddress = "0x10a92B12Da3DEE9a3916Dbaa8F0e141a75F07126";
  usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  passAddress ="0x0e4f563103A6c7b624E3017958A9823C7E7dD4F9"
} else {
  nftAddress = "0x98A107e2d232F5b1f63013b22045Eac0605ECb15";
  stakeAddress = "0x158DFe56A8c7c4d8195cbbb7070eFe515Ccefaf0";
  usdcAddress = "0x092232e8a7d6018c5a63dA113229597ce03ec0Ec";
  passAddress ="0x4c95C21179831192D120c93538f19B1b70bdb259"
}
const SFT_LOGIC = "0x1F5352b46D868fb26D97213D229E97B3De65254F";
const SFT_PUBLIC_NFT = "0x5eF95B8676953076779322291a8720a923b86426";
const SFT_ERC_20 = "0x6b48D3467DE7D45de55A3703D12a1005440eDc7b";

export {
  nftAddress,
  stakeAddress,
  usdcAddress,
  SFT_LOGIC,
  SFT_PUBLIC_NFT,
  SFT_ERC_20,
  passAddress
};

const tokenSymbol = "USDC";
const tokenDecimals = 6;
const tokenImage =
  "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png";

export const addTokenFunction = async () => {
  try {
    const wasAdded = await ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: usdcAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: tokenImage,
        },
      },
    });
    if (wasAdded) {
      console.log("Thanks for your interest!");
    } else {
      console.log("Token has not been added");
    }
  } catch (error) {
    console.log(error);
  }
};

export const checkIfWalletIsConnected = async (
  address,
  setEthBalance,
  setUsdcBalance,
  setgetCoinPrice
) => {
  const { ethereum } = window;
  //console.log("address",address);
  
  const provider = new ethers.providers.Web3Provider(ethereum);
  //console.log(provider);
  const signer = provider.getSigner();
  // if (!ethereum) {
  //   console.log("Make sure you have metamask!");
  //   return;
  // }

  let chainId = await ethereum.request({ method: "eth_chainId" });
  console.log("Connected to chain " + chainId);

  if (chainId.slice(2, 3) !== desiredChainId.toString()) {
    console.log(
      "You are not connected to the desiredChainId:" +
        desiredChainId.toString() +
        "==" +
        chainId.slice(2, 3)
    );
    return;
  } else {
    setEthBalance(
      (+ethers.utils.formatEther(await signer.getBalance())).toFixed(3)
    );
    setgetCoinPrice(await fetchPrice("ethereum"));
    const usdcContract = new ethers.Contract(usdcAddress, erc20ABI, signer);
    const decimals = await usdcContract.decimals();
    setUsdcBalance(
      (+ethers.utils.formatUnits(
        await usdcContract.balanceOf(address),
        decimals
      )).toFixed(3)
    ); //.toNumber()  //.toFixed(1)
  }
};


export const CheckWalletStatus = async (address) => {
  const { ethereum } = window;
  ereum.enable();
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  if (!ethereum) {
    console.log("Make sure you have metamask!");
    return;
  }
  let returnObj = {
    ethBalance: 0,
    usdcBalance: 0,
    coinPrice: 0,
  };

  let chainId = await ethereum.request({ method: "eth_chainId" });
  // console.log("Connected to chain " + chainId);

  returnObj.ethBalance = (+ethers.utils.formatEther(
    await signer.getBalance()
  )).toFixed(3);
  returnObj.coinPrice = await fetchPrice("ethereum");

  if (chainId.slice(2, 3) !== desiredChainId.toString()) {
    console.log(
      "You are not connected to the desiredChainId:" +
        desiredChainId.toString() +
        "==" +
        chainId.slice(2, 3)
    );
  } else {
    const usdcContract = new ethers.Contract(usdcAddress, erc20ABI, signer);
    const decimals = await usdcContract.decimals();
    returnObj.usdcBalance = (+ethers.utils.formatUnits(
      await usdcContract.balanceOf(address),
      decimals
    )).toFixed(3); //.toNumber()  //.toFixed(1)
  }
  return returnObj;
};
