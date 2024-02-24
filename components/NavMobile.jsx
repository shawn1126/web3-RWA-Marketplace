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

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ClickAwayListener,
  Dialog,
  MenuItem,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import { AppContext } from "../context/app-context";
import MobileWalletConnect from "./MobileWalletConnect";
import { mintClosed } from "../src/utils/web3utils";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
import { shortenAddress } from "../src/utils/shortenAddress";
import { MusicContext } from "../context/music-context";
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";

const NavMobile = ({ navOpen, verify, SFTDemo, closeModal }) => {
  const [toggleWallet, setToggleWallet] = useState(false);
  const [openLangMenu, setOpenLangMenu] = useState(false);
  const [copyClicked, setCopyClicked] = useState(false);

  const { t } = useTranslation("common");
  const router = useRouter();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const appCTX = useContext(AppContext);
  const musicCTX = useContext(MusicContext);
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const path = router.pathname;

  const toggleDrawerHandler = () => {
    closeModal();
  };
  const isGoerli = chain?.name == "Goerli";
  const { disconnect } = useDisconnect();

  let isCorrectNetwork;
  if (process?.env?.PRODUCTION == "false" && !SFTDemo) {
    if (chain?.id == 5) {
      isCorrectNetwork = true;
    } else {
      isCorrectNetwork = false;
    }
  } else if (process?.env?.PRODUCTION == "false" && SFTDemo) {
    if (chain?.id == 5) {
      isCorrectNetwork = true;
    } else {
      isCorrectNetwork = false;
    }
  } else if (process?.env?.PRODUCTION == "true" && !SFTDemo) {
    if (chain?.id == 1) {
      isCorrectNetwork = true;
    } else {
      isCorrectNetwork = false;
    }
  } else if (process?.env?.PRODUCTION == "true" && SFTDemo) {
    if (chain?.id == 5) {
      isCorrectNetwork = true;
    } else {
      isCorrectNetwork = false;
    }
  }
  let navHeight = 800;
  if (address && isCorrectNetwork) {
    navHeight = 860;
  } else if (address && !isCorrectNetwork) {
    navHeight = 900;
  } else if (!address) {
    navHeight = 640;
  }
  const copyAddressHandler = () => {
    setCopyClicked(true);
    navigator.clipboard.writeText(address);
    setTimeout(() => {
      setCopyClicked(false);
    }, 1500);
  };

  return (
    <Dialog
      fullScreen
      sx={{
        "& .MuiDialog-container": {
          justifyContent: "right",
        },
        "& .MuiDialog-paper": {
          marginBottom: "0px",
          marginLeft: "0px",
          minHeight: { xs: "100vh" },
          height: "100%",
          background: "linear-gradient(180deg, #44334C 0%, #1E1722 100%)",
          maxWidth: {
            xs: "100%",
          },
          width: {
            xs: "100%",
          },
        },
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0,0,0,0.7)",
        },
        "& .MuiDialog-container": {
          // alignItems:"flex-start"
          justifyContent: "flex-end",
          alignItems: "flex-start",
        },
      }}
      open={navOpen}
    >
      <div className="relative">
        <div className=" w-full sticky top-0 left-0 right-0 bg-[#fff0] md:justify-center items-center flex bg-invar-dark z-20 min-h-[60px]">
          <div className="navbar-start flex">
            <button
              onClick={() => musicCTX.setIsMusicOn((v) => !v)}
              className="absolute top-[22px] left-[16px] md:hidden"
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
              <Link href="invaria2222#mindmapoutside">
                <li className="mx-8 hover:underline font-semibold text-base cursor-pointer">
                  Mindmap
                </li>
              </Link>
              {/* </ScrollLink> */}
              <Link href="/media">
                <li className="hover:underline font-semibold text-base cursor-pointer">
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
                className="h-[2.5rem] w-24 xl:w-32 cursor-pointer"
                src="/logo_white.svg"
              />
            </Link>
          </div>
          <div className="navbar-end md:hidden">
            {!navOpen && (
              <button
                className=" absolute top-[22px] right-[16px]"
                onClick={() => {
                  closeModal();
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
            {navOpen && (
              <button
                className=" absolute top-[22px] right-[16px]"
                onClick={() => {
                  setToggleWallet(false);
                  closeModal();
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
              <label
                htmlFor="my-modal-3"
                className="btn btn-sm modal-button btn-outline rounded h-[40px] w-[130px] px-[11px] py-[1px] m-[12px] font-semibold text-sm text-white border-[#44334C] normal-case hover:border-none hover:bg-primary "
              >
                {t("connect_wallet")}
              </label>
            ) : (
              <>
                {console.log("verify", verify)}
                <Link href="/dashboard">
                  <button className="btn btn-sm modal-button btn-outline rounded h-[40px] w-[130px] px-[11px] py-[1px] my-[12px] font-semibold text-sm text-white border-[#44334C] normal-case hover:border-none hover:bg-primary ">
                    Dashboard
                    {verify == "Unverified" && (
                      <img
                        src="/icons/ic_warning.svg"
                        className="ml-1"
                        alt=""
                      />
                    )}
                  </button>
                </Link>
                <label
                  htmlFor="my-modal-4"
                  className="btn btn-sm modal-button btn-outline rounded h-[40px] w-[148px] px-[11px] py-[1px] m-[12px] font-semibold text-sm text-white border-[#44334C] normal-case hover:border-none hover:bg-primary "
                >
                  {shortenAddress(address)}
                  {SFTDemo && !isGoerli && (
                    <img src="/icons/ic_warning.svg" className="ml-1" alt="" />
                  )}
                  {!SFTDemo && chain?.id != 1 && (
                    <img src="/icons/ic_warning.svg" className="ml-1" alt="" />
                  )}
                </label>
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
        <div
          className={`nav-mobile-link w-full pt-4  flex flex-col justify-start items-start md:hidden text-white bg-gradient-to-b from-primary to-[#1E1722] overflow-scroll min-h-[${navHeight}px]`}
          style={{ minHeight: `${navHeight}px` }}
        >
          <MenuItem
            sx={{
              ...menuStyles,
              fontSize: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
            onClick={() => {
              closeModal();
              if (verify == "Unverified") {
                router.push({
                  pathname: "/dashboard",
                  query: { kyc: true },
                });
              } else router.push("/dashboard");
            }}
          >
            <div className="flex">
              Dashboard
              {verify == "Unverified" && (
                <img src="/icons/ic_warning.svg" className="ml-2.5" alt="" />
              )}
            </div>
          </MenuItem>

          <div className="px-4 w-full mb-2.5">
            <div className=" border-b border-[#37293E] w-full"></div>
          </div>
          <p className="font-normal text-xs leading-4 text-neutral ml-4">
            {t("menu")}
          </p>
          <Link href="/rwa-reflector">
            <MenuItem sx={menuStyles} onClick={toggleDrawerHandler}>
              RWA REFLECTOR
            </MenuItem>
          </Link>
          {!appCTX.passNftSoldOut && !mintClosed && (
            <Link href={"/pass-nft"} className="w-full">
              <div className="w-full">
                <MenuItem
                  sx={{ ...menuStyles, color: "#00DEAE" }}
                  onClick={toggleDrawerHandler}
                >
                  PASS: InVariant Mint
                </MenuItem>
              </div>
            </Link>
          )}
          <Link href={"/sftdemo"} className="w-full text-[#FFC25F]">
            <MenuItem
              sx={{ ...menuStyles, color: "#FFC25F" }}
              onClick={toggleDrawerHandler}
            >
              {" "}
              SFT Demo
            </MenuItem>
          </Link>

          <Link href="invaria2222#mindmapoutside">
            <MenuItem sx={menuStyles} onClick={toggleDrawerHandler}>
              Mindmap
            </MenuItem>
          </Link>
          <label htmlFor="my-modal-1" className="w-full">
            <MenuItem sx={menuStyles} onClick={toggleDrawerHandler}>
              Storyline
            </MenuItem>
          </label>
          <Link href="/media">
            <MenuItem onClick={toggleDrawerHandler} sx={menuStyles}>
              News
            </MenuItem>
          </Link>

          <MenuItem onClick={toggleDrawerHandler} sx={menuStyles}>
            <a
              href="https://docs.invar.finance/road-to-web3"
              rel="noopener noreferrer"
              target="_blank"
            >
              Docs
            </a>
          </MenuItem>

          <div className="px-4 w-full mb-2.5">
            <div className=" border-b border-primary w-full"></div>
          </div>
          <p className="font-normal text-xs leading-4 text-neutral ml-4">
            {t("setting")}
          </p>
          <div className="language-accordion">
            <Accordion
              sx={{
                backgroundColor: "transparent",
                color: "white",
                width: "100%",
              }}
              elevation={0}
            >
              <AccordionSummary>
                <Typography sx={{ fontWeight: "600" }}>
                  {" "}
                  {t("language")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <MenuItem
                    sx={{
                      ...menuStyles,
                      color: router.locale === "en" ? "white" : "#B4B7C0",
                    }}
                    onClick={toggleDrawerHandler}
                  >
                    <Link href={router.pathname} locale="en">
                      English
                    </Link>
                  </MenuItem>
                  <MenuItem
                    sx={{
                      ...menuStyles,
                      color: router.locale === "tw" ? "white" : "#B4B7C0",
                    }}
                    onClick={toggleDrawerHandler}
                  >
                    <Link href={router.pathname} locale="tw">
                      繁體中文
                    </Link>
                  </MenuItem>
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="px-4 w-full mt-4">
            {!address && (
              <button
                className="btn connect-btn btn-primary w-full h-[48px] font-semibold text-base bg-invar-main-purple rounded text-center normal-case	text-white mb-6"
                // onClick={() => setToggleWallet(true)}
                onClick={openConnectModal}
              >
                {t("connect_wallet")}
              </button>
            )}

            {address && (
              <>
                <div className="w-full flex flex-row justify-between items-end">
                  <h3 className="text-base font-semibold text-white pt-[16px]">
                    My Wallet
                  </h3>
                  <div
                    className="flex cursor-pointer"
                    onClick={copyAddressHandler}
                  >
                    <Image
                      src={copyClicked ? "/copied.svg" : "/copy_icon.svg"}
                      width={18}
                      height={18}
                    />
                    <h3 className="text-sm ml-2 font-semibold text-white text-end">
                      {shortenAddress(address)}
                    </h3>
                  </div>
                </div>
                <div className=" border-b border-primary mt-3 w-[324px]"></div>
                <div className=" w-full mt-[14px] flex justify-between items-center ">
                  <div className=" flex justify-center items-center text-white font-semibold">
                    <img
                      className="h-[32px] w-[32px] mr-[12px]"
                      src="/icons/ic_eth.png"
                      alt=""
                    />
                    <p>ETH</p>
                  </div>

                  {appCTX.ethBalance && (
                    <div className=" flex flex-col justify-center items-end text-white font-semibold">
                      <p>{(+appCTX.ethBalance).toFixed(3)}</p>
                      <p className=" text-sm font-normal text-neutral">
                        $
                        {(
                          +appCTX.ethBalance * +appCTX.coinPrice?.ethereum?.usd
                        ).toFixed(3)}{" "}
                        USD
                      </p>
                    </div>
                  )}
                </div>
                <div className=" w-full mt-[14px] flex justify-between items-center ">
                  <div className=" flex justify-center items-center text-white font-semibold">
                    <img
                      className="h-[32px] w-[32px] mr-[12px]"
                      src="/icons/ic_usdc.png"
                      alt=""
                    />
                    <p>USDC</p>
                  </div>
                  <div className=" flex flex-col justify-center items-end text-white font-semibold">
                    {appCTX.usdcBalance && (
                      <p className=" text-base">
                        {(+appCTX.usdcBalance).toFixed(3)}
                      </p>
                    )}
                    {appCTX.coinPrice && (
                      <p className=" text-sm font-normal text-neutral">
                        $
                        {(
                          +appCTX.usdcBalance *
                          +appCTX.coinPrice["usd-coin"].usd
                        ).toFixed(3)}{" "}
                        USD
                      </p>
                    )}
                  </div>
                </div>

                {/* {!isGoerli && SFTDemo && address && (
                  <button
                    className="btn bg-invar-error relative w-full h-[56px] mt-5 rounded flex justify-center items-center border-none normal-case"
                    onClick={() => switchNetwork?.(5)}
                  >
                    <p className=" font-semibold text-white">
                      {t("click_switch")}
                    </p>
                  </button>
                )} */}
                {/* {chain?.id != 1 && !SFTDemo && address && (
                  <button
                    className="btn bg-invar-error relative w-full h-[56px] mt-5 rounded flex justify-center items-center border-none normal-case"
                    onClick={() => switchNetwork?.(1)}
                  >
                    <p className=" font-semibold text-white">
                      {t("click_eth")}
                    </p>
                  </button>
                )} */}

                {process.env.PRODUCTION == "true" &&
                  !SFTDemo &&
                  chain.id !== 1 && (
                    <button
                      className="btn bg-invar-error relative w-full h-[56px] mt-5 rounded flex justify-center items-center border-none normal-case"
                      onClick={openChainModal}
                    >
                      <p className=" font-semibold text-white">
                        {t("click_eth")}
                      </p>
                    </button>
                  )}
                {process.env.PRODUCTION == "false" &&
                  !SFTDemo &&
                  chain.id !== 5 && (
                    <button
                      className="btn bg-invar-error relative w-full h-[56px] mt-5 rounded flex justify-center items-center border-none normal-case"
                      onClick={openChainModal}
                    >
                      <p className=" font-semibold text-white">
                        Switch to goerli
                      </p>
                    </button>
                  )}
                {SFTDemo && chain.id !== 5 && (
                  <button
                    className="btn bg-invar-error relative w-full h-[56px] mt-5 rounded flex justify-center items-center border-none normal-case"
                    onClick={openChainModal}
                  >
                    <p className=" font-semibold text-white">
                      {t("click_switch")}
                    </p>
                  </button>
                )}

                <button
                  className="btn btn-primary relative w-full h-[56px] mb-6 mt-[14px] rounded flex justify-center items-center border-none normal-case"
                  onClick={() => disconnect()}
                >
                  <p className=" font-semibold text-white">
                    {" "}
                    {t("disconnect")}
                  </p>
                </button>
              </>
            )}
          </div>
        </div>
        {toggleWallet && !address && (
          <>
            <MobileWalletConnect setToggleWallet={(e) => setToggleWallet(e)} />
          </>
        )}
      </div>
    </Dialog>
  );
};

export default NavMobile;
