import React, { useContext, useEffect, useState } from "react";

import { Twitter, Discord } from "../components/icons/Link";
import { ScrollToTop, Footer, Navbar } from "../components";

import Image from "next/image";
//import { disableScroll } from "../src/utils/disableScroll";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//import { Link as ScrollLink } from "react-scroll";

import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { ModalContext } from "../context/Modals-context";
import { mintClosed } from "../src/utils/web3utils";
import { AppContext } from "../context/app-context";
import { useAccount, useConnect } from "wagmi";
import MobileWalletConnect from "../components/MobileWalletConnect";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import male from "../public/male.png";
import HeaderOld from "../components/HeaderOld";
import HeaderNew from "../components/HeaderNew";
import realWorldImage from "../public/v2imgs/image_intro_en.png";
import trustMinimized from "../public/v2imgs/trust-minimized.png";
import nftImage from "../public/v2imgs/nft.png";
import nftbgImg from "../public/v2imgs/nft-bg.png";
import nftImageSm from "../public/v2imgs/real-nft-sm.png";
import circleLg1 from "../public/v2imgs/circle/circle-lg1.png";
import circleLg2 from "../public/v2imgs/circle/circle-lg2.png";
import circleLg3 from "../public/v2imgs/circle/circle-lg3.png";
import circleLg4 from "../public/v2imgs/circle/circle-lg4.png";

export const endtimestamp = 1664582400000;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "index",
        "common",
        "storyline",
        "propertyInfo",
        "sale",
        "dashboard",
      ])),
    },
  };
}

