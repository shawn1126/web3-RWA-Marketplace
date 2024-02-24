import { Checkbox, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { disableScroll, enableScroll } from "../src/utils/disableScroll";


const MergeBurnModal = ({ tokensList, perform, closeModal, modalType,tt }) => {
  const [checkedBox, setCheckedBox] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState([]);
  useEffect(() => {
    disableScroll();
    return () => enableScroll();
  });

  const submitHandler = async () => {
    if (!checkedBox) return;
    if (modalType === "merge" && selectedTokens.length > 1) {
      await perform(selectedTokens);
      closeModal();
    }
    if (modalType === "burn" && selectedTokens.length > 0) {
      await perform(selectedTokens);
      closeModal();
    }
  };
  let accInterest = 0;
  tokensList.forEach((t) => {
    if(selectedTokens.includes(t.tokenId))accInterest += t.interest;
  });
  const theme=useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <div
        onClick={closeModal}
        className="fixed top-0 right-0 w-full h-full bg-black opacity-70 z-50"
      ></div>
      <div className="fixed top-20 left-1/2 translate-x-[-50%] bg-[#37293E] z-[51] overflow-scroll max-h-[85%] sm:w-[546px] w-[88%] h-[611px] ">
        <div className="w-full sm:min-h-[611px] sm:p-9 p-6">
          <h3 className="font-semibold text-xl leading-6 text-center sm:mb-9 mb-6">
            {modalType==="burn"?tt("burn_sft"):tt("merge_sft")}
          </h3>

          {tokensList.map((t, i) => {
            return (
              <div
                className={`sm:h-[133px] h-[119px] w-full bg-primary border ${selectedTokens.includes(t.tokenId)?"border-[#00DEAE]":"border-primary"} rounded mb-3 sm:p-6 p-4 flex items-center`}
                key={i}
              >
                <Checkbox
                  size="small"
                  checked={selectedTokens.includes(t.tokenId)}
                  onChange={() =>
                    selectedTokens.includes(t.tokenId)
                      ? setSelectedTokens(
                          selectedTokens.filter((item) => item !== t.tokenId)
                        )
                      : setSelectedTokens([...selectedTokens, t.tokenId])
                  }
                  style={{
                    color: "#00deae",
                    width: "20px",
                    height: "20px",
                   marginRight:isMobile?"16px":"24px"
                  }}
              
                />
                <div className="flex-1">
                  <div className="flex justify-between mb-3">
                    <p className="font-normal text-sm leading-5 text-invar-light-grey">
                      Token ID
                    </p>
                    <p className="font-semibold sm:text-base text-sm sm:leading-5 leading-4">
                      #{t.tokenId}
                    </p>
                  </div>
                  <div className="flex justify-between mb-3">
                    <p className="font-normal text-sm leading-5 text-invar-light-grey">
                     {tt("token_val")}
                    </p>
                    <p className="font-semibold sm:text-base text-sm sm:leading-5 leading-4">
                      {t.tokenVal / ( 1e6)} USDC
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="font-normal text-sm leading-5 text-invar-light-grey">
                      {tt("token_interest")}
                    </p>
                    <p className="font-semibold text-base leading-20">
                     {+t.interest.toFixed(4)} USDC
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {modalType=="merge"?<div className="flex items-center justify-between h-[70px] border-primary bg-primary px-6 mb-6 sm:mb-9 ">
            <p className="text-invar-light-grey font-normal text-sm leading-5 text-left">
              {tt("token_claim_claim")}<br className="sm:hidden "  style={{textAlign:isMobile?"left":""}}/> {tt("token_claim_interests")}
            </p>
            <p className="font-semibold text-base leading-5 text-white">
              {(+accInterest.toString()).toFixed(4)} USDC
            </p>
          </div>:          <div className="flex w-full items-center justify-center h-24 bg-primary border-primary sm:px-6 px-4 rounded sm:mb-9 mb-6">
            <div className="flex-1">
              <div className="flex justify-between mb-2 w-full">
                <p className="text-invar-light-grey font-normal text-sm leading-5 text-left">
                 {tt("claim_interests")}
                </p>
                <p className="font-semibold text-base leading-5 text-white">
                  {(+accInterest.toString()).toFixed(4)} USDC
                </p>
              </div>
              <p className="text-invar-validation font-normal text-xs leading-4 sm:whitespace-nowrap text-left">
               {tt("claim_est")}
              </p>
            </div>
          </div>}

          <div className="font-normal text-xs leading-4 text-invar-light-grey">
            <div className="flex mb-[2px]">
              <div>1.&nbsp;</div>
              <div>
                <p>
                 {tt("merge_1")}
                </p>
              </div>
            </div>
            <div className="flex mb-[2px]">
              <div>2.&nbsp;</div>
              <div>
                <p>
                  {tt("merge_2")}
                </p>
              </div>
            </div>

            <div className="flex">
              <div>3.&nbsp;</div>
              <div>
                <p>
                 {modalType=="burn"? tt("burn_3"):tt("merge_3")}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center relative right-3 mb-9">
            <Checkbox
              size="small"
              checked={checkedBox}
              onChange={() => setCheckedBox((v) => !v)}
              style={{
                color: "#00deae",
              }}
            />
            <p className="font-normal text-xs leading-4 text-invar-light-grey">
              {tt("notice")}
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div
              className="btn rounded border-invar-dark bg-transparent text-invar-light-grey mr-3 normal-case w-32 sm:h-[56px] h-12 font-semibold text-base leading-5"
              onClick={closeModal}
            >
              {tt("cancel")}
            </div>
            <button
              className="btn rounded text-white bg-invar-dark disabled:bg-invar-grey disabled:text-invar-light-grey border-none normal-case w-32 sm:h-[56px] h-12 font-semibold text-base leading-5"
              onClick={submitHandler}
              disabled={selectedTokens.length==0||!checkedBox||modalType==="merge"&&selectedTokens.length<2}
            >
              {tt("confirm")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default MergeBurnModal;
