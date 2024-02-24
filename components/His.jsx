import React, {  useState } from "react";
import { shortenAddress } from "../src/utils/shortenAddress";
import { useTranslation } from "next-i18next";
import { useAccount } from "wagmi";

const His = ({ i }) => {
  const { address } = useAccount();
  const [copy, setCopy] = useState(false);
  const { t } = useTranslation("dashboard");

  function handleCopy() {
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 2000);
  }

  return (
    <div className="py-6 min-h-max w-full flex flex-col md:flex-row border-t border-[#37293E] ">
      <div className=" m-0 w-full h-[270px] md:w-[214px] md:h-[187px]">
        {/* <Image className=" rounded" layout='fixed' width={214} height={187} src='/bg/bg_building.jpeg' /> */}
        <img
          className="w-full h-full object-fill md:w-[214px] md:h-[187px] rounded"
          src="/bg/bg_building.jpeg"
        />
      </div>
      <div className=" grow mt-6 md:mt-0 md:ml-12 grid grid-cols-2 md:grid-cols-3 gap-0 font-[350] font tracking-wider">
        <div className=" h-[45px] ">
          <p className=" text-sm text-invar-light-grey mb-1 ">
            {t("dashbaord_activity_whitemint_nft")}
          </p>
          <p className=" text-base text-white font-light ">
            {t("dashbaord_activity_whitemint_nftname")}
          </p>
        </div>
        <div className=" h-[45px] ">
          <p className=" text-sm text-invar-light-grey mb-1 ">
            {t("dashbaord_activity_whitemint_address")}
          </p>
          <p className=" text-base text-white font-light ">
            {address ? shortenAddress(address) : ""}
          </p>
        </div>
        <div className=" h-[45px] ">
          <p className=" text-sm text-invar-light-grey mb-1 ">
            {t("dashbaord_activity_whitemint_result")}
          </p>
          <p className=" text-base text-white font-light ">
            {t("dashbaord_activity_whitemint_result_completed")}
          </p>
        </div>
        <div className=" h-[45px] mt-[20px] ">
          <p className=" text-sm text-invar-light-grey mb-1 ">
            {t("dashbaord_activity_whitemint_amount")}
          </p>
          <p className=" text-base text-white font-light ">{i.amount}</p>
        </div>
        <div className=" h-[45px] mt-[20px] ">
          <p className=" text-sm text-invar-light-grey mb-1 ">
            {t("dashbaord_activity_whitemint_value")}
          </p>
          <p className=" text-base text-white font-light ">
            {(2000 * i.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
            USDC
          </p>
        </div>
        <div className=" md:h-[45px] mt-[20px] md:w-[180px] ">
          <p className=" text-sm text-invar-light-grey mb-1 ">
            {t("dashbaord_activity_unstake_unstaketime")}
          </p>
          <p className=" text-base text-white font-light ">{i.date}</p>
        </div>
        <div className=" h-[45px] mt-[20px] ">
          <p className=" text-sm text-invar-light-grey mb-1 ">
            {t("dashbaord_activity_presale_txid")}
          </p>
          {i.txid ? (
            <div className=" relative flex justify-start items-center">
              <a
                href={i.etherScanUrl}
                target="_blank"
                rel="noreferrer"
                className=" text-base text-white font-light "
              >
                {i.txid ? shortenAddress(i.txid) : ""}
              </a>
              {copy ? (
                <>
                  <img
                    className="ml-2 h-4 cursor-pointer"
                    src="/icons/ic_copied.svg"
                  />
                  <div className=" absolute left-[95px] bottom-7 text-xs font-normal rounded bg-black bg-opacity-70 px-[6px] py-1 shadow">
                    Copied
                  </div>
                </>
              ) : (
                <img
                  className="ml-2 h-4 cursor-pointer"
                  src="/icons/ic_copy.svg"
                  onClick={(e) => {
                    navigator.clipboard.writeText(i.txid);
                    handleCopy(e);
                  }}
                />
              )}
            </div>
          ) : (
            ""
          )}
        </div>
        <div className=" h-[45px] mt-[20px] ">
          {/* <p className=" text-sm text-invar-light-grey mb-1 ">View on</p> */}
          {/* <a href={i.openSeaUrl} target="_blank" rel="noreferrer" className="flex">
  <div className=" h-6 w-6 mr-2 ">
    <img src="/icons/opensea.svg" alt="" />
  </div>
  <p className=" text-base text-white font-light ">OpenSea</p>
</a> */}
        </div>
      </div>
    </div>
  );
};

export default His;
