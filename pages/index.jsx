import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ClickAwayListener, MenuItem, TextField } from "@mui/material";
import { useRouter } from "next/router";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["landingPage"])),
    },
  };
}

function App() {
  const [openLangMenu, setOpenLangMenu] = useState(false);
  const router = useRouter();

  const { t } = useTranslation("landingPage");
  return (
    <div className="relative overscroll-none allflame overflow-hidden h-full">
      <div className="relative z-40">
        {openLangMenu && (
          <ClickAwayListener onClickAway={() => setOpenLangMenu(false)}>
            <div
              style={{
                background: "linear-gradient(180deg, #44334C 0%, #1E1722 100%)",

              }}
              className="absolute w-36 h-[85px] sm:right-[24px] right-4 sm:top-[72px] top-[64px] flex flex-col justify-center rounded"
            >
              <MenuItem
                onClick={() => {
                  setOpenLangMenu(false);
                }}
                sx={{
                  color: router.locale === "en" ? "white" : "#8F97A3",
                  fontWeight: router.locale === "en" ? "600" : "400",
                  "&.MuiMenuItem-root": {
                    minHeight: 36
                  },
                  "& a": {
                    width: "100%"
                  }
                }}
              >
                <Link href={router.pathname} locale="en" className="w-full">
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
                  "&.MuiMenuItem-root": {
                    minHeight: 36
                  },
                  "& a": {
                    width: "100%"
                  }

                }}
              >
                <Link href={router.pathname} locale="tw" className="w-full">
                  繁體中文
                </Link>
              </MenuItem>
            </div>
          </ClickAwayListener>
        )}
      </div>
      <div className="absolute top-20 xl:top-20 left-0 right-0 ml-auto mr-auto w-[134px] md:w-[223.33px] ">
        <Image width={223.33} height={80} src="/logo_white.svg"  alt="modal-img"  />
      </div>
      <button
        onClick={() => setOpenLangMenu((v) => !v)}
        className="btn btn-sm border-0 rounded h-[40px] w-[40px] absolute right-4 top-4 sm:right-6 sm:top-6 px-[4px] py-[4px] font-semibold text-sm text-white normal-case bg-primary "
      >
        <img
          className="h-[20px] w-[20px]"
          src="/icons/ic_language.svg"
          alt=""
        />
      </button>


      <img
        className="w-full min-h-screen max-h-full h-screen object-cover object-left-top overflow-hidden "
        src="/bg/cover_new.jpeg"
        alt="cover"
      />
      <div className="absolute top-40 md:top-60 left-0 right-0 ml-auto mr-auto text-center">
        <p className="text-[#E3D5FA] text-3xl mx-6 xl:mx-0 md:text-5xl font-semibold">
          {t("image_title")}
        </p>
        <Link href="/invaria2222" target="_blank">
            <button className="z-50 btn w-max h-12 text-center bg-invar-dark hover:bg-invar-dark normal-case text-sm md:text-base text-white font-semibold mt-6 md:mt-4 px-7 rounded border-none">
              {t("image_launchapp")}
            </button>
        </Link>
      </div>

      <div className="absolute top-80 md:top-[440px] lg:top-[400px] left-6 right-6 md:right-16 ml-auto mr-auto text-center md:text-right">
        <p className="text-[#E3D5FA]">{t("image_desc_1")}</p>
        <p className="text-[#E3D5FA]">{t("image_desc_2")}</p>
      </div>

      <footer className="absolute flex flex-col md:flex-row md:items-center md:justify-center left-6 right-0 mx-auto bottom-[35px] font-semibold text-white text-sm ">
        <p className="mx-1 select-none">© 2022 InVaria2222</p>
        <p className="mx-1 hidden md:block font-normal">|</p>
        <div className="flex">
          <div>
            <Link href="/terms">
              <p className="mx-1 hover:underline cursor-pointer">
                {t("image_terms")}
              </p>
            </Link>
          </div>
          <div>
            <Link href="/privacy">
              <p className="mx-1 hover:underline cursor-pointer">
                {t("image_privacy")}
              </p>
            </Link>
          </div>
        </div>
      </footer>
      <div className="absolute flex justify-end right-6 mx-auto bottom-[25px]  ">
        <a
          className="mr-3"
          href="https://twitter.com/InVarFinance"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/twitter.svg" width={40} height={40} alt="Logo" />
        </a>
        <a
          href="https://discord.gg/BrzPWYut4p"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/discord.svg" width={40} height={40} alt="Logo" />
        </a>
      </div>
    </div>
  );
}

export default App;
