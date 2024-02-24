// 為了讓copy state能在每個item獨立，所以要針對每個item設state

import React, { useState } from "react";
import { shortenAddress } from "../src/utils/shortenAddress";
import { useTranslation } from "next-i18next";

const ItemActivity = ({ i }) => {
  const { t } = useTranslation("dashboard");
  const [copy, setCopy] = useState(false);
  function handleCopy() {
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 2000);
  }
  return (
    <div className="py-6 min-h-max w-full flex flex-col md:flex-row border-t border-[#37293E] ">
      <div className=" m-0 md:w-[214px] md:h-[187px] w-full h-[270px]">
        {/* <Image className=" rounded" layout='fixed' width={214} height={187} src='/bg/bg_building.jpeg' /> */}
        <img
          className="md:w-[214px] md:h-[187px] object-fill rounded  w-full h-full"
          src={i.img}
        />
      </div>
      <div className=" grow mt-6 md:mt-0 md:ml-12 grid grid-cols-2 md:grid-cols-3 gap-0 font-[350] font tracking-wider">
        <div className=" h-[45px] ">
          <p className=" text-sm text-invar-light-grey mb-1 ">
            {t("dashbaord_activity_whitemint_nft")}
          </p>
          <p className=" text-base text-white font-light ">{i.name}</p>
        </div>
        <div className=" h-[45px] ">
          <p className=" text-sm text-invar-light-grey mb-1 ">Token ID</p>
          <p className=" text-base text-white font-light ">#{i.tokenId}</p>
        </div>
        <div className=" h-[45px] ">
          <p className=" text-sm text-invar-light-grey mb-1 md:mt-0 mt-5 ">
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
            {i.value.includes("0.0")
              ? "🚀"
              : i.value.includes("0.")
              ? "0.1 ETH"
              : i.value}
          </p>
        </div>
        <div className=" md:h-[45px] mt-[20px] md:w-[180px] ">
          <p className=" text-sm text-invar-light-grey mb-1 ">
            {t("dashbaord_activity_whitemint_minttime")}
          </p>
          <p className=" text-base text-white font-light ">{i.date}</p>
        </div>
        <div className=" h-[45px] mt-[20px] ">
          <p className=" text-sm text-invar-light-grey mb-1 ">
            {t("dashbaord_activity_whitemint_txid")}
          </p>
          {i.txid ? (
            <div className=" relative flex justify-start items-center">
              <a
                href={i.etherScanUrl}
                target="_blank"
                rel="noreferrer"
                className=" text-base text-white font-light hover:underline "
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
          <p className=" text-sm text-invar-light-grey mb-1 ">
            {t("dashbaord_activity_presale_marketplace")}
          </p>
          <a
            href={i.openSeaUrl}
            target="_blank"
            rel="noreferrer"
            className="flex"
          >
            <div className=" h-6 w-6 mr-2 ">
              <img src="/icons/opensea.svg" alt="" />
            </div>
            <p className=" text-base text-white font-light ">OpenSea</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ItemActivity;
