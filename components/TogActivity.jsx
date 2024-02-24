import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import inVariaJSON from "../src/utils/InVaria.json";
import { nftAddress, passAddress, RPC_URL } from "../src/utils/web3utils";
import { MinusIcon, PlusIcon } from "@heroicons/react/outline";
import { ItemActivity } from "../components";
import { useTranslation } from "next-i18next";
import { useAccount, useNetwork, useSigner } from "wagmi";
import passJSON from "../src/utils/passABI.json";
import { passTypeArray } from "../src/utils/passTokens";

const TogActivity = ({ setAllActivityData, start, end, type }) => {
  const [collapse, setCollapse] = useState(true);

  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const provider = signer?.provider;

  const [transactions, setTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  console.log("transMint", transactions);

  const passImgNameHandler = (tokenId) => {
    const type = passTypeArray[tokenId + 1];

    if (type == "Earth") {
      return { img: "/bg/earthInvariant.png", name: "Earth InVariant" };
    }
    if (type == "Ocean") {
      return { img: "/bg/oceanInvariant.png", name: "Ocean InVariant" };
    }
    if (type == "Skyline") {
      return { img: "/bg/skyInvariant.png", name: "Skyline InVariant" };
    }
  };

  async function getActivity() {
    if (!address || !provider) return;
    let etherScan, passOpenSea, amwajOpenSea;
    if (chain.id == 5) {
      etherScan = "https://goerli.etherscan.io/tx/";
      passOpenSea = `https://testnets.opensea.io/assets/goerli/0x4c95C21179831192D120c93538f19B1b70bdb259/1`;
      amwajOpenSea = `https://testnets.opensea.io/assets/goerli/0x98A107e2d232F5b1f63013b22045Eac0605ECb15/1`;
    } else if (chain.id == 1) {
      etherScan = "https://etherscan.io/tx/";
      passOpenSea = `https://opensea.io/assets/ethereum/0x0e4f563103A6c7b624E3017958A9823C7E7dD4F9/1`;
      amwajOpenSea = `https://testnets.opensea.io/assets/goerli/0x502818ec5767570F7fdEe5a568443dc792c4496b/1`;
    }
    const nftContract = new ethers.Contract(nftAddress, inVariaJSON, signer);
    const filter = nftContract.filters.TransferSingle(
      null,
      "0x0000000000000000000000000000000000000000",
      address,
      null,
      null
    );
    const rpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const rpcNftContract = new ethers.Contract(
      nftAddress,
      inVariaJSON,
      rpcProvider
    );

    const query = await rpcNftContract.queryFilter(filter);

    let arr = [];
    await Promise.all(
      query?.map(async (i) => {
        const block = await provider.getBlock(i.blockHash);
        const blockTime = new Date(block?.timestamp * 1000);
        if (i.args.id.toNumber() == 1) {
          const item = {
            date: blockTime.toString(),
            tokenId: 1,
            dd: blockTime,
            year: blockTime.getFullYear(),
            month: blockTime.getMonth() + 1,
            day: blockTime.getDate(),
            from: i.args.from,
            to: i.args.to,
            operator: i.args.operator,
            id: i.args.id.toNumber(),
            amount: parseFloat(i.args.value),
            value: `${2000 * parseFloat(i.args.value)} USDC`
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            txid: `${i.transactionHash}`,
            img: "/bg/bg_building.jpeg",
            name: "Amwaj20",
            etherScanUrl: `${etherScan}${i.transactionHash}`,
            openSeaUrl: amwajOpenSea,
          };
          arr.push(item);
          return item;
        }
      })
    );
    //fetch pass nft details here

    const passContract = new ethers.Contract(
      passAddress,
      passJSON.abi,
      provider
    );

    let finalDataArray = [];
    let eventFilter = passContract.filters.Mint(address, null, null);
    let events = await passContract.queryFilter(eventFilter);
    //events give us tokenId and blockNumber
    let promisesArray = [];
    events.forEach((element) => {
      promisesArray.push(provider.getBlock(element.blockNumber));
    });
    const history = await Promise.all(promisesArray);
    console.log("timehistory", history);
    //we fetch block to get timeStamp;

    let pricePromises = [];
    events.forEach((element) => {
      pricePromises.push(provider.getTransaction(element.transactionHash));
    });
    //we fetched transaction to get value
    const transactionHistory = await Promise.all(pricePromises);
    events.forEach((e, i) => {
      finalDataArray.push({
        txid: events[i].transactionHash,
        time: history[i].timestamp * 1000,
        tokenId: parseInt(events[i].data),
        value: `${ethers.utils.formatEther(transactionHistory[i].value)} ETH`,
        amount: 1,
        date: new Date(history[i].timestamp * 1000).toString(),
        day: new Date(history[i].timestamp * 1000).getDate(),
        dd: new Date(history[i].timestamp * 1000),
        to: address,
        month: new Date(history[i].timestamp * 1000).getMonth() + 1,
        year: new Date(history[i].timestamp * 1000).getFullYear(),
        to: address,
        openSeaUrl: passOpenSea,
        ...passImgNameHandler(parseInt(events[i].data)),
      });
    });
    console.log("finalDataArray", finalDataArray);
    if (type == "pass") arr = finalDataArray;
    else arr = [...arr, ...finalDataArray];
    //pass nft ends here
    arr = arr.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (arr.length > 0) setAllActivityData((d) => [...d, "activity"]);
    setAllTransactions(arr);
  }

  useEffect(() => {
    setTransactions([]);
    setAllTransactions([]);
    setAllActivityData((prev) => {
      let index = prev.indexOf("activity");
      if (index > -1) {
        prev.splice(index, 1);
      }
      return prev;
    });
    if (address && provider) {
      console.log("test unstake mounted");
      getActivity();
    }
    console.log("network name", chain?.name);
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
      if(type=="pass"){
        tx = tx.filter(
          (t) =>t.name.includes("InVariant")
        );
      }else if(type=="Amwaj20"){
        tx = tx.filter(
          (t) =>t.name.includes("Amwaj20")
        );
      }
      setTransactions(tx);
    }
  }, [start, end, allTransactions,type]);
  
console.log("type",type)
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
            <p className=" text-xl font-semibold">{t("minting_history")}</p>
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
                  <ItemActivity key={index} i={i} />
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

export default TogActivity;
