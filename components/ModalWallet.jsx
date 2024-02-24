import React, { useContext, useState } from "react";
import { shortenAddress } from "../src/utils/shortenAddress";
import { addTokenFunction } from "../src/utils/web3utils";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { AppContext } from "../context/app-context";
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";

import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi";
import { Link } from "@mui/material";
import Image from "next/image";

const ModalWallet = ({ SFTDemo, verify }) => {
  const [copyClicked, setCopyClicked] = useState(false);

  const { t } = useTranslation("common");
  const router = useRouter();
  const appCTX = useContext(AppContext);

  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const { chain } = useNetwork();

  const copyWalletAddress = () => {
    setCopyClicked(true);
    navigator.clipboard.writeText(address);
    setTimeout(() => {
      setCopyClicked(false);
    }, 1500);
  };

  const isGoerli = chain?.name == "Goerli";
  let MM_Present =
    typeof window !== "undefined" && window.ethereum ? true : false;
  const { openChainModal } = useChainModal();

  const { openConnectModal } = useConnectModal();

  return (
    <div>
      {!address ? (
        <>
          {/* <input type="checkbox" id="my-modal-3" className="modal-toggle" /> */}
          <div className="modal bg-[#000000b6]">
            <div className="modal-box w-[375px] h-[230px] absolute top-[73px] right-[85px] rounded-[4px] bg-gradient-to-b from-primary to-[#1E1722] p-6">
              <div className="flex justify-between">
                <h3 className="text-2xl font-semibold text-white mb-[22px]">
                  {t("connect_wallet")}
                </h3>
                <label
                  htmlFor="my-modal-3"
                  className="btn btn-sm pr-0 rounded-[4px] bg-opacity-0 hover:bg-opacity-0 text-[#fff] border-none"
                >
                  <img
                    className="h-[20px] w-[20px]"
                    src="/icons/ic_close.svg"
                    alt=""
                  />
                </label>
              </div>
              {/* <button
                className="btn btn-primary relative w-[327px] h-[56px] rounded flex justify-center items-center border-none normal-case"
                onClick={openConnectModal}
              >
                <img
                  className="absolute top-[13px] left-4 h-[30px] w-[30px]"
                  src="/icons/ic_metamask.png"
                  alt=""
                />
                <p className=" font-semibold text-accent">MetaMask</p>
              </button> */}
              <button
                className="btn btn-primary mt-3 relative w-[327px] h-[56px] rounded flex justify-center items-center border-none normal-case"
                onClick={openConnectModal}
              >
                <img
                  className="absolute top-[13px] left-4 h-[30px] w-[30px]"
                  src="/icons/ic_walletconnect.png"
                  alt=""
                />
                <p className=" font-semibold text-accent">WalletConnect</p>
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <input type="checkbox" id="my-modal-4" className="modal-toggle" />
          <label
            htmlFor="my-modal-4"
            className="modal cursor-pointer bg-transparent"
          >
            <label
              className="modal-box w-[375px] absolute top-[73px] right-[85px] rounded-[4px] bg-gradient-to-b from-primary to-[#1E1722] p-6"
              htmlFor=""
            >
              <div className="flex justify-between items-start">
                <div
                  className="flex relative group cursor-pointer"
                  onClick={copyWalletAddress}
                >
                  <h3 className="text-xl leading-6 font-semibold text-white mr-2">
                    My Wallet{" "}
                  </h3>
                  <Image
                    src={copyClicked ? "/copied.svg" : "/copy_icon.svg"}
                    width={18}
                    height={18}
                  />
                  <p className="group-hover:block hidden absolute top-7 left-5 whitespace-nowrap px-2 rounded bg-slate-800">
                    {copyClicked ? "copied!" : "copy address"}
                  </p>
                </div>
                <h3
                  className="font-semibold text-white flex text-xl leading-6 items-center cursor-pointer"
                  onClick={() => {
                    verify == "Unverified"
                      ? router.push({
                          pathname: "/dashboard",
                          query: { kyc: true },
                        })
                      : router.push({
                          pathname: "/dashboard",
                        });
                  }}
                >
                  Dashboard
                  {verify == "Unverified" ? (
                    // /dashboard?kyc=true
                    <img
                      src="/icons/ic_warning.svg"
                      className="ml-2 cursor-pointer"
                    />
                  ) : (
                    <img
                      src="/passDash/arrow-right.svg"
                      className="ml-2 rotate-[-52deg] cursor-pointer"
                    />
                  )}
                </h3>
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
                <span className=" flex flex-col justify-center items-end text-white font-semibold">
                  <p>{(+appCTX.ethBalance).toFixed(3)}</p>

                  <p className=" text-sm font-normal text-neutral test">
                    $
                    {(
                      appCTX.ethBalance * appCTX.coinPrice?.ethereum?.usd
                    ).toFixed(3)}{" "}
                    USD
                  </p>
                </span>
              </div>
              <div className=" relative w-full mt-[14px] flex justify-between items-center group">
                <div className=" flex justify-center items-center text-white font-semibold">
                  <img
                    className="h-[32px] w-[32px] mr-[12px]"
                    src="/icons/ic_usdc.png"
                    alt=""
                  />
                  <p>USDC</p>
                </div>
                <span className=" flex flex-col justify-center items-end text-white font-semibold transition-opacity group-hover:opacity-0">
                  <p className=" text-base">
                    {(+appCTX.usdcBalance).toFixed(3)}
                  </p>
                  {appCTX.coinPrice ? (
                    <p className=" text-sm font-normal text-neutral">
                      $
                      {(
                        appCTX.usdcBalance * appCTX.coinPrice["usd-coin"].usd
                      ).toFixed(3)}{" "}
                      USD
                    </p>
                  ) : (
                    <p className=" text-sm font-normal text-neutral">$0 USD</p>
                  )}
                </span>
                <button
                  className="btn btn-sm btn-outline border-[#E6E7EA] absolute w-[90px] h-[28px] bottom-[6px] right-0 
                  ransition-opacity opacity-0 group-hover:opacity-100 text-xs font-semibold px-3 py-[6px] rounded normal-case 
                  hover:border-[#E6E7EA] text-white hover:text-white"
                  onClick={() => addTokenFunction()}
                >
                  Add Token
                </button>
              </div>
              {/* {!isGoerli && path == "/sftdemo" && address && (
                <button
                  className="btn relative w-[327px] h-[56px] mt-4 rounded flex justify-center items-center border-none normal-case bg-invar-error"
                  onClick={() => switchNetwork?.(5)}
                >
                  <p className=" font-semibold text-white">{t("click_switch")}</p>
                </button>
              )} */}

              {/* {chain?.id != 1 && path !== "/sftdemo" && address && (
                <button
                  className="btn relative w-[327px] h-[56px] mt-4 rounded flex justify-center items-center border-none normal-case bg-invar-error"
                  onClick={() => switchNetwork?.(1)}
                >
                  <p className=" font-semibold text-white">{t("click_eth")}</p>
                </button>
              )} */}
              {process.env.PRODUCTION == "true" &&
                chain.id !== 1 &&
                !SFTDemo && (
                  <button
                    className="btn relative w-[327px] h-[56px] mt-4 rounded flex justify-center items-center border-none normal-case bg-invar-error"
                    onClick={openChainModal}
                  >
                    <p className=" font-semibold text-white">
                      {t("click_eth")}
                    </p>
                  </button>
                )}
              {process.env.PRODUCTION == "false" &&
                chain.id !== 5 &&
                !SFTDemo && (
                  <button
                    className="btn relative w-[327px] h-[56px] mt-4 rounded flex justify-center items-center border-none normal-case bg-invar-error"
                    onClick={openChainModal}
                  >
                    <p className=" font-semibold text-white">
                      Switch to goerli
                    </p>
                  </button>
                )}

              {chain.id !== 5 && SFTDemo && (
                <button
                  className="btn relative w-[327px] h-[56px] mt-4 rounded flex justify-center items-center border-none normal-case bg-invar-error"
                  onClick={openChainModal}
                >
                  <p className=" font-semibold text-white">
                    {t("click_switch")}
                  </p>
                </button>
              )}

              <button
                className="btn btn-primary relative w-[327px] h-[56px] mt-4 rounded flex justify-center items-center border-none normal-case"
                onClick={() => disconnect()}
              >
                <p className=" font-semibold text-white">{t("disconnect")}</p>
              </button>
            </label>
          </label>
        </>
      )}
    </div>
  );
};

export default ModalWallet;
