import React, { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import { Navbar, ScrollToTop } from "../components/";
import Footer from "../components/Footer";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ethers } from "ethers";
import { ButtonMailto } from "../components/icons/Link";
import {
  mintClosed,
  mintNotStarted,
  passAddress,
  tokensAvailable,
} from "../src/utils/web3utils";
import passJSON from "../src/utils/passABI.json";
import Image from "next/image";
import { AppContext } from "../context/app-context";
import { useAccount, useConnect, useNetwork, useSigner } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "storyline",
        "sale",
        "dashboard",
        "passnft",
      ])),
    },
  };
}

const PassNFT = () => {
  const [mintNum, setMintNum] = useState(1);
  const router = useRouter();
  const headerBackground = true;
  const { t } = useTranslation(["passnft", "sale"]);
  const [checked, setChecked] = useState(false);
  const [readmore, setReadmore] = useState(false);
  const [notification, setNotification] = useState("");
  const [notiType, setNotiType] = useState("success");
  const [btnState, setBtnState] = useState();
  const [loading, setLoading] = useState(false);
  const allowedToMint = useRef(0);

  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const provider = signer?.provider;

  const appCTX = useContext(AppContext);
  function handleMintNum(c) {
    if (c == "+") {
      if (mintNum < allowedToMint.current) setMintNum(+mintNum + 1);
      return;
    } else if (c == "-") {
      if (mintNum > 0) setMintNum(+mintNum - 1);
      return;
    } else {
      if (c < 0) {
        setMintNum(0);
      } else if (c > allowedToMint.current) {
        setMintNum(allowedToMint.current);
      } else {
        setMintNum(+c);
      }
    }
  }

  useEffect(
    () => {
      const func = async () => {
        isCorrectNetwork && setLoading(true);
        if (address && provider) await fetchInitialData();
        setMintNum(0);
        setLoading(false);
      };
      try {
        func();
      } catch (e) {
        setLoading(false);
      }
    },
    [address, chain?.id, provider],
    provider
  );

  useEffect(() => {
    if (+appCTX.ethBalance < +mintNum * 0.1) {
      setBtnState("nofund");
    } else {
      setBtnState("mint");
    }
  }, [appCTX.ethBalance, mintNum]);

  const fixedinfo = (
    <>
      <div className=" md:mb-9 mb-[34px] lg:w-[466px] w-full md:h-[335px]">
        <img
          className="w-full"
          src="/pass-nft/pass-nft-img.png"
          alt=""
          width={466}
          height={335}
        />
        <div className="md:hidden">
          <p className="font-semibold text-2xl leading-7 mt-3 mb-3 ">
            {t("pass_heading")}
          </p>
          <p className="font-normal text-base leading-5 ">
            {t("goals_deliveries")}
          </p>
        </div>
      </div>
      <div className="flex justify-between md:mt-6">
        <p className="font-normal md:text-base text-sm md:leading-6 leading-5">
          {t("type")}
        </p>
        <p className="font-semibold md:text-xl md:leading-6 text-lg leading-5">
          {t("utility")}
        </p>
      </div>
      <div className="flex justify-between mt-6">
        <p className="font-normal md:text-base text-sm md:leading-6 leading-5">
          {t("tiers")}
        </p>
        <p className="font-semibold md:text-xl md:leading-6 text-lg leading-5">
          {t("earth_ocean_sky")}
        </p>
      </div>
      <p className="font-normal md:text-base text-sm md:leading-6 leading-5 mt-6">
        {t("available_supply")}
      </p>
      <div className="border relative border-white bg-[#37293E] h-8 rounded flex justify-end">
        <div
          className="bg-invar-success h-[30px] w-[73px] rounded absolute top-0 left-0"
          style={{
            width: `${(appCTX.tokensAlreadyMinted / 500) * 100}%`,
          }}
        ></div>
        <p className="font-normal text-sm leading-5 text-white mt-[6px] mr-1.5 relative z-10">
          {500 - appCTX.tokensAlreadyMinted} / 500
        </p>
      </div>
    </>
  );

  let isCorrectNetwork;
  if (process.env.PRODUCTION === "true") {
    isCorrectNetwork = chain?.id === 1;
  } else {
    isCorrectNetwork = chain?.id === 5;
  }

  const publicMintHandler = async () => {
    setBtnState("minting");
    try {
      const nftContract = new ethers.Contract(
        passAddress,
        passJSON.abi,
        signer
      );
      let fee;
      if (mintNum === 1) {
        fee = 210000;
      } else if (mintNum === 2) {
        fee = 350000;
      } else if (mintNum === 3) {
        fee = 500000;
      }
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
      setBtnState("mint");

      console.log(error);
      setNotification(
        router.locale === "en"
          ? "Transaction Failed! Please try again or check if any problems."
          : "交易失敗！請再試一次，或查看是否存在任何問題。"
      );
      setNotiType("fail");
    }
  };

  const fetchInitialData = async () => {
    console.log("fetchInitialData");
    const nftContract = new ethers.Contract(passAddress, passJSON.abi, signer);
    try {
      const tokens = await nftContract.mintRecords(address);
      console.log("tokensAlready", tokens);
      allowedToMint.current = 3 - +tokens.publicMinted;
      if (+tokens.publicMinted === 3) setMintNum(0);
    } catch (e) {
      console.log(e);
    }
  };

  let limitExceeded = appCTX.tokensAlreadyMinted + mintNum > tokensAvailable;
  // let allowedToMint.current = 3 - mintedCount;
  const { openConnectModal } = useConnectModal();

  return (
    <div>
      <Navbar headerBackground={headerBackground} />
      <div
        className=" min-w-full max-w-full relative overflow-hidden h-full bg-gradient-to-b from-[#44334C] to-[#1E1722]
        text-white"
      >
        <img
          className=" hidden lg:flex absolute top-[400px] right-[-158px] w-[685px] h-[359px] z-0 "
          src="/bg/bg_03.png"
          alt=""
        />
        <img
          className=" hidden lg:flex absolute bottom-0 -left-1/4 w-[800px] h-[400px] z-10 "
          src="/bg/bg_05.png"
          alt=""
        />
        <div className="md:pt-[152px] pt-[90px] px-4 max-w-[1010px] lg:mx-auto md:ml-12 relative">
          <div className="flex w-full md:justify-between md:flex-row flex-col mb-10">
            <div className="md:max-w-[466px]">{fixedinfo}</div>
            {appCTX.passNftSoldOut && (
              <div className="lg:min-w-[466px] max-w-[466px] md:flex md:max-h-[486px] md:h-[486px] lg:ml-0 md:ml-2 md:min-w-[340px] hidden items-center justify-center">
                <p>SOLD OUT!</p>
              </div>
            )}
            {!appCTX.passNftSoldOut && (
              <div className="lg:min-w-[466px] max-w-[466px] md:max-h-[486px] md:h-[486px] bg-[#37293E] mt-6 md:mt-12 lg:ml-0 md:ml-2 md:min-w-[340px] lg:px-0 px-4">
                {mintClosed && (
                  <div className="md:flex justify-center hidden mt-[318px]">
                    <button
                      className="btn bg-invar-dark w-3/4 h-[48px] font-semibold text-sm text-white disabled:bg-invar-grey disabled:text-invar-light-grey border-none normal-case rounded mx-auto"
                      disabled
                    >
                      {t("mint_close")}
                    </button>
                  </div>
                )}
                {!mintClosed && (
                  <div>
                    {((isCorrectNetwork && address) || !address) && (
                      <div className="md:max-w-[327px] mx-auto pt-[18px]">
                        <div className=" mt-4 flex justify-between items-baseline">
                          <p className=" text-sm font-normal text-invar-light-grey ">
                            {t("mint_stage")}
                          </p>
                          <p className=" text-base font-semibold text-white ">
                            {t("public_stage")}
                          </p>
                        </div>
                        <div className=" mt-4 flex justify-between items-baseline">
                          <p className=" text-sm font-normal text-invar-light-grey ">
                            {t("homepage_pubilcsale_mintprice", { ns: "sale" })}
                          </p>
                          <p className=" text-base font-semibold text-white ">
                            {t("eth_each")}
                          </p>
                        </div>
                        <div className=" mt-4 flex justify-between items-baseline">
                          <p className=" text-sm font-normal text-invar-light-grey ">
                            {t("mint_time")}
                          </p>
                          <p className=" text-base font-semibold text-white max-w-[260px] text-end ">
                            Mar 1, 00:00 ~ 15, 00:00 UTC
                          </p>
                        </div>
                        {!address && (
                          <button
                            onClick={openConnectModal}
                            className="mt-[195px] btn mb-[18px] bg-invar-dark w-full h-[52px] font-semibold text-sm text-white border-none normal-case rounded"
                          >
                            {t("connect_wallet")}
                          </button>
                        )}
                      </div>
                    )}
                    {!isCorrectNetwork && <div className="w-full h-32"></div>}

                    {/* {isCorrectNetwork && (
                      <p className="font-normal text-base leading-5 text-invar-validation md:max-w-[327px] mx-auto text-center my-9">
                        {t("public_title")}
                      </p>
                    )} */}

                    {address && !isCorrectNetwork && (
                      <p className="text-center font-normal text-base leading-5 md:max-w-[327px] mx-auto my-9">
                        {t("wrong_network")}
                        <br /> {t("switch_mainnet")}
                      </p>
                    )}

                    {address && isCorrectNetwork && (
                      <div className="md:max-w-[327px] mx-auto">
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
                              style={{ color: "white" }}
                            />

                            {mintNum < 1 ? (
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
                            {console.log(
                              "allowedToMint.current",
                              allowedToMint.current
                            )}
                            <button
                              className=" w-6 cursor-pointer absolute inset-y-0 right-[14px] flex items-center text-white"
                              onClick={() => handleMintNum("+")}
                            >
                              {allowedToMint.current == 0 ||
                              mintNum == allowedToMint.current ? (
                                <img
                                  className="w-6 "
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
                                />
                              </div>
                            )}

                            <p className="text-accent font-normal text-xs leading-[18px]">
                              {t("have_read")}
                              <Link href={"/terms"}>
                                <span className="underline cursor-pointer">
                                  {t("terms")}
                                </span>
                              </Link>
                              {router.locale === "tw" ? "、" : " "}
                              <Link href="/privacy">
                                <span className="underline cursor-pointer">
                                  {t("privacy")}
                                </span>
                              </Link>
                              {router.locale === "tw" ? "。" : "."}
                            </p>
                          </div>
                        </>
                        {!notification && loading && (
                          <button className="btn loading bg-invar-dark w-full h-[48px] font-semibold text-sm text-white border-none normal-case rounded">
                            Loading
                          </button>
                        )}

                        {!notification && !loading && (
                          <>
                            {btnState === "minting" ? (
                              <button className="btn loading bg-invar-dark w-full h-[48px] font-semibold text-sm text-white border-none normal-case rounded">
                                {t("minting")}
                              </button>
                            ) : btnState === "nofund" ? (
                              <div className="btn btn-disabled bg-invar-disabled w-full h-[48px] font-semibold text-sm text-invar-light-grey border-none normal-case rounded">
                                {t("nofund")}
                              </div>
                            ) : (
                              <button
                                className="btn bg-invar-dark w-full h-[48px] font-semibold text-sm text-white disabled:bg-invar-grey disabled:text-invar-light-grey border-none normal-case rounded"
                                onClick={publicMintHandler}
                                disabled={
                                  !checked ||
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

                        <>
                          <p
                            className={`font-normal text-sm leading-5 text-accent mb-3 mt-[18px] `}
                            //${notification && "mt-3"}
                          >
                            {t("buy_tokens")}
                          </p>

                          <div className="flex justify-between">
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
                                <img
                                  src="/icons/ic_1inch.png"
                                  width={24}
                                  height={24}
                                />
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
                      </div>
                    )}

                    {address && !isCorrectNetwork && (
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
                )}
              </div>
            )}
          </div>
          <h3 className="font-semibold text-[32px] leading-[38px] mb-2 md:block hidden">
            PASS: InVariant
          </h3>
          <p className="font-normal text-lg leading-6 max-w-[808px] mb-[38px] md:block hidden">
            {t("goals_deliveries")}
          </p>

          <div className="flex z-10 border-b-2 border-invar-main-purple">
            <button
              className={
                "pb-2 mr-9 h-[36px] min-w-[120px] text-sm font-semibold text-center text-white border-b-2 border-t-2 border-t-transparent"
              }
            >
              <span className="whitespace-nowrap"> {t("about")}</span>
            </button>
          </div>
          <div className="max-w-[938px] md:min-h-[630px] min-h-[555px] px-4 relative ml-auto min-w-[375px] ">
            <div className="absolute top-10 left-[-15px] max-w-[340px]">
              <div className="bg-black opacity-50 rounded-full md:w-[168px] w-[98px] md:h-[168px] h-[98px] absolute md:top-10 md:left-5 top-[52px] left-[-12px]"></div>
              <img
                src="/pass-nft/bg_07.png"
                className="w-full md:block hidden"
              />
              <img
                src="/pass-nft/left-circle-mobile.png"
                className="w-full md:hidden"
              />
              <p className="text-center font-semibold md:text-xl text-base md:leading-6 leading-5 absolute md:top-[43%] top-16 md:left-[-45px] left-8">
                {t("exclusive")} <br />
                {t("rwa_backed")}
              </p>
              <p className="font-normal md:text-sm text-xs leading-5 absolute md:top-28 md:right-[-25px] right-2 bottom-12">
                Access
              </p>
            </div>
            <div className="absolute top-0 md:right-0 max-w-[369px] right-[-20px]">
              <p className="font-semibold md:text-xl text-base md:leading-6 leading-5 absolute md:right-10 right-8 top-[115px] z-10">
                {t("hyfi_vaults")}
              </p>
              <div className="bg-black opacity-50 rounded-full md:w-[248px] md:h-[248px] w-[121px] h-[121px] absolute md:top-14 top-[72px] md:left-[98px] left-[76px]"></div>
              <img
                src="/pass-nft/bg_06.png"
                className="w-full md:block hidden"
              />
              <img
                src="/pass-nft/right-circle-mobile.png"
                className="w-full md:hidden"
              />

              <p className="font-normal text-sm leading-5 absolute md:top-44 top-[229px] left-12 md:left-[-30px]">
                Access
              </p>
            </div>
            <div className="md:w-[76%] mx-auto md:absolute bottom-[95px] left-32 md:mt-0 pt-60">
              <img
                src="/pass-nft/bg_10.png"
                className="ml-auto min-w-[355px] md:h-auto h-48"
              />

              <div className="md:top-[210px] md:left-[70px] top-48 left-[-58px] absolute max-w-[180px]">
                <p className="font-semibold md:text-xl md:leading-6 text-base leading-5 bottom-[6px] md:left-20 left-16 absolute">
                  TradFi
                </p>
                <img src="/pass-nft/bg_09.png" className="w-full" />
              </div>

              <div className="absolute md:right-[-45px] md:top-[310px] top-[18rem] right-[-40px] md:max-w-full max-w-[200px]">
                <p className="font-semibold md:text-xl text-base md:leading-6 leading-5 md:top-[70px] md:right-[-16px] right-0 left-2.5 top-7 absolute">
                  HyFi
                </p>
                <img src="/pass-nft/bg_11.png" className="w-full" />
              </div>
              <div className="absolute md:left-1/4 md:bottom-[-28px] left-[20px] bottom-[5rem]">
                <p className="font-semibold md:text-xl tex-base leading-5 md:leading-6 md:bottom-7 bottom-[5rem] md:right-10 right-[-0.7rem] absolute">
                  DeFi
                </p>
                <img
                  src="/pass-nft/bg_12.png"
                  className="w-full md:w-auto h-auto max-w-[150px]"
                />
              </div>
            </div>
            <div className="absolute md:bottom-0 bottom-[-2.3rem] right-[22px] md:left-[-54px] md:max-w-[275px] max-w-[225px]">
              <img
                src="/pass-nft/bg_05.png"
                className="w-full md:block hidden"
              />
              <img
                src="/pass-nft/mobile-partners.png"
                className="w-full md:hidden"
              />

              <p className="font-semibold md:text-xl text-base leading-5 md:leading-6 absolute md:top-[52%] md:left-10 top-[40%] left-[72px]">
                ESG / Partners
              </p>
              <p className="font-normal text-xs md:text-sm leading-5 absolute md:top-0 md:right-[-15px] right-[205px] top-[90px]">
                Connect
              </p>
            </div>
          </div>

          <h2 className="font-semibold md:text-[32px] md:leading-10 text-2xl leading-7 text-center md:mt-8 mt-8 md:mb-6 mb-9">
            {t("unique_pass")}
            <br className="md:hidden" /> {t("distinctive_alpha")}
          </h2>

          <div className="flex md:justify-between md:mb-14 max-w-[920px] mx-auto md:flex-row flex-col">
            <div className="md:w-60">
              <p className="font-semibold text-xl leading-6 md:text-center text-left md:w-5/6 w-44 md:ml-auto md:mr-auto ml-7">
                Earth InVariant (TradFi)
              </p>
              <div className="md:h-auto h-[140px] md:mb-0 relative md:bottom-0 bottom-[52px]">
                <img
                  src="/pass-nft/bg_01.png"
                  width={150}
                  height={200}
                  className="md:mx-auto md:mr-auto mr-7 ml-auto min-h-[200px]"
                />
              </div>
              <div className="font-normal md:text-base text-sm leading-5 md:leading-6 w-11/12">
                <div className="flex mb-[2px] ">
                  <div className="md:text-2xl text-base self-start">
                    &#x2022;&nbsp;
                  </div>
                  <div>
                    <p className="mt-1">{t("early_access")}</p>
                  </div>
                </div>
                <div className="flex mb-[2px] ">
                  <div className="md:text-2xl text-base self-start">
                    &#x2022;&nbsp;
                  </div>
                  <div>
                    <p className="mt-1">{t("yield_boosting")}</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="md:text-2xl text-base self-start">
                    &#x2022;&nbsp;
                  </div>
                  <div>
                    <p className="mt-1">{t("airdrop")}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-60">
              <p className="font-semibold text-xl leading-6 md:text-center md:w-5/6 md:mx-auto md:mt-0 mt-9 w-44 md:mr-auto ml-auto mr-7 text-right">
                {t("ocean_invariant")}
              </p>
              <div className="">
                <div className="flex md:h-[200px] h-[100px] items-center md:ml-auto md:mr-auto ml-7 md:mb-0 mb-12">
                  <img
                    src="/pass-nft/bg_02.png"
                    width={54}
                    height={72}
                    className="h-[72px] w-14 opacity-30 mt-auto md:mb-[45px] mb-0 rotate-[-2deg] relative left-3"
                  />
                  <img
                    src="/pass-nft/bg_02.png"
                    width={106}
                    height={141}
                    className="w-[106px] h-[141px]"
                  />
                  <img
                    src="/pass-nft/bg_02.png"
                    width={83}
                    height={111}
                    className="rotate-[-29deg] max-w-[83px] max-h-[111px] relative right-6 mt-10 opacity-80"
                  />
                </div>
                <div className="font-normal md:text-base md:leading-6 text-sm leading-5 w-11/12">
                  <div className="flex mb-[2px]">
                    <div className="md:text-2xl text-base self-start">
                      &#x2022;&nbsp;
                    </div>
                    <div>
                      <p className="mt-1">{t("ocean_1")}</p>
                    </div>
                  </div>
                  <div className="flex mb-[2px]">
                    <div className="md:text-2xl text-base self-start">
                      &#x2022;&nbsp;
                    </div>
                    <div>
                      <p className="mt-1">{t("ocean_2")}</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="md:text-2xl text-base self-start">
                      &#x2022;&nbsp;
                    </div>
                    <div>
                      <p className="mt-1">{t("ocean_3")}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="md:text-2xl text-base">&#x2022;&nbsp;</div>
                    <div>
                      <p className="mt-1">{t("ocean_4")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-60">
              <p className="font-semibold text-xl leading-6 md:text-center md:w-5/6 mx-auto text-left w-[170px] md:ml-auto ml-7 md:mt-0 mt-9">
                Skyline InVariant (HyFi)
              </p>
              <div className="relative md:h-[200px] h-40 flex items-center md:justify-start justify-end">
                <img
                  src="/pass-nft/bg_03.png"
                  width={203}
                  height={162}
                  className="relative z-10 md:mr-0 mr-8"
                />
                <img
                  src="/pass-nft/bg_03.png"
                  width={203}
                  height={162}
                  className="absolute md:left-8 right-0 opacity-30 md:top-5 top-0"
                />
              </div>
              <div className="font-normal md:text-base text-sm md:leading-6 leading-5 w-11/12 md:mt-0 mt-5">
                <div className="flex mb-[2px]">
                  <div className="md:text-2xl text-base self-start">
                    &#x2022;&nbsp;
                  </div>
                  <div>
                    <p className="mt-1">{t("sky_1")}</p>
                  </div>
                </div>
                <div className="flex mb-[2px]">
                  <div className="md:text-2xl text-base self-start">
                    &#x2022;&nbsp;
                  </div>
                  <div>
                    <p className="mt-1">{t("sky_2")}</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="md:text-2xl text-base self-start">
                    &#x2022;&nbsp;
                  </div>
                  <div>
                    <p className="mt-1">{t("sky_3")}</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="md:text-2xl text-base self-start">
                    &#x2022;&nbsp;
                  </div>
                  <div>
                    <p className="mt-1">{t("sky_4")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="font-normal text-sm leading-[18px] max-w-[920px] italic text-accent md:mt-0 mt-12 md:mx-auto">
            <p className="mb-2">{t("notice")}</p>
            <p className="mb-2">{t("note_1")}</p>
            <p>{t("note_2")}</p>
          </div>
          <a
            href="https://github.com/HashEx/public_audits/blob/master/PASS%3A%20InVariant/PASS%3A%20InVariant.pdf"
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="relative w-full md:max-w-[466px] md:h-[72px] h-16 rounded py-4 md:px-6 px-4 bg-invar-main-purple hover:bg-[#37293E] flex justify-between items-center md:mb-[219px] mb-16 lg:mx-[29px] mt-11">
              <p className="text-white font-semibold md:text-base text-sm leading-4">
                {t("audit_report")} <br />{" "}
                <span className="md:text-sm text-xs font-normal text-invar-light-grey md:whitespace-normal whitespace-nowrap">
                  {t("audited_by")}
                </span>
              </p>
              <img src="/icons/upright.svg" alt="" />
            </div>
          </a>
        </div>
        <ScrollToTop />
        <div id="footer">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default PassNFT;
