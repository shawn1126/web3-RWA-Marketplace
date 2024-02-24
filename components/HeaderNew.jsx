import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { Discord, Twitter } from "./icons/Link";

const HeaderNew = ({ toggleClick, animateStart }) => {
  const [showTerms, setShowTerms] = React.useState(false);

  const router = useRouter();
  const { t } = useTranslation(["index", "storyline", "common"]);

  const onClickHideTerms = () => {
    setShowTerms(false);
    const date = new Date();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const expirationDate = date.getTime() + thirtyDays;
    localStorage.setItem("termsExpirationDate", expirationDate);
  };

  useEffect(() => {
    const termsExpirationDate = localStorage.getItem("termsExpirationDate");
    const date = new Date();
    if (termsExpirationDate) {
      if (date.getTime() > termsExpirationDate) {
        setShowTerms(true);
      } else {
        setShowTerms(false);
      }
    } else {
      setShowTerms(true);
    }
  }, []);

  return (
    <div className="header-wrapper relative">
      <div className="md:pt-[140px] pt-[106px] w-screen h-screen relative md:bg-[url('/new-header-bg.png')] bg-[url('/new-header-mb.png.png')] bg-no-repeat bg-center bg-cover">
        {showTerms && (
          <div className="fixed z-50 bottom-0 md:left-1/2 left-5 md:w-[70%] md:max-w-[673px] max-w-[277px] md:w-unset w-[235px] h-[111px] md:h-[72px] bg-[#44334C] md:translate-x-[-50%] flex md:px-5 p-2.5 md:justify-center justify-between items-center gap-[10px] rounded ">
            <p className="font-normal md:text-sm text-xs leading-[18px] md:leading-[21px] md:max-w-full max-w-[186px]">
              <span>{t("acceptingTerms")}</span>{" "}
              <Link href={"/terms"}>
                <span className="underline">{t("terms")}</span>
              </Link>
              {t("have_read")}
            </p>
            <button
              className="text-black border-none md:py-[11.5px] md:px-[12.5px] py-1 px-2.5 bg-white rounded-3xl font-semibold text-base leading-4 md:relative absolute bottom-4 md:bottom-0 md:right-0 right-2 md:h-auto md:w-auto w-[38px] h-[23px] md:q-full"
              onClick={onClickHideTerms}
            >
              <span className="md:block hidden">Agree</span>
              <span className="md:hidden flex justify-center">OK</span>
            </button>
          </div>
        )}
        <div className="md:hidden absolute left-0 top-0 w-full h-full bg-[url('/new-header-mb.png')]"></div>
        <div className="md:ml-[6.25%] ml-[30px]">
          <h1 className="font-semibold md:text-[56px] text-[36px] md:leading-[61px] leading-[43px]">
            {router.locale == "en" ? (
              <>
                {t("bring")} <br className="md:hidden" /> {t("real_world")}
                <br className={router.locale == "tw" ? "hidden" : "block"} />
                {t("asset")}
                <br className="md:hidden" /> {t("generate")}
                <br /> {t("real_value")}
              </>
            ) : (
              <span>
                通過
                <br />
                真實世界資產
                <br />
                創造
                <br />
                真實價值
              </span>
            )}
          </h1>
          <p className="md:mt-1.5 mt-2.5 font-normal md:text-base text-sm md:leading-6 leading-5 md:max-w-[495px] max-w-[300px] mb-5">
            {t("header_description")}
          </p>
          <Link href="/rwa-reflector">
            <button className="relative z-[1] py-[0.72rem] px-[1.33rem] rounded-3xl font-semibold text-base leading-6 bg-white text-black">
              {t("view_rwa")}
            </button>
          </Link>
        </div>
        <div
          className={`md:flex hidden items-end absolute right-0 bottom-[103px] ${
            animateStart && "small-header-bottom"
          }`}
        >
          {!animateStart && (
            <div className="h-[127px] w-[1px] bg-white mr-3"></div>
          )}
          <div>
            <Image
              onClick={toggleClick}
              src="/bg/bg.png"
              className={`${animateStart && "small-header"}`}
              width={304}
              height={162}
              alt="InVaria2222 meta-journey"
            />
            {!animateStart && (
              <p className="font-nomral text-base leading-6 text-accent">
                {t("meta_journey")}
              </p>
            )}
          </div>
        </div>
        <div className="m-6 mr-4 ml-5 flex justify-between absolute bottom-[0px] right-0 z-20">
          <Twitter />
          <Discord />
        </div>
      </div>
    </div>
  );
};

export default HeaderNew;
