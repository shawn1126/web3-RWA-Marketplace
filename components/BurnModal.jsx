import { Checkbox } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { disableScroll, enableScroll } from "../src/utils/disableScroll";
import { uuid } from "uuidv4";

const BurnModal = ({ selectedToken, closeModal, burnFn,tt }) => {
  const [checkedBox, setCheckedBox] = useState(false);

  useEffect(() => {
    disableScroll();
    return () => enableScroll();
  });

  const submitHandler = () => {
    if (!checkedBox) return;
    burnFn(selectedToken.tokenId);
    closeModal();
  };
  return (
    <>
      <div
        onClick={closeModal}
        className="fixed top-0 right-0 w-full h-full bg-black opacity-70 z-50"
      ></div>
      <div className="fixed top-20 left-1/2 translate-x-[-50%] bg-[#37293E] z-[51] overflow-scroll max-h-[85%] sm:w-[546px] w-[88%] h-[611px] ">
        <div className="w-full sm:min-h-[611px] sm:p-9 p-6">
          <h3 className="font-semibold text-xl leading-6 text-center sm:mb-9 mb-6">
            {tt("burn_sft")}
          </h3>
          <div className="h-[88px] sm:h-[102px]  border border-[rgb(68,51,76)] sm:p-6 p-4 mb-3 rounded">
            <div className="flex justify-between mb-3">
              <p className="font-normal text-sm leading-5 text-invar-light-grey">
                Token ID
              </p>
              <p className="font-semibold sm:text-base text-sm sm:leading-5 leading-4">
                #{selectedToken.tokenId}
              </p>
            </div>
            <div className="flex justify-between mb-3">
              <p className="font-normal text-sm leading-5 text-invar-light-grey">
               {tt("value")}
              </p>
              <p className="font-semibold sm:text-base text-sm sm:leading-5 leading-4">
                {selectedToken.tokenVal / 1e6} USDC
              </p>
            </div>
          </div>
          <div className="flex w-full items-center justify-center h-24 bg-primary border-primary sm:px-6 px-4 rounded sm:mb-9 mb-6">
            <div className="flex-1">
              <div className="flex justify-between mb-2 w-full">
                <p className="text-invar-light-grey font-normal text-sm leading-5 text-left">
                 {tt("claim_interests")}
                </p>
                <p className="font-semibold text-base leading-5 text-white">
                  {(+selectedToken.interest.toString()).toFixed(4)} USDC
                </p>
              </div>
              <p className="text-invar-validation font-normal text-xs leading-4 sm:whitespace-nowrap text-left">
               {tt("claim_est")}
              </p>
            </div>
          </div>

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
                  {tt("burn_p_2")}
                </p>
              </div>
            </div>

            <div className="flex">
              <div>3.&nbsp;</div>
              <div>
                <p>
                 {tt("burn_p_3")}
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
              className="btn rounded text-white bg-invar-dark disabled:bg-invar-grey disabled:text-invar-light-grey  border-none normal-case w-32 sm:h-[56px] h-12 font-semibold text-base leading-5"
              onClick={submitHandler}
              disabled={!checkedBox}
            >
              {tt("confirm")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default BurnModal;
