import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSigner,
} from "wagmi";
import ModalStory from "./ModalStory";
import ModalWallet from "./ModalWallet";
import { shortenAddress } from "../src/utils/shortenAddress";
import { disableScroll, enableScroll } from "../src/utils/disableScroll";
import {
  useAccountModal,
  useChainModal,
  useConnectModal,
} from "@rainbow-me/rainbowkit";

import { getUser } from "../src/utils/storeFirebase";
import passJSON from "../src/utils/passABI.json";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ClickAwayListener,
  MenuItem,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import {
  mintClosed,
  passAddress,
  tokensAvailable,
  usdcAddress,
} from "../src/utils/web3utils";
import { useContext } from "react";
import { MusicContext } from "../context/music-context";
import { ModalContext } from "../context/Modals-context";
import PropertyModal from "./PropertyModal";
import PassNFTModal from "./PassNFTModal";
import PassModal from "./PassModal";
import { AppContext } from "../context/app-context";
import { ethers } from "ethers";
import erc20ABI from "../src/utils/erc20ABI.json";
import axios from "axios";
import NavMobile from "./NavMobile";

const menuStyles = {
  paddingY: "16px",
  fontFamily: "inherit",
  fontWeight: "600",
  fontSize: "16px",
  lineHeight: "20px",
  width: "100%",
  "&.Mui-disabled": {
    opacity: "0.5",
  },
  "&.MuiButtonBase-root-MuiMenuItem-root": {
    opacity: "0.5",
  },
};