function App() {
  const [headerBackground, setHeaderBackground] = useState(false);
  const [currentTVL, setCurrentTVL] = useState("");
  const [interestAccured, setInterestAccured] = useState("");
  const [changeHeaderStart, setChangeHeaderStart] = useState(false);
  const [toggleHeader, setToggleHeader] = useState(false);

  const [toggleWallet, setToggleWallet] = useState(false);
  const [showConnected, setShowConnected] = useState(false);

  const { t } = useTranslation(["index", "storyline", "common"]);
  const router = useRouter();
  const { address } = useAccount();

  let timeout;
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", () =>
        setHeaderBackground(window.pageYOffset > 20)
      );
      if (window.pageYOffset < 10) {
        setShowConnected(true);
      }
      timeout = setTimeout(() => {
        setShowConnected(false);
      }, 5000);
      return () => {
        window.removeEventListener("scroll", () =>
          setHeaderBackground(window.pageYOffset > 20)
        );
        clearTimeout(timeout);
      };
    }
  }, []);

  useEffect(() => {
    if (!address && toggleWallet) setToggleWallet(false);
    if (!currentTVL) {
      axios
        .get("https://api.llama.fi/tvl/invar-finance")
        .then((response) => {
          console.log("currentTVL", response.data);
          setCurrentTVL(response.data);
        })
        .catch((e) => console.log(e));

      axios
        .get(
          "https://asia-east1-invaria2222.cloudfunctions.net/total-interest-accrued"
        )
        .then((response) => {
          console.log("interestaccured", response.data.totalInterestAccrued);
          setInterestAccured(Number(response.data.totalInterestAccrued));
        })
        .catch((e) => console.log(e));
    }
  }, []);

  const [toggleWallet2, setToggleWallet2] = useState(false);
  const { openConnectModal } = useConnectModal();

  let typewriterTW =
    "”完成了！“ 多雷米拉盯著凌亂的電纜纏繞在一起的量子機器，“PASS” 字樣閃閃發光顯現著。多雷米拉花了數週時間與科學團隊合作，為部落治理和經濟公平分配製造特殊憑證，目的是創造一種可識別的方式，讓更多人體驗到在 InVaria 探索中的收穫，也是給先行者的額外獎勵。";
  let typewriterEN =
    "“It’s complete!”. Dyoremira staring at the quantum machine intertwined by messy cables, the “PASS” shining aside it. Dyoremira spends several weeks with science team to manufacture special credentials for tribes governance and fair economic distribution. Purpose is for creating an identifiable method to let more people experience the acquisition from InVaria exploration, as well as rewarding to the pioneers.";
  useEffect(() => {
    const node = document.getElementById("typeWriter");
    if (!node) return;
    let timer;
    let text;
    let i = 0;
    node.textContent = "";
    if (router.locale === "tw") text = typewriterTW;
    else text = typewriterEN;
    function typeWriter() {
      if (i < text.length) {
        node.innerHTML += text.charAt(i);
        i++;
        timer = setTimeout(typeWriter, 20);
      }
    }
    typeWriter();
    return () => {
      clearTimeout(timer);
    };
  }, [router.locale, toggleHeader]);
  const toggleClickHandler = () => {
    setChangeHeaderStart(true);
    setTimeout(() => {
      setToggleHeader((prevState) => !prevState);
      setChangeHeaderStart(false);
    }, 4000);
  };
  const CIRCLE_LG = [
    {
      name: t("do_kyc_first"),
      description: t("do_kyc_first_desc"),
      image: circleLg1,
      width: "193px",
      height: "186px",
    },
    {
      name: t("mint_rwa_nft"),
      description: t("mint_rwa_nft_desc"),
      image: circleLg2,
      width: "225px",
      height: "216px",
    },
    {
      name: t("finance_investment"),
      description: t("finance_investment_desc"),
      image: circleLg3,
      width: "225px",
      height: "216px",
    },
    {
      name: t("hold_sell_redeem"),
      description: t("hold_sell_redeem_desc"),
      image: circleLg4,
      width: "193px",
      height: "186px",
    },
  ];
  return (
    <div className=" min-w-full max-w-full relative overscroll-none overflow-hidden h-full scrollbar-hide">
      {toggleWallet2 && (
        <MobileWalletConnect setToggleWallet={(e) => setToggleWallet2(e)} />
      )}
      <Navbar headerBackground={headerBackground} />

      {/* {address && showConnected && (
        <button className="w-full h-[48px] font-semibold text-base text-invar-success text-center normal-case absolute top-[60px] z-10 rounded-none md:hidden pointer-events-none">
          {t("connected_wallet", { ns: "common" })}
        </button>
      )} */}

      {toggleHeader && (
        <HeaderOld toggleClick={() => setToggleHeader((s) => !s)} />
      )}
      {!toggleHeader && (
        <HeaderNew
          toggleClick={toggleClickHandler}
          animateStart={changeHeaderStart}
        />
      )}

      {/* <div className="tvl-bg ">
        <div className="relative mx-auto max-w-[1112px] lg:h-[265px] h-[380px] w-full px-4 lg:pt-6 pt-4 lg:pb-7 pb-4 ">
          <div className="hidden lg:flex">
            <div className="flex items-center border border-[#413148] flex-1 relative">
              <Link href="/propertyinfo">
                <label className="w-full h-full top-0 right-0 absolute cursor-pointer z-[1]"></label>
              </Link>
              <div className="w-6 h-[109px] bg-invar-success roounded mr-6 hidden lg:block"></div>
              <div className="w-[89px] h-[91px] mr-4 ">
                <Image
                  width={89}
                  height={91}
                  src="/amwaj-sm.png"
                  alt="modal-img"
                />
              </div>
              <div className="flex justify-between items-center lg:mr-12 flex-1 lg:flex-row flex-col">
                <div>
                  <h6 className="font-normal text-sm leading-5 text-white mb-0.5">
                    {t("b_real_estate")}
                  </h6>
                  <p className="font-semibold text-2xl leading-7">Amwaj20</p>
                </div>
                <div>
                  <h6 className="font-normal text-sm leading-5 text-white mb-0.5">
                    {t("est_apr")}
                  </h6>
                  <p className="font-semibold text-2xl leading-7">12%</p>
                </div>
                <div>
                  <h6 className="font-normal text-sm leading-5 text-white mb-0.5">
                    {t("token_val")}
                  </h6>
                  <p className="font-semibold text-2xl leading-7">
                    $20,000,000
                  </p>
                </div>
              </div>
            </div>
            <div className="border border-[#413148] rounded ml-6 lg:flex items-center hidden">
              <div className="w-6 h-[109px] bg-[#646A79] roounded mr-6 relative"></div>
              <div className="w-[89px] h-[91px]  border border-[#646A79] mr-4 relative">
                <span className="w-[23px] h-[1px] absolute top-1/2 right-1/2 bg-[#646A79] translate-y-1/2 translate-x-1/2"></span>
                <span className="w-[1px] h-[23px] absolute top-[26%] right-1/2 bg-[#646A79] translate-y-1/2 translate-x-1/2"></span>
              </div>
              <div className="mr-4">
                <p className="font-normal text-sm leading-5 text-invar-grey">
                  {t("developing")}
                </p>
                <p className="font-semibold text-2xl leading-7 text-invar-grey">
                  ...
                </p>
              </div>
            </div>
          </div>

          <div className="lg:flex justify-between mt-1 hidden ml-[50px] mr-10 lg:mt-7">
            <div className="my-auto md:flex-col flex-row flex">
              <p
                className={`font-semibold text-2xl leading-7 md:mr-0 sm:mr-5 mr-4`}
              >
                {t("curr_tvl")}
              </p>
              <p className="font-semibold text-[44px] leading-[52px]">
                {currentTVL
                  .toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                  .slice(0, -3)}
              </p>
            </div>

            <div className="my-auto md:flex-col flex-row flex">
              <p
                className={`font-semibold text-2xl leading-7 md:mr-0 sm:mr-5 mr-4`}
              >
                {t("interest_accured")}
              </p>
              <p className="font-semibold text-[44px] leading-[52px]">
                {interestAccured.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
            </div>

            <div className="flex items-end relative top-2">
              <a
                href="https://defillama.com/protocol/invar-finance"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Image
                  src="/bg/lama.png"
                  width={130}
                  height={93}
                  alt="lama-img"
                />
              </a>
              <span className="mb-5 text-[#E3D5FA] text-base font-normal rotate-[7.6deg]">
                We’re in
                <br />
                DefiLlama
              </span>
            </div>
          </div>

          <div className="lg:hidden border border-[#413148] rounded mb-[18px]">
            <div className="h-3 w-full rounded bg-invar-success"></div>
            <div className="flex px-4 relative">
              <Link href="/propertyinfo">
                <label className="w-full h-full top-0 right-0 absolute cursor-pointer z-[1]"></label>
              </Link>

              <div className="w-[122px] h-[125px] mr-4 mt-2.5 mb-6">
                <Image
                  width={122}
                  height={125}
                  src="/amwaj-sm.svg"
                  // src="/amwaj-sm.png"
                  alt="modal-img"
                />
              </div>
              <div>
                <h6 className="font-normal text-xs leading-[18px] mt-1">
                  {t("b_real_estate")}
                </h6>
                <p className="font-semibold text-xl leading-6 mb-1">Amwaj20</p>
                <h6 className="font-normal text-xs leading-[18px]">
                  {t("est_apr")}
                </h6>
                <p className="font-semibold text-xl leading-6 mb-1">12%</p>

                <h6 className="font-normal text-xs leading-[18px]">
                  {t("token_val")}
                </h6>
                <p className="font-semibold text-xl leading-6 mb-1">
                  $20,000,000
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-l border-r border-[#413148] rounded h-9 flex items-center justify-center text-invar-grey font-normal text-sm leading-5 lg:hidden">
            <span>...</span>
          </div>
          <div className="px-4 relative bottom-4 lg:hidden">
            <div className="flex justify-between">
              <p className="font-semibold text-[19px] leading-10">
                {t("curr_tvl")}
              </p>
              <p className="font-semibold text-[30px] leading-[38px]">
                {currentTVL
                  .toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                  .slice(0, -3)}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold text-[19px] leading-10">
                {t("interest_accured")}
              </p>
              <p className="font-semibold text-[30px] leading-[38px]">
                {interestAccured.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
            </div>
            <div className="relative bottom-2">
              <div className="flex items-start justify-center ">
                <a
                  href="https://defillama.com/protocol/invar-finance"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div className="relative bottom-0">
                    <Image
                      src="/lama.svg"
                      // src="/bg/lama.png"
                      width={116}
                      height={75}
                      alt="lama-img"
                    />
                  </div>
                </a>
                <span className="mt-5 text-[#E3D5FA] text-base font-normal rotate-[7.6deg]">
                  We’re in
                  <br />
                  DefiLlama
                </span>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className={styles.firstHalfbg}>
        <section className={`${styles.introSection} ${styles.sidesSpacing}`}>
          <div className={styles.exploreContWrapper}>
            <div className={styles.exploreLeft}>
              <h3 className={`${styles.h3} hidden md:block`}>
                {t("explore_benefit1")}
                <br
                  className={router.locale == "tw" ? "hidden" : "block"}
                />{" "}
                {t("explore_benefit2")}
                <br
                  className={router.locale == "tw" ? "hidden" : "block"}
                />{" "}
                {t("explore_benefit3")}
              </h3>
              <h3
                className={`${styles.h3} ${
                  router.locale == "tw" ? "!w-[100%]" : "!w-[90%]"
                } md:hidden`}
              >
                {t("explore_benefit_sm")}
              </h3>
              <p className={`${styles.p}`}>
                {t("homepage_intro_desc1")}
                <br />
                <br />
                {t("homepage_intro_desc2")}
              </p>
            </div>
            <div className={styles.exploreRight}>
              {/* <Image
                src={realWorldImage}
                alt={t("homepage_intro_desc1")}
                width={558}
                height={448}
              /> */}
              <div className="relative">
                <Image
                  src={
                    router.locale === "tw"
                      ? "/v2imgs/explore-nft-tw.png"
                      : "/v2imgs/image_intro_en.png"
                  }
                  width={558}
                  height={448}
                  alt="modal-img"
                />
                <div className="absolute w-20 h-[75px] flex items-center flex-col sm:left-[40%] sm:bottom-[25%] left-[35%] bottom-[18%]">
                  <span className="wm:text-base sm:text-base text-xs">
                    Youtube
                  </span>
                  <a
                    href="https://www.youtube.com/watch?v=ECLc-XO6VTA"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <div className="sm:w-16 sm:h-11 w-10 h-7 bg-[#646A79] hover:bg-[#FF0000] sm:rounded-2xl rounded-[10px] flex items-center">
                      <img
                        src="/icons/ic_play.svg"
                        width={23}
                        height={23}
                        alt="invar youtube"
                        className="sm:w-[23px] sm:h-[23px] w-4 h-4 ml-auto sm:mr-[18px] mr-[11px]"
                      />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="hidden md:block mini-modal-section max-w-[1270px] m-auto px-5 w-full mt-10 mb-20 md:mb-[100px] md:mt-[66px]">
          <h3 className={`${styles.h3} text-center w-full`}>
            {t("how_it_works")}
          </h3>
          <div className="flex gap-5 justify-center items-center [&>*:first-child]:pt-[18px] [&>*:last-child]:pt-[18px]">
            {CIRCLE_LG.map((item, index) => (
              <div
                key={item.name}
                className="flex flex-col items-center justify-between h-[325px] relative"
              >
                {index !== CIRCLE_LG.length - 1 && (
                  <img
                    src="/arrow-right.png"
                    className="absolute top-[6.5rem] right-[-3rem] w-[25%] h-2"
                  />
                )}
                <div className={`relative`}>
                  <Image
                    src={item.image}
                    alt={item.description}
                    width={item.width}
                    height={item.height}
                  />
                  <h4
                    className={`${
                      router.locale == "tw" ? "text-lg" : "text-2xl"
                    } font-semibold ${styles.circleLgTitle} w-full text-center`}
                  >
                    {item.name}
                  </h4>
                </div>
                <p className="w-[100%]">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
        <section className=" mt-7 mb-[90px] md:hidden">
          <h2 className="font-semibold text-2xl leading-7 text-center mb-[28px]">
            {t("how_it_works")}
          </h2>

          <div className="flex justify-center items-center px-1">
            <div className="w-[360px] h-[1170px] relative">
              <Image
                src="/verticle-circles.png"
                alt="circle img"
                width={360}
                height={1010}
              />
              <h5 className="text-xl font-semibold absolute top-[70px] left-[26px] w-[35%] text-center">
                {t("do_kyc_first")}
              </h5>
              <p className="text-sm font-normal absolute top-[155px] right-0 w-[60%]">
                {t("do_kyc_first_desc")}
              </p>
              <h5 className="text-xl font-semibold absolute top-[348px] right-[28px] w-[40%] text-center">
                {t("mint_rwa_nft")}
              </h5>
              <p className="text-sm font-normal absolute top-[445px] left-0 w-[60%]">
                {t("mint_rwa_nft_desc")}
              </p>
              <h5 className="text-xl font-semibold absolute top-[644px] left-[32px] w-[40%] text-center">
                {t("finance_investment")}
              </h5>
              <p className="text-sm font-normal absolute top-[766px] right-0 w-[60%]">
                {t("finance_investment_desc")}
              </p>
              <h5 className="text-xl font-semibold absolute top-[950px] right-[56px] w-[40%] text-center">
                {t("hold_sell_redeem")}
              </h5>
              <p className="text-sm font-normal absolute bottom-[25px] left-0 w-[60%]">
                {t("hold_sell_redeem_desc")}
              </p>
            </div>
          </div>
          <div className="flex justify-end mr-10">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-[130px] h-[45px] rounded-3xl bg-white text-black font-semibold"
            >
              {t("get_started")}
            </button>
          </div>
        </section>
        <section className="hidden md:flex mini-modal-section max-w-[1270px] m-auto px-5 w-full mt-10 pb-20 md:pb-[152px]">
          <div className="w-[63.7%] relative flex items-center">
            <Image
              src={trustMinimized}
              width={785}
              height={413}
              alt="modal-img"
            />
          </div>
          <div
            className={`flex-1  ${
              router.locale == "tw"
                ? "max-w-[364px] min-w-[364px] mt-12"
                : "min-w-[350px] mt-8"
            }`}
          >
            <h3
              className={`font-semibold text-[32px] leading-[38px] ${
                router.locale === "tw" && "ml-[52px]"
              }`}
            >
              {t("trust_minimized")}
            </h3>
            <div className="mt-9 ml-[52px] font-normal text-base leading-6">
              <p className="mb-10">{t("invaria_open_platform")}</p>
              <p>{t("trust_min")}</p>
              <button
                onClick={() => router.push("/dashboard")}
                className="hidden md:flex justify-center items-center w-[130px] h-12 text-black bg-white text-base font-semibold rounded-3xl mt-[20px]"
              >
                {t("get_started")}
              </button>
            </div>
          </div>
        </section>
        <section className="mini-modal-mob md:mb-10 md:hidden">
          {/* <h3
            className={`font-semibold text-2xl leading-7 text-center mb-6 px-4 ${
              router.locale === "tw" && "w-3/4 m-auto sm:block hidden"
            }`}
          >
            {t("trust_minimized")}
          </h3> */}
          <h3
            className={`font-semibold text-2xl leading-7 mb-6 px-4 text-center`}
          >
            {t("trust_minimized_sm1")}
            <br />
            {t("trust_minimized_sm2")}
          </h3>
          <p className="font-normal text-sm leading-6 mb-6 px-4">
            {t("invaria_open_platform")}
          </p>
          <div className="flex flex-col relative sm:h-auto h-[630px]">
            <div className="w-[327px] h-[312px]">
              <Image
                src="/modal-img-3.png"
                width={327}
                height={312}
                alt="modal-img"
              />
            </div>
            <div className="absolute w-[261px] h-[386px] left-32 top-28">
              <Image
                src="/modal-img-2.png"
                width={261}
                height={386}
                alt="modal-img"
              />
            </div>
            <div className="w-[152px] h-[384px] relative bottom-16">
              <Image
                src="/modal-img-1.png"
                width={152}
                height={384}
                alt="modal-img"
              />
            </div>
          </div>
          <p className="font-normal text-sm leading-6 mt-2 px-4">
            {t("trust_min")}{" "}
          </p>
        </section>

        {/* <span id="mindmapoutside" className="relative bottom-28"></span>
        <section
          id="mindmap"
          className={`${styles.mindmapSection} ${styles.sidesSpacing}`}
        >
          <h3 className={styles.h3}>{t("homepage_mindmap_title")}</h3>
          <p className={`${styles.p}`}>{t("homepage_mindmap_desc")}</p>
        </section> */}

        {/* <section id="storyline" className={styles.phase1}>
          <div className={`${styles.phase1Content} ${styles.sidesSpacing}`}>
            <div className={styles.phase1Left}></div>

            <div className={styles.phase1Right}>
              <h5 className={styles.h5}>{t("homepage_mindmap_phaseone")}</h5>
              <h3 className={styles.h3}>
                {t("homepage_mindmap_phaseone_title")}
              </h3>
              <p className={styles.p}>{t("homepage_mindmap_phaseone_desc")}</p>
              <ul className={styles.ul}>
                <li>{t("homepage_mindmap_phaseone_point1")}</li>
                <li>{t("homepage_mindmap_phaseone_point2")}</li>
                <li>{t("homepage_mindmap_phaseone_point3")}</li>
                <li>{t("homepage_mindmap_phaseone_point4")}</li>
              </ul>
            </div>
          </div>
        </section> */}
      </div>
      <div className={styles.secondHalfbg}>
        {/* <section className={styles.phase2}>
          <div className={`${styles.phase2Content} ${styles.sidesSpacing}`}>
            <div className={styles.phase2Left}>
              <h5 className={styles.h5}>{t("homepage_mindmap_phasetwo")}</h5>
              <h3 className={styles.h3}>
                {t("homepage_mindmap_phasetwo_title")}
              </h3>
              <p className={styles.p}>{t("homepage_mindmap_phasetwo_desc")}</p>
              <ul className={`${styles.ul} text-sm md:text-base`}>
                <li>{t("homepage_mindmap_phasetwo_point1")}</li>
                <li>{t("homepage_mindmap_phasetwo_point2")}</li>
                <li>{t("homepage_mindmap_phasetwo_point3")}</li>
              </ul>
            </div>
            <div className={styles.phase2Right}></div>
          </div>
        </section> */}

        {/* <section className={`${styles.phase3} md:mb-[120px]`}>
          <div className={`${styles.phase1Content} ${styles.sidesSpacing}`}>
            <div className={styles.phase3Left}></div>
            <div className={`${styles.phase1Right} ${styles.phase3Right}`}>
              <h5 className={styles.h5}>{t("homepage_mindmap_phasethree")}</h5>
              <h3 className={styles.h3}>
                {t("homepage_mindmap_phasethree_title")}
              </h3>
              <p className={styles.p}>
                {t("homepage_mindmap_phasethree_desc")}
              </p>
              <ul className={styles.ul}>
                <li className="text-sm md:text-base">
                  {t("homepage_mindmap_phasethree_point1")}
                </li>
              </ul>
            </div>
          </div>
        </section> */}
        <span id="faqoutside" className="relative bottom-28"></span>
        {/* <section
          id="faq"
          className={`${styles.faqSection} ${styles.sidesSpacing}`}
        >
          <h3 className={`${styles.h3} text-center`}>FAQ</h3>

          <CollapseMenu
            heading={t("faq_1_title")}
            para={<p className={styles.p}>{t("faq_1_desc")}</p>}
          />
          <CollapseMenu
            heading={t("faq_2_title")}
            para={<p className={styles.p}>{t("faq_2_desc")}</p>}
          />
          <CollapseMenu
            heading={t("faq_3_title")}
            para={
              <>
                <p className={styles.p}>
                  <span className="purpleGrey">{t("faq_3_desc_1")}</span>
                  {t("faq_3_desc_2")}
                </p>
                <br />
                <Link href="/terms">
                  <p className={`${styles.p} m-0`}>
                    {t("faq_3_desc_3")}
                    <span className="purple">{t("faq_3_desc_4")}</span>
                    {t("faq_3_desc_5")}
                  </p>
                </Link>
              </>
            }
          />
          <CollapseMenu
            heading={t("faq_4_title")}
            para={<p className={styles.p}>{t("faq_4_desc")}</p>}
          />
          <CollapseMenu
            heading={t("faq_5_title")}
            para={
              <p className={styles.p}>
                {t("faq_5_desc_1")}
                <span className="purpleGrey">{t("faq_5_desc_2")}</span>
                {t("faq_5_desc_3")} (
                <a
                  className="linksColor"
                  href="https://twitter.com/InVarFinance"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
                ,
                <a
                  className="linksColor"
                  href="https://discord.com/invite/BrzPWYut4p"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  Discord
                </a>
                ){t("faq_5_desc_4")}.
              </p>
            }
          />

          <CollapseMenu
            heading={t("faq_6_title")}
            para={
              <p className={styles.p}>
                {t("faq_6_desc_1")}
                <span className="purpleGrey">{t("faq_6_desc_2")}</span>
                <span className="linksColor text-semibold">
                  <a
                    className="linksColor"
                    href="https://coinmarketcap.com/currencies/usd-coin/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("faq_6_desc_3")}
                  </a>
                </span>
                <span className="purpleGrey">{t("faq_6_desc_4")}</span>
                {t("faq_6_desc_5")}
                <a
                  className="linksColor"
                  href="https://ethereum.org/en/developers/docs/gas/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("faq_6_desc_6")}
                </a>
                {t("faq_6_desc_7")}
              </p>
            }
          />
          <CollapseMenu
            heading={t("faq_7_title")}
            para={
              <p className={styles.p}>
                <span className="purpleGrey">{t("faq_7_desc_1")}</span>
                {t("faq_7_desc_2")}
              </p>
            }
          />
          <CollapseMenu
            heading={t("faq_8_title")}
            para={
              <p className={styles.p}>
                {t("faq_8_desc_1")}
                <span className="purpleGrey">{t("faq_8_desc_2")}</span>
              </p>
            }
          />
          <CollapseMenu
            heading={t("faq_9_title")}
            para={<p className={styles.p}>{t("faq_9_desc")}</p>}
          />
          <CollapseMenu
            heading={t("faq_10_title")}
            para={
              <p className={styles.p}>
                <span className="purpleGrey">{t("faq_10_desc_1")}</span>
                {t("faq_10_desc_2")}
              </p>
            }
          />
          <CollapseMenu
            heading={t("faq_11_title")}
            para={
              <>
                <p className={styles.p}>
                  <span className="purpleGrey">{t("faq_11_desc_1")}</span>
                  {t("faq_11_desc_2")}
                </p>
                <br />
                <p className={`${styles.p} m-0`}>
                  <span className="purpleGrey">{t("faq_11_desc_3")}</span>
                  {t("faq_11_desc_4")}
                </p>
              </>
            }
          />
          <CollapseMenu
            heading={t("faq_12_title")}
            para={
              <>
                <ul
                  style={{ marginTop: "12px", marginLeft: "20px" }}
                  className={styles.ul}
                >
                  <li>
                    {t("faq_12_desc_1")}
                    <br />{" "}
                    <p className={`${styles.p} m-0`}>
                      {t("faq_12_desc_2")}
                      <span className=" text-invar-grey font-semibold break-all">
                        {t("faq_12_desc_3")}
                      </span>{" "}
                    </p>{" "}
                    <p className={`${styles.p} m-0`}>
                      {t("faq_12_desc_4")}
                      <span className=" text-invar-grey font-semibold break-all">
                        {t("faq_12_desc_5")}
                      </span>
                    </p>
                  </li>
                  <li>
                    {t("faq_12_desc_6")}
                    <br />{" "}
                    <p className={`${styles.p} m-0`}>
                      <span className=" text-invar-grey font-semibold break-all">
                        {t("faq_12_desc_7")}
                      </span>{" "}
                    </p>
                  </li>
                </ul>
              </>
            }
          />
          <CollapseMenu
            heading={t("faq_13_title")}
            para={
              <p className={styles.p}>
                {t("faq_13_desc_1")} (
                <a
                  className="linksColor"
                  href="https://twitter.com/InVarFinance"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
                ,
                <a
                  className="linksColor"
                  href="https://discord.com/invite/BrzPWYut4p"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  Discord
                </a>
                ) {t("faq_13_desc_2")}{" "}
                <a
                  href="mailto:info@invar.finance"
                  className="linksColor"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  info@invar.finance
                </a>
                {t("faq_13_desc_3")}
              </p>
            }
          />
        </section>
        <section className={`${styles.tutorialSection} ${styles.sidesSpacing}`}>
          <h3 className={`${styles.h3} text-center`}>Tutorials</h3>
          <CollapseMenu
            heading={t("tutorials_1_title")}
            para={
              <>
                <p className={styles.p}>{t("tutorials_1_desc_1")}</p>
                <br />
                <p className={`m-0 ${styles.p}`}>
                  {t("tutorials_1_desc_2")}
                  <span className="text-invar-error font-semibold">
                    {t("tutorials_1_desc_3")}
                  </span>
                </p>
              </>
            }
          />
          <CollapseMenu
            heading={t("tutorials_2_title")}
            para={<p className={styles.p}>{t("tutorials_2_desc_1")}</p>}
          />
          <CollapseMenu
            heading={t("tutorials_3_title")}
            para={<p className={styles.p}>{t("tutorials_3_desc_1")}</p>}
          />
          <CollapseMenu
            heading={t("tutorials_4_title")}
            para={<p className={styles.p}>{t("tutorials_4_desc_1")}</p>}
          />
          <CollapseMenu
            heading={t("tutorials_5_title")}
            para={<p className={styles.p}>{t("tutorials_5_desc_1")}</p>}
          />
        </section> */}

        <section className={`${styles.partnersSection} ${styles.sidesSpacing}`}>
          <h3 className={`${styles.h3} text-center`}>{t("partners_title")}</h3>
          <div className={styles.partnerSectionWrapper}>
            <a
              href="https://www.affluxcon.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className={`${styles.logoCont} `}>
                <div className="flex items-center">
                  <div className="sm:w-[150px] sm:h-[76px] w-[120px] h-[74px] bg-[url('/affux.png')] sm:hover:bg-[url('/affux_hover.png')]  bg-cover" />
                </div>
              </div>
            </a>

            <a
              href="https://www.circle.com/en/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className={`${styles.logoCont}`}>
                <div className={styles.logo1}></div>
              </div>
            </a>

            <a
              href="https://app.crossspace.io/login"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className={`${styles.logoCont} `}>
                <div className="flex items-center">
                  <div className="sm:w-[150px] sm:h-[60px] w-[120px] h-[74px] bg-[url('/CrossSpace.png')] sm:hover:bg-[url('/CrossSpace_hover.png')]  bg-cover" />
                </div>
              </div>
            </a>

            <a
              href="https://www.catchonlabs.xyz/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className={`${styles.logoCont}`}>
                <div className={styles.logo2}></div>
              </div>
            </a>
            <a
              href="https://cerestoken.io/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className={`${styles.logoCont}`}>
                <div className={styles.logo6}></div>
              </div>
            </a>
            <a
              href="https://flowbay.co/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className={`${styles.logoCont}`}>
                <div className={styles.logo3}></div>
              </div>
            </a>
            <a
              href="https://headdao.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className={`${styles.logoCont}`}>
                <div className={styles.logo4}></div>
              </div>
            </a>
            <a
              href="https://hashex.org/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className={`${styles.logoCont}`}>
                <div className={styles.logo5}></div>
              </div>
            </a>
            <a
              href="https://www.kryptogo.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className={`${styles.logoCont}`}>
                <div className={styles.logo7}></div>
              </div>
            </a>
            <a
              href="https://www.xpacebbs.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className={`${styles.logoCont} `}>
                <div className="flex items-center">
                  <div className="sm:w-[150px] sm:h-[76px] w-[88px] h-[67px] bg-[url('/linkalive-black.png')] sm:hover:bg-[url('/linkalive.png')]  bg-cover" />
                </div>
              </div>
            </a>

            <a
              href="https://moledao.io/#/starter"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className={`${styles.logoCont} `}>
                <div className="flex items-center">
                  <div className="sm:w-[150px] sm:h-[76px] w-[88px] h-[67px] bg-[url('/moledao.png')] sm:hover:bg-[url('/moledao_hover.png')]  bg-cover" />
                </div>
              </div>
            </a>

            <a
              href="https://www.okx.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className={`${styles.logoCont} `}>
                <div className="flex items-center">
                  <div className="sm:w-[150px] sm:h-[76px] w-[88px] h-[67px] bg-[url('/okx_img.png')] sm:hover:bg-[url('/okx_img_hover.png')]  bg-cover" />
                </div>
              </div>
            </a>

            <a
              href="https://twitter.com/PlayEstates"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className={`${styles.logoCont} `}>
                <div className="flex items-center">
                  <div className="sm:w-[150px] sm:h-[110px] w-[120px] h-[74px] bg-[url('/playEstate-black.png')] sm:hover:bg-[url('/playEstate.png')]  bg-cover" />
                </div>
              </div>
            </a>

            <a
              href="https://www.routerprotocol.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className={`${styles.logoCont}`}>
                <div className={styles.logo8}></div>
              </div>
            </a>
            <a
              href="https://sftlabs.io/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className={`${styles.logoCont} `}>
                <div className="flex items-center">
                  <div className="sm:w-[150px] sm:h-[30px] w-[120px] h-[74px] bg-[url('/sftlabs-black.png')] sm:hover:bg-[url('/sftlabs.png')]  bg-cover" />
                </div>
              </div>
            </a>
          </div>
        </section>
        {/* <section className="hidden md:flex mini-modal-section max-w-[1270px] m-auto px-5 w-full mt-10 mb-[130px] relative">
          <div>
            <div
              className={`${styles.h3} absolute ${
                router.locale == "tw" ? "right-[240px]" : "right-[148px]"
              }  top-[80px] z-[2] flex flex-col items-end`}
            >
              <h3>{t("nft_real1")}</h3>
              <h3 className="ml-9">{t("nft_real2")}</h3> */}
        {/* <button
                onClick={() =>
                  router.push({
                    pathname: "/dashboard",
                    query: {
                      kyc: true,
                    },
                  })
                }
                className="hidden md:flex justify-center items-center w-[130px] h-12 text-black bg-white text-base font-semibold rounded-3xl mt-[20px]"
              >
                {t("go_kyc")}
              </button> */}
        {/* </div>
            <div className="relative">
              <Image
                src={nftbgImg}
                alt="invar nft"
                width={504}
                height={393}
                className={styles.realNftBgImage}
              />
              <Image
                src={nftImage}
                alt={"nft image"}
                width={688}
                height={388}
                className="relative z-[1]"
              />
            </div>
          </div>
        </section> */}
        {/* <section className="mb-[80px] relative h-[440px] md:hidden">
          <div className="flex justify-center">
            <h3
              className={`${styles.h3} text-center w-[80%] min-[380px]:w-[70%]`}
            >
              {t("nft_real1")} {t("nft_real2")}
            </h3>
          </div>
          <Image src={nftImageSm} alt="invar nft" width={511} height={287} />
          <button
            onClick={() =>
              router.push({
                pathname: "/dashboard",
                query: {
                  kyc: true,
                },
              })
            }
            className={`absolute ${
              router.locale == "tw" ? "top-[223px]" : "top-[250px]"
            }  right-[28px] flex justify-center items-center w-[130px] h-[46px] text-black bg-white text-base font-semibold rounded-3xl mt-[20px] md:hidden`}
          >
            {t("go_kyc")}
          </button>
        </section> */}
        <ScrollToTop />
        <Footer />
      </div>
    </div>
  );
}

export default App;
