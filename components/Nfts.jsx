import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import inVariaJSON from "../src/utils/InVaria.json";
import stakeABI from "../src/utils/invarstaking.json";
import {
  nftAddress,
  passAddress,
  RPC_URL,
  stakeAddress,
} from "../src/utils/web3utils";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import passJSON from "../src/utils/passABI.json";
import axios from "axios";

import IcLight from "../public/icons/ic_light.png";
import { useRouter } from "next/router";
import { useAccount, useNetwork, useSigner } from "wagmi";
import PassFactory from "./PassFactory";
import {
  ClickAwayListener,
  styled,
  Tooltip,
  tooltipClasses,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const Nfts = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const provider = signer?.provider;
  const [nfts, setnfts] = useState();
  const [staked, setstaked] = useState();
  const [burnable, setburnable] = useState();
  const [interest, setinterest] = useState();
  const [evestake, setevestake] = useState([]);
  const [infos, setinfos] = useState([]);
  const [openinfo, setopeninfo] = useState(false);
  const [tabState, setTabState] = useState("staking");
  const [openact, setopenact] = useState();
  const [inputs, setInputs] = useState({ Burnable: 0 });
  const [btnState, setBtnState] = useState();
  const [showtoast, setshowtoast] = useState(false);
  const [tt, sett] = useState("sdc");
  const [stkinfo, setstkinfo] = useState();
  const [passTokensData, setPassTokenData] = useState([]);
  const [passFactoryOpened, setPassFactoryOpened] = useState(false);
  const [openAprModal, setOpenAprModal] = useState(false);
  const [openBurnModal, setOpenBurnModal] = useState(false);
  const { t } = useTranslation("dashboard");
  const router = useRouter();

  const resetAllStates = () => {
    setnfts();
    setstaked();
    setburnable();
    setinterest();
    setevestake([]);
    setinfos([]);
    setopeninfo(false);
    setTabState("staking");
    setopenact();
    setInputs({ Burnable: 0 });
    setBtnState();
    setshowtoast(false);
    sett("sdc");
    setstkinfo();
  };

  let toast = (
    <div className=" z-40 w-screen fixed bottom-20 left-0 right-0 ">
      <div className=" flex justify-center items-center text-center w-full">
        <div className=" bg-black w-[568px] h-[52px] flex items-center justify-between px-4 text-sm font-normal text-invar-success">
          <p className="">{tt}</p>
          <div
            className="h-[30px] w-[30px] cursor-pointer"
            onClick={() => setshowtoast(false)}
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
  );

  async function getNfts() {
    try {
      console.log("get activity");
      if (!address || !provider) return;

      const nftContract = new ethers.Contract(
        nftAddress,
        inVariaJSON,
        signer?.provider
      );
      console.log("test1");
      const query = await nftContract["balanceOf(address)"](address);
      let nftBalance = query.toString();
      console.log("test2");
      setnfts(nftBalance);

      const rpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL);
      const stakeContract = new ethers.Contract(
        stakeAddress,
        stakeABI,
        provider
      );
      const stakeRpcContract = new ethers.Contract(
        stakeAddress,
        stakeABI,
        rpcProvider
      );
      console.log("test3");
      const stakebal = await stakeContract.nftBalance(address);
      console.log("test4");
      setstaked(stakebal.stakingAmount.toString());
      console.log("nftBalance", stakebal);
      console.log("test5");

      const burnbal = (await stakeContract.BurnNftInfo(address)).toString();
      console.log("test6");

      setburnable(burnbal);
      console.log("burnbal", burnbal);

      const intersts =
        +(await stakeContract.CheckClaimValue(address)).toString() / 1000000;
      console.log("test7");

      setinterest(intersts);
      console.log("test8");

      const qq = await stakeRpcContract.queryFilter(
        stakeRpcContract.filters.stakeInfo(address, null, null, null)
      );
      console.log("test10", qq);

      let infosarr = [];
      let stkarr = [];
      console.log("test11");
      for (var m = 0; m < 1000; m++) {
        try {
          const stakebal = await stakeContract.burningInfo(address, m);
          console.log("fetching burningInfo", m);
          let mm = { ...stakebal, m: m };
          infosarr.push(mm);
          console.log("mmmm", m);
        } catch (error) {
          console.log("fetching burning error", error);
          break;
        }
      }
      console.log("test12");
      console.log(
        "\n\n",
        "fetcching burning end---------------------------------\n\n"
      );

      for (var m = 0; m < 100; m++) {
        try {
          const stk = await stakeContract.stakingInfo(address, m);
          console.log("fetching stakingINFO", m);
          // console.log("stk wh", stk, stk.isUnstake, m)
          let mm = { ...stk, m: m };
          if (stk.isUnstake == false) stkarr.push(mm);
        } catch (error) {
          console.log("fetching staking error", error);
          console.log("error stk");
          break;
        }
      }
      console.log("infosarr2", stkarr);
      console.log("test16", qq);

      const items = await Promise.all(
        qq?.map(async (i, index) => {
          console.log("test14", i);
          const blockTime = new Date(i.args.stakeTime * 1000);
          // numstake = numstake + (i.args.amount).toNumber()
          const item = {
            date: blockTime.toString(),
            year: blockTime.getFullYear(),
            month: blockTime.getMonth() + 1,
            day: blockTime.getDate(),
            amount: i.args.amount.toNumber(),
            // staked: numstake,
            // unstaked: numunstake,
            txid: `${i.transactionHash}`,
          };
          return item;
        })
      );
      console.log("test13", items);
      const unfilter = stakeContract.filters.unStakeInfo(address, null, null);
      const unqq = await stakeRpcContract.queryFilter(unfilter);
      // console.log("unqq", unqq, stakeAddress, nftAddress)
      // const unitems = await Promise.all(
      //   unqq?.map(async (i, index) => {
      //     const blockTime = new Date(i.args.unstakeTime * 1000);
      //     console.log("blockTime", blockTime);
      //     const item = {
      //       date: blockTime.toString(),
      //       year: blockTime.getFullYear(),
      //       month: blockTime.getMonth() + 1,
      //       day: blockTime.getDate(),
      //       amount: i.args.amount.toNumber(),
      //       txid: `${i.transactionHash}`,
      //     };
      //     return item;
      //   })
      // );
      const i = [...infosarr].sort((a, b) => b.mm - a.mm);
      const ii = [...stkarr].sort((a, b) => b.mm - a.mm);
      setinfos(i);
      setstkinfo(ii);
      setevestake(items);
    } catch (error) {
      console.log("getNfts error", error);
    }
  }
  useEffect(() => {
    if (address && provider) {
      getNfts();
    }
    if (!address) {
      setopeninfo(false);
      resetAllStates();
    }
  }, [address, provider]);
  const theme = useTheme();

  const CustomWidthUSDCTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: "292px",
      width: "292px",
      background: "linear-gradient(180deg, #44334C 0%, #1E1722 100%)",
      padding: "28px 24px 20px 24px",
      borderRadius: "4px",
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: "rgb(25, 20, 28,0.8)",
      "&::before": {
        backgroundColor: "rgb(25, 20, 28,0.8)",
        border: "rgb(25, 20, 28,0.8)",
      },
    },
    "& .MuiTooltip-tooltip": {
      padding: "0px",
      maxWidth: "292px",
    },
  });

  const USDCInfoTooltip = (props) => {
    const { t } = useTranslation("dashboard");
    return (
      <CustomWidthUSDCTooltip
        open={openAprModal}
        title={
          <ClickAwayListener onClickAway={() => setOpenAprModal(false)}>
            <div
              className="text-xs font-normal leading-5 text-invar-light-grey rounded py-2 px-3"
              style={{ background: "rgb(25, 20, 28,0.8)" }}
            >
              <p className="font-normal text-xs leading-[18px]">
                {t("apr_warning")}
                <a
                  href={
                    router.locale === "en"
                      ? "https://docs.invar.finance/security-and-risk/risk-framework"
                      : "https://docs.invar.finance/v/tong-guo-xian-shi-zi-chan-shi-jie-chuang-zao-zhen-shi-jia-zhi/an-quan-feng-xian/feng-xian-kuang-jia"
                  }
                  rel="noreferrer"
                  target="_blank"
                  className="underline"
                >
                  {t("apr_link")}
                </a>
              </p>
            </div>
          </ClickAwayListener>
        }
        arrow
      >
        <div
          onClick={() => {
            setOpenAprModal(true);
          }}
        >
          {props.children}
        </div>
      </CustomWidthUSDCTooltip>
    );
  };

  const BurnInfoTooltip = (props) => {
    const { t } = useTranslation("dashboard");
    return (
      <CustomWidthUSDCTooltip
        open={openBurnModal}
        title={
          <ClickAwayListener onClickAway={() => setOpenBurnModal(false)}>
            <div
              className="text-xs font-normal leading-5 text-invar-light-grey rounded py-2 px-3"
              style={{ background: "rgb(25, 20, 28,0.8)" }}
            >
              <p className="font-normal text-xs leading-[18px]">
                {t("burn_warning")}
              </p>
            </div>
          </ClickAwayListener>
        }
        arrow
      >
        <div
          onClick={() => {
            setOpenBurnModal(true);
          }}
        >
          {props.children}
        </div>
      </CustomWidthUSDCTooltip>
    );
  };
  const stake = async () => {
    const stakeContract = new ethers.Contract(stakeAddress, stakeABI, signer);
    try {
      setBtnState("loading");
      // console.log(inputs.Balance, typeof inputs.Balance)
      const stake = await stakeContract.stakeNFT(inputs.Balance);
      await stake.wait();
      console.log("stake", stake);
      setBtnState("");
      getNfts();
      setopenact();
      sett(t("dashboard_nfts_stakesuccess"));
      setshowtoast(true);
    } catch (error) {
      setBtnState("");
      console.log(error);
    }
  };

  const unstake = async () => {
    const stakeContract = new ethers.Contract(stakeAddress, stakeABI, signer);
    try {
      setBtnState("loading");
      console.log(inputs.unstake, typeof inputs.unstake);
      const stake = await stakeContract.unStake(inputs.unstake);
      await stake.wait();
      console.log("stake", stake);
      setBtnState("");
      getNfts();
      setopenact();
      sett(t("dashboard_nfts_unstakesuccess"));
      setshowtoast(true);
    } catch (error) {
      setBtnState("");
      console.log(error);
    }
  };

  const burn = async () => {
    const stakeContract = new ethers.Contract(stakeAddress, stakeABI, signer);
    try {
      setBtnState("loading");
      //console.log(inputs.Burnable, typeof inputs.Burnable);
      console.log(
        "number of available burning",
        inputs.Burnable,
        typeof inputs.Burnable
      );
      const stake = await stakeContract.BurnNFT(inputs.Burnable);
      await stake.wait();
      console.log("stake", stake);
      setBtnState("");
      getNfts();
      setopenact();
      sett(t("dashboard_nfts_burn_burnsuccess"));
      setshowtoast(true);
      // location.reload()
    } catch (error) {
      setBtnState("");
      console.log(error);
    }
  };

  const claim = async () => {
    const stakeContract = new ethers.Contract(stakeAddress, stakeABI, signer);
    try {
      setBtnState("claiming");
      // console.log(inputs.Burnable, typeof inputs.Burnable)
      const stake = await stakeContract.withDraw();
      await stake.wait();
      console.log("stake", stake);
      setBtnState("");
      getNfts();
      setopenact();
      sett(t("dashboard_nfts_claimsuccess"));
      setshowtoast(true);
      // location.reload()
    } catch (error) {
      setBtnState("");
      console.log(error);
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const fetchInitialData = async () => {
    console.log("fetching Data Again");
    const nftContract = new ethers.Contract(
      passAddress,
      passJSON.abi,
      provider
    );

    const userNftCount = await nftContract.balanceOf(address);
    console.log("tokenDetails", userNftCount);
    if (+userNftCount.toString() === 0) return;

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
    console.log("tokenDetails", tokenDetails);
    tokenDetails = tokenDetails.map((t) => t.data);
    console.log("tokenDetails", tokenDetails);
    if (tokenDetails.length > 0) setPassTokenData(tokenDetails);
  };

  useEffect(() => {
    if (address && provider) fetchInitialData();
  }, [address, chain?.id, provider]);
  if (passFactoryOpened) return <PassFactory passTokens={passTokensData} />;
  return (
    <div className="relative flex min-h-[70vh] w-full border-t border-invar-main-purple">
      {showtoast && <div className=" absolute bg-black w-screen">{toast}</div>}
      <div className="w-full z-10 mt-12 mb-10">
        {(nfts == 0 &&
          staked == 0 &&
          interest == 0 &&
          passTokensData.length === 0) ||
        !address ? (
          <div className="w-full h-full flex justify-center items-center">
            <div>
              <Image width={162} height={200} src={IcLight} alt="" />
              <p className=" text-lg font-normal text-center text-invar-light-grey">
                {t("dashbaord_nfts_nodata")}
              </p>
            </div>
          </div>
        ) : (
          <>
            {!openinfo ? (
              <div className="flex sm:gap-8 gap-6 sm:flex-row flex-col flex-wrap sm:items-start items-center">
                {+nfts + +staked > 0 && (
                  <div
                    key={"amwaj"}
                    onClick={() => setopeninfo(true)}
                    className=" relative w-[300px] h-[382px] bg-black rounded overflow-hidden shadow cursor-pointer"
                  >
                    <img
                      className=" w-[300px] h-[310px]"
                      src="https://dev2988.dkotaim8jhfxo.amplifyapp.com/Renft.gif"
                      alt=""
                    />
                    <div className="px-[109px] py-6 relative">
                      <p className="font-semibold text-xl">
                        {t("dashbaord_nfts_amwaj20")}
                      </p>
                      <p
                        className="absolute top-[30px] right-4 font-normal text-xs leading-4 text-accent text-center cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push("/propertyinfo");
                        }}
                      >
                        {t("detail")}
                      </p>
                    </div>
                    <div className=" absolute top-0 left-0 m-3 p-2 bg-invar-dark bg-opacity-70 text-invar-success font-semibold text-sm rounded">
                      {t("dashbaord_nfts_nftamount", { V: +nfts + +staked })}
                    </div>
                  </div>
                )}
                {passTokensData.length > 0 &&
                  passTokensData.map((token) => {
                    let imgUrl;
                    if (token?.name?.includes("Ocean"))
                      imgUrl = "/bg/oceanInvariant.png";
                    else if (token?.name?.includes("Earth"))
                      imgUrl = "/bg/earthInvariant.png";
                    else if (token?.name?.includes("Skyline"))
                      imgUrl = "/bg/skyInvariant.png";
                    return (
                      <div
                        key={token.name}
                        className="flex flex-col items-center relative w-[300px] h-[382px] bg-black rounded overflow-hidden shadow cursor-pointer "
                      >
                        <Image
                          onClick={() => setPassFactoryOpened(true)}
                          className=" w-[300px] min-h-[310px] object-cover"
                          src={imgUrl}
                          width={300}
                          height={310}
                          alt=""
                        />
                        <div className="relative py-6 w-full">
                          <p className=" font-semibold text-xl text-center">
                            {token?.name?.slice(0, token?.name?.indexOf("#"))}
                          </p>
                          <p
                            className="cursor-pointer absolute top-[30px] right-4 font-normal text-xs leading-4 text-accent text-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push("/pass-nft");
                            }}
                          >
                            {t("detail")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <>
                <div className=" rounded overflow-hidden shadow-md md:h-[485px]">
                  <div className=" relative w-full md:flex justify-end p-9 bg-invar-main-purple">
                    <div className=" md:absolute md:top-[50%] lg:top-[36px] lg:left-9 md:left-2 flex flex-col items-center">
                      <img
                        className=" lg:w-[328px] lg:h-[354px] md:w-[250px] md:h-[254px] rounded shadow"
                        src="https://dev2988.dkotaim8jhfxo.amplifyapp.com/Renft.gif"
                        alt=""
                      />
                      <p className=" mb-6 md:mb-0 mt-6 font-semibold text-3xl text-center">
                        {t("dashbaord_nfts_info_name")}
                      </p>
                    </div>
                    <div className=" w-full md:w-60 md:mr-6">
                      <p className=" mb-2 text-center font-normal text-sm text-invar-light-grey flex items-center">
                        {t("dashbaord_nfts_info_apr")}
                        <USDCInfoTooltip>
                          <img
                            src="/icons/grey-i.svg"
                            className="cursor-pointer ml-2"
                            alt="info"
                            width={16}
                            height={16}
                          />
                        </USDCInfoTooltip>
                      </p>
                      <p className=" text-center font-semibold text-3xl ">
                        12%
                      </p>
                    </div>
                    <div className=" md:ml-4 mt-6 md:mt-0 w-full md:w-60 ">
                      <p className=" mb-2 text-center font-normal text-sm text-invar-light-grey">
                        {t("dashbaord_nfts_info_dailyinterests")}
                      </p>
                      <p className=" text-center font-semibold text-3xl ">
                        {0.657 * staked}
                      </p>
                    </div>
                  </div>
                  <div className=" w-full flex justify-end p-9 bg-[#37293E] md:justify-end justify-center lg:h-[346px]">
                    <div className=" md:grid grid-cols-2 w-[516px]">
                      {openact == "Balance" ? (
                        <div className=" w-full md:w-60">
                          <div className=" flex justify-between">
                            <p className=" mb-[2px] text-center font-normal text-sm text-invar-light-grey">
                              {t("dashbaord_nfts_info_balanece")}
                            </p>
                            <p className=" text-center font-normal text-sm text-invar-success ">
                              {nfts}
                            </p>
                          </div>
                          <input
                            name="Balance"
                            type="number"
                            onChange={handleChange}
                            value={inputs.Balance || ""}
                            min="1"
                            max={nfts}
                            required
                            className="block bg-invar-main-purple w-full h-[42px] rounded focus:border border-white text-white font-normal px-[15px]"
                          />
                          <div className="flex justify-between max-w-full">
                            <button
                              className="btn mt-3 bg-transparent w-[140px] md:w-[114px] h-[40px] font-semibold text-base border-invar-dark normal-case rounded text-invar-light-grey"
                              onClick={() => setopenact("")}
                            >
                              {t("dashbaord_nfts_info_cancle")}
                            </button>
                            <a
                              href="#stakeModal"
                              className={
                                `btn mt-3 ml-3 bg-invar-dark w-[140px] md:w-[114px] h-[40px] font-semibold text-base text-white border-none normal-case rounded` +
                                (+inputs.Balance < 1 ||
                                +inputs.Balance > nfts ||
                                inputs.Balance == undefined
                                  ? " btn-disabled"
                                  : "") +
                                (btnState == "loading" ? " loading" : "")
                              }
                              // onClick={() => stake()}
                            >
                              {t("dashbaord_nfts_info_stake")}
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className=" w-full md:w-60">
                          <p className=" mb-2 text-center font-normal text-sm text-invar-light-grey">
                            {t("dashbaord_nfts_info_balanece")}
                          </p>
                          <p
                            className={
                              ` text-center font-semibold text-3xl` +
                              (nfts == 0 ? "" : " text-invar-success")
                            }
                          >
                            {nfts}
                          </p>
                          <button
                            className={
                              `btn mt-3 w-full h-[40px] font-semibold text-base text-white border-none normal-case rounded` +
                              (nfts == 0
                                ? " btn-disabled bg-invar-disabled"
                                : " bg-invar-dark ")
                            }
                            onClick={() => setopenact("Balance")}
                          >
                            {t("dashbaord_nfts_info_stake")}
                          </button>
                        </div>
                      )}
                      {openact == "staking" ? (
                        <div className=" w-full md:w-60 md:ml-[18px]">
                          <div className=" flex justify-between">
                            <p className=" mb-[2px] text-center font-normal text-sm text-invar-light-grey">
                              {t("dashbaord_nfts_tab_staking")}
                            </p>
                            <p className=" text-center font-normal text-sm text-invar-success ">
                              {staked}
                            </p>
                          </div>
                          <input
                            name="unstake"
                            type="number"
                            onChange={handleChange}
                            value={inputs.unstake || ""}
                            min="1"
                            max={staked}
                            required
                            className="block bg-invar-main-purple w-full h-[42px] rounded focus:border border-white text-white font-normal px-[15px]"
                          />
                          <div className="flex justify-between max-w-full">
                            <button
                              className="btn mt-3 bg-transparent w-[140px] md:w-[114px] h-[40px] font-semibold text-base border-invar-dark normal-case rounded text-invar-light-grey"
                              onClick={() => setopenact("")}
                            >
                              {t("dashbaord_nfts_info_cancle")}
                            </button>
                            <a
                              href="#unstakeModal"
                              className={
                                `btn mt-3 ml-3 bg-invar-dark w-[140px] md:w-[114px] h-[40px] font-semibold text-base text-white border-none normal-case rounded` +
                                (+inputs.unstake < 1 ||
                                +inputs.unstake > staked ||
                                inputs.unstake == undefined
                                  ? " btn-disabled"
                                  : "") +
                                (btnState == "loading" ? " loading" : "")
                              }
                              // onClick={() => unstake()}
                            >
                              {t("dashbaord_activity_unstake_title")}
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className=" mt-6 md:mt-0 w-full md:w-60 md:ml-[18px]">
                          <p className=" mb-2 text-center font-normal text-sm text-invar-light-grey">
                            {t("dashbaord_nfts_tab_staking_staking")}
                          </p>
                          <p
                            className={
                              ` text-center font-semibold text-3xl ` +
                              (staked == "0" ? " " : " text-invar-success")
                            }
                          >
                            {staked}
                          </p>
                          <button
                            className={
                              `btn mt-3 w-full h-[40px] font-semibold text-base text-white border-none normal-case rounded` +
                              (staked == 0
                                ? " btn-disabled bg-invar-disabled"
                                : " bg-invar-dark")
                            }
                            onClick={() => setopenact("staking")}
                          >
                            {t("dashbaord_activity_unstake_title")}
                          </button>
                        </div>
                      )}
                      {openact == "Burnable" ? (
                        <div className=" w-full md:w-60 mt-9">
                          <div className=" flex justify-between">
                            <p className=" mb-[2px] text-center font-normal text-sm text-invar-light-grey">
                              {t("dashbaord_nfts_info_burnable")}
                            </p>
                            <p className=" text-center font-normal text-sm text-invar-success ">
                              {burnable}
                            </p>
                          </div>
                          <input
                            name="Burnable"
                            type="number"
                            onChange={handleChange}
                            value={inputs.Burnable || ""}
                            min="1"
                            max={burnable}
                            required
                            className="block bg-invar-main-purple w-full h-[42px] rounded focus:border border-white text-white font-normal px-[15px]"
                          />
                          <div className="flex justify-between max-w-full">
                            <button
                              className="btn mt-3 bg-transparent w-[140px] md:w-[114px] h-[40px] font-semibold text-base border-invar-dark normal-case rounded text-invar-light-grey"
                              onClick={() => setopenact("")}
                            >
                              {t("dashbaord_nfts_info_cancle")}
                            </button>

                            {nfts >= +inputs.Burnable && (
                              <a
                                href="#burnModal"
                                className={
                                  `btn mt-3 ml-3 bg-invar-dark w-[140px] md:w-[114px] h-[40px] font-semibold text-base text-white border-none normal-case rounded` +
                                  (+inputs.Burnable < 1 ||
                                  +inputs.Burnable > burnable ||
                                  inputs.Burnable == undefined
                                    ? " btn-disabled"
                                    : " ") +
                                  (btnState == "loading" ? " loading" : "")
                                }
                              >
                                {t("dashbaord_nfts_info_burn")}
                              </a>
                            )}
                            {nfts < +inputs.Burnable && (
                              <a
                                href="#notburnModal"
                                className={
                                  `btn mt-3 ml-3 bg-invar-dark w-[140px] md:w-[114px] h-[40px] font-semibold text-base text-white border-none normal-case rounded` +
                                  (+inputs.Burnable < 1 ||
                                  +inputs.Burnable > burnable ||
                                  inputs.Burnable == undefined
                                    ? " btn-disabled"
                                    : " ") +
                                  (btnState == "loading" ? " loading" : "")
                                }
                              >
                                {t("dashbaord_nfts_info_burn")}
                              </a>
                            )}
                            {/* <a href="#burnModal" className="btn">open modal</a> */}
                          </div>
                        </div>
                      ) : (
                        <div className=" w-full md:w-60 mr-6 mt-9">
                          <p className=" mb-2 text-center font-normal text-sm text-invar-light-grey flex items-center justify-center">
                            {t("dashbaord_nfts_info_burnable")}
                            <BurnInfoTooltip>
                              <img
                                src="/icons/grey-i.svg"
                                className="cursor-pointer ml-2"
                                alt="info"
                                width={16}
                                height={16}
                              />
                            </BurnInfoTooltip>
                          </p>
                          <p
                            className={
                              ` text-center font-semibold text-3xl ` +
                              (burnable == "0" ? " " : " text-invar-success")
                            }
                          >
                            {burnable}
                          </p>
                          <button
                            className={
                              `btn mt-3 w-full h-[40px] font-semibold text-base text-white border-none normal-case rounded` +
                              (burnable == 0
                                ? " bg-invar-disabled btn-disabled"
                                : " bg-invar-dark")
                            }
                            onClick={() => setopenact("Burnable")}
                          >
                            {t("dashbaord_nfts_info_burn")}
                          </button>
                        </div>
                      )}
                      {openact == "Interests" ? (
                        <div className=" w-full md:w-60 mt-9"></div>
                      ) : (
                        <div className=" w-full md:w-60 md:ml-[18px] mt-9">
                          <p className=" mb-2 text-center font-normal text-sm text-invar-light-grey">
                            {t("dashbaord_nfts_info_totalinterests")}{" "}
                          </p>
                          <p
                            className={
                              ` text-center font-semibold text-3xl ` +
                              (interest == "0" ? " " : " text-invar-success")
                            }
                          >
                            {interest}
                          </p>
                          <button
                            className={
                              `btn mt-3 w-full h-[40px] font-semibold text-base text-white border-none normal-case rounded` +
                              (interest == 0
                                ? " btn-disabled bg-invar-disabled"
                                : " bg-invar-dark ") +
                              (btnState == "claiming" ? " loading" : "")
                            }
                            onClick={() => claim()}
                          >
                            {t("dashbaord_nfts_info_claim")}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className=" mt-12 mb-6 flex z-10 ">
                  <button
                    className={
                      " mr-3 h-[40px] w-[130px] rounded border border-invar-main-purple text-sm font-semibold text-center" +
                      (tabState == "staking"
                        ? " text-white bg-invar-main-purple "
                        : " text-invar-light-grey hover:text-white ")
                    }
                    onClick={() => {
                      setTabState("staking");
                    }}
                  >
                    {t("dashbaord_nfts_tab_staking_staking")}
                  </button>
                  <button
                    className={
                      " sm:mr-9 h-[40px] w-[130px] rounded border border-invar-main-purple text-sm font-semibold text-center" +
                      (tabState == "activity"
                        ? " text-white bg-invar-main-purple"
                        : " text-invar-light-grey hover:text-white")
                    }
                    onClick={() => {
                      setTabState("activity");
                    }}
                  >
                    {t("dashbaord_nfts_tab_redemption")}
                  </button>
                </div>
                {tabState == "staking" && (
                  <>
                    <div className="flex justify-between border-b w-full border-invar-main-purple">
                      <p className=" pb-3 text-invar-light-grey text-sm font-normal ">
                        {t("dashbaord_nfts_tab_staking_stakingtime")}
                      </p>
                      <div className=" flex ">
                        <p className=" pb-3 text-invar-light-grey text-sm font-normal  w-12 text-left">
                          {t("dashbaord_nfts_tab_staking_staking")}
                        </p>
                        <p className=" ml-6 md:ml-[7.8rem] sm:mr-9 w-max pb-3 text-invar-light-grey text-sm font-normal w-14 min-w-14 text-right">
                          {t("dashbaord_activity_unstake_title")}
                        </p>
                      </div>
                    </div>
                    {console.log("infos", infos)}
                    {evestake?.length == 0 ? (
                      <div className=" mt-16 w-full flex justify-center items-center">
                        <div>
                          <Image
                            width={162}
                            height={200}
                            src={IcLight}
                            alt=""
                          />
                          <p className=" text-lg font-normal text-center text-invar-light-grey">
                            {t("staking-redemption-no-data")}
                          </p>
                        </div>
                      </div>
                    ) : (
                      stkinfo?.map((eve, index) => (
                        <div
                          key={index}
                          className=" py-4 flex justify-between border-b border-invar-main-purple text-white font-normal text-base"
                        >
                          <div className=" text-invar-light-grey max-w-[200px] md:max-w-none">
                            {new Date(
                              eve?.staketime.toNumber() * 1000
                            ).toString()}
                          </div>
                          <div className=" flex ">
                            <p className=" text-invar-success font-normal w-12 text-right">
                              {eve?.leftToUnstakeNFTamount.toNumber()}
                            </p>
                            <p className=" ml-6 md:ml-[7.9rem] sm:mr-9 w-max text-white font-normal w-14 text-right min-w-14">
                              {eve?.stakeNFTamount.toNumber() -
                                eve?.leftToUnstakeNFTamount.toNumber()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    {/* {eveunstake?.map((eve, index) => (
                        <div key={index} className=" py-4 flex justify-between border-b border-invar-main-purple text-white font-normal text-base">
                          <div className=" text-invar-light-grey">{eve?.date}</div>
                          <div className=' flex '>
                            <p className=" text-white  font-normal ">
                              0</p>
                            <p className=" ml-6 md:ml-48 mr-9 w-max text-invar-success font-normal ">
                              {eve?.amount}</p>
                          </div>
                        </div>
                      ))
                    } */}
                  </>
                )}
                {tabState == "activity" && (
                  <>
                    <div className="flex justify-between border-b w-full border-invar-main-purple">
                      <p className=" pb-3 text-invar-light-grey text-sm font-normal ">
                        {t("dashbaord_nfts_tab_redemption_unlocktime")}{" "}
                      </p>
                      <div className=" flex ">
                        <p className=" pb-3 text-invar-light-grey text-sm font-normal w-16 text-right">
                          {t("dashbaord_nfts_tab_redemption_unlocked")}
                        </p>
                        <p className=" ml-6 md:ml-32 pb-3 text-invar-light-grey text-sm font-normal w-14 min-w-14 text-right">
                          {t("dashbaord_nfts_tab_redemption_burnable")}
                        </p>
                        <p className=" ml-6 md:ml-32 sm:mr-9 w-max pb-3 text-invar-light-grey text-sm font-normal w-12 sm:w-14 text-right">
                          {t("dashbaord_nfts_tab_redemption_burned")}
                        </p>
                      </div>
                    </div>
                    {infos?.length == 0 ? (
                      <div className=" mt-16 w-full flex justify-center items-center">
                        <div>
                          <Image
                            width={162}
                            height={200}
                            src={IcLight}
                            alt=""
                          />
                          <p className=" text-lg font-normal text-center text-invar-light-grey">
                            {t("staking-redemption-no-data")}
                          </p>
                        </div>
                      </div>
                    ) : (
                      infos?.map((eve, index) => (
                        <>
                          {console.log(infos, "infoss")}
                          {eve?.isBurn == false && (
                            <div
                              key={index}
                              className=" py-4 flex justify-between border-b border-invar-main-purple text-white font-normal text-base"
                            >
                              <div className=" text-invar-light-grey max-w-[200px] md:max-w-none">
                                {new Date(
                                  eve?.locktime.toNumber() * 1000
                                ).toString()}
                              </div>
                              <div className=" flex">
                                <p className="text-invar-success font-normal w-16 sm:w-16 text-right">
                                  {eve?.locktime.toNumber() * 1000 > Date.now()
                                    ? eve?.burnableNFTamount.toString()
                                    : "0"}
                                </p>
                                <p className=" ml-6 md:ml-32 text-invar-success font-normal  w-14 text-right">
                                  {eve?.locktime.toNumber() * 1000 < Date.now()
                                    ? eve?.leftToBurnNFTamount.toString()
                                    : "0"}
                                </p>
                                <p className=" ml-6 md:ml-32 sm:mr-9 w-max text-white font-normal w-12 sm:w-14 text-right">
                                  {eve?.burnableNFTamount.toNumber() -
                                    eve?.leftToBurnNFTamount.toNumber()}
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      ))
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
        {openinfo && (
          <>
            <p className="text-[#B4B7C0] italic text-sm mt-8">
              {t("disclaimer_heading")}
            </p>
            <p className="text-[#B4B7C0] italic text-sm mt-2">
              {t("disclaimer_1")}
            </p>
            <p className="mt-2 text-[#B4B7C0] italic text-sm">
              {t("disclaimer_2")}
            </p>
          </>
        )}
      </div>

      {/* modals */}

      <div id="stakeModal" className="modal bg-[#000000b6] ">
        <div className="modal-box p-9 w-[432px] bg-invar-main-purple rounded">
          <h3 className=" font-semibold text-xl text-center">
            {t("dashboard_nfts_stakeconfirm", { V: inputs.Balance })}
          </h3>
          <div className="modal-action justify-center">
            <a
              href="#"
              className="btn mt-3 bg-transparent w-[140px] md:w-[114px] h-[40px] font-semibold text-base border-invar-dark normal-case rounded text-invar-light-grey"
              onClick={() => setopenact("")}
            >
              {t("dashbaord_nfts_info_cancle")}
            </a>
            <a
              href="#"
              className={
                `btn mt-3 ml-3 bg-invar-dark w-[140px] md:w-[114px] h-[40px] font-semibold text-base text-white border-none normal-case rounded` +
                (btnState == "loading" ? " loading" : "")
              }
              onClick={() => stake()}
            >
              {t("dashboard_nfts_burn_burncheck_confirm")}
            </a>
          </div>
        </div>
      </div>
      <div id="unstakeModal" className="modal bg-[#000000b6] ">
        <div className="modal-box p-9 w-[432px] bg-invar-main-purple rounded">
          <h3 className=" font-semibold text-xl text-center">
            {t("dashboard_nfts_unstakeconfirm", { V: inputs.unstake })}
          </h3>
          <div className="modal-action justify-center">
            <a
              href="#"
              className="btn mt-3 bg-transparent w-[140px] md:w-[114px] h-[40px] font-semibold text-base border-invar-dark normal-case rounded text-invar-light-grey"
              onClick={() => setopenact("")}
            >
              {t("dashbaord_nfts_info_cancle")}
            </a>
            <a
              href="#"
              className={
                `btn mt-3 ml-3 bg-invar-dark w-[140px] md:w-[114px] h-[40px] font-semibold text-base text-white border-none normal-case rounded` +
                (btnState == "loading" ? " loading" : "")
              }
              onClick={() => unstake()}
            >
              {t("dashboard_nfts_burn_burncheck_confirm")}
            </a>
          </div>
        </div>
      </div>
      <div id="burnModal" className="modal bg-[#000000b6] ">
        <div className="modal-box p-0 bg-[#37293E] rounded">
          <div className="bg-invar-main-purple px-9 py-6">
            <h3 className=" font-semibold text-xl text-center">
              {t("dashboard_nfts_burn_burncheck1")}
            </h3>
            <p className=" text-center text-invar-error">
              {t("dashboard_nfts_burn_burncheck2_1")}
            </p>
          </div>
          <div className=" flex flex-col item-center px-9 py-6">
            <h3 className=" font-semibold text-xl text-center">
              {t("dashboard_nfts_burn_burncheck2_2")}
            </h3>
            <div className="modal-action justify-center">
              <a
                href="#"
                className="btn mt-3 bg-transparent w-[140px] md:w-[114px] h-[40px] font-semibold text-base border-invar-dark normal-case rounded text-invar-light-grey"
                onClick={() => setopenact("")}
              >
                {t("dashbaord_nfts_info_cancle")}
              </a>
              <a
                href="#"
                className={
                  `btn mt-3 ml-3 bg-invar-dark w-[140px] md:w-[114px] h-[40px] font-semibold text-base text-white border-none normal-case rounded` +
                  (btnState == "loading" ? " loading" : "")
                }
                onClick={() => burn()}
              >
                {t("dashboard_nfts_burn_burncheck_confirm")}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div id="notburnModal" className="modal bg-[#000000b6] ">
        <div className="modal-box p-9 w-[423px] bg-invar-main-purple rounded">
          <h3 className=" font-semibold text-xl text-center">
            {t("dashboard_nfts_burn_unstakefirst")}
          </h3>
          <div className="modal-action w-full flex justify-center">
            <a
              href="#"
              className="btn mt-3 bg-invar-dark w-[140px] md:w-[114px] h-[40px] font-semibold text-base border-invar-dark normal-case rounded text-white"
              onClick={() => setopenact("")}
            >
              {t("dashboard_nfts_burn_unstakefirst_ok")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nfts;
