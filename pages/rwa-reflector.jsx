import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/reflector.module.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { ethers, utils } from "ethers";
import { nftAddress } from "../src/utils/web3utils";
import inVariaJSON from "../src/utils/InVaria.json";
import { getUser } from "../src/utils/storeFirebase";
import { useAccount } from "wagmi";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "storyline",
        "propertyInfo",
        "sale",
        "dashboard",
        "reflector",
      ])),
    },
  };
}

const RwaReflector = () => {
  const [headerBackground, setHeaderBackground] = useState(false);
  const [soldNft, setSoldNft] = useState(0);
  const { address } = useAccount();

  const router = useRouter();
  const { t } = useTranslation("reflector");

  async function getdata() {
    const state = await getUser(address);
    console.log("state", state);
  }

  useEffect(() => {
    console.log("address", address);
    if (address) getdata();
    let rpcUrl;
    if (process.env.PRODUCTION === "true")
      rpcUrl = `https://mainnet.infura.io/v3/${process.env.infura_key}`;
    else rpcUrl = `https://goerli.infura.io/v3/${process.env.infura_key}`;

    console.log("rpcurl", rpcUrl.slice(0, 14));

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    const nftContract = new ethers.Contract(nftAddress, inVariaJSON, provider);
    nftContract.Sold().then((res) => {
      setSoldNft(Number(+res.toString()));
      console.log("soldNft", res.toString());
    });

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", () =>
        setHeaderBackground(window.pageYOffset > 20)
      );
    }
  }, [address]);
  return (
    <div className={styles.mediaPage}>
      <div className={styles.navWrapper}>
        <Navbar headerBackground={headerBackground} />
      </div>
      <div className={styles.pageWrapper}>
        <section className={styles.mediaSection}>
          <h1 className="md:mb-3 mb-4 md:text-[32px] md:leading-[38px] text-2xl leading-7 font-semibold ">
            RWA REFLECTOR{" "}
          </h1>
          <p className="font-normal md:text-base md:leading-6 text-sm leading-5 md:mb-0 mb-6">
            {t("activate_reflector")}{" "}
            <a
              href="https://www.youtube.com/watch?v=V8BsCq65vng&t=30s"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="underline">{t("watch_yt")}</span>
            </a>
          </p>
          <p className="font-normal text-base leading-6 md:hidden w-5/6">
            {t("bring_transparency")}
          </p>
        </section>
        <div
          className={`relative flex items-center justify-center  ${styles.reflectorSectionWrapper}`}
        >
          <h3 className="font-semibold text-[48px] leading-[57px] opacity-10  absolute top-0 left-4 md:hidden">
            {t("safu_")}
            <br />
            {t("to_earn")}
          </h3>
          <h3 className="font-semibold text-[48px] leading-[57px] opacity-10 text-right absolute bottom-0 right-4 md:hidden">
            {t("security")}
            <br />
            {t("first")}
          </h3>
          <div className={`${styles.safu} ${styles.safuSecurity}`}>
            <h3>{t("safu_to_earn")}</h3>
            <p className={styles.safuPara}>
              {t("bring_trans")}
              <br /> {t("without_loosing")}
            </p>
          </div>
          <div className={`${styles.security} ${styles.safuSecurity}`}>
            <h3>{t("sec_first")}</h3>
            <p className={styles.securityPara}>{t("legal_regulate")}</p>
          </div>
          <div className="flex justify-center relative">
            <img
              src="/rwa-reflector.png"
              width={440}
              height={360}
              alt="reflector-img"
              className="h-100 object-cover overflow-x-hidden min-h-100"
            />
            <p
              className="absolute top-[39%] sm:right-[34%] right-[31%] rotate-[-39deg] font-black text-[10px] leading-[15px] w-[137px] text-[#E3D5FA]"
              style={{ fontSize: "10px" }}
            >
              {t("connecting_connecting")}
            </p>
          </div>
        </div>
        <p className="font-normal text-lg leading-6 md:hidden mr-0 ml-12 mb-9">
          {t("legal_regulate")}
        </p>

        <section className="px-5 pb-24 max-w-[1020px] mx-auto">
          <p className="font-normal text-base leading-6 text-invar-grey md:mb-0 mb-5">
            {t("read_learn")}
          </p>

          <div className="md:flex hidden mt-5">
            <div className="flex-1"></div>
            <div className="flex-1">{t("name_type")}</div>
            <div className="flex-1 md:text-center">{t("est_return")}</div>
            <div className={`${styles.lastCol} flex-auto text-right`}>
              {t("avlbl_tokens")}
            </div>
          </div>

          {/* nft bars */}
          <div className="md:block hidden">
            <p className="font-semibold text-sm leading-4 mb-1 md:block hidden">
              {t("real_estate")}
            </p>
            <div
              className={styles.nftCard}
              onClick={() => router.push("/propertyinfo")}
            >
              <a
                href="https://opensea.io/collection/invaria-2222"
                rel="noopener noreferrer"
                target="_blank"
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-4 z-10"

              >
                <img
                  src="/opensea.png"
                  alt="opensea-img"
                  width={26}
                  height={26}
                  style={{ height: "26px", width: "26px" }}
                />
              </a>
              <div className="flex">
                <img
                  src="/reflector-amwaj.png"
                  alt="amwaj-nft"
                  width={147}
                  height={118}
                  className="md:mt-3"
                />

                <div className={styles.nftDetailCol}>
                  <p className="font-normal text-sm leading-5">
                    {t("backed_nft")}
                  </p>
                  <h5 className="font-semibold text-2xl leading-7">
                    {t("behrain_amwaj")}
                  </h5>
                  <p className="font-normal text-base leading-6 text-invar-error">
                    {t("close")}
                  </p>
                </div>
              </div>

              <p className={`${styles.percentVal} px-3`}>12.00%</p>

              <p className={`${styles.percentVal}  ${styles.tokenVal}`}>
                $0 / $20,000,000
              </p>
            </div>
          </div>

          <div
            className="nft-mobile md:hidden h-[248px] p-[22px] bg-primary rounded mb-3 cursor-pointer"
            style={{ boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.12);" }}
            onClick={() => router.push("/propertyinfo")}
          >
            <div className="h-[120px] border border-invar-dark flex justify-between rounded">
              <img
                src="/reflector-amwaj.png"
                alt="amwaj-nft"
                width={147}
                height={118}
                className="h-auto"
              />
              <div className="mt-5 pr-1.5 text-right">
                <p className="font-normal text-xs leading-[18px] text-invar-grey">
                  APR
                </p>
                <p className="font-semibold text-2xl leading-7 mb-0.5">
                  12.00%
                </p>
                <p className="font-normal text-xs leading-[18px] text-invar-grey mb-0.5">
                  Available (USDC)
                </p>
                <p className="font-semibold text-base leading-5">$0</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="font-normal text-xs leading-[18px] mb-0.5">
                {t("backed_nft")}
              </p>
              <div className="flex justify-between">
                <p className="font-semibold text-xl leading-6">
                  {t("behrain_amwaj")}
                </p>
              </div>
              <div className="flex justify-between mt-[7px] relative">
                <p className="text-invar-error font-normal text-sm leading-6">
                  {t("close")}
                </p>
                <a
                  href="https://opensea.io/collection/invaria-2222"
                  rel="noopener noreferrer"
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src="/opensea.png"
                    alt="opensea-img"
                    width={26}
                    height={26}
                    style={{ height: "26px", width: "26px" }}
                    className="absolute right-0 bottom-2 z-10"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default RwaReflector;
