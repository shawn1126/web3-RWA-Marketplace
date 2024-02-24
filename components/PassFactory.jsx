import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import passNftMobileImage from "../public/passDash/passnftmobImg.png";
import earthNftImage from "../public/passDash/earth.png";
import oceanNftImage from "../public/passDash/ocean.png";
import skyNFTImage from "../public/passDash/sky.png";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { passAddress } from "../src/utils/web3utils";
import passJSON from "../src/utils/passABI.json";
import axios from "axios";
import { ethers } from "ethers";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const PassFactory = ({ passTokens }) => {
  const [earthTokens, setEarthTokens] = useState(
    passTokens.filter((t) => t?.name?.includes("Earth"))
  );
  const [oceanTokens, setOceanTokens] = useState(
    passTokens.filter((t) => t?.name?.includes("Ocean"))
  );
  const [skyTokens, setSkyTokens] = useState(
    passTokens.filter((t) => t?.name?.includes("Skyline"))
  );
  const [toast, setToast] = useState({ open: false, error: false, text: "" });

  const { address } = useAccount();

  const [loading, setLoading] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [mergeSuccess, setMergeSuccess] = useState(false);
  const [startAnimate, setStartAnimate] = useState(false);

  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const provider = signer?.provider;
  const { t } = useTranslation("passnft");
  const router = useRouter();

  console.log("earthoceansky", earthTokens, oceanTokens, skyTokens);
  const animationHandler = () => {
    setStartAnimate(true);
    setTimeout(() => {
      setStartAnimate(false);
    }, 5000);
  };
  let loadingInterval;
  useEffect(() => {
    if (!mergeSuccess && loading && loadingPercentage > 90) {
      return;
    } else if (mergeSuccess && loading && loadingPercentage <= 100) {
      loadingInterval = setInterval(() => {
        if (loadingPercentage > 96) {
          console.log("end reached");
          setLoadingPercentage(100);
          setLoading(false);
          setStartAnimate(true);
        } else if (loadingPercentage < 97)
          setLoadingPercentage(loadingPercentage + 5);
      }, 200);
    } else if (!mergeSuccess && loading && loadingPercentage < 50) {
      loadingInterval = setInterval(() => {
        setLoadingPercentage(loadingPercentage + 3);
      }, 200);
    } else if (!mergeSuccess && loading && loadingPercentage >= 50) {
      loadingInterval = setInterval(() => {
        setLoadingPercentage(loadingPercentage + 1);
      }, 200);
    }
    return () => clearInterval(loadingInterval);
  }, [mergeSuccess, loading, loadingPercentage]);

  const getProof = async (t1, t2) => {
    const apiResult = await axios.post("api/multiproof", { t1, t2 });
    const treeResult = apiResult.data;

    const root = treeResult.root;
    // const proof = treeResult.proof;
    const earthProof = treeResult.earthProof;
    const oceanProof = treeResult.oceanProof;

    console.log("generated multiproof", { earthProof, oceanProof, root });
    return { earthProof, oceanProof, root };
  };
  const refreshData = async () => {
    const nftContract = new ethers.Contract(
      passAddress,
      passJSON.abi,
      provider
    );

    const userNftCount = await nftContract.balanceOf(address);
    if (+userNftCount.toString() === 0) {
      setEarthTokens([]);
      setOceanTokens([]);
      setSkyTokens([]);
      return;
    }

    let tokenPromises = [];
    for (let i = 0; i < +userNftCount.toString(); i++) {
      const tokenId = nftContract.tokenOfOwnerByIndex(address, i);
      tokenPromises.push(tokenId);
    }
    let tokenIds = await Promise.all(tokenPromises);
    tokenIds = tokenIds.map((t) => t.toString());

    let tokensData = tokenIds.map((t) =>
      axios.get(
        `https://asia-southeast1-invaria2222.cloudfunctions.net/invar-pass-metadata/${+t.toString()}`
      )
    );
    let tokenDetails = await Promise.all(tokensData);
    tokenDetails = tokenDetails.map((t) => t.data);
    console.log("tokenDetails", tokenDetails);
    setEarthTokens(tokenDetails.filter((t) => t?.name?.includes("Earth")));
    setOceanTokens(tokenDetails.filter((t) => t?.name?.includes("Ocean")));
    setSkyTokens(tokenDetails.filter((t) => t?.name?.includes("Skyline")));
  };
  const premiumMintHandler = async () => {
    try {
      let earth = +earthTokens[0]?.name?.split("#")[1];
      let ocean = +oceanTokens[0]?.name?.split("#")[1];
      // verifyToken(earth,ocean);
      setLoading(true);
      const passContract = new ethers.Contract(
        passAddress,
        passJSON.abi,
        signer
      );
      const { earthProof, oceanProof } = await getProof(earth, ocean);
      const combinedProof = [earthProof, oceanProof];
      const res = await passContract.premiumMint(combinedProof, [earth, ocean]);
      await res.wait();
      console.log(res.toString());
      console.log("premium", res);
      setEarthTokens(earthTokens.splice(1));
      setOceanTokens(oceanTokens.splice(1));
      setMergeSuccess(true);
      setLoading(false);
      setLoadingPercentage(0);
      await refreshData();
      setToast({
        open: true,
        error: false,
        text: `${t("success_message")}`,
        // text: "You have successfully merged the PASS NFTs.",
      });
    } catch (e) {
      setLoading(false);
      setLoadingPercentage(0);
      await refreshData();
      setToast({
        open: true,
        error: true,
        text: `${t("failed_message")}`,
        // text: "Merge failed! Please try again or check if own any available NFT.",
      });
    }
  };

  console.log("startAnimation", startAnimate);
  return (
    <div className="xl:px-0 md:px-3 mt-[70px] md:mt-0">
      <div className="block relative h-auto w-4/5 md:hidden mb-factory">
        <Image
          src={passNftMobileImage}
          alt="pass nft mobile"
          className={`w-full h-full object-contain `}
        />
        <div
          className={`${
            startAnimate ? "earth-animation-sm" : ""
          } absolute top-8 w-[65%] left-[29%] ${
            earthTokens.length == 0 && "opacity-20"
          } ${earthTokens.length > 0 && "z-20"}`}
        >
          <Image
            src={earthNftImage}
            alt="earth-nft img"
            className="rounded w-full h-full object-contain"
          />
          {!startAnimate && earthTokens.length > 0 && (
            <h3 className="font-semibold text-2xl leading-7 text-center mt-4">
              {t("earth_invariant")}
            </h3>
          )}
          {!startAnimate && earthTokens.length > 0 && (
            <div className="flex mt-1 gap-2">
              {earthTokens.map((n, i) => (
                <div
                  key={i}
                  className="min-w-[54px] h-7 bg-invar-grey font-normal text-base leading-6 flex items-center justify-center rounded"
                >
                  <p>{n.name.slice(n.name.indexOf("#")).replace(" ", "")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div
          className={`${
            startAnimate ? "ocean-animation-sm" : ""
          }  absolute top-[26.3%] w-[65%] left-[30%]  ${
            oceanTokens.length == 0 && "opacity-20"
          } ${oceanTokens.length > 0 && "z-20"}`}
        >
          <Image
            src={oceanNftImage}
            alt="ocean-nft img"
            className="rounded w-full h-full object-contain"
          />
          {oceanTokens.length > 0 && (
            <h3 className="font-semibold text-2xl leading-7 text-center mt-4">
              {t("ocean_invariant_title")}
            </h3>
          )}
          {oceanTokens.length > 0 && (
            <div className="flex mt-1 gap-2">
              {oceanTokens.map((n, i) => (
                <div
                  key={i}
                  className="min-w-[54px] h-7 bg-invar-grey font-normal text-base leading-6 flex items-center justify-center rounded"
                >
                  <p>{n.name.slice(n.name.indexOf("#")).replace(" ", "")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="absolute top-[63.6%] w-full">
          {!startAnimate && (
            <Fragment>
              {!loading ? (
                <button
                  // disabled={earthTokens.length == 0 || oceanTokens.length == 0}
                  disabled={true}
                  onClick={premiumMintHandler}
                  className="absolute w-[90%] font-semibold max-w-[295px] left-[20%] btn text-base leading-5  px-[75px] disabled:bg-invar-grey disabled:text-invar-light-grey bg-invar-dark text-white border-none h-10"
                >
                  {t("merge")}
                </button>
              ) : (
                <div className="w-[100px] left-[1.75rem] h-10 flex items-center justify-center border-invar-success border rounded absolute">
                  <div
                    className="h-[38px] top-0 left-0 absolute flex-1 bg-invar-success opacity-50 rounded-l-rounded"
                    style={{ width: `${loadingPercentage}%` }}
                  ></div>
                  <p className="z-20 absolute text-xs font-semibold">
                    {t("loading")}...
                  </p>
                </div>
              )}
            </Fragment>
          )}
        </div>
        {skyTokens.length > 0 && (
          <div
            className={`${
              startAnimate ? "skyline-animation-sm" : ""
            } skyline-img-cont absolute sm:bottom-[-0.4%] bottom-[-1%] sm:left-[20%] w-[79%] min-w-[296px] min-h-[319px] left-[17%]`}
          >
            <Image
              src={skyNFTImage}
              alt="earth-nft img"
              className="rounded w-full h-full object-contain"
            />
            {skyTokens.length > 0 && (
              <h3 className="font-semibold text leading-10 text-center mt-3 text-[32px] whitespace-nowrap">
                {t("skyline_invariant")}
              </h3>
            )}
            {skyTokens.length > 0 && (
              <div className="flex mt-1 gap-2">
                {skyTokens.map((n, i) => (
                  <div
                    key={i}
                    className="min-w-[54px] h-7 bg-invar-grey font-normal text-base leading-6 flex items-center justify-center rounded"
                  >
                    <p>{n.name.slice(n.name.indexOf("#")).replace(" ", "")}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div
        className={`factory-description flex items-end flex-col mt-[4.5rem]  px-4 max-w-[564px] font-normal text-base leading-6 ml-auto relative z-30 ${
          skyTokens.length > 0 && "pt-9 md:pt-0"
        }`}
      >
        <div>
          <p
            className="inline"
            dangerouslySetInnerHTML={{ __html: t("pass_nft_description1") }}
          ></p>{" "}
          <a href="https://twitter.com/InVarFinance" className="underline ">
            {t("invar_finance")}
          </a>
          , {t("pass_nft_description2")}
        </div>
        <p className="mt-2 w-full">{t("pass_nft_description3")}</p>
        <div className="flex items-center mt-4">
          <Link href="/pass-nft" className="text-accent mr-0.5 relative z-20">
            {t("detail_page")}
          </Link>
          <Image
            src="/passDash/arrow-right.svg"
            width={20}
            height={20}
            alt="arrow-right"
          />
        </div>
      </div>
      <div className="factory-container hidden md:block relative bottom-28 z-10">
        <div
          className={`absolute left-[-1px] top-[21px] rounded desktop-earth-token ${
            earthTokens.length == 0 && "opacity-20"
          } ${earthTokens.length > 0 && "z-20"} ${
            startAnimate ? "earth-animation" : ""
          }`}
        >
          <Image
            src="/passDash/earth.png"
            width={230}
            height={242}
            alt="earth-nft img"
            className="rounded"
          />
          {!startAnimate && earthTokens.length > 0 && (
            <h3 className="font-semibold text-2xl leading-7 text-center mt-5 d-earth-heading">
              {t("earth_invariant")}
            </h3>
          )}
          {!startAnimate && earthTokens.length > 0 && (
            <div className="flex mt-3 gap-3 d-token-list">
              {earthTokens.map((n, i) => (
                <div
                  key={i}
                  className="w-16 h-7 bg-invar-grey font-normal text-base leading-6 flex items-center justify-center rounded"
                >
                  <p>{n.name.slice(n.name.indexOf("#")).replace(" ", "")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div
          className={`absolute left-[-1px] rounded desktop-ocean-token ${
            oceanTokens.length == 0 && "opacity-20 bottom-[18px]"
          } ${
            oceanTokens.length > 0 && "z-20 lg:bottom-[-72px] bottom-[-65px]"
          } ${startAnimate ? "occean-animation" : ""} `}
        >
          <Image
            src="/passDash/ocean.png"
            width={230}
            height={242}
            alt="ocean-nft img"
            className="rounded"
          />
          {!startAnimate && oceanTokens.length > 0 && (
            <h3 className="font-semibold text-2xl leading-7 text-center mt-5 d-ocean-heading">
              {t("ocean_invariant_title")}
            </h3>
          )}
          {oceanTokens.length > 0 && (
            <div className="flex mt-3 gap-3 d-token-list">
              {oceanTokens.map((n, i) => (
                <div
                  key={i}
                  className="w-16 h-7 bg-invar-grey font-normal text-base leading-6 flex items-center justify-center rounded"
                >
                  <p>{n.name.slice(n.name.indexOf("#")).replace(" ", "")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="z-10 relative desktop-factory">
          <Image
            src="/passDash/factory.png"
            width={1018}
            height={766}
            alt="factory-img"
          />
          {!startAnimate && (
            <Fragment>
              {!loading ? (
                <button
                  disabled={true}
                  // disabled={earthTokens.length == 0 || oceanTokens.length == 0}
                  onClick={premiumMintHandler}
                  className={`btn d-merge-btn  text-base leading-5 absolute top-[57.5%] ${
                    router.locale == "en" ? "left-[43%]" : "left-[44.2%]"
                  } px-[75px] h-[52px] disabled:bg-invar-grey disabled:text-invar-light-grey bg-invar-dark text-white border-none font-semibold normal-case`}
                >
                  {t("merge")}
                </button>
              ) : (
                <div className="top-[59%] left-[46.5%] w-[137px] h-10 flex items-center justify-center border-invar-success border rounded absolute">
                  <div
                    className="h-10 top-0 left-0 absolute flex-1 bg-invar-success opacity-50 rounded-l-rounded"
                    style={{ width: `${loadingPercentage}%` }}
                  ></div>
                  <p className="z-20 absolute text-xs font-semibold">
                    {t("loading")}...
                  </p>
                </div>
              )}
            </Fragment>
          )}
        </div>
        <div
          className={`absolute right-[-30px] top-[24%] rounded z-20 desktop-skyline-token ${
            skyTokens.length == 0 || loading ? "opacity-0" : ""
          } ${startAnimate ? "skyline-animation" : ""}`}
        >
          <Image
            src="/passDash/sky.png"
            width={295}
            height={317}
            alt="sky-nft img"
            className="rounded"
          />
          {skyTokens.length > 0 && (
            <h3 className="font-semibold text-2xl leading-7 text-center lg:mt-5 mt-3 d-ocean-heading d-sky-heading">
              Skyline InVariant
            </h3>
          )}
          {skyTokens.length > 0 && (
            <div className="flex mt-3 gap-3 d-token-list">
              {skyTokens.map((n, i) => (
                <div
                  key={i}
                  className="w-16 h-7 bg-invar-grey font-normal text-base leading-6 flex items-center justify-center rounded"
                >
                  <p>{n.name.slice(n.name.indexOf("#")).replace(" ", "")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {toast.open && (
        <div className=" z-40 w-screen fixed sm:bottom-12 bottom-8 left-0 right-0 ">
          <div className=" flex justify-center items-center text-center w-full">
            <div
              className={`bg-black sm:w-[568px] sm:h-[52px] w-[343px] h-[74px] flex items-center justify-between px-4 text-sm font-normal ${
                toast.error ? "text-invar-error" : "text-invar-success"
              }`}
            >
              <p className="">{toast.text}</p>
              <div
                className="h-[30px] w-[30px] cursor-pointer"
                onClick={() => setToast({ ...toast, open: false })}
              >
                <img
                  className="h-[24px] w-[24px] cursor-pointer"
                  src="/icons/ic_close.svg"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassFactory;
