import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { ethers } from "ethers";
import { shortenAddress } from "../src/utils/shortenAddress";
import passJSON from "../src/utils/passABI.json";
import {
  mintClosed,
  mintNotStarted,
  passAddress,
  tokensAvailable,
} from "../src/utils/web3utils";
import {
  addTokenFunction,
} from "../src/utils/web3utils";
import { ButtonMailto } from "../components/icons/Link";
import { useTranslation } from "next-i18next";
import { ModalContext } from "../context/Modals-context";
import {  Dialog } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { AppContext } from "../context/app-context";
import { useAccount, useConnect, useNetwork, useSigner } from "wagmi";
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";

const PassModal = () => {
  const [mintNum, setMintNum] = useState(1);
  const [readmore, setReadmore] = useState(false);
  const [checked, setChecked] = useState(false);
  const [notification, setNotification] = useState("");
  const [notiType, setNotiType] = useState("success");
  const [btnState, setBtnState] = useState();
  const [loading, setLoading] = useState(false);
  const [mintedCount, setMintedCount] = useState(0);


  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const provider = signer?.provider;
  const { openChainModal } = useChainModal();



  const { t } = useTranslation("sale");
  const router = useRouter();
  let isCorrectNetwork;
  if (process.env.PRODUCTION === "true") {
    isCorrectNetwork = chain?.id === 1;
  } else {
    isCorrectNetwork = chain?.id === 5;
  }

  const modalOpen = useContext(ModalContext);
  const appCTX = useContext(AppContext);

  let allowedToMint = 3 - mintedCount;
  console.log("mintedCount",mintedCount);

  const publicMintHandler = async () => {
    setBtnState("minting");
    try {
      const nftContract = new ethers.Contract(
        passAddress,
        passJSON.abi,
        signer
      );
      let fee;
      if(mintNum===1){fee=210000;} 
      else if(mintNum===2) {fee=350000;}
      else if(mintNum===3){fee=500000;}
      let tx = await nftContract.publicMint(mintNum, {
        value: ethers.utils.parseEther(`${mintNum * 0.1}`),
        gasLimit: fee,
      });
      await tx.wait();
      setBtnState("mint");
      setNotiType("success");

      setNotification(
        router.locale === "en"
          ? "Transaction Successful! You can check NFT in Dashboard / Wallet."
          : "交易成功！您可以到 Dashboard 或錢包查看。"
      );
      appCTX.setTokensAlreadyMinted(appCTX.tokensAlreadyMinted + mintNum);
      fetchInitialData();
    } catch (error) {
      console.log(error);
      setBtnState("mint");
      setNotification(
        router.locale === "en"
          ? "Transaction Failed! Please try again or check if any problems."
          : "交易失敗！請再試一次，或查看是否存在任何問題。"
      );
      setNotiType("fail");
    }
  };

  // function handleMintNum(c) {
  //   if(!isMainnet)return;
  //   if (c == "+" && mintNum < allowedToMint) {
  //     setMintNum(mintNum + 1);
  //   } else if (c == "-" && mintNum > 0) {
  //     setMintNum(mintNum - 1);
  //   } else {
  //     if (c < 0) {
  //       setMintNum(0);
  //     } else if (c > allowedToMint) {
  //       setMintNum(allowedToMint);
  //     } else {
  //       setMintNum(+c);
  //     }
  //   }
  // }
  function handleMintNum(c) {
    if (c == "+") {
      if (mintNum < allowedToMint) setMintNum(+mintNum + 1);
      return;
    } else if (c == "-") {
      if (mintNum > 0) setMintNum(+mintNum - 1);
      return;
    } else {
      if (c < 0) {
        setMintNum(0);
      } else if (c > allowedToMint) {
        setMintNum(allowedToMint);
      } else {
        setMintNum(+c);
      }
    }
  }

  let isMainnet;
  if (process.env.PRODUCTION === "true") {
    isMainnet = chain?.id === 1;
  } else {
    isMainnet = chain?.id === 5;
  }
  const fetchInitialData = async () => {
    console.log("test0")
    if(!provider)return;
    const nftContract = new ethers.Contract(
      passAddress,
      passJSON.abi,
      signer
    );
    console.log("test1",signer,nftContract)
    const tokens = await nftContract.mintRecords(address);
    console.log("test2",tokens)
    setMintedCount(+tokens.publicMinted);
    if (+tokens.publicMinted === 3) setMintNum(0);
  };
console.log("provider",provider)
  useEffect(() => {
    if (!address||!provider) return;
    const func = async () => {
      console.log("test1")
      isCorrectNetwork &&address&&provider&& setLoading(true);
      if (address&&provider) await fetchInitialData();
      setLoading(false);
    };
    try {
      func();
    } catch (e) {
      setLoading(false);
    }
  }, [address, chain?.id,provider]);
  useEffect(() => {
    if (+appCTX.ethBalance < +mintNum * 0.1) {
      setBtnState("nofund");
    } else {
      setBtnState("mint");
    }
  }, [appCTX.ethBalance, mintNum]);

  let limitExceeded = appCTX.tokensAlreadyMinted + mintNum > tokensAvailable;

  const { openConnectModal } = useConnectModal();

  return (
    <Dialog
      sx={{
        "& .MuiDialog-container": {
          justifyContent: "right",
        },
        "& .MuiDialog-paper": {
          marginRight: { xs: "0px", sm: "24px" },
          marginTop: { xs: "0px", sm: "20px" },
          marginBottom: "auto",
          marginLeft: "0px",
          maxHeight: "100vh",
          height: {
            sm: "unset",
            xs: "100%",
          },
          background: "linear-gradient(180deg, #44334C 0%, #1E1722 100%)",
          maxWidth: {
            xs: "100%",
            sm: "375px",
          },
          width: {
            xs: "100%",
          },
        },
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0,0,0,0.7)",
        },
      }}
      open={modalOpen.passBuyModal}
    >
      <div className="relative">
        <div className="bg-[#000000b6] text-2xl text-white bg-gradient-to-b from-primary to-[#1E1722] ">
          <div className="sm:h-full h-screen">
            <div className="px-6 pb-4">
              <div className="flex justify-between mt-[24px] mb-6">
                <h3 className="text-2xl font-semibold ">PASS: InVariant NFT</h3>
                <div
                  onClick={() => modalOpen.setPassBuyModal(false)}
                  className="bg-transparent border-none hover:bg-transparent flex items-center"
                >
                  <img
                    className="h-[20px] w-[20px] cursor-pointer"
                    src="/icons/ic_close.svg"
                    alt=""
                  />
                </div>
              </div>
              <div className="w-full h-24 relative">
                <Image
                  src={"/bg/pass-mint-bcg.png"}
                  width={327}
                  height={96}
                  alt="mint-bg"
                />
              </div>
              <p className=" text-sm font-normal text-invar-light-grey mt-[16px] mb-1">
                {t("homepage_pubilcsale_mywallet")}
              </p>
              {!address ? (
                <button
                  className="btn btn-primary font-semibold text-sm text-invar-light-grey w-full h-[40px] rounded border-none normal-case"
                  onClick={openConnectModal}
                  >
                  {t("connect_wallet")}
                </button>
              ) : (
                <>
                  <div className="w-full min-h-max bg-primary h-10 flex items-center normal-case rounded border-none mb-1">
                    <div className="text-white w-full text-center">
                      <span className="font-semibold text-base leading-5 ">
                        {shortenAddress(address)}
                      </span>
                    </div>
                  </div>
                </>
              )}
              <div className="mt-1 w-full p-4 bg-invar-main-purple rounded">
                <div className=" w-full flex justify-between items-center ">
                  <div className=" flex justify-center items-center text-white font-normal text-sm">
                    <img
                      className="h-[24px] w-[24px] mr-[12px]"
                      src="/icons/ic_eth.png"
                      alt=""
                    />
                    <p>ETH</p>
                  </div>
                  <span className=" flex flex-col justify-center items-end text-white font-semibold text-base">
                    <p>{(+appCTX?.ethBalance)?.toFixed(3)}</p>
                  </span>
                </div>
                <div className=" relative w-full mt-3 flex justify-between items-center group">
                  <div className=" flex justify-center items-center text-white font-normal text-sm">
                    <img
                      className="h-[24px] w-[24px] mr-[12px]"
                      src="/icons/ic_usdc.png"
                      alt=""
                    />
                    <p>USDC</p>
                  </div>
                  <span className=" flex flex-col justify-center items-end text-white font-semibold text-base transition-opacity group-hover:opacity-0">
                    <p>{(+appCTX.usdcBalance).toFixed(3)}</p>
                  </span>
                  <button
                    className="btn btn-sm btn-outline border-[#E6E7EA] absolute w-[90px] h-[28px] bottom-[-2px] right-0 
                  transition-opacity opacity-0 group-hover:opacity-100 text-xs font-semibold px-3 py-[6px] rounded normal-case 
                  hover:border-[#E6E7EA] text-white hover:text-white"
                    onClick={() => addTokenFunction()}
                  >
                    {t("homepage_pubilcsale_addtoken")}
                  </button>
                </div>
              </div>
              <div className=" mt-4 mb-1 flex justify-between items-baseline">
                <p className=" text-sm font-normal text-invar-light-grey ">
                  {t("mint_stage")}
                </p>
                <p className=" text-base font-semibold text-white ">
                  {t("public_stage")}
                </p>
              </div>
              <div className=" mt-4 flex justify-between items-baseline">
                <p className=" text-sm font-normal text-invar-light-grey ">
                  {t("homepage_pubilcsale_mintprice")}
                </p>
                <p className=" text-base font-semibold text-white ">
                  {t("eth_each")}
                </p>
              </div>
              <div className=" mt-4 flex justify-between items-baseline">
                <p className=" text-sm font-normal text-invar-light-grey ">
                  {t("homepage_pubilcsale_minttime")}
                </p>
                <p className=" text-base font-semibold text-white max-w-[260px] text-end ">
                  Mar 1, 00:00 ~ 15, 00:00 UTC
                </p>
              </div>
              {address && (
                <>
                  <p className=" mt-3 text-sm font-normal text-invar-light-grey ">
                    {t("mint_amount")}
                  </p>
                  <div className="relative ">
                    <input
                      type="number"
                      onChange={(e) => handleMintNum(e.target.value)}
                      value={mintNum}
                      min="0"
                      required
                      className="appearance-none disabled:text-white block mt-1 px-3 h-[48px] bg-invar-main-purple w-full font-semibold text-2xl text-white rounded focus:border border-white text-center"
                    />
                    {mintNum < 1 || !isMainnet ? (
                      <button className=" w-6 absolute inset-y-0 left-[14px] flex items-center text-white">
                        <img
                          className=" w-6 "
                          src="/icons/ic_minus_disabled.svg"
                          alt=""
                        />
                      </button>
                    ) : (
                      <button
                        className=" w-6 cursor-pointer absolute inset-y-0 left-[14px] flex items-center text-white"
                        onClick={() => handleMintNum("-")}
                      >
                        <img
                          className=" w-6 "
                          src="/icons/ic_minus.svg"
                          alt=""
                        />
                      </button>
                    )}
                    <button
                      className=" w-6 cursor-pointer absolute inset-y-0 right-[14px] flex items-center text-white"
                      onClick={() => handleMintNum("+")}
                    >
                      {allowedToMint == 0 ||
                      mintNum == allowedToMint ||
                      !isMainnet ? (
                        <img
                          className=" w-6 "
                          src="/icons/ic_plus_disabled.svg"
                          alt=""
                        />
                      ) : (
                        <img
                          className=" w-6 "
                          src="/icons/ic_plus.svg"
                          alt=""
                        />
                      )}
                    </button>
                  </div>
                  <div className=" mt-4 flex justify-between items-baseline">
                    <p className=" text-sm font-normal text-invar-light-grey">
                      {t("eth_amount")}
                    </p>
                    <p className=" font-semibold text-white text-base">
                      {(mintNum * 0.1).toFixed(2)} ETH
                    </p>
                  </div>
                  <div className="flex mb-3 items-center">
                    {!checked ? (
                      <div
                        className="border rounded-sm border-accent mr-2 cursor-pointer"
                        style={{ minWidth: "16px", minHeight: "16px" }}
                        onClick={() => setChecked((v) => !v)}
                      />
                    ) : (
                      <div
                        className="rounded-sm flex items-center justify-center select-none mr-2 cursor-pointer"
                        style={{
                          minWidth: "16px",
                          minHeight: "16px",
                          backgroundColor: "#00DEAE",
                        }}
                        onClick={() => setChecked((v) => !v)}
                      >
                        <Image
                          priority
                          src="/icons/tick.svg"
                          className="w-3 h-3 select-none"
                          width={12}
                          height={12}
                          alt="tick"
                        />
                      </div>
                    )}
                    <p className="text-accent font-normal text-xs leading-[18px]">
                      {t("have_read")}
                      <Link href={"/terms"}>
                        <span
                          className="underline cursor-pointer"
                          onClick={() => modalOpen.setPassBuyModal(false)}
                        >
                          {t("terms")}
                        </span>
                      </Link>
                      {router.locale === "tw" ? "、" : " "}
                      <Link href="/privacy">
                        <span
                          className="underline cursor-pointer"
                          onClick={() => modalOpen.setPassBuyModal(false)}
                        >
                          {t("privacy")}
                        </span>
                      </Link>
                      {router.locale === "tw" ? "。" : "."}
                    </p>
                  </div>
                </>
              )}
              {!notification && loading && (
                <button className="btn loading bg-invar-dark w-full h-[48px] font-semibold text-sm text-white border-none normal-case rounded">
                  Loading
                </button>
              )}
              {!notification && !loading && (
                <>
                  {address && isMainnet && (
                    <>
                      {btnState === "minting" ? (
                        <button className="btn loading bg-invar-dark w-full h-[48px] font-semibold text-sm text-white border-none normal-case rounded">
                          {t("minting")}
                        </button>
                      ) : btnState === "nofund" &&
                        !mintClosed &&
                        !appCTX.passNftSoldOut ? (
                        <div className="btn btn-disabled bg-invar-disabled w-full h-[48px] font-semibold text-sm text-invar-light-grey border-none normal-case rounded">
                          {t("nofund")}
                        </div>
                      ) : (
                        <button
                          className="btn bg-invar-dark w-full h-[48px] font-semibold text-sm text-white disabled:bg-invar-grey disabled:text-invar-light-grey border-none normal-case rounded"
                          onClick={publicMintHandler}
                          disabled={
                            !checked ||
                            appCTX.passNftSoldOut ||
                            mintClosed ||
                            mintNotStarted ||
                            mintNum < 1 ||
                            limitExceeded
                          }
                        >
                          {`${t("mint")} (${mintNum})`}
                        </button>
                      )}
                    </>
                  )}
                  {address && !isMainnet && (
                    <button
                      className="btn bg-invar-error w-full h-[48px] font-semibold text-sm text-white disabled:bg-invar-grey disabled:text-invar-light-grey border-none normal-case rounded"
                      onClick={openChainModal}
                    >
                      {t("switch_eth")}
                    </button>
                  )}
                </>
              )}

              {notification && (
                <div className="w-full h-[74px] bg-invar-dark rounded relative p-4">
                  <p
                    className={`w-5/6 ${
                      notiType === "success"
                        ? "text-invar-success"
                        : "text-invar-error"
                    } text-normal text-sm leading-5`}
                  >
                    {notification}
                  </p>
                  <img
                    src="/icons/ic_close.svg"
                    width={20}
                    height={20}
                    className="absolute top-7 right-6"
                    onClick={() => setNotification("")}
                  />
                </div>
              )}

              {address && (
                <>
                  <p
                    className={`font-normal text-sm leading-5 text-accent mb-3 mt-[18px] `}
                    //${notification && "mt-3"}
                  >
                    {t("buy_tokens")}
                  </p>

                  <div className="flex justify-between mb-[66px]">
                    <a
                      href="https://app.uniswap.org/#/swap"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <div className="flex items-center">
                        <img
                          src="/icons/ic_uniswap.png"
                          width={24}
                          height={24}
                        />
                        <p className="font-semibold text-xs leading-4 ml-2">
                          Uniswap
                        </p>
                      </div>
                    </a>
                    <a
                      href="https://app.1inch.io/#/1/unified/swap/ETH/DAI"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <div className="flex items-center">
                        <img src="/icons/ic_1inch.png" width={24} height={24} />
                        <p className="font-semibold text-xs leading-4 ml-2">
                          1inch
                        </p>
                      </div>
                    </a>
                    <a
                      href="https://app.thevoyager.io/swap"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <div className="flex items-center">
                        <img
                          src="/icons/ic_voyager.png"
                          width={24}
                          height={24}
                        />
                        <p className="font-semibold text-xs leading-4 ml-2">
                          Voyager
                        </p>
                      </div>
                    </a>
                  </div>
                </>
              )}
              {!address && (
                <div className="my-6 w-full h-[1px] border-b border-b-invar-main-purple"></div>
              )}

              {!address && (
                <div className="md:max-w-[327px] mx-auto">
                  <ul className="list-decimal pl-3 text-xs font-normal text-invar-light-grey mb-3 mx-auto">
                    <li>{t("public_notice_1")}</li>
                    <li>{t("public_notice_2")}</li>
                    <li>{t("public_notice_3")}</li>
                    {readmore && (
                      <>
                        <li>{t("public_notice_4")}</li>
                        <li>{t("public_notice_5")}</li>

                        <li>
                          {t("public_notice_6")} <ButtonMailto />.
                        </li>
                      </>
                    )}
                  </ul>
                  {!readmore && (
                    <>
                      <p
                        className="my-3 text-invar-light-grey text-xs font-semibold cursor-pointer hover:underline"
                        onClick={() => setReadmore(true)}
                      >
                        Read More
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PassModal;
