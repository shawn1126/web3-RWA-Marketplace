import { Checkbox } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { disableScroll, enableScroll } from "../src/utils/disableScroll";
import { uuid } from "uuidv4";

const SplitModal = ({ selectedToken, closeModal, splitFn,tt }) => {
  const [inputs, setInputs] = useState([{ value: "", id: uuid() }]);
  const [checkedBox, setCheckedBox] = useState(false);

  useEffect(() => {
    disableScroll();
    return () => enableScroll();
  });

  const updateInputs = (newQuantity = undefined, index = "") => {
    const _ = inputs.map((data, idx) => {
      if (idx === index) {
        return {
          ...data,
          value: newQuantity ? newQuantity : "",
        };
      } else {
        return { ...data };
      }
    });
    setInputs(_);
  };

  const onChangeInputs = (e) => {
    e.preventDefault();
    if (/[a-zA-Z]/g.test(e.target.value))return;
    const newQuantity = e.target.value.trim();
    const index = parseInt(e.target.dataset.index);
    updateInputs(newQuantity, index);
  };
  let total = 0;
  inputs.forEach((i) => (total += +i.value));
let valArr=[];
let outOfRange;
inputs.forEach((i) =>{
    let val=(+i.value)
    if(val<0.1)outOfRange=true;
   if(!Number.isNaN(val)) valArr.push(val);
  });
let totalEqual=total===((+selectedToken.tokenVal)/1e6)

  const submitHandler = () => {
    if (!checkedBox || total > selectedToken.tokenVal) return;
    if(totalEqual&&valArr.length==1)return;
    if(totalEqual)valArr.shift()
    splitFn(selectedToken, valArr);
    closeModal();
  };
  return (
    <>
      <div
        onClick={closeModal}
        className="fixed top-0 right-0 w-full h-full bg-black opacity-70 z-50"
      ></div>
      <div className="fixed top-20 left-1/2 translate-x-[-50%] bg-[#37293E] z-[51] overflow-scroll max-h-[85%] sm:w-[546px] w-[88%] h-[748px] ">
        <div className="w-full sm:min-h-[748px] sm:p-9 p-6">
          <h3 className="font-semibold text-xl leading-6 text-center sm:mb-9 mb-6">
            {tt("split_sft")}
          </h3>
          <div className="h-[120px] sm:h-[102px]  border border-[rgb(68,51,76)] sm:p-6 p-4 mb-6 rounded">
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
              {tt("token_val")}
              </p>
              <p className="font-semibold sm:text-base text-sm sm:leading-5 leading-4">
                {selectedToken.tokenVal / 1e6} USDC
              </p>
            </div>
            <div className="flex justify-between mb-3 sm:hidden">
              <p className="font-normal text-sm leading-5 text-invar-light-grey">
              {tt("token_interest")}
              </p>
              <p className="font-semibold sm:text-base text-sm sm:leading-5 leading-4">
                {selectedToken.interest.toFixed(4)} USDC
              </p>
            </div>
          </div>

          <div className="flex justify-between font-normal text-sm leading-5 mb-1">
            <p className="text-invar-light-grey">{tt("split")}</p>
            <p className={`${total>(+selectedToken.tokenVal/1e6)?"text-invar-error":"text-invar-success"} sm:flex hidden`}>
              {tt("balance")} : {(selectedToken.tokenVal / 1e6 - total).toFixed(4)} USDC
            </p>
          </div>

          {inputs.map((data, idx) => (
            <div className="flex mb-3" key={idx}>
              <label className="flex-1 block">
                <div className="relative">
                  <input
                    name="split"
                    type="text"
                    className={`block bg-invar-main-purple w-full h-10 rounded focus:border border-white outline-none text-white font-normal px-[15px] appearance-none ${data.value&&(+data.value)<0.1&&"border-invar-error"} ${(+data.value)>=0.1&&"focus:border-invar-success"}`}
                    value={data.value}
                    data-index={idx}
                    onChange={onChangeInputs}
                  />
                  <span className=" pointer-events-none absolute inset-y-0 right-[15px] flex items-center text-white text-base font-semibold leading-5">
                    USDC
                  </span>
                  {!data.value && (
                    <span className=" pointer-events-none absolute inset-y-0 left-[15px] flex items-center text-invar-light-grey text-base font-semibold leading-5">
                      ≥ 0.1
                    </span>
                  )}
                </div>
                {
                           data.value&& (data.value)<0.1 && 
                            <span className="text-invar-error text-sm">{tt("val_range")}</span>}
              </label>
              <div
                className="w-10 h-10 bg-[#44334C] rounded ml-3 flex justify-center items-center cursor-pointer"
                onClick={() => {
                  setInputs(inputs.filter((d) => d.id != data.id));
                }}
              >
                <img
                  src="/icons/ic_close.svg"
                  alt="close-icon"
                  className="w-5 h-5"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          ))}

          <button
            className="font-semibold text-xs leading-4 px-3 py-1.5 bg-invar-main-purple rounded inline-block sm:mb-9 mb-6"
            onClick={() => setInputs([...inputs, { value: "", id: uuid() }])}
          >
            {tt("add_new")}
          </button>

          <p className="text-right text-invar-success font-normal text-sm leading-5 sm:hidden">
            {tt("balance")} : {(selectedToken.tokenVal / 1e6 - total).toFixed(4)} USDC
          </p>

          <div className="sm:hidden border border-primary w-full h-0 my-6"></div>

          <div className="sm:flex items-center justify-between h-[70px] bg-primary px-6 mb-6 hidden">
            <p className="text-invar-light-grey font-normal text-sm leading-5">
             {tt("claim_interests")}
            </p>
            <p className="font-semibold text-base leading-5 text-white">
              {(+selectedToken.interest.toString()).toFixed(4)} USDC
            </p>
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
                  {tt("merge_2")}
                </p>
              </div>
            </div>

            <div className="flex">
              <div>3.&nbsp;</div>
              <div>
                <p>
                  {tt("split_3")}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center relative right-3 mb-6">
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
              disabled={
                inputs.length == 0 ||
                !checkedBox ||
                (inputs.length == 1 && !+inputs[0].value > 0) ||
                outOfRange||
                total > selectedToken.tokenVal / 1e6||
                valArr.includes(0)||totalEqual&&valArr.length==1
              }
              className="btn rounded disabled:bg-invar-grey disabled:text-invar-light-grey text-white bg-invar-dark border-none normal-case w-32 sm:h-[56px] h-12 font-semibold text-base leading-5"
              onClick={submitHandler}
            >
              {tt("confirm")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default SplitModal;
