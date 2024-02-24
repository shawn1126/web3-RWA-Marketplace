import React, { useState } from "react";
import styles from "../styles/collapse.module.css";
import Image from "next/image";

const CollapseMenu = ({ heading, para }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={styles.quesWrapper}
      onClick={() => setExpanded((val) => !val)}
    >
      <div className={styles.questHeader}>
        <p style={{ color: expanded ? "white" : "#B4B7C0" }}>{heading}</p>
        <div className={styles.expandImg}>
          <img src={expanded ? "/v2imgs/minus.png" : "/v2imgs/plus.png"}  />
        </div>
      </div>
      {expanded && <div>{para}</div>}
    </div>
  );
};

export default CollapseMenu;