const Navbar = ({ headerBackground, SFTDemo }) => {
  const router = useRouter();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const { openConnectModal } = useConnectModal();
  console.log("address", address);

  const isGoerli = chain?.name == "Goerli";

  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleWallet, setToggleWallet] = useState(false);
  const [verify, setVerify] = useState(false);

  const musicCTX = useContext(MusicContext);
  const modals = useContext(ModalContext);
  const appCTX = useContext(AppContext);

  let chainId = chain?.id;
  let isCorrectChain = true;
  if (process.env.PRODUCTION === "true" && chainId !== 1) {
    isCorrectChain = false;
  } else if (process.env.PRODUCTION === "false" && chainId !== 5) {
    isCorrectChain = false;
  }

  async function getdata() {
    const state = await getUser(address);
    console.log("ver state", state);
    setVerify(state);
  }

  const fetchPrice = async () => {
    try {
      const fetchIt = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cusd-coin&vs_currencies=usd`,
        {}
      );
      return fetchIt.data;
    } catch (error) {
      console.log("fetch coin price error", error);
    }
  };

  const fetchInitialAppData = async () => {
    if (!isCorrectChain || !address || !signer) return;
    const balance = (+ethers.utils.formatEther(
      await signer.getBalance()
    )).toFixed(3);
    console.log("balanceis", balance);
    //await sdk.wallet.balance();
    appCTX.setEthBalance(balance);
    //fetching price
    const price = await fetchPrice();
    appCTX.setCoinPrice(price);
    //fetching usdc balance
    // 6 decimals
    const usdcContract = new ethers.Contract(usdcAddress, erc20ABI, signer);
    const usdc = await usdcContract.balanceOf(address);
    const usdcBalance = ethers.utils.formatUnits(usdc, 6);

    const decimals = await usdcContract.decimals();
    appCTX.setUsdcBalance(usdcBalance);
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!address) return;
      setToggleWallet(false);
      getdata();
    }
    return () => enableScroll();
  }, [address]);

  useEffect(() => {
    if (process.env.PRODUCTION === "true" && chain?.id !== 1) {
      appCTX.setEthBalance(0);
      appCTX.setUsdcBalance(0);
      appCTX.setCoinPrice(0);
      return;
    }
    if (process.env.PRODUCTION === "false" && chain?.id !== 5) {
      appCTX.setEthBalance(0);
      appCTX.setUsdcBalance(0);
      appCTX.setCoinPrice(0);
      return;
    }
    if (address) fetchInitialAppData();
  }, [address, chain?.id, signer]);

  const [openLangMenu, setOpenLangMenu] = useState(false);

  const toggleDrawerHandler = () => {
    setToggleMenu((s) => !s);
  };

  const { t } = useTranslation("common");

  // useEffect(() => {
  //   if (toggleMenu) document.body.style.position = "fixed";
  //   return () => {
  //     document.body.style.position = "relative";
  //   };
  // }, [toggleMenu]);

  useEffect(() => {
    const func = async () => {
      let rpcUrl;
      if (process.env.PRODUCTION === "true")
        rpcUrl = `https://mainnet.infura.io/v3/${process.env.infura_key}`;
      else rpcUrl = `https://goerli.infura.io/v3/${process.env.infura_key}`;

      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const nftContract = new ethers.Contract(
        passAddress,
        passJSON.abi,
        provider
      );

      nftContract
        .currentTokenId()
        .then((res) => {
          let tokensAlreadyMinted = +res.toString();
          appCTX.setTokensAlreadyMinted(tokensAlreadyMinted);
          if (tokensAlreadyMinted >= tokensAvailable) {
            appCTX.setPassNftSoldOut(true);
          } else {
            appCTX.setPassNftSoldOut(false);
          }
        })
        .catch((e) => console.log("infura error", e));
    };
    try {
      func();
    } catch (e) {}
  }, [address, chain?.id]);

  return (
    <>
      {console.log("currentNetwork", typeof chain?.id)}
      <nav
        className={`fixed flex items-center justify-between w-full h-[3.75rem] bg-invar-dark md:h-[5rem] z-50
        ${headerBackground ? "md:bg-invar-dark" : "md:bg-transparent"}`}
      >
        <PropertyModal />
        <PassNFTModal />

        {modals.passBuyModal && <PassModal />}

        <ModalWallet SFTDemo={SFTDemo} verify={verify} />

        <ModalStory />

        <div className="navbar w-full sticky top-0 left-0 right-0 bg-[#fff0] md:justify-center items-center h-[60px] md:h-[88px] flex">
          <div className="navbar-start flex">
            <button
              onClick={() => musicCTX.setIsMusicOn((v) => !v)}
              className="absolute top-[24px] left-[16px] md:hidden"
            >
              <img
                className="h-[20px] w-[20px]"
                src={
                  musicCTX.isMusicOn
                    ? "/icons/ic_music.svg"
                    : "/icons/ic_music_off.svg"
                }
                alt=""
              />
            </button>
            <ul className="list-none md:flex hidden ml-10 text-[#B4B7C0]">
              <li>
                <label
                  htmlFor="my-modal-1"
                  className=" modal-button hover:underline font-semibold text-base cursor-pointer"
                >
                  Storyline
                </label>
              </li>
              {/* <ScrollLink
                activeClass="active"
                offset={-100}
                smooth
                spy
                to="mindmap"
              > */}
              {/* <Link href="invaria2222#mindmapoutside">
                <li className="mx-8 hover:underline font-semibold text-base cursor-pointer">
                  Mindmap
                </li>
              </Link> */}
              {/* </ScrollLink> */}
              <Link href="/media">
                <li className="hover:underline font-semibold text-base cursor-pointer ml-8">
                  News
                </li>
              </Link>
              <a
                href="https://docs.invar.finance/road-to-web3"
                rel="noopener noreferrer"
                target="_blank"
              >
                <li className="hover:underline font-semibold text-base cursor-pointer ml-8">
                  Docs
                </li>
              </a>
            </ul>
          </div>
          <div className="navbar-center">
            <Link href="invaria2222">
              <img
                className="m-6 h-[2.5rem] w-24 xl:w-32 cursor-pointer"
                src="/logo_white.svg"
              />
            </Link>
          </div>
          <div className="navbar-end md:hidden">
            {!toggleMenu && (
              <button
                className=" absolute top-[24px] right-[16px]"
                onClick={() => {
                  setToggleMenu(true);
                  // disableScroll();
                }}
              >
                <img
                  className="h-[20px] w-[20px]"
                  src="/icons/ic_menu.svg"
                  alt=""
                />
              </button>
            )}
            {toggleMenu && (
              <button
                className=" absolute top-[24px] right-[16px]"
                onClick={() => {
                  setToggleMenu(false);
                  setToggleWallet(false);
                  // enableScroll();
                }}
              >
                <img
                  className="h-[20px] w-[20px]"
                  src="/icons/ic_close.svg"
                  alt=""
                />
              </button>
            )}
          </div>
          <div className="navbar-end hidden md:flex flex-row">
            {!address ? (
              <button
                //  htmlFor="my-modal-3"
                onClick={openConnectModal}
                className="btn btn-sm modal-button btn-outline rounded h-[44px] w-[160px] px-[11px] py-[1px] m-[12px] font-semibold text-sm text-white border-[#44334C] normal-case hover:border-none hover:bg-primary "
              >
                {t("connect_wallet")}
              </button>
            ) : (
              // <Profile />
              <>
                <Link href="/dashboard">
                  <button className="btn btn-sm modal-button btn-outline rounded h-[40px] w-[130px] px-[11px] py-[1px] my-[12px] font-semibold text-sm text-white border-[#44334C] normal-case hover:border-none hover:bg-primary ">
                    Dashboard
                  </button>
                </Link>
                <label
                  htmlFor="my-modal-4"
                  className="btn btn-sm modal-button btn-outline rounded h-[40px] w-[148px] px-[11px] py-[1px] m-[12px] font-semibold text-sm text-white border-[#44334C] normal-case hover:border-none hover:bg-primary "
                  style={{ padding: "0" }}
                >
                  {shortenAddress(address)}
                  {SFTDemo && !isGoerli && (
                    <img src="/icons/ic_warning.svg" className="ml-1" alt="" />
                  )}
                  {!SFTDemo && chain?.id != 1 && (
                    <img src="/icons/ic_warning.svg" className="ml-1" alt="" />
                  )}
                </label>
                {/* <div className="mx-4">
                </div> */}
              </>
            )}
            <div className="relative">
              <button
                onClick={() => setOpenLangMenu((v) => !v)}
                className="btn btn-sm btn-outline rounded h-[40px] w-[40px] my-[24px] mr-[12px] px-[4px] py-[4px] font-semibold text-sm text-white border-[#44334C] normal-case hover:border-none hover:bg-primary "
              >
                <img
                  className="h-[20px] w-[20px]"
                  src="/icons/ic_language.svg"
                  alt=""
                />
              </button>

              {openLangMenu && (
                <ClickAwayListener onClickAway={() => setOpenLangMenu(false)}>
                  <div
                    style={{
                      background:
                        "linear-gradient(180deg, #44334C 0%, #1E1722 100%)",
                    }}
                    className="absolute w-36 h-[85px] right-[12px] top-[75px] flex flex-col justify-center rounded"
                  >
                    <MenuItem
                      onClick={() => {
                        setOpenLangMenu(false);
                      }}
                      sx={{
                        color: router.locale === "en" ? "white" : "#8F97A3",
                        fontWeight: router.locale === "en" ? "600" : "400",
                        "& a": {
                          width: "100%",
                        },
                      }}
                    >
                      <Link href={router.pathname} locale="en">
                        English
                      </Link>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setOpenLangMenu(false);
                      }}
                      sx={{
                        color: router.locale === "tw" ? "white" : "#8F97A3",
                        fontWeight: router.locale === "tw" ? "600" : "400",
                        "& a": {
                          width: "100%",
                        },
                      }}
                    >
                      <Link href={router.pathname} locale="tw">
                        繁體中文
                      </Link>
                    </MenuItem>
                  </div>
                </ClickAwayListener>
              )}
            </div>
            <button
              onClick={() => musicCTX.setIsMusicOn((v) => !v)}
              className="btn btn-sm btn-outline rounded h-[40px] w-[40px] my-[24px] mr-[24px] px-[4px] py-[4px] font-semibold text-sm text-white border-[#44334C] normal-case hover:border-none hover:bg-primary "
            >
              <img
                className="h-[20px] w-[20px]"
                src={
                  musicCTX.isMusicOn
                    ? "/icons/ic_music.svg"
                    : "/icons/ic_music_off.svg"
                }
                alt=""
              />
            </button>
          </div>
        </div>
      </nav>
      <NavMobile
        navOpen={toggleMenu}
        closeModal={() => setToggleMenu(false)}
        verify={verify}
        SFTDemo={SFTDemo}
      />
    </>
  );
};

export default Navbar;
