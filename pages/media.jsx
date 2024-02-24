import React, { useEffect, useState } from "react";
import styles from "../styles/media.module.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MediaRow from "../components/MediaRow";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ScrollToTop } from "../components";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "storyline",
        "propertyInfo",
        "sale",
        "dashboard",
      ])),
    },
  };
}

const Media = () => {
  const [headerBackground, setHeaderBackground] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", () =>
        setHeaderBackground(window.pageYOffset > 20)
      );
    }
  }, []);
  return (
    <div className={styles.mediaPage}>
      <div className={styles.navWrapper}>
        <Navbar headerBackground={headerBackground} />
      </div>
      <div className={styles.pageWrapper}>
        <section className={styles.mediaSection}>
          <h4>News</h4>
          <MediaRow
            about="Afflux"
            detail="INTERVIEW WITH INVAR FINANCE — RWA NFT-YIELDING PLATFORM"
            img={"/v2imgs/affux_news.png"}
            redirectLink="https://medium.com/@Afflux/afflux-interview-with-invar-finance-rwa-nft-yielding-platform-27d4bbe4ce29"
          />
          <MediaRow
            about="Bitcoin.com"
            detail="InVar Finance Builds InVaria2222 as the Team Looks to Provide Hybrid Finance Services"
            img={"/v2imgs/bitcoin.png"}
            redirectLink="https://news.bitcoin.com/invar-finance-builds-invaria2222-as-the-team-looks-to-provide-hybrid-finance-services/"
          />
          <MediaRow
            about="SFTLabs"
            detail="Top SFT App You Should Know About In 2023"
            img={"/v2imgs/sftlabs.png"}
            redirectLink="https://sftlabs.io/2023/02/06/top-sft-app-you-should-know-about-in-2023/"
          />
          <MediaRow
            about="Meet"
            detail="3D Social Platform Linkalive cooperated with RWA project InVaria to hold the first ever Metaverse carnival successfully"
            img={"/v2imgs/meet.png"}
            redirectLink="https://meet.bnext.com.tw/blog/view/87591?"
          />
          <p className="font-semibold md:text-base md:leading-5 text-sm leading-4 mt-9">
            中文
          </p>
          <div className={styles.newsDivider}></div>

          <MediaRow
            about="Foresight News"
            detail="InVaria2222 是一个基于 RWA 的代币化世界，其目标是在现实世界和数字经济之间建立联系"
            img={"/v2imgs/foresight.png"}
            redirectLink="https://foresightnews.pro/wiki/project/20163"
          />
          <MediaRow
            about="Cointime"
            detail="不仅仅是映射，InVar Finance用实体经济促成代币资产现实化"
            img={"/v2imgs/cointime_news.png"}
            redirectLink="https://cn.cointime.com/news/bu-jin-jin-shi-ying-she-invar-finance-yong-shi-ti-jing-ji-cu-cheng-dai-bi-zi-chan-xian-shi-hua-29824"
          />
        </section>
        <ScrollToTop />

        <Footer />
      </div>
    </div>
  );
};

export default Media;
