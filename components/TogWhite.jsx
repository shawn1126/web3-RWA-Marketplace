import React, { useEffect, useState } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/outline";
import { shortenAddress } from "../src/utils/shortenAddress";
import { getWhite } from "../src/utils/storeFirebase";
import { useTranslation } from "next-i18next";
import { useAccount, useNetwork } from "wagmi";

const TogWhite = ({ start, end, setAllActivityData }) => {
  const [collapse, setCollapse] = useState(true);

  const { address } = useAccount();
  const { chain } = useNetwork();
  
  const [transactions, setTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const { t } = useTranslation("dashboard");

  async function getActivity() {
    if (!address) return;
    const items = await getWhite(address);
    setAllTransactions(items);
    if (items.length > 0) setAllActivityData((d) => [...d, "white"]);
  }

  useEffect(() => {
    setTransactions([]);
    setAllTransactions([]);
    setAllActivityData(prev => {
      let index = prev.indexOf("white");
      if (index > -1) {
        prev.splice(index, 1);
      }
      return prev;
    });

    if (address) getActivity();
  }, [address, chain?.name]);

  useEffect(() => {
    if (address && allTransactions.length > 0) {
      let tx = [...allTransactions];
      if (start && end) {
        tx = tx.filter(
          (t) =>
            t.millisec > start &&
            t.millisec < end
        );
      }
      setTransactions(tx);
    }
  }, [start, end, allTransactions]);



  return (
    <div className=" max-w-full z-10 ">
      {address && transactions.length > 0 && transactions[0] != undefined ? (
        <div
          className={
            "mt-3 bg-invar-main-purple px-4 sm:px-6 rounded text-white " +
            (collapse ? "mb-[436px]" : "")
          }
        >
          <div
            className="py-6 flex justify-between z-30 cursor-pointer"
            onClick={() => setCollapse(!collapse)}
          >
            <p className=" text-xl font-semibold">
              {t("dashbaord_activity_whiteapply_title")}
            </p>
            <div>
              {!collapse ? (
                <MinusIcon className="w-6 ml-6" />
              ) : (
                <PlusIcon className="w-6 ml-6" />
              )}
            </div>
          </div>
          {!collapse && (
            <div className="z-50 font-normal animate-fade-in-down">
              {transactions &&
                transactions.map((i, index) => (
                  <div
                    key={index}
                    className="py-6 min-h-max w-full flex flex-col md:flex-row border-t border-[#37293E] "
                  >
                    <div className=" w-full grow md:mt-0 grid grid-cols-2 md:grid-cols-3 gap-0 font-[350] font tracking-wider">
                      <div className=" h-[45px] ">
                        <p className=" text-sm text-invar-light-grey mb-1 ">
                          {t("dashbaord_activity_presale_nft")}
                        </p>
                        <p className=" text-base text-white font-light ">
                          {t("dashbaord_activity_presale_nftname")}
                        </p>
                      </div>
                      <div className=" h-[45px] ">
                        <p className=" text-sm text-invar-light-grey mb-1 ">
                          {t("dashbaord_activity_presale_address")}
                        </p>
                        <p className=" text-base text-white font-light ">
                          {i.address ? shortenAddress(i.address) : ""}
                        </p>
                      </div>
                      <div className=" h-[45px] mt-[20px] md:mt-0">
                        <p className=" text-sm text-invar-light-grey mb-1 ">
                          {t("dashbaord_activity_presale_result")}
                        </p>
                        <p className=" text-base text-white font-light ">
                          {t("dashbaord_activity_presale_result_completed")}
                        </p>
                      </div>
                      <div className=" h-[45px] mt-[20px] ">
                        <p className=" text-sm text-invar-light-grey mb-1 ">
                          {t("dashbaord_activity_presale_amount")}
                        </p>
                        <p className=" text-base text-white font-light ">
                          {i.amount}
                        </p>
                      </div>
                      <div className=" md:h-[45px] mt-[20px] md:w-[280px] mb-6 ">
                        <p className=" text-sm text-invar-light-grey mb-1 ">
                          {t("dashbaord_activity_whiteapply_applytime")}
                        </p>
                        <p className=" text-base text-white font-light ">
                          {i.date2.toString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          {/* <div>
              <Image width={162} height={200} src='/icons/ic_light.png' alt="" />
              <p className=" text-lg font-normal text-center text-invar-light-grey">{t("dashbaord_activity_presale_nodata")}</p>
            </div> */}
        </div>
      )}
    </div>
  );
};

export default TogWhite;
