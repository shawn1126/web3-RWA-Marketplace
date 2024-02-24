import { ButtonMailto } from "../components/icons/Link";
import Image from "next/image";
import Link from "next/link";
import { Navbar, Footer, ScrollToTop } from "../components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Link as ScrollLink } from "react-scroll";
import { useEffect } from "react";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "privacy",
        "storyline",
        "propertyInfo",
        "sale",
        "dashboard",
      ])),
    },
  };
}

const Privacy = () => {
  const { t } = useTranslation("privacy");
  const router = useRouter();
  const titleList = [
    {
      id: "p1",
      title: t("privacy_subtitle1"),
    },
    {
      id: "p2",
      title: t("privacy_subtitle2"),
    },
    {
      id: "p3",
      title: t("privacy_subtitle3"),
    },
    {
      id: "p4",
      title: t("privacy_subtitle4"),
    },
    {
      id: "p5",
      title: t("privacy_subtitle5"),
    },
    {
      id: "p6",
      title: t("privacy_subtitle6"),
    },
    {
      id: "p7",
      title: t("privacy_subtitle7"),
    },
    {
      id: "p8",
      title: t("privacy_subtitle8"),
    },
    {
      id: "p9",
      title: t("privacy_subtitle9"),
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
            {t("privacy_title")}
          </p>
          <p className="pt-3 pb-6 ">{t("privacy_updatetime")}</p>
          <p>{t("privacy_intro")}</p>
          <p className="text-2xl font-semibold mt-[46px] mb-3" id="p1">
            {t("privacy_1_title")}
          </p>
          <p>{t("privacy_1_desc")}</p>

          <p className="text-2xl font-semibold mt-[46px] mb-3" id="p2">
            {t("privacy_2_title")}
          </p>
          <p>
            {t("privacy_2_desc_1")}
            <br></br>
            {t("privacy_2_desc_2")}
          </p>
          <br />
          <p>
            {t("privacy_2_desc_3")}
            <br></br>
            {t("privacy_2_desc_4")}
          </p>
          <p className="pl-6 -indent-4">{t("privacy_2_desc_5")}</p>
          <p className="pl-6 -indent-4">{t("privacy_2_desc_6")}</p>
          <p className="pl-6 -indent-4">{t("privacy_2_desc_7")}</p>
          <br />
          <p>
            {t("privacy_2_desc_8")}
            <br />
            {t("privacy_2_desc_9")}
          </p>
          <br />
          <p>
            {t("privacy_2_desc_10")}
            <br />
            {t("privacy_2_desc_11")}
          </p>

          <p className="text-2xl font-semibold mt-[46px] mb-3" id="p3">
            {t("privacy_3_title")}
          </p>
          <p>{t("privacy_3_desc_1")}</p>
          <br />
          <p>{t("privacy_3_desc_2")}</p>
          <br />
          <p>{t("privacy_3_desc_3")}</p>
          <br />
          <p>{t("privacy_3_desc_4")}</p>
          <br />
          <p>{t("privacy_3_desc_5")}</p>
          <br />
          <p>{t("privacy_3_desc_6")}</p>
          <br />
          <p>{t("privacy_3_desc_7")}</p>
          <br />
          <p>{t("privacy_3_desc_8")}</p>
          <br />
          <p>{t("privacy_3_desc_9")}</p>
          <br />
          <p>{t("privacy_3_desc_10")}</p>

          <p className="text-2xl font-semibold mt-[46px] mb-3" id="p4">
            {t("privacy_4_title")}
          </p>
          <p>{t("privacy_4_desc_1")}</p>
          <br />
          <p>{t("privacy_4_desc_2")}</p>

          <p className="text-2xl font-semibold mt-[46px] mb-3" id="p5">
            {t("privacy_5_title")}
          </p>
          <p>{t("privacy_5_desc")}</p>

          <p className="text-2xl font-semibold mt-[46px] mb-3" id="p6">
            {t("privacy_6_title")}
          </p>
          <p>{t("privacy_6_desc_1")}</p>
          <br />
          <p>{t("privacy_6_desc_2")}</p>
          <br />
          <p>{t("privacy_6_desc_3")}</p>
          <br />
          <p>{t("privacy_6_desc_4")}</p>
          <br />
          <p>{t("privacy_6_desc_5")}</p>
          <br />
          <p>{t("privacy_6_desc_6")}</p>
          <br />
          <p>{t("privacy_6_desc_7")}</p>
          <br />
          <p>{t("privacy_6_desc_8")}</p>

          <p className="text-2xl font-semibold mt-[46px] mb-3" id="p7">
            {t("privacy_7_title")}
          </p>
          <p>{t("privacy_7_desc")}</p>

          <p className="text-2xl font-semibold mt-[46px] mb-3" id="p8">
            {t("privacy_8_title")}
          </p>
          <p>{t("privacy_8_desc")}</p>

          <p className="text-2xl font-semibold mt-[46px] mb-3" id="p9">
            {t("privacy_9_title")}
          </p>
          <p>
            {t("privacy_9_desc_1")} <ButtonMailto />
            {router.locale !== "tw" && "."} {t("privacy_9_desc_3")}
          </p>
        </div>
        <div
          className="md:col-span-3 hidden md:block fixed top-[144px] right-6 xl:right-40"
          id="float"
        >
          <div className="bg-invar-dark px-6 pt-6 pb-3 rounded text-invar-light-grey">
            {titleList.map((item, index) => (
              <div key={index} className="pb-3 hover:underline" id={item.id}>
                <ScrollLink
                  activeClass="active"
                  offset={-110}
                  smooth
                  spy
                  to={item.id}
                >
                  <p className="pb-3 hover:underline">{item.title}</p>
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

export default Privacy;
