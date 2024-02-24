import React, { useState, useEffect } from "react";
import { SiweMessage } from "siwe";
import { getUserData } from "../src/utils/storeFirebase";
import { useTranslation } from "next-i18next";
import { useAccount, useSigner } from "wagmi";

const FormInfo = () => {
  let domain;

  const [signed, setSigned] = useState(false);
  const [data, setData] = useState();
  const { t } = useTranslation("dashboard");

  const { address } = useAccount();
  const { data: signer } = useSigner();

  function createSiweMessage(address, statement) {
    const message = new SiweMessage({
      domain,
      address,
      statement,
      uri: origin,
      version: "1",
      chainId: "1",
    });
    return message.prepareMessage();
  }
  async function signInWithEthereum() {
    const message = createSiweMessage(
      address,
      "Sign to view personal infomation."
    );
    const nonce = { ["nonce"]: await signer.signMessage(message) };
    console.log(nonce);
  }

  async function handleSign() {
    try {
      console.log("sign");
      await signInWithEthereum();
      // setData(await getUserData(address))
      const newData = await getUserData(address);
      setData(newData);
      setSigned(true);
    } catch (error) {
      console.log(error);
      setSigned(false);
    }
  }


  useEffect(() => {
    console.log("formInfo");
    if (!address) return;
    // if (address == pervState[0]) return
    // pervState[0] = address
    setSigned(false);
    domain = window.location.host;
  }, [address]);

  return (
    <>
      {!signed && (
        <div className=" w-full p-16 mb-64 rounded flex flex-col justify-center items-center bg-invar-main-purple text-white font-semibold">
          <p className=" text-xl text-accent">
            {t("dashbaord_profile_table_signconfirm")}
          </p>
          <button
            className="btn bg-invar-dark mt-8 rounded text-white px-8 normal-case text-base font-semibold cursor-pointer border-none"
            onClick={() => {
              handleSign();
            }}
          >
            {t("dashbaord_profile_table_sign")}
          </button>
        </div>
      )}
      {signed && (
        <form name="kycForm" className=" flex-grow pb-[117px]">
          <label className="w-full mb-6 block">
            <p className="block text-invar-light-grey text-sm leading-4 font-normal mb-3">
              {t("dashbaord_profile_table_country")}
            </p>
            <div className="relative">
              <div
                className="block bg-invar-main-purple w-full h-12 rounded 
             text-white font-normal text-base px-4 py-3"
              >
                {data.selectCountryRegion}
              </div>
            </div>
          </label>
          <label className="w-full mb-6 block">
            <p className="block text-invar-light-grey text-sm leading-4 font-normal mb-3">
              {t("dashbaord_profile_table_fullname")}
            </p>
            <div className="relative">
              <div
                className="block bg-invar-main-purple w-full h-12 rounded 
             text-white font-normal text-base px-4 py-3"
              >
                {data.inputName}
              </div>
            </div>
          </label>
          <label className="w-full mb-6 block">
            <p className="block text-invar-light-grey text-sm leading-4 font-normal mb-3">
              {t("dashbaord_profile_table_idtype")}
            </p>
            <div className="relative">
              <div
                className="block bg-invar-main-purple w-full h-12 rounded 
             text-white font-normal text-base px-4 py-3"
              >
                {data.selectIDtype}
              </div>
            </div>
          </label>
          <label className="w-full mb-6 block">
            <p className=" text-invar-light-grey text-sm leading-4 font-normal mb-3">
              {t("dashbaord_profile_table_idnumber")}
            </p>
            <div className="relative">
              <div
                className="block bg-invar-main-purple w-full h-12 rounded 
             text-white font-normal text-base px-4 py-3"
              >
                {data.inputIDnumber}
              </div>
            </div>
          </label>
          <label className="w-full mb-6 block">
            <p className="block text-invar-light-grey text-sm leading-4 font-normal mb-3">
              {t("dashbaord_profile_table_birthday")}
            </p>
            <div className="relative">
              <div
                className="block bg-invar-main-purple w-full h-12 rounded 
             text-white font-normal text-base px-4 py-3"
              >
                {data.selectDate}
              </div>
            </div>
          </label>
          <label className="w-full mb-6 block">
            <p className="block text-invar-light-grey text-sm leading-4 font-normal mb-3">
              {t("dashbaord_profile_table_email")}
            </p>
            <div className="relative">
              <div
                className="block bg-invar-main-purple w-full h-12 rounded 
             text-white font-normal text-base px-4 py-3"
              >
                {data.inputEmail}
              </div>
            </div>
          </label>

          <label className="w-full mb-6 block">
            <p className="text-invar-light-grey text-sm leading-4 font-normal mb-3">
              {t("dashbaord_profile_table_fulladdress")}
            </p>
            <div className="relative">
              <div
                className="block bg-invar-main-purple w-full h-12 rounded 
             text-white font-normal text-base px-4 py-3"
              >
                {data.inputAddress}
              </div>
            </div>
          </label>
          {/* <input
      type="submit" value="Next"
      className="btn btn-disabled inline-block bg-invar-disabled hover:bg-invar-main-purple rounded text-white px-8 normal-case text-base font-semibold"
    /> */}
        </form>
      )}
    </>
  );
};

export default FormInfo;
