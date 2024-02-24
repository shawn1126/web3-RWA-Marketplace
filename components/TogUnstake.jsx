import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import stakeABI from "../src/utils/invarstaking.json";
import { RPC_URL, stakeAddress } from "../src/utils/web3utils";
import { MinusIcon, PlusIcon } from "@heroicons/react/outline";
import { His } from ".";
import { useTranslation } from "next-i18next";
import { useAccount, useNetwork, useSigner } from "wagmi";

const TogUnstake = ({ start, end, setAllActivityData }) => {
  const [collapse, setCollapse] = useState(true);  
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const provider=signer?.provider;

  const [allTransactions, setAllTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  console.log("test unstake component main");
  async function getActivity() {
    if (!address) return;
    const stakeContract = new ethers.Contract(stakeAddress, stakeABI, signer);
    const filter = stakeContract.filters.unStakeInfo(address, null, null);

    const rpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const rpcNftContract = new ethers.Contract( stakeAddress, stakeABI, rpcProvider);
    const unstake = await rpcNftContract.queryFilter(filter);

    console.log("unstake");
    let unitems = await Promise.all(
      unstake?.map(async (i, index) => {
        const blockTime = new Date(i.args.unstakeTime * 1000);
        const item = {
          date: blockTime.toString(),
          year: blockTime.getFullYear(),
          month: blockTime.getMonth() + 1,
          day: blockTime.getDate(),
          amount: i.args.amount.toNumber(),
          txid: `${i.transactionHash}`,
        };
        return item;
      })
    );

    unitems = unitems.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    if (unitems.length > 0) setAllActivityData((d) => [...d, "unstake"]);
    setAllTransactions(unitems);
  }

  useEffect(() => {
    setTransactions([]);
    setAllTransactions([]);
    setAllActivityData(prev => {
      let index = prev.indexOf("unstake");
      if (index > -1) {
        prev.splice(index, 1);
      }
      return prev;
    });

    if (address&&provider) {
      console.log("test unstake mounted");
      getActivity();
    }
  }, [address, chain?.name, provider]);

  useEffect(() => {
    if (address && allTransactions.length > 0) {
      let tx = [...allTransactions];
      if (start && end) {
        tx = tx.filter(
          (t) =>
            new Date(t.date).getTime() > start &&
            new Date(t.date).getTime() < end
        );
      }
      setTransactions(tx);
    }
  }, [start, end, allTransactions]);

  const { t } = useTranslation("dashboard");

  return (
    <div className=" max-w-full z-10 ">
      {address && transactions.length > 0 ? (
        <div
          className={
            "mt-3 bg-invar-main-purple px-4 sm:px-6 rounded text-white " +
            (collapse ? "" : "")
          }
        >
          <div
            className="py-6 flex justify-between z-30 cursor-pointer"
            onClick={() => setCollapse(!collapse)}
          >
            <p className=" text-xl font-semibold">
              {t("dashbaord_activity_unstake_title")}
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
                transactions.map((i, index) => <His key={index} i={i} />)}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center"></div>
      )}
    </div>
  );
};

export default TogUnstake;
