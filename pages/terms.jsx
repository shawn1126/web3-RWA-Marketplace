import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar, Footer, ScrollToTop } from "../components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { Link as ScrollLink } from "react-scroll";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "terms",
        "storyline",
        "propertyInfo",
        "sale",
        "dashboard",
      ])),
    },
  };
}

const Terms = () => {
  const { t } = useTranslation("terms");

  const titleList = [
    {
      id: "t1",
      title: t("terms_subtitle1"),
      offset: -110,
    },
    {
      id: "t2",
      title: t("terms_subtitle2"),
      offset: -110,
    },
    {
      id: "t3",
      title: t("terms_subtitle3"),
      offset: -110,
    },
    {
      id: "t4",
      title: t("terms_subtitle4"),
      offset: -110,
    },
    {
      id: "t5",
      title: t("terms_subtitle5"),
      offset: -110,
    },
    {
      id: "t6",
      title: t("terms_subtitle6"),
      offset: -110,
    },
    {
      id: "t7",
      title: t("terms_subtitle7"),
      offset: -110,
    },
    {
      id: "t8",
      title: t("terms_subtitle8"),
      offset: -110,
    },
    {
      id: "t9",
      title: t("terms_subtitle9"),
      offset: -110,
    },
    {
      id: "t10",
      title: t("terms_subtitle10"),
      offset: -110,
    },
    {
      id: "t11",
      title: t("terms_subtitle11"),
      offset: -110,
    },
  ];
  const headerBackground = true;

  useEffect(() => {
    var float = document.querySelector("#float");
    var footer = document.querySelector("#footer");

    function checkOffset() {
      function getRectTop(el) {
        var rect = el.getBoundingClientRect();
        return rect.top;
      }
      if (
        getRectTop(float) + document.body.scrollTop + float.offsetHeight >=
        getRectTop(footer) + document.body.scrollTop - 10
      ) {
        float.style.bottom = `${footer.scrollHeight + 70}px`;
        float.style.top = "unset";
      }
      if (
        document.body.scrollTop + window.innerHeight <
        getRectTop(footer) + document.body.scrollTop
      ) {
        float.style.top = "144px";
        float.style.bottom = "unset";
      }
    }

    document.addEventListener("scroll", function () {
      checkOffset();
    });
    return () => {
      document.removeEventListener("scroll", function () {
        checkOffset();
      });
    };
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#44334C] to-[#1E1722] relative">
      {/* <div className="h-20 bg-invar-dark grid place-content-center text-[#030F2B]">
        <Link href="invaria2222">
          <Image className='cursor-pointer' width={95} height={34} src='/logo_white.svg' />
        </Link>
      </div> */}
      <Navbar headerBackground={headerBackground} />
      <div className="py-16 px-6 xl:px-56 grid grid-cols-8 gap-12">
        <div className="container mt-20 text-white col-span-8 md:col-span-5 text-base font-normal">
          <p className="text-[32px] leading-[38.4px] font-semibold">
            {t("terms_title")}
          </p>
          <p className="pt-3 pb-6 ">{t("terms_updatetime")}</p>
          <p>{t("terms_intro_1")}</p>
          <br />
          <p>{t("terms_intro_2")}</p>
          <p className="text-xl font-semibold mt-[46px] mb-3" id="t1">
            {t("terms_1_title")}
          </p>
          <p>{t("terms_1_desc_1")}</p>
          <br />
          <p>{t("terms_1_desc_2")}</p>
          <br />
          <p>{t("terms_1_desc_3")}</p>
          <p className="pl-6 -indent-4">{t("terms_1_desc_4")}</p>
          <p className="pl-6 -indent-4">{t("terms_1_desc_5")}</p>
          <p className="pl-6 -indent-4">{t("terms_1_desc_6")}</p>
          <br />
          <p>{t("terms_1_desc_7")}</p>
          <br />
          <p>{t("terms_1_desc_8")}</p>
          <p className="text-xl font-semibold mt-[46px] mb-3" id="t2">
            {t("terms_2_title")}
          </p>
          <p>{t("terms_2_desc")}</p>
          <p className="text-xl font-semibold mt-[46px] mb-3" id="t3">
            {t("terms_3_title")}
          </p>
          <p>{t("terms_3_desc_1")}</p>
          <br />
          <p>{t("terms_3_desc_2")}</p>
          <p className="text-xl font-semibold mt-[46px] mb-3" id="t4">
            {t("terms_4_title")}
          </p>
          <p>{t("terms_4_desc_1")}</p>
          <br />
          <p>{t("terms_4_desc_2")}</p>
          <br />
          <p>{t("terms_4_desc_3")}</p>
          <br />
          <p>{t("terms_4_desc_4")}</p>
          <p className="pl-6 -indent-4">{t("terms_4_desc_5")}</p>
          <p className="pl-6 -indent-4">{t("terms_4_desc_6")}</p>
          <p className="pl-6 -indent-4">{t("terms_4_desc_7")}</p>
          <p className="pl-6 -indent-4">{t("terms_4_desc_8")}</p>
          <br />
          <p>{t("terms_4_desc_9")}</p>

          <p className="pl-6 -indent-4">{t("terms_4_desc_10")}</p>
          <p className="pl-6 -indent-4">{t("terms_4_desc_11")}</p>
          <p className="pl-6 -indent-4">{t("terms_4_desc_12")}</p>
          <p className="pl-6 -indent-4">{t("terms_4_desc_13")}</p>
          <p className="pl-6 -indent-4">{t("terms_4_desc_14")}</p>
          <p className="pl-6 -indent-4">{t("terms_4_desc_15")}</p>
          <p className="pl-6 -indent-4">{t("terms_4_desc_16")}</p>
          <br />
          <p>{t("terms_4_desc_17")}</p>
          <p className="text-xl font-semibold mt-[46px] mb-3" id="t5">
            {t("terms_5_title")}
          </p>
          <p>{t("terms_5_desc_1")}</p>
          <br />
          <p>{t("terms_5_desc_2")}</p>
          <p className="text-xl  font-semibold mt-[46px] mb-3" id="t6">
            {t("terms_6_title")}
          </p>
          <p>{t("terms_6_desc_1")}</p>
          <br />
          <p>{t("terms_6_desc_2")}</p>
          <br />
          <p>{t("terms_6_desc_3")}</p>
          <p className="text-xl  font-semibold mt-[46px] mb-3" id="t7">
            {t("terms_7_title")}
          </p>

          <p>{t("terms_7_desc_1")}</p>
          <br />
          <p>{t("terms_7_desc_2")}</p>
          <br />
          <p>{t("terms_7_desc_3")}</p>
          <br />
          <p>{t("terms_7_desc_4")}</p>
          <br />
          <p>{t("terms_7_desc_5")}</p>
          <br />
          <p>{t("terms_7_desc_6")}</p>
          <p className="text-xl font-semibold mt-[46px] mb-3" id="t8">
            {t("terms_8_title")}
          </p>
          <p>{t("terms_8_desc")}</p>
          <p className="text-xl font-semibold mt-[46px] mb-3" id="t9">
            {t("terms_9_title")}
          </p>
          <p>{t("terms_9_desc")}</p>
          <p className="text-xl font-semibold mt-[46px] mb-3" id="t10">
            {t("terms_10_title")}
          </p>
          <p>{t("terms_10_desc")}</p>
          <p className="text-xl font-semibold mt-[46px] mb-3" id="t11">
            {t("terms_11_title")}
          </p>
          <p>{t("terms_11_desc_1")}</p>
          <br />
          <p>{t("terms_11_desc_2")}</p>
        </div>
        <div
          className="md:col-span-3 hidden md:block fixed top-[149px] right-6 xl:right-52"
          id="float"
        >
          <div className=" bg-invar-dark px-6 pt-6 pb-3 rounded text-invar-light-grey">
            {titleList.map((item, index) => (
              <div key={index} className="pb-3 hover:underline" id={item.id}>
                <ScrollLink
                  activeClass="active"
                  offset={item.offset}
                  smooth
                  spy
                  to={item.id}
                >
                  <p>{item.title}</p>
                </ScrollLink>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ScrollToTop />

      <div id="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Terms;
