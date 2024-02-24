import React from "react";
import styles from "../styles/footer.module.css";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";

const Footer = ({ c }) => {
  const { t } = useTranslation("common");
  return (
    <footer id="footer" className={`${styles.footer} relative`}>
      <div className={styles.footerContent}>
        <div className={styles.footerLeft}>
          <div className={styles.winnerBtn}>
            <a href="#footer">
              <img
                onClick={() => window["logBadgeClick"]()}
                id="badge-button"
                style={{ width: "186px", height: "32px" }}
                src="https://static.alchemyapi.io/images/marketing/alchemy-wagbi-badge-dark.png"
                alt="Alchemy Supercharged"
              />
            </a>
          </div>
          <ul className="text-sm font-semibold">
            <a
              href="https://github.com/InVarFinance/invaria2222"
              rel="noopener noreferrer"
              target="_blank"
            >
              <li>Github </li>
            </a>
            <a
              href="https://docs.invar.finance/road-to-web3"
              rel="noopener noreferrer"
              target="_blank"
            >
              <li>Docs </li>
            </a>
    
            <Link href="/privacy">
              <li>{t("privacy_policy")}</li>
            </Link>
            <Link href="terms">
              <li>{t("terms_conditions")}</li>
            </Link>
          </ul>
        </div>
        <div className={styles.footerRight}>
          <div className={styles.footerIconCont}>
          <a
              href="https://defillama.com/protocol/invar-finance"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className={styles.footerIcon}>
                <img src={'/ic_defi.png'} width={22} height={22} />
              </div>
            </a>

            <a
              href="https://www.youtube.com/channel/UCE6nLXvFjITq0IAsXipnkqQ"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className={styles.footerIcon}>
                <img src={"/v2imgs/icons/youtube.png"} />
              </div>
            </a>
            <a
              href="https://medium.com/@invar.finance"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className={styles.footerIcon}>
                <img src={"/v2imgs/icons/dots.png"} />
              </div>
            </a>
            <a
              href="https://twitter.com/InVarFinance"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className={styles.footerIcon}>
                <img src={"/v2imgs/icons/twitter.png"} />
              </div>
            </a>
            <a
              href="https://discord.gg/BrzPWYut4p"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className={styles.footerIcon}>
                <img src={"/v2imgs/icons/discord.png"}  />
              </div>
            </a>

            <a
              href="mailto:info@invar.finance"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className={styles.lastIcon}>
                <img src={"/v2imgs/icons/email.png"}/>
              </div>
            </a>
          </div>
          <p className="text-sm">
            © 2022 InVaria2222 | {" "}
            
              <a
                href="https://invar.finance/"
                rel="noopener noreferrer"
                target="_blank"
              >
                InVar Finance
              </a>
            
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
