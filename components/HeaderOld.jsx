import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { AppContext } from "../context/app-context";
import { mintClosed } from "../src/utils/web3utils";
import { Discord, Twitter } from "./icons/Link";
import male from "../public/male.png";
import { ModalContext } from "../context/Modals-context";
import { useAccount, useConnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

const HeaderOld = ({ toggleClick }) => {
  const { t } = useTranslation(["index", "storyline", "common"]);
  const appCTX = useContext(AppContext);
  const modals = useContext(ModalContext);
  const router = useRouter();
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const { openConnectModal } = useConnectModal();
  return (
    <>
      {!address && (
        <button
          onClick={openConnectModal}
          className="btn connect-btn btn-primary w-full h-[48px] font-semibold text-base bg-invar-main-purple text-center normal-case	text-white absolute top-[60px] z-10 rounded-none md:hidden"
        >
          {t("connect_wallet", { ns: "common" })}
        </button>
      )}
      <div className="w-full flex flex-col justify-center items-center h-0 absolute top-[330px] z-20">
        <Link href="/media">
          <p
            className="btn w-[183px] md:w-max btnShadow bg-white 
    opacity-80 hover:bg-white hover:opacity-100 px-6 py-3 mt-4 md:mt-0 text-sm text-info 
    rounded md:top-[280px] md:right-1/4 normal-case border-none z-20 md:hidden news-btn"
          >
            News
          </p>
        </Link>

        <a
          href="https://docs.invar.finance/road-to-web3"
          rel="noopener noreferrer"
          target="_blank"
        >
          <div
            className=" md:hidden btn modal-button w-[183px] md:w-max btnShadow bg-white 
    opacity-80 hover:bg-white hover:opacity-100 px-6 py-3 mt-4 md:mt-0 text-sm text-info 
    rounded md:top-[280px] md:right-1/4 normal-case border-none z-20 learn-btn"
          >
            Docs
          </div>
        </a>
        <Link href="/rwa-reflector">
          <div
            className="btn modal-button w-[183px] md:w-max btnShadow bg-white
    opacity-80 hover:bg-white hover:opacity-100 px-6 py-3 mt-4 md:mt-0 text-sm text-info 
    rounded md:top-[449px] md:hidden  md:left-[450px] normal-case border-none z-20 reflector-btn"
          >
            {t("RWA REFLECTOR")}
          </div>
        </Link>

        <div
          onClick={() => router.push("/sftdemo")}
          className="mt-4 z-20 md:top-[375px] md:left-[738px] w-[183px] h-[48px] md:w-max btnShadow btn bg-[#FFC25F] opacity-80 hover:bg-[#FFC25F] hover:opacity-100
      rounded normal-case border-none text-base font-semibold px-[21px] flex flex-col text-[#31135E] md:hidden demo-btn"
        >
          <div className=" text-sm ">SFT Demo</div>
        </div>

        <Link href="/pass-nft">
          <div className="relative">
            <div
              className={`mt-4 z-20 md:top-[375px] md:left-[738px] w-[183px] h-[48px] md:w-max btnShadow btn pass-btn ${
                appCTX.passNftSoldOut || mintClosed
                  ? "bg-white hover:bg-white"
                  : "bg-invar-success hover:bg-invar-success"
              } opacity-80 hover:opacity-100
      rounded normal-case border-none text-base font-semibold px-[21px] flex flex-col text-[#31135E] md:hidden`}
            >
              {!appCTX.passNftSoldOut && !mintClosed && (
                <span
                  className="w-[85px] h-4 bg-invar-error rotate-[19.59deg] text-white font-semibold text-xs leading-4 top-[-2px] right-[-15px] normal-case absolute"
                  style={{
                    clipPath:
                      "polygon(0% 0%, 100% 0%, 95% 49.5%, 100% 100%, 0% 100%, 0% 50%)",
                  }}
                >
                  Public Mint
                </span>
              )}
              <div className=" text-sm ">PASS: InVariant</div>
            </div>
          </div>
        </Link>
      </div>

      <div className=" w-full min-w-full max-w-full relative bg-gradient-radial from-[#55465D] to-black ">
        <img
          className="hidden"
          // className=" cloud1 absolute top-56 md:top-[161px] -left-16 md:left-0 right-0 w-[500px] md:w-[600px] object-contain z-10 "
          draggable="false"
          src="/cloud1.png"
          alt="cloud1"
        />

        <img
          className=" cloud2 absolute top-[430px] -right-20 md:right-0 w-[600px] md:w-[600px] object-contain z-10 "
          draggable="false"
          src="/cloud2.png"
          alt="cloud2"
        />
        <div className=" relative z-0 h-screen min-h-screen w-full object-cover overflow-hidden">
          <Image
            layout="fill"
            objectFit="cover"
            draggable="false"
            src="/bg/bg.png"
            alt="modal-img"
          />
        </div>

        <label
          onClick={() => modals.setPropertyModal(true)}
          className=" hidden z-10 pr-8 w-48 h-32 hover:cursor-pointer absolute top-[62%] right-[51%] md:flex justify-end items-start"
        >
          <div className=" hidden md:flex justify-center items-center z-10">
            <span className="animate-ping absolute inline-flex h-[14px] w-[14px] rounded-full bg-invar-error opacity-75"></span>
            <span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-invar-error"></span>
          </div>
        </label>

        <Link href={"/sftdemo"}>
          <div className="z-30 hover:cursor-pointer absolute top-[46%] right-[53.5%] hidden md:flex">
            <span className="animate-ping z-[1] absolute inline-flex h-[16px] bottom-1 left-0.5 w-[16px] rounded-full bg-[#ffc25f] opacity-75"></span>

            <Image
              src="/icons/ic_arrow.svg"
              width={21}
              height={19}
              alt="arrow icon"
            />
          </div>
        </Link>

        <div>
          <a
            href="https://invar.finance/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="hover:cursor-pointer absolute top-[40%] xl:left-[25%] lg:left-[18%] left-[10%] hidden md:flex w-24 h-32 z-50"></div>
          </a>
        </div>

        <div>
          <Link href={"/sftdemo"}>
            <div className="z-10 hover:cursor-pointer absolute top-[47%] lg:right-[55%] right-[57%] hidden md:flex w-14 h-24"></div>
          </Link>
        </div>
        <Link href="/rwa-reflector">
          <div className=" z-10 w-[154px] h-10 bg-white text-info top-[54%] right-[39%] absolute rounded md:flex items-center justify-center font-semibold text-sm leading-6 btn modal-bottom btnShadow  opacity-80 border-none hover:bg-white hover:opacity-100 hidden">
            RWA REFLECTOR
          </div>
        </Link>
        {!appCTX.passNftSoldOut && !mintClosed && (
          <div
            onClick={() => modals.setPassBuyModal(true)}
            className={`z-20 w-[154px] h-10 bg-invar-success hover:bg-invar-success text-info top-[75%] lg:left-[24%] left-[18%] absolute rounded md:flex items-center justify-center font-semibold text-sm leading-6 btn modal-bottom btnShadow  opacity-80 border-none hover:opacity-100 hidden normal-case`}
          >
            <span
              className="w-[85px] h-4 bg-invar-error rotate-[19.59deg] absolute text-white font-semibold text-xs leading-4 top-[-2px] right-[-15px] normal-case"
              style={{
                clipPath:
                  "polygon(0% 0%, 100% 0%, 95% 49.5%, 100% 100%, 0% 100%, 0% 50%)",
              }}
            >
              Public Mint
            </span>
            PASS: InVariant
          </div>
        )}
        <div className="mt-[88px]  hidden absolute top-0 left-[24px] md:flex flex-row items-start justify-start h-[592px] w-[300px] text-white indent-0.5 font-normal text-sm z-10 animate-fade-in-down">
          <div className="flex flex-col items-center justify-center mr-3 ">
            <span className="flex h-3 w-3 justify-center items-center">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <div className="h-[540px] w-[1px] border-l bg-white -mt-1 z-0"></div>
          </div>
          {t("storyline_popup_story7", { ns: "storyline" })}
        </div>

        <div className=" hidden absolute bottom-0 left-0 right-0 md:flex justify-center items-center z-[11]">
          <div
            style={{ height: router.locale === "en" ? "120px" : "99px" }}
            className=" flex relative justify-start items-start text-start w-[826px] mt-6 mx-6 mb-1 p-5 pl-[87px] pr-10 bg-invar-main-purple 
bg-opacity-60 text-white text-sm font-normal leading-[19.6px] rounded-lg animate-fade-in-up"
          >
            <div className="absolute left-[-200px] bottom-[-23px] w-[374px] h-[294px]">
              <Image src={male} width={374} height={294} />
            </div>
            <div
              className="text-start flex justify-start"
              id="typeWriter"
            ></div>
          </div>
        </div>

        {router.locale === "en" && (
          <h3
            onClick={toggleClick}
            className="font-semibold md:text-[56px] md:leading-[61px] text-[24px] leading-7 text-invar-dark absolute bottom-[86px] right-6 z-10 text-right"
          >
            {t("bring")}
            <br />
            {t("real_world_asset")}
            <br />
            {t("generate")}
            <br />
            {t("real_value")}
          </h3>
        )}
        {router.locale === "tw" && (
          <h3
            onClick={toggleClick}
            className="font-semibold md:text-[56px] md:leading-[61px] text-2xl leading-7 text-invar-dark absolute bottom-[86px] right-6 z-10 text-right"
          >
            通過 現實世界資產，
            <br />
            創造 真實價值
          </h3>
        )}

        <div
          onClick={() => modals.setPassNFTModal(true)}
          className=" hidden z-10 pr-8 w-48 h-32 hover:cursor-pointer absolute top-[80%] right-[55%] lg:right-[56%] md:right-[58%] md:flex justify-end items-start"
        >
          <div className=" hidden md:flex justify-center items-center z-10">
            <span className="animate-ping absolute inline-flex h-[14px] w-[14px] rounded-full bg-invar-error opacity-75"></span>
            <span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-invar-error"></span>
          </div>
        </div>

        <div className="m-6 flex justify-between absolute bottom-[0px] right-0 z-20">
          <Twitter />
          <Discord />
        </div>
      </div>
    </>
  );
};

export default HeaderOld;
