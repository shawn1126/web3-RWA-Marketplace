import Image from "next/image";
import React from "react";
import styles from "../styles/media.module.css";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

const MediaRow = ({ about, detail, img, redirectLink }) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <a rel="noopener noreferrer" target="_blank" href={redirectLink}>
      <div className={styles.mediaRowBox}>
        <div className={styles.mediaRowContent}>
          <div className={styles.rowTextCont}>
            <p className={styles.rowAbout}>{about}</p>
            <p className={styles.mediaDetail} style={{ margin: "0" }}>
              {isMobile ? `${detail.slice(0, 55)}...` : detail}
            </p>
          </div>
          <div className={styles.mediaImg}>
            <Image src={img} width={148} height={84} alt="img"/>
          </div>
        </div>
      </div>
    </a>
  );
};

export default MediaRow;
