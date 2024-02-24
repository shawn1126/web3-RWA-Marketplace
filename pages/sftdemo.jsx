import React, { useEffect, useState } from "react";
import styles from "../styles/sft.module.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ScrollToTop } from "../components";
import Image from "next/image";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useTranslation } from "next-i18next";
import {
  ClickAwayListener,
  styled,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import dragCard from "../public/drag-card.png";
import factoryImg from "../public/factory.png";
import logicABI from "../src/utils/logicABI.json";
import RNFTABI from "../src/utils/RNFTABI.json";
import ERC20ABI_new from "../src/utils/ERC20ABI_new.json";

import { ethers, utils } from "ethers";
import SplitModal from "../components/SplitModal";
import BurnModal from "../components/BurnModal";
import MergeBurnModal from "../components/MergeBurnModal";
import { enableScroll } from "../src/utils/disableScroll";
import IcLight from "../public/icons/ic_light.png";
import { SFT_ERC_20, SFT_LOGIC, SFT_PUBLIC_NFT } from "../src/utils/web3utils";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { useChainModal } from "@rainbow-me/rainbowkit";

const RLOGIC = SFT_LOGIC;
const RNFT = SFT_PUBLIC_NFT;
const ERC20 = SFT_ERC_20;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "storyline",
        "propertyInfo",
        "sale",
        "sft",
      ])),
    },
  };
}

const SFTDemo = () => {
  const [headerBackground, setHeaderBackground] = useState(false);
  const [rwaNameError, setRwaNameError] = useState(false);
  const [rwaNameLengthErr, setRWANameLengthErr] = useState(false);
  const [rwaTypeError, setRwaTypeError] = useState(false);
  const [mintAmountError, setMintAmountError] = useState(false);
  const [btnState, setBtnState] = useState("all");
  const [showData, setShowData] = useState(true);
  const [rwaName, setRwaName] = useState("");
  const [rwaType, setRwaType] = useState("");
  const [marketValue, setMarketValue] = useState("1");
  const [alreadyClaimedUSDC, setAlreadyClaimedUSDC] = useState(false);
  const [mintAmount, setMintAmount] = useState("0.1");
  const [marketValueError, setMarketValueError] = useState(false);
  const [alreadyApprovedForAll, setAlreadyApprovedForAll] = useState(false);
  const [alreadyHaveAllowence, setAlreadyHaveAllowence] = useState(false);
  const [tokensData, setTokensData] = useState([]);
  const [openSplit, setOpenSplit] = useState(false);
  const [openBurn, setOpenBurn] = useState(false);
  const [selectedToken, setSelectedToken] = useState();
  const [openMerge, setOpenMerge] = useState(false);
  const [openBurnMany, setOpenBurnMany] = useState(false);
  const [showCard, setShowCard] = useState(true);
  const { openChainModal } = useChainModal();

  const [showTotalValTooltip, setShowTotalValTooltip] = useState(false);
  const [showReturnValToolTip, setShowReturnValTooltip] = useState(false);
  const [showDailyValTooltip, setShowDailyValTooltip] = useState(false);
  const [showBurnableTooltip, setShowBurnableTooltip] = useState(false);
  const [showTotalInterestTooltip, setShowTotalInterestTooltip] =
    useState(false);
  const [showUSDCInfoTooltip, setShowUSDCInfoTooltip] = useState(false);
  const [assetSnap, setAssetSnap] = useState({
    mintableValue: "",
    rwaValue: "",
  });
  const [toast, setToast] = useState({ open: false, error: false, text: "" });
  const [maturity, setMaturity] = useState(600);

  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const provider = signer?.provider;

  const { t } = useTranslation("sft");

  const isGoerli = chain?.name == "Goerli";

  const themes = useTheme();
  const isMobile = useMediaQuery(themes.breakpoints.down("sm"));

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", () =>
        setHeaderBackground(window.pageYOffset > 20)
      );
    }
  }, []);
  const closeAllTooltips = () => {
    setShowTotalValTooltip(false);
    setShowReturnValTooltip(false);
    setShowDailyValTooltip(false);
    setShowBurnableTooltip(false);
    setShowTotalInterestTooltip(false);
    setShowUSDCInfoTooltip(false);
  };
  const dragEnd = ({ source, destination }) => {
    if (!destination || !address || !isGoerli) {
      return;
    }
    if (!rwaName && !rwaType) {
      setRwaNameError(true);
      setRwaTypeError(true);
      return;
    }
    if (!rwaName) {
      setRwaNameError(true);
      return;
    }
    if (!rwaType) {
      setRwaTypeError(true);
      return;
    }
    if (+marketValue < 1 || rwaNameLengthErr) return;
    if (assetSnap.rwaValue) return;
    if (destination.droppableId === "droppable-2") {
      setShowData(false);
      setShowCard(false);
      createSlot();
    }
  };

  const claimUSDC = async () => {
    if (!address) return;
    console.log("usdcsigner", signer);
    const erc20contract = new ethers.Contract(ERC20, ERC20ABI_new.abi, signer);
    try {
      const res = await erc20contract.claim({ gasLimit: 250000 });
      res.wait().then((res) => {
        if (res.blockNumber) {
          setAlreadyClaimedUSDC(true);
          setToast({
            open: true,
            error: false,
            text: t("claim_success"),
          });
        }
      });
    } catch (e) {
      setToast({
        open: true,
        error: true,
        text: t("claim_fail"),
      });
      RefreshData();
    }
  };

  const createSlot = async () => {
    if (!address) return;
    const rlogic = new ethers.Contract(RLOGIC, logicABI.abi, signer);

    try {
      const result = await rlogic.createSlot(
        rwaType,
        rwaName,
        (marketValue / 2) * 1e6,
        {
          gasLimit: 250000,
        }
      );
      result.wait().then((receipt) => {
        console.log(receipt);
        if (receipt.blockNumber) {
          setRwaName("");
          setRwaType("");
          setMarketValue("1");
          RefreshData();
          setShowCard(true);
        } else {
          setShowData(true);
          setShowCard(true);
          RefreshData();
        }
      });
    } catch (e) {
      console.log(e);
      console.log("canceled");
      setShowData(true);
      setShowCard(true);
      RefreshData();
    }
  };
  const mint = async () => {
    if (!address) return;

    if (
      !mintAmount ||
      +mintAmount < 0.1 ||
      mintAmount == "." ||
      mintAmountError ||
      !assetSnap.mintableValue
    )
      return;
    const rlogic = new ethers.Contract(RLOGIC, logicABI.abi, signer);
    try {
      const result = await rlogic.mint(mintAmount * 1e6, {
        gasLimit: 800000,
      });
      result.wait().then((receipt) => {
        console.log(receipt);
        if (receipt.blockNumber) {
          RefreshData();
          setMintAmount("0.1");
          setToast({
            open: true,
            error: false,
            text: t("mint_success"),
          });
        } else {
          setToast({
            open: true,
            error: true,
            text: t("mint_fail"),
          });
          throw new Error("Transaction encountered a problem");
        }
      });
    } catch (e) {
      setToast({
        open: true,
        error: true,
        text: t("mint_fail"),
      });
    }
  };
  const resetRWAData = async () => {
    if (!address) return;
    const rlogic = new ethers.Contract(RLOGIC, logicABI.abi, signer);
    try {
      const result = await rlogic.reset({ gasLimit: 250000 });
      result.wait().then((receipt) => {
        console.log(receipt);
        if (receipt.blockNumber) {
          setAssetSnap({ mintableValue: "", rwaValue: "" });
          setRwaName("");
          setRwaType("");
          setMarketValue(1);
          setShowData(true);
          setTokensData([]);
          RefreshData();
        }
      });
    } catch (e) {
      console.log(e);
      RefreshData();
    }
  };
  const handleInputField = (event) => {
    if (event.target.value.length > 5 || /[a-zA-Z]/g.test(event.target.value))
      return;
    event.target.value < 1 || event.target.value > 200
      ? setMarketValueError(true)
      : setMarketValueError(false);
    setMarketValue(event.target.value);
  };

  const approve = async () => {
    if (!address) return;
    const erc20contract = new ethers.Contract(ERC20, ERC20ABI_new.abi, signer);
    const rnft = new ethers.Contract(RNFT, RNFTABI.abi, signer);
    let erc20receiopt = alreadyHaveAllowence;
    try {
      if (!alreadyHaveAllowence) {
        const result1 = await erc20contract.approve(
          RLOGIC,
          ethers.constants.MaxUint256,
          {
            gasLimit: 250000,
          }
        );
        result1.wait().then((receipt) => {
          if (receipt.blockNumber) {
            erc20receiopt = true;
            setAlreadyHaveAllowence(true);
          }
        });
      }

      if (!alreadyApprovedForAll) {
        const result2 = await rnft.setApprovalForAll(RLOGIC, true, {
          gasLimit: 250000,
        });

        result2.wait().then((receipt) => {
          if (receipt.blockNumber && erc20receiopt) {
            setAlreadyApprovedForAll(true);
          }
        });
      }
      RefreshData();
    } catch (e) {
      console.log(e);
      RefreshData();
    }
  };

  const burnNft = async (id) => {
    if (!address) return;
    const rlogic = new ethers.Contract(RLOGIC, logicABI.abi, signer);
    try {
      const resulttt = await rlogic["redeem(uint256)"](id, {
        gasLimit: 250000,
      });
      resulttt.wait().then((receipt) => {
        if (receipt.blockNumber) {
          setToast({
            open: true,
            error: false,
            text: t("burning_success"),
          });

          RefreshData();
        } else {
          setToast({
            open: true,
            error: true,
            text: t("burning_failed"),
          });
        }
      });
    } catch (e) {
      console.log(e);
      setToast({
        open: true,
        error: true,
        text: t("burning_failed"),
      });
      RefreshData();
    }
  };
  const splitSFT = async (token, values) => {
    if (!address) return;

    const rlogic = new ethers.Contract(RLOGIC, logicABI.abi, signer);
    try {
      if (values.length == 1) {
        console.log(values[0] * 1e6);
        const resulttt = await rlogic["split(uint256,uint256)"](
          token.tokenId,
          values[0] * 1e6,
          { gasLimit: 500000 }
        );
        resulttt.wait().then((receipt) => {
          console.log(receipt);
          receipt.blockNumber &&
            setToast({
              open: true,
              error: false,
              text: t("split_success"),
            });
          RefreshData();
        });
        return;
      } else {
        let vals = values.map((v) => v * 1e6);
        const resulttt = await rlogic["split(uint256,uint256[])"](
          token.tokenId,
          vals,
          { gasLimit: 800000 }
        );
        resulttt.wait().then((receipt) => {
          console.log(receipt);
          receipt.blockNumber &&
            setToast({
              open: true,
              error: false,
              text: t("split_success"),
            });
          RefreshData();
        });
      }
    } catch (e) {
      console.log(e);
      RefreshData();
      setToast({
        open: true,
        error: true,
        text: t("split_fail"),
      });
    }
  };

  const mergeSFT = async (tokensArr) => {
    if (!address) return;

    const rlogic = new ethers.Contract(RLOGIC, logicABI.abi, signer);
    try {
      if (tokensArr.length == 2) {
        const resulttt = await rlogic["merge(uint256,uint256)"](
          tokensArr[0],
          tokensArr[1],
          { gasLimit: 500000 }
        );
        resulttt.wait().then((receipt) => {
          console.log(receipt);
          if (receipt.blockNumber) {
            setToast({
              open: true,
              error: false,
              text: t("merge_success"),
            });
          }
          RefreshData();
        });
      } else {
        const allTokens = tokensArr;
        const result = await rlogic["merge(uint256[],uint256)"](
          allTokens.splice(1),
          tokensArr[0],
          { gasLimit: 250000 }
        );
        result.wait().then((receipt) => {
          console.log(receipt);
          if (receipt.blockNumber) {
            setToast({
              open: true,
              error: false,
              text: t("merge_success"),
            });
          }
          RefreshData();
        });
      }
    } catch (e) {
      setToast({
        open: true,
        error: true,
        text: t("merge_fail"),
      });
      console.log(e);
    }
  };
  const burnMany = async (ids) => {
    if (!address) return;

    const rlogic = new ethers.Contract(RLOGIC, logicABI.abi, signer);
    try {
      const result = await rlogic["redeem(uint256[])"](ids, {
        gasLimit: 500000,
      });
      result.wait().then((receipt) => {
        console.log(receipt);
        if (receipt.blockNumber) {
          setToast({
            open: true,
            error: false,
            text: t("burning_success"),
          });
        } else {
          setToast({
            open: true,
            error: true,
            text: t("burning_failed"),
          });
        }
        RefreshData();
      });
    } catch (e) {
      console.log(e);
      setToast({
        open: true,
        error: true,
        text: t("burning_failed"),
      });
      RefreshData();
    }
  };

  const claim = async (ids) => {
    if (!address) return;

    const rlogic = new ethers.Contract(RLOGIC, logicABI.abi, signer);
    try {
      const result = await rlogic.claim({ gasLimit: 250000 });
      result.wait().then((receipt) => {
        if (receipt.blockNumber) {
          setToast({
            open: true,
            error: false,
            text: t("claiming_success"),
          });
        }
        RefreshData();
      });
    } catch (e) {
      console.log(e);
      RefreshData();
      setToast({
        open: true,
        error: true,
        text: t("claiming_failed"),
      });
    }
  };
  let tryCount = 0;
  const RefreshData = async () => {
    if (!address) return;
    console.log("refreshed data");
    const erc20contract = new ethers.Contract(ERC20, ERC20ABI_new.abi, signer);
    const rnft = new ethers.Contract(RNFT, RNFTABI.abi, signer);
    const rlogic = new ethers.Contract(RLOGIC, logicABI.abi, signer);
    console.log("address", address, erc20contract.isClaimedAlready);
    const result = await erc20contract.isClaimedAlready(address, {
      gasLimit: 250000,
    });
    setAlreadyClaimedUSDC(result);

    const isApprovedForAllForAll = await rnft.isApprovedForAll(address, RLOGIC);
    const allow = await erc20contract.allowance(address, RLOGIC);
    if (+allow.toString() == 0) setAlreadyHaveAllowence(false);
    else {
      setAlreadyHaveAllowence(true);
    }
    setAlreadyApprovedForAll(isApprovedForAllForAll && +allow.toString() > 0);

    try {
      const slot = await rnft.slotByOwner(address);
      const assets = await rnft.getAssetSnapshot(slot.toString());
      setAssetSnap(assets);
      console.log(assets);
      if (!assets.rwaValue) setShowData(true);
      else {
        setRwaName(assets.rwaName);
        setRwaType(assets.category);
        setMarketValue((assets.rwaValue / 1e6) * 2);
      }
    } catch (e) {
      console.log(e);
    }

    try {
      const tokens = await rlogic.getTokensByOwner(address);
      let balancePromises = [];
      let tokensTimebalancePromises = [];
      tokens.forEach((val, ind) => {
        balancePromises.push(
          rnft["balanceOf(uint256)"](tokens[ind].toString())
        );
        tokensTimebalancePromises.push(
          rnft.getTimeSnapshot(tokens[ind].toString())
        );
      });

      // const maturityy = await rnft.MATURITY();
      // setMaturity(+maturityy.toString());

      let results = await Promise.all(balancePromises);
      let timeSnaps = await Promise.all(tokensTimebalancePromises);

      results = results.map((R, i) => {
        return {
          tokenId: tokens[i].toString(),
          tokenVal: R.toString(),

          claimTime: +timeSnaps[i].claimTime.toString(),
          mintTime: +timeSnaps[i].mintTime.toString(),
          interest:
            0.3 *
            ((new Date().getTime() / 1000 -
              +timeSnaps[i].claimTime.toString()) /
              31536000) *
            (+R.toString() / 1e6),
          burnable:
            new Date().getTime() / 1000 - +timeSnaps[i].mintTime > 600
              ? true
              : false,
        };
      });
      setTokensData(results);
    } catch (e) {
      tryCount < 4 &&
        setTimeout(() => {
          tryCount += 1;
          RefreshData();
        }, 3000);
    }
  };
  const resetEverything = () => {
    setRwaNameError(false);
    setRWANameLengthErr(false);
    setRwaTypeError(false);
    setMintAmountError(false);
    setBtnState("all");
    setRwaName("");
    setRwaType("");
    setMarketValue("1");
    setAlreadyClaimedUSDC(false);
    setMintAmount("0.1");
    setMarketValueError(false);
    setAlreadyApprovedForAll(false);
    setTokensData([]);
    setOpenSplit(false);
    setOpenBurn(false);
    setSelectedToken("");
    setOpenMerge(false);
    setOpenBurnMany(false);
    setAssetSnap({
      mintableValue: "",
      rwaValue: "",
    });
  };
  useEffect(() => {
    resetEverything();
  }, [address]);

  useEffect(() => {
    if (!address || !provider) return;
    enableScroll();
    RefreshData();
    let interval = setInterval(() => {
      console.log("timer refreshed");
      RefreshData();
    }, 45000);
    return () => clearInterval(interval);
  }, [address, chain?.name, provider]);

  let accDailyInterest = 0;
  let totalTokansVal = 0;
  let totalBurnable = 0;
  tokensData.forEach((t) => {
    accDailyInterest += t.interest;
    totalTokansVal += +t.tokenVal;
    if (t.burnable) totalBurnable += 1;
  });
  let dailyReturn = ((totalTokansVal / 1e6) * 0.3) / 365;

  let burnableTokens = tokensData.filter((t) => t.burnable);

  let shortlistedTokens = tokensData;
  if (btnState !== "all") shortlistedTokens = burnableTokens;

  const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 375,
      background: "rgb(25, 20, 28,0.8)",
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
      maxWidth: isMobile ? "336px" : "375PX",
    },
  });

  const CustomWidthUSDCTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: "375px",
      width: "360px",
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
      maxWidth: isMobile ? "336px" : "360px",
    },
  });

  const TotalValTooltip = () => {
    const { t } = useTranslation("sft");
    return (
      <CustomWidthTooltip
        open={showTotalValTooltip}
        title={
          <ClickAwayListener onClickAway={() => setShowTotalValTooltip(false)}>
            <div
              className="text-xs font-normal text-invar-light-grey rounded leading-5 py-1 px-6"
              style={{ background: "rgb(25, 20, 28,0.8)" }}
            >
              <div className="flex">
                <div>1.&nbsp;</div>
                <div>
                  <p>{t("total_val_1")}</p>
                </div>
              </div>
              <div className="flex">
                <div>2.&nbsp;</div>
                <div>
                  <p>{t("total_val_2")}</p>
                </div>
              </div>
            </div>
          </ClickAwayListener>
        }
        arrow
      >
        <img
          src="icons/ic_info.svg"
          className="inline-block cursor-pointer mb-0.5 sm:mb-[2.5px]"
          width={16}
          height={16}
          alt="info"
          onClick={() => {
            setShowUSDCInfoTooltip(false);
            setShowTotalInterestTooltip(false);
            setShowReturnValTooltip(false);
            setShowDailyValTooltip(false);
            setShowBurnableTooltip(false);
            setShowTotalValTooltip(true);
          }}
        />
      </CustomWidthTooltip>
    );
  };

  const ReturnValTooltip = () => {
    const { t } = useTranslation("sft");
    return (
      <CustomWidthTooltip
        open={showReturnValToolTip}
        title={
          <ClickAwayListener onClickAway={() => setShowReturnValTooltip(false)}>
            <div
              className="text-xs font-normal text-invar-light-grey rounded leading-5 py-1 px-6"
              style={{ background: "rgb(25, 20, 28,0.8)" }}
            >
              <div className="flex">
                <div>1.&nbsp;</div>
                <div>
                  <p>{t("return_val_1")}</p>
                </div>
              </div>
              <div className="flex">
                <div>2.&nbsp;</div>
                <div>
                  <p>{t("return_val_2")}</p>
                </div>
              </div>
            </div>
          </ClickAwayListener>
        }
        arrow
      >
        <img
          src="icons/ic_info.svg"
          className="inline-block cursor-pointer  mb-[2.5px]"
          width={16}
          height={16}
          alt="info"
          onClick={() => {
            setShowUSDCInfoTooltip(false);
            setShowTotalInterestTooltip(false);
            setShowReturnValTooltip(true);
            setShowDailyValTooltip(false);
            setShowBurnableTooltip(false);
            setShowTotalValTooltip(false);
          }}
        />
      </CustomWidthTooltip>
    );
  };
  const DailyValTooltip = () => {
    const { t } = useTranslation("sft");
    return (
      <CustomWidthTooltip
        open={showDailyValTooltip}
        title={
          <ClickAwayListener onClickAway={() => setShowDailyValTooltip(false)}>
            <div
              className="text-xs font-normal text-invar-light-grey rounded leading-5 py-1 px-6"
              style={{ background: "rgb(25, 20, 28,0.8)" }}
            >
              <div className="flex">
                <div>1.&nbsp;</div>
                <div>
                  <p>{t("daily_val_1")}</p>
                </div>
              </div>
              <div className="flex">
                <div>2.&nbsp;</div>
                <div>
                  <p>{t("return_val_2")}</p>
                </div>
              </div>
            </div>
          </ClickAwayListener>
        }
        arrow
      >
        <img
          src="icons/ic_info.svg"
          className="inline-block cursor-pointer  mb-[2.5px]"
          width={16}
          height={16}
          alt="info"
          onClick={() => {
            setShowUSDCInfoTooltip(false);
            setShowTotalInterestTooltip(false);
            setShowReturnValTooltip(false);
            setShowDailyValTooltip(true);
            setShowBurnableTooltip(false);
            setShowTotalValTooltip(false);
          }}
        />
      </CustomWidthTooltip>
    );
  };

  const BurnableTooltip = () => {
    const { t } = useTranslation("sft");
    return (
      <CustomWidthTooltip
        open={showBurnableTooltip}
        title={
          <ClickAwayListener onClickAway={() => setShowBurnableTooltip(false)}>
            <div
              className="text-xs font-normal text-invar-light-grey rounded leading-5 py-1 px-6"
              style={{ background: "rgb(25, 20, 28,0.8)" }}
            >
              <div className="flex">
                <div>1.&nbsp;</div>
                <div>
                  <p>{t("burnable_1")}</p>
                </div>
              </div>
              <div className="flex">
                <div>2.&nbsp;</div>
                <div>
                  <p>{t("burnable_2")}</p>
                </div>
              </div>
              <div className="flex">
                <div>3.&nbsp;</div>
                <div>
                  <p>{t("burnable_3")}</p>
                </div>
              </div>
            </div>
          </ClickAwayListener>
        }
        arrow
      >
        <img
          src="icons/ic_info.svg"
          className="inline-block cursor-pointer  mb-[2.5px]"
          width={16}
          height={16}
          alt="info"
          onClick={() => {
            setShowUSDCInfoTooltip(false);
            setShowTotalInterestTooltip(false);
            setShowReturnValTooltip(false);
            setShowDailyValTooltip(false);
            setShowBurnableTooltip(true);
            setShowTotalValTooltip(false);
          }}
        />
      </CustomWidthTooltip>
    );
  };

  const TotalInterestTooltip = () => {
    const { t } = useTranslation("sft");
    return (
      <CustomWidthTooltip
        open={showTotalInterestTooltip}
        title={
          <ClickAwayListener
            onClickAway={() => setShowTotalInterestTooltip(false)}
          >
            <div
              className="text-xs font-norma text-invar-light-grey rounded leading-5 py-1 px-6"
              style={{ background: "rgb(25, 20, 28,0.8)" }}
            >
              <div className="flex">
                <div>1.&nbsp;</div>
                <div>
                  <p>{t("total_interest_1")}</p>
                </div>
              </div>
              <div className="flex">
                <div>2.&nbsp;</div>
                <div>
                  <p>{t("total_interest_2")}</p>
                </div>
              </div>
              <div className="flex">
                <div>3.&nbsp;</div>
                <div>
                  <p>{t("total_interest_3")}</p>
                </div>
              </div>
            </div>
          </ClickAwayListener>
        }
        arrow
      >
        <img
          src="icons/ic_info.svg"
          className="inline-block cursor-pointer  mb-[2.5px]"
          width={16}
          height={16}
          alt="info"
          onClick={() => {
            setShowUSDCInfoTooltip(false);
            setShowTotalInterestTooltip(true);
            setShowReturnValTooltip(false);
            setShowDailyValTooltip(false);
            setShowBurnableTooltip(false);
            setShowTotalValTooltip(false);
          }}
        />
      </CustomWidthTooltip>
    );
  };
  const USDCInfoTooltip = (props) => {
    const { t } = useTranslation("sft");
    return (
      <CustomWidthUSDCTooltip
        open={showUSDCInfoTooltip}
        title={
          <ClickAwayListener onClickAway={() => setShowUSDCInfoTooltip(false)}>
            <div
              className="text-xs font-normal leading-5 text-invar-light-grey rounded py-1 px-6"
              style={{ background: "rgb(25, 20, 28,0.8)" }}
            >
              <p>{t("test_usdc_address")} </p>
              <p className="mb-1.5">
                0x6b48d3467de7d45de55a3703d12a1005440edc7b
              </p>
              <p>{t("user_will_get")}</p>
            </div>
          </ClickAwayListener>
        }
        arrow
      >
        <div
          onClick={() => {
            setShowUSDCInfoTooltip(true);
            setShowTotalInterestTooltip(false);
            setShowReturnValTooltip(false);
            setShowDailyValTooltip(false);
            setShowBurnableTooltip(false);
            setShowTotalValTooltip(false);
          }}
        >
          {props.children}
        </div>
      </CustomWidthUSDCTooltip>
    );
  };
  console.log("rwatype", rwaType);
  const typeOptions = {
    select: t("select"),
    "Real Estate": t("real_estate"),
    Artwork: t("artwork"),
    Commodity: t("commodity"),
    "Industrial Equipment": t("industrial_equipment"),
    Others: t("others"),
  };
  const test = async () => {
    const erc20contract = new ethers.Contract(ERC20, ERC20ABI_new.abi, signer);
    const allow = await erc20contract.allowance(address, RLOGIC);
    console.log("allowence", allow);
  };
  return (
    <div className={styles.mediaPage} onClick={test}>
      <div className={styles.navWrapper}>
        <Navbar headerBackground={headerBackground} SFTDemo={true} />
      </div>
      <div className={styles.pageWrapper} style={{}}>
        {!isGoerli && address && (
          <div
            className="fixed w-full py-1.5 bg-invar-error md:top-20 top-[60px] z-20 flex items-center justify-center px-10 text-center cursor-pointer"
            onClick={openChainModal}
          >
            <p className="text-white font-semibold text-base leading-5 cursor-pointer">
              {t("switch_network")}
            </p>
          </div>
        )}

        <section
          className={`${styles.SFTSection} sm:pt-32 ${
            !isGoerli && address ? "pt-32" : "pt-24"
          }`}
        >
          <h4 className="font-semibold md:text-[32px] md:leading-10 text-2xl leading-7 mb-4">
            {t("sft_factory")}
          </h4>
          <p className="font-normal md:text-base md:leading-5 text-sm leading-5 md:mb-1 mb-8">
            {t("welcome")}
          </p>
        </section>
        {/* {address && isGoerli && !alreadyClaimedUSDC && (
          <div className={styles.emptyBox}>
            <div className={styles.borderBox}></div>
          </div>
        )}
        {address && !isGoerli && (
          <div className={styles.emptyBox}>
            <div className={styles.borderBox}></div>
          </div>
        )}
        {!address && (
          <div className={styles.emptyBox}>
            <div
              className={styles.borderBox}
              style={{ backgroundColor: "#D9D9D9" }}
            ></div>
          </div>
        )} */}

        {
          <>
            <div className="bg-[url('/bg/layer.png')] xl:w-[1167px] bg-no-repeat lg:h-[383px] md:h-[300px] m-auto bg-bottom bg-contain md:flex hidden">
              <div className="relative lg:h-72 md:h-[14rem] lg:max-w-[1020px] md:w-11/12 m-auto bg-[url('/bg/sft-landscape-bg.png')] bg-contain bg-no-repeat bg-center sm:bg-contain">
                <div className="lg:w-[1020px] max-w-full m-auto px-5 relative bottom-4 font-semibold md:text-xl leading-6 md:flex justify-between hidden">
                  <p> {t("100x")}</p>
                  <p className="relative lg:right-4 md:right-3">
                    {t("real_world_asset")}
                  </p>
                  <p className="relative lg:right-6 ">{t("fraction")}</p>
                </div>
                <div className="absolute top-[44%] flex">
                  <img
                    src="icons/ic_block.png"
                    width={20}
                    height={20}
                    alt="blocks"
                    className="w-[30px] h-[30px]"
                  />
                  <p className="ml-2 text-invar-light-purple font-normal text-xs leading-4">
                    {t("tradfi_1")}
                    <br />
                    {t("tradfi_2")}
                  </p>
                </div>
                <div className="absolute bottom-[25%] left-[6.5%] flex items-center">
                  <img
                    src="icons/ic_building.png"
                    width={20}
                    height={20}
                    className="w-[25px] h-[25px]"
                  />
                  <p className="ml-2 text-invar-light-purple font-normal text-xs leading-4">
                    {t("global_real_estate_1")}
                    <br />
                    {t("global_real_estate_2")}
                  </p>
                </div>
                <div className="absolute bottom-[0%] left-[9.5%] flex items-center">
                  <img
                    src="icons/ic_money.png"
                    width={20}
                    height={15}
                    className="w-[25px] h-[25px]"
                  />
                  <p className="ml-2 text-invar-light-purple font-normal text-xs leading-4">
                    {t("gold_trillion_1")}
                    <br />
                    <span className="whitespace-nowrap">
                      {t("gold_trillion_2")}
                    </span>{" "}
                  </p>
                </div>
                <div className="absolute bottom-[11%] left-[18%] flex items-center">
                  <img
                    src="icons/ic_ethereum.png"
                    width={20}
                    height={20}
                    className="w-[25px] h-[25px]"
                  />
                  <p className="ml-2 text-invar-light-purple font-normal text-xs leading-4">
                    {t("cryptocurrency_trillion_1")}
                    <br />
                    {t("cryptocurrency_trillion_2")}
                  </p>
                </div>
              </div>
            </div>

            {/* mobile section style */}
            <div className="bg-[url('/bg/sft-bg-sm.png')] bg-no-repeat bg-right relative md:hidden">
              {/* <div className="bg-[url('/bg/layer.png')] bg-no-repeat rotate-90 w-[585px] h-[192px]"></div> */}
              <p className="font-semibold text-xl leading-6 text-right mr-[10%] mb-3">
                {" "}
                {t("100x")}
              </p>
              <div className="bg-[url('/bg/landscape-circles.png')]  bg-no-repeat  w-[202px] h-[184px] sm:w-[250px] sm:h-[230px] ml-6 relative bg-contain">
                <div className="absolute top-[39%] flex">
                  <img
                    src="icons/ic_block.png"
                    width={20}
                    height={20}
                    alt="blocks"
                    className="w--[18px] h-[18px]"
                  />
                  <p className="ml-2 text-invar-light-purple font-normal text-sm leading-4">
                    {t("tradfi_1")}
                    <br />
                    {t("tradfi_2")}
                  </p>
                </div>
                <div className="absolute bottom-[25%] left-[23%] flex items-center">
                  <img
                    src="icons/ic_building.png"
                    width={20}
                    height={20}
                    className="w-[18px] h-[18px]"
                  />
                  <p className="ml-2 text-invar-light-purple font-normal text-sm leading-4">
                    {t("global_real_estate_1")}
                    <br />
                    {t("global_real_estate_2")}
                  </p>
                </div>
                <div className="absolute bottom-[-3%] left-[34%] flex items-center">
                  <img
                    src="icons/ic_money.png"
                    width={20}
                    height={15}
                    className="w-[18px] h-[18px]"
                  />
                  <p className="ml-2 text-invar-light-purple font-normal text-sm leading-4">
                    {t("gold_trillion_1")}
                    <br />
                    <span className="whitespace-nowrap">
                      {t("gold_trillion_2")}
                    </span>{" "}
                  </p>
                </div>
                <div className="absolute bottom-[9%] left-[63%] flex items-center">
                  <img
                    src="icons/ic_ethereum.png"
                    width={20}
                    height={20}
                    className="w-[18px] h-[18px]"
                  />
                  <p className="ml-2 text-invar-light-purple font-normal text-sm leading-4">
                    {t("cryptocurrency_trillion_1")}
                    <br />
                    {t("cryptocurrency_trillion_2")}
                  </p>
                </div>
              </div>
              <div className="arrows flex flex-col items-end justify-center mr-[25%] ">
                <img
                  src="/icons/arrow-down-sm.png"
                  width={30}
                  height={16}
                  alt="arrow-down"
                />
                <img
                  src="/icons/arrow-down-lg.png"
                  width={43}
                  height={24}
                  alt="arrow-down"
                />
              </div>
              <div className="ml-[8%]">
                <p className="font-semibold text-xl leading-6 ml-[6%]">
                  {t("real_world_asset")}
                </p>
                <img
                  src="/bg/landscape-second.png"
                  className="w-full h-auto"
                  alt="building"
                />
              </div>
              <div className="arrows flex flex-col items-start justify-center ml-[20%]">
                <img
                  src="/icons/arrow-down-sm.png"
                  width={30}
                  height={16}
                  alt="arrow-down"
                />
                <img
                  src="/icons/arrow-down-lg.png"
                  width={43}
                  height={24}
                  alt="arrow-down"
                />
              </div>
              <div className="ml-6">
                <p className="font-semibold text-xl leading-6 text-right mr-[15%] mb-3">
                  {t("fraction")}
                </p>
                <img
                  src="/bg/landscape-dots.png"
                  width={224}
                  height={189}
                  alt="dots"
                />
              </div>
            </div>
          </>
        }
        {
          <div
            className={`w-full ${
              alreadyApprovedForAll && "border-b-2"
            } border-invar-main-purple flex justify-end md:relative md:bottom-2`}
          >
            <div
              className={`md:flex ${
                isMobile ? "md:mt-8 mt-14" : styles.claiming
              }`}
            >
              <div className="md:flex justify-between items-center md:w-[95%] relative md:bottom-5 md:h-unset ">
                <div className="px-4 md:px-0 md:basis-[52%] md:flex justify-between items-center">
                  <p className="m-0 md:m-auto font-semibold sm:text-base text-sm sm:leading-5 leading-4 mb-1.5">
                    {t("new_type")} {t("claim_tokens")}
                  </p>
                </div>
                {isMobile ? (
                  <div className="relative ml-[26%] bottom-[-11px]">
                    <img
                      src={"/icons/down-arrow.svg"}
                      className="w-6 h-5 inline"
                      width={24}
                      height={14}
                      alt="arrow-icon"
                    />
                    <img
                      src={"/icons/down-arrow.svg"}
                      className="w-6 h-5 inline relative right-1.5 sm:m-0 mx-3"
                      width={24}
                      height={14}
                      alt="arrow-icon"
                    />
                    <img
                      src={"/icons/down-arrow.svg"}
                      className="w-6 h-5 inline relative right-3"
                      width={24}
                      height={14}
                      alt="arrow-icon"
                    />
                  </div>
                ) : (
                  <img
                    src={"/v2imgs/h-arrows.png"}
                    className="object-contain"
                    alt="clain eth"
                  />
                )}
                {isMobile && (
                  <div className="bg-invar-main-purple h-14 md:mb-0 mb-8"></div>
                )}
                <div
                  className={`inline-flex gap-4 ${
                    isMobile
                      ? "w-full  justify-center absolute bottom-[-20px]"
                      : ""
                  }`}
                >
                  <a
                    href="https://goerlifaucet.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <button className="btn w-[140px] h-[52px] font-semibold text-sm text-white border-none normal-case rounded bg-invar-dark">
                      {t("claim_eth")}
                    </button>
                  </a>
                  <button
                    disabled={alreadyClaimedUSDC || !address}
                    className="disabled:bg-invar-grey disabled:text-invar-light-grey  btn w-[140px] h-[52px] font-semibold text-sm text-white border-none normal-case rounded bg-invar-dark"
                    onClick={claimUSDC}
                  >
                    {t("claim_usdc")}
                  </button>
                </div>
              </div>
              <div className="w-4 h-4 relative bottom-1.5 ml-5 mr-5 md:block hidden">
                <USDCInfoTooltip>
                  <img
                    src="/icons/ic_black_info.svg"
                    className="cursor-pointer"
                    alt="info"
                    width={16}
                    height={16}
                  />
                </USDCInfoTooltip>
              </div>
              <div className="md:hidden mt-10 mb-4">
                <div className="px-5 flex items-start">
                  <img
                    src="/icons/ic_black_info.svg"
                    className="mr-1.5 mt-2"
                    width={16}
                    height={16}
                  />
                  <div className="text-xs font-normal leading-5 text-invar-light-grey rounded">
                    <p>{t("test_usdc_address")}</p>
                    <p className="mb-1.5">
                      0x6b48d3467de7d45de55a3703d12a1005440edc7b
                    </p>
                    <p>{t("user_will_get")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        {alreadyClaimedUSDC && (
          <section className={`${styles.rwaSection}`}>
            <div className="h-12 md:h-auto md:flex md:gap-[8%] lg:gap-[16%] sm:mb-7 mb-4">
              <p className="font-normal sm:text-base text-sm leading-5 md:self-center lg:self-end">
                {t("enter_data")}
              </p>
              <div className="hidden md:block">
                <img
                  src={"v2imgs/v-arrows.png"}
                  alt="rwa"
                  className="w-9 h-[86px]"
                />
              </div>
            </div>
            <div className="flex md:mb-5 mb-6 md:flex-row flex-col md:mt-0">
              <div className="lg:w-[48%] lg:min-w-[470px] md:min-w-[350px] md:w-[40%] lg:px-7 px-3 flex justify-between items-center">
                <div className="lg:min-w-[400px] flex justify-between w-full relative">
                  <DragDropContext onDragEnd={dragEnd}>
                    <Droppable key={"drag1"} droppableId="droppable-1" cl>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="flex items-center"
                        >
                          <Draggable
                            key={"drag1"}
                            draggableId={"drag1"}
                            index={0}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {showCard && (
                                  <div className="w-36 h-20 lg:w-[200px] lg:h-full  md:w-36 md:h-20 lg:flex lg:items-center relative">
                                    <Image
                                      src={dragCard}
                                      alt="rwa img"
                                      className="z-10 select-none h-full w-full"
                                    />
                                    <div className="absolute text-invar-purple z-10 p-2 top-0 lg:top-1 text-xs capitalize">
                                      <p className="whitespace-nowrap lg:mb-1.5">
                                        {t("name")}:{" "}
                                        <span className="md:font-semibold">
                                          {rwaName}
                                        </span>
                                      </p>
                                      <p className="whitespace-nowrap lg:mb-1.5">
                                        {t("type")}:{" "}
                                        <span className="md:font-semibold">
                                          {typeOptions[rwaType]}
                                        </span>
                                      </p>
                                      <p className="lg:mb-1.5">
                                        {t("market_val")}:{" "}
                                        <span className="md:font-semibold">
                                          {marketValue}
                                        </span>
                                      </p>
                                      <p>
                                        {t("tokenized_value")}:{" "}
                                        <span className="font-semibold">
                                          {(marketValue / 2).toFixed(1)}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    <Droppable key={"test2"} droppableId="droppable-2">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          <div className="w-28 lg:w-40 lg:h-44 md:w-32 md:h-32">
                            {" "}
                            <Image
                              src={factoryImg}
                              alt="rwa img"
                              className="z-10 select-none"
                            />
                          </div>
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>

                  {showCard && (
                    <img
                      src="icons/ic_direction.svg"
                      className="left-[40%] absolute lg:left-[47%] left-[40%] md:left-[40%] lg:left-[45%]  top-1/3 z-0 select-none"
                    />
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex justify-between md:flex-row flex-col">
                  <div className="lg:w-[54%] md:w-[48%]">
                    <label className="w-full mb-3.5 block md:mt-0 sm:mt-4 mt-2.5">
                      <p className=" text-invar-light-grey text-sm leading-4 font-normal mb-1">
                        {t("rwa_name")}
                      </p>
                      <input
                        disabled={assetSnap.rwaValue}
                        name="inputIDnumber"
                        type="text"
                        required=""
                        className="block bg-invar-main-purple w-full h-12 rounded focus:border border-white text-white font-normal px-[15px]"
                        value={rwaName}
                        onChange={(e) => {
                          if (e.target.value.length < 15)
                            setRwaName(e.target.value);
                          e.target.value.length && setRwaNameError(false);
                          e.target.value.length > 13
                            ? setRWANameLengthErr(true)
                            : setRWANameLengthErr(false);
                        }}
                      />
                      {rwaNameError && (
                        <span className="text-invar-error text-sm">
                          {t("rwa_name_error")}
                        </span>
                      )}
                      {rwaNameLengthErr && (
                        <span className="text-invar-error text-sm">
                          {t("long_must_13")}
                        </span>
                      )}
                      {!isMobile &&
                        !rwaNameError &&
                        !rwaNameLengthErr &&
                        rwaTypeError && (
                          <span className="text-invar-error text-sm invisible">
                            {t("long_must_13")}
                          </span>
                        )}
                    </label>

                    <label className="w-full block md:mt-0 mt-4">
                      <p className="block text-invar-light-grey text-sm leading-4 font-normal mb-1">
                        {t("estimated_value")}
                      </p>
                      <div className="relative">
                        <input
                          disabled={assetSnap.rwaValue}
                          name="marketValue"
                          type="text"
                          required=""
                          className="block bg-invar-main-purple w-full h-12 rounded focus:border border-white outline-none text-white font-normal px-[15px] appearance-none"
                          value={marketValue}
                          onChange={handleInputField}
                        />
                        <span className=" pointer-events-none absolute inset-y-0 right-[15px] flex items-center text-white text-base font-semibold leading-5">
                          USDC
                        </span>
                        {!marketValue && (
                          <span className=" pointer-events-none absolute inset-y-0 left-[15px] flex items-center text-invar-light-grey text-base font-semibold leading-5">
                            ≥ 1
                          </span>
                        )}
                      </div>
                      {marketValueError && (
                        <span className="text-invar-error text-sm">
                          {t("market_value_error")}
                        </span>
                      )}
                    </label>
                  </div>

                  <div className="lg:w-[43%] md:w-[48%] relative">
                    <label className="w-full mb-3.5 block md:mt-0 mt-4">
                      <p className="block text-invar-light-grey text-sm leading-4 font-normal mb-1">
                        {t("rwa_type")}
                      </p>
                      <div className="relative">
                        <select
                          disabled={assetSnap.rwaValue}
                          name="rwatype"
                          className="appearance-none block bg-invar-main-purple w-full h-12 rounded focus:border border-white focus:outline-none text-white font-normal px-[15px]"
                          value={rwaType}
                          onChange={(e) => {
                            setRwaType(e.target.value);
                            e.target.value != "" && setRwaTypeError(false);
                          }}
                        >
                          <option value="">{t("select")}</option>
                          <option value="Real Estate">
                            {t("real_estate")}
                          </option>
                          <option value="Artwork">{t("artwork")}</option>
                          <option value="Commodity">{t("commodity")}</option>
                          <option value="Industrial Equipment">
                            {t("industrial_equipment")}
                          </option>
                          <option value="Others">{t("others")}</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                          <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path>
                          </svg>
                        </div>
                      </div>
                      {rwaTypeError && (
                        <span className="text-invar-error text-sm">
                          {t("rwa_type_error")}
                        </span>
                      )}
                      {!rwaTypeError &&
                        (rwaNameError || rwaNameLengthErr) &&
                        !isMobile && (
                          <span className="text-invar-error text-sm invisible">
                            {t("rwa_type_error")}
                          </span>
                        )}
                    </label>

                    <label className="w-full block md:mt-0 mt-4">
                      <p className="block text-invar-light-grey text-sm leading-4 font-normal mb-1">
                        {t("token_value")}
                      </p>
                      <div className="relative">
                        <input
                          name="tokenized value"
                          disabled
                          type="text"
                          required=""
                          className="block bg-invar-main-purple w-full h-12 rounded focus:border border-white outline-none text-white font-normal px-[15px] appearance-none"
                          value=""
                        />
                        <span className=" pointer-events-none absolute inset-y-0 right-[15px] flex items-center text-white text-base font-semibold leading-5">
                          USDC
                        </span>
                        <span className=" pointer-events-none absolute inset-y-0 left-[15px] flex items-center text-invar-light-grey text-base font-semibold leading-5">
                          0{" "}
                          {marketValue / 2 > 0 && (
                            <span className="text-white">
                              &nbsp;~ {(marketValue / 2).toFixed(1)}
                            </span>
                          )}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
                <p className="font-normal text-base leading-6 md:mt-[22px] mt-4">
                  {t("make_sure")}
                </p>
              </div>
            </div>

            <button
              disabled={!assetSnap.rwaValue}
              className="btn w-full h-[52px] font-semibold text-sm text-white border-none normal-case rounded bg-invar-dark mr-4 mb-6 disabled:bg-invar-grey disabled:text-invar-light-grey"
              onClick={resetRWAData}
            >
              {t("reset_data")}
            </button>
            {assetSnap.rwaValue && (
              <>
                {" "}
                <div className="hidden md:block md:flex md:justify-center mb-6">
                  <img src={"v2imgs/v-arrows.png"} className="w-9 h-[86px]" />
                </div>
                <div className="w-full md:h-[395px] bg-invar-main-purple flex relative rounded md:flex-row flex-col md:px-  lg:px-4 md:px-4 shadow-xl shadow-[rgba(0, 0, 0, 0.12)]">
                  <div className="z-0 w-full h-full absolute left-0 top-0 bg-[#37293E] rounded">
                    <div className="w-full h-[184px] lg:bg-invar-main-purple md:bg-invar-main-purple rounded"></div>
                  </div>

                  <div className="bg-invar-main-purple lg:bg-transparent md:bg-transparent md:w-[47.5%] w-full flex flex-col justify-start items-center md:pt-9 pt-10 pb-4 mb-7 md:mb-0 lg:mb-0 md:pb-10 lg:pb-12 relative z-10 rounded-t lg:rounded md:rounded md:px-0 px-4 ">
                    <div className="md:w-[395px] md:h-[211px] w-full max-w-full h-[336px] flex justify-center">
                      <Image
                        src="/rwa-img.png"
                        width={395}
                        height={211}
                        alt="rwa-nft-img"
                        className="rounded"
                      />
                    </div>
                    <h6 className="font-semibold text-2xl leading-7 md:mt-4 mt-6 mb-6  md:mb-2">
                      {assetSnap.rwaName || "RWA SFT"}
                    </h6>
                    <p className="font-normal text-sm leading5 text-invar-light-grey text-center mb-2">
                      {t("total_value_usdc")}&nbsp;
                      <TotalValTooltip />
                    </p>
                    <p className=" text-center font-semibold md:text-[32px] text-2xl md:leading-10 leading-7 text-invar-success">
                      {(+totalTokansVal / 1e6 + accDailyInterest).toFixed(4)}
                    </p>
                  </div>
                  <div className="flex-1 md:pt-20 md:pb-10 relative z-10 rounded px-4 md:px-0 lg:px-0">
                    <div className="flex md:flex-row flex-col md:items-start items-center md:mb-9 mb-2">
                      <div className="sm:w-1/2">
                        <p className="font-normal text-sm leading5 text-invar-light-grey text-center mb-2 ">
                          {t("est_return")}&nbsp;
                          <ReturnValTooltip />
                        </p>
                        <p className="text-center font-semibold md:text-[32px] text-2xl md:leading-10 leading-7 md:mb-0 mb-6">
                          30%
                        </p>
                      </div>
                      <div className="sm:w-1/2">
                        <p className="font-normal text-sm leading5 text-invar-light-grey text-center mb-2 ">
                          {t("est_daily")}&nbsp;
                          <DailyValTooltip />
                        </p>
                        <p className="text-center font-semibold md:text-[32px] text-2xl md:leading-10 leading-7">
                          {dailyReturn.toFixed(4)}
                        </p>
                      </div>
                    </div>
                    <div className="flex md:flex-row flex-col-reverse  md:items-start items-center sm:mb-[22px] mb-2">
                      <div className="sm:w-1/2 sm:mt-0 mt-6">
                        <p className="font-normal text-sm leading5 text-invar-light-grey text-center mb-2 md:mt-2.5 ">
                          {t("burnable_usdc")}&nbsp;
                          <BurnableTooltip />
                        </p>
                        <p className="text-center font-semibold md:text-[32px] text-2xl md:leading-10 leading-7">
                          {totalBurnable}
                        </p>
                      </div>
                      <div className="sm:w-1/2">
                        <p className="font-normal text-sm leading5 text-invar-light-grey text-center mb-2 md:mt-2.5 mt-4">
                          {t("total_interest")}&nbsp;
                          <TotalInterestTooltip />
                        </p>
                        <p className="text-center font-semibold md:text-[32px] text-2xl md:leading-10 leading-7 md:text-white text-invar-success">
                          {accDailyInterest.toFixed(4)}
                        </p>
                      </div>
                    </div>
                    <div className="flex md:flex-row flex-col">
                      <label className="flex-1 block">
                        <p className="block text-invar-light-grey text-sm leading-4 font-normal mb-1">
                          {t("enter_amount")}
                        </p>
                        <div className="relative">
                          <input
                            name="mint"
                            type="text"
                            className="block bg-invar-main-purple w-full h-12 rounded focus:border border-white outline-none text-white font-normal px-[15px] appearance-none"
                            value={mintAmount}
                            disabled={!alreadyApprovedForAll}
                            onChange={(e) => {
                              if (
                                e.target.value.length > 5 ||
                                /[a-zA-Z]/g.test(e.target.value)
                              )
                                return;
                              setMintAmount(e.target.value);
                              +e.target.value < 0.1 ||
                              +e.target.value >
                                +assetSnap.mintableValue.toString() / 1e6
                                ? setMintAmountError(true)
                                : setMintAmountError(false);
                            }}
                          />
                          <span className=" pointer-events-none absolute inset-y-0 right-[15px] flex items-center text-white text-base font-semibold leading-5">
                            USDC
                          </span>
                          {!mintAmount && (
                            <span className=" pointer-events-none absolute inset-y-0 left-[15px] flex items-center text-invar-light-grey text-base font-semibold leading-5">
                              ≥ 0.1
                            </span>
                          )}
                        </div>
                        {mintAmountError && (
                          <span className="text-invar-error text-sm">
                            {t("mint_amount_error", {
                              min: "0.1",
                              max: +assetSnap.mintableValue.toString() / 1e6,
                            })}
                          </span>
                        )}
                      </label>
                      <div className="min-w-52 md:mr-5 md:ml-2 flex md:flex-col flex-col-reverse md:mt-0 md:mb-0 mt-4 mb-5 items-end">
                        <p className="block text-invar-light-grey text-sm leading-4 font-normal mb-1 text-right sm:mt-0 mt-1">
                          {t("available")} :{" "}
                          {assetSnap.mintableValue
                            ? +assetSnap?.mintableValue?.toString() / 1e6
                            : 0}{" "}
                          USDC
                        </p>
                        {alreadyApprovedForAll ? (
                          <button
                            className="btn md:w-52 w-full h-12 font-semibold text-sm text-white border-none normal-case rounded bg-invar-dark disabled:bg-invar-grey disabled:text-invar-light-grey "
                            onClick={mint}
                            disabled={!address || !isGoerli || mintAmountError}
                          >
                            {t("mint")}
                          </button>
                        ) : (
                          <button
                            className="btn md:w-52 w-full h-12 font-semibold text-sm text-white border-none normal-case rounded bg-invar-dark disabled:bg-invar-grey"
                            onClick={approve}
                            disabled={!address || !isGoerli}
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {assetSnap.rwaValue && (
              <>
                {" "}
                <div className="controls-bar md:h-10 w-full mt-9 md:mb-6 mb-4 flex justify-between md:flex-row flex-col">
                  <div className="flex">
                    <button
                      className={
                        " mr-3 w-[42px] h-[40px] lg:h-[40px] lg:w-[130px] md:h-[40px] md:w-[130px] rounded border border-invar-main-purple text-sm font-semibold text-center" +
                        (btnState == "all"
                          ? " text-white bg-invar-main-purple "
                          : " text-invar-light-grey hover:text-white ")
                      }
                      onClick={() => {
                        setBtnState("all");
                      }}
                    >
                      All
                    </button>
                    <button
                      className={
                        " sm:mr-9 h-[40px] w-[130px] rounded border border-invar-main-purple text-sm font-semibold text-center" +
                        (btnState == "redemption"
                          ? " text-white bg-invar-main-purple"
                          : " text-invar-light-grey hover:text-white")
                      }
                      onClick={() => {
                        setBtnState("redemption");
                      }}
                    >
                      {t("redemption")}
                    </button>
                  </div>
                  <div className="flex gap-3 md:mt-0 mt-4">
                    <button
                      onClick={claim}
                      disabled={tokensData.length < 1}
                      className="flex-auto  h-10 lg:w-[102px] lg:h-[40px] md:w-[102px] md:h-[40px] rounded disabled:bg-invar-grey font-semibold text-sm leading-4 disabled:text-invar-light-grey bg-invar-dark text-white"
                    >
                      {t("claim")}
                    </button>
                    <button
                      onClick={() => {
                        closeAllTooltips();
                        setOpenMerge(true);
                      }}
                      disabled={tokensData.length < 2}
                      className=" flex-auto h-10 lg:w-[102px] lg:h-[40px] md:w-[102px] md:h-[40px] rounded disabled:bg-invar-grey font-semibold text-sm leading-4 disabled:text-invar-light-grey bg-invar-dark text-white"
                    >
                      {t("merge")}
                    </button>
                    <button
                      onClick={() => {
                        closeAllTooltips();
                        setOpenBurnMany(true);
                      }}
                      disabled={totalBurnable == 0}
                      className="flex-auto lg:block md:block h-10 lg:w-[102px] lg:h-[40px] md:w-[102px] md:h-[40px] rounded disabled:bg-invar-grey font-semibold text-sm leading-4 disabled:text-invar-light-grey bg-invar-dark text-white"
                    >
                      {t("burn")}
                    </button>
                  </div>
                </div>
                {/* <div className="details-section flex md:flex-row flex-col md:gap-2"> */}
                {shortlistedTokens.length === 0 ? (
                  <div className=" mt-16 w-full flex justify-center items-center">
                    <div>
                      <Image
                        width={162}
                        height={200}
                        src={IcLight}
                        alt="light"
                      />
                      <p className=" text-lg font-normal text-center text-invar-light-grey">
                        {t("no_records")}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="details-section md:grid-cols-2 grid-cols-1 md:gap-2 grid">
                    {shortlistedTokens.map((d) => (
                      <div
                        key={d.tokenId}
                        className="md:h-48 md:w-full md:max-w-1/2 rounded border border-invar-main-purple flex md:flex-row flex-col relative md:mb-0 mb-4"
                      >
                        <div className="max-h-[114px] md:w-1/2 md:max-h-[103px] h-[114px] sm:h-auto flex md:flex-col flex-row">
                          <div
                            className="w-[154px] md:w-full first:block sm:max-h-[103px] max-h-[114px] min-width-[154px]"
                            style={{ minWidth: "154px" }}
                          >
                            <img
                              className="sm:w-full w-[154px] block md:max-h-[103px] sm:h-[102px] h-[114px] md:h-28  rounded"
                              src="/rwa-img.png"
                              width={239}
                              height={103}
                              alt="rwa img"
                            />
                          </div>

                          <div className="sm:ml-6 ml-3 sm:mt-2 mt-auto sm:mb-0 mb-4">
                            <p className="text-sm font-normal leading-5 text-invar-light-grey mb-1">
                              {/* {t("unlock_time")} */}
                              {t("redemption_time")}
                            </p>
                            <p className="text-base font-normal leading-6 text-white w-11/12">
                              {/* 2023/07/01 10:00 (UTC){" "} */}
                              {new Date(
                                (d.mintTime + maturity) * 1000
                              ).toLocaleString({
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                              &nbsp; (UTC
                              {new Date().getTimezoneOffset() / 60 < 0
                                ? "+"
                                : "-"}
                              {Math.abs(new Date().getTimezoneOffset() / 60)})
                            </p>
                          </div>
                        </div>
                        <div
                          className={`md:w-1/2 bg-invar-main-purple border border-invar-main-purple md:block flex ${
                            isMobile && "h-[115px]"
                          }`}
                        >
                          <div className="sm:pl-5 pl-4">
                            <div className="flex sm:mt-11 mt-7">
                              <p className=" w-16 mr-3 mb-5 font-normal text-sm leading-5 text-invar-light-grey inline-block">
                                {t("interests")}
                              </p>
                              <p className="font-normal text-base leading-6 text-white">
                                {d.interest.toFixed(4)} USDC
                              </p>
                            </div>
                            <div className="flex">
                              <p className=" w-16 mr-3 mb-6 sm:mb-4 font-normal text-sm leading-5 text-invar-light-grey inline-block">
                                {t("value")}
                              </p>
                              <p className="font-normal text-base leading-6 text-invar-success">
                                {(d.tokenVal / 1e6).toFixed(4)} USDC
                              </p>
                            </div>
                          </div>
                          <div className="flex sm:justify-center justify-end flex-1">
                            <div className="sm:mt-2.5 mt-6 mb-6 sm:mb-0 flex sm:items-start sm:justify-center justify-end items-end sm:flex-row flex-col-reverse sm:mr-0 mr-4">
                              <button
                                className="disabled:bg-invar-grey disabled:text-invar-light-grey mb-0 text-white bg-invar-dark w-[51px]  h-7 rounded sm:w-[102px]  sm:h-10 sm:mr-3 text-sm font-semibold"
                                onClick={() => {
                                  setSelectedToken(d);
                                  closeAllTooltips();
                                  setOpenSplit(true);
                                }}
                                disabled={d.tokenVal <= 0.1 * 1e6}
                              >
                                {t("split")}
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedToken(d);
                                  closeAllTooltips();
                                  setOpenBurn(true);
                                }}
                                disabled={!d.burnable}
                                className="bg-invar-dark disabled:bg-invar-grey disabled:text-invar-light-grey border-none w-[51px] h-7 rounded sm:w-12 sm:h-10 p-0 flex justify-center items-center sm:mb-0 mb-3"
                              >
                                {d.burnable ? (
                                  <img
                                    src="/icons/fire_on.png"
                                    width={22}
                                    height={22}
                                    alt="fire"
                                    className="sm:block sm:w-[22px] sm:h-[22px] w-[18px] h-[18px]"
                                  />
                                ) : (
                                  <img
                                    src="/icons/ic_fire_off.svg"
                                    width={22}
                                    height={22}
                                    alt="fire"
                                    className="sm:block sm:w-[22px] sm:h-[22px] w-[18px] h-[18px]"
                                  />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        )}
        {!alreadyClaimedUSDC && <div className="h-[140px] w-full"></div>}
        <ScrollToTop />
        {openSplit && (
          <SplitModal
            selectedToken={selectedToken}
            splitFn={splitSFT}
            closeModal={() => setOpenSplit(false)}
            tt={t}
          />
        )}
        {openBurn && (
          <BurnModal
            selectedToken={selectedToken}
            burnFn={burnNft}
            closeModal={() => setOpenBurn(false)}
            tt={t}
          />
        )}
        {openMerge && (
          <MergeBurnModal
            tokensList={tokensData}
            perform={mergeSFT}
            closeModal={() => setOpenMerge(false)}
            modalType="merge"
            tt={t}
          />
        )}
        {openBurnMany && (
          <MergeBurnModal
            tokensList={burnableTokens}
            perform={burnMany}
            closeModal={() => setOpenBurnMany(false)}
            modalType="burn"
            tt={t}
          />
        )}
        <Footer />
        {toast.open && (
          <div className=" z-40 w-screen fixed sm:bottom-20 bottom-8 left-0 right-0 ">
            <div className=" flex justify-center items-center text-center w-full">
              <div
                className={`bg-black sm:w-[568px] sm:h-[52px] w-[343px] h-[74px] flex items-center justify-between px-4 text-sm font-normal ${
                  toast.error ? "text-invar-error" : "text-invar-success"
                }`}
              >
                <p className="">{toast.text}</p>
                <div
                  className="h-[30px] w-[30px] cursor-pointer"
                  onClick={() => setToast({ ...toast, open: false })}
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
        )}
      </div>
    </div>
  );
};

export default SFTDemo;
