import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { SiweMessage } from "siwe";
import { handleKyc } from "../src/utils/handleKyc";
import { SelectLocale, SelectCountryRegion } from "./SelectOptions";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useAccount, useEnsAddress, useNetwork, useSigner } from "wagmi";

const Form = () => {
  const router = useRouter();
   let domain;
   // provider, signer;
  const { address } = useAccount();

  const { chain } = useNetwork();

  const { data: signer } = useSigner();

  const [inputs, setInputs] = useState({
    ["address"]: address,
    ["time"]: new Date(Date.now()),
    ["language"]: router.locale,
  });

  const [isAdult, setIsAdult] = useState(true);
  const [emailChange, setEmailChange] = useState(false);
  const [submitState, setSubmitState] = useState("");
  const { t } = useTranslation("dashboard");

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
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();
    const message = createSiweMessage(address, "Sign in with Ethereum.");
    const nonce = { ["nonce"]: await signer.signMessage(message) };
    console.log(nonce);
    console.log("pppaddress", address);
  }

  useEffect(() => {
    console.log("form");
    if (!address) return;
    domain = window.location.host;
    if (inputs.address !== address) {
      setInputs((values) => ({
        ...values,
        ["address"]: address,
        ["domain"]: window.location.href,
      }));
    }
    // provider = new ethers.providers.Web3Provider(window.ethereum);
    // signer = provider.getSigner();
  }, [address, chain?.id]);

  const handleSubmit = async (event) => {
    //資料符合才會跑以下
    event.preventDefault();
    setSubmitState("submitting");
    console.log("submitting...", inputs, submitState);
    // const items = await Promise.all(inputs?.map(async i => {
    //   const item = {
    //     date: blockTime.toString(),
    //     year: blockTime.getFullYear(),
    //     month: blockTime.getMonth() + 1,
    //     day: blockTime.getDate(),
    //   }
    //   return item
    // }))
    try {
      await signInWithEthereum();
      const kycLink = await handleKyc(inputs);
      console.log("emailTestkyclinkk",kycLink);
      // window.open(kycLink, 'kycLink')
      // var tempwindow = window.open('_blank'); // 先打開頁面
      window.location.href = kycLink; // 後更改頁面地址
    } catch (error) {
      console.log(error);
      setSubmitState("");
    }
  };

  const handleChange = (event) => {
    if (submitState != "") return;
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
    if (name == "selectDate") {
      handleBirthDate(value);
    }
  };

  useEffect(() => {
    if (inputs.inputEmail == undefined) return;
    setEmailChange(true);
  }, [inputs.inputEmail]);

  const handleBirthDate = (birth) => {
    let today = new Date();
    let birthDate = new Date(birth);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 21) {
      setIsAdult(false);
    } else {
      setIsAdult(true);
    }
  };

  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  let btnSubmit;
  if (
    inputs.selectDate !== undefined &&
    isAdult == true && //年紀、信箱先過濾，後讓內建submit過濾
    validateEmail(inputs.inputEmail) &&
    address &&
    submitState == ""
  ) {
    btnSubmit = (
      <input
        type="submit"
        value={t("dashbaord_profile_table_next")}
        className="btn inline-block bg-invar-dark hover:bg-invar-main-purple rounded text-white px-8 normal-case text-base font-semibold cursor-pointer border-none"
      />
    );
  } else if (submitState == "submitted") {
    btnSubmit = (
      <input
        type="submit"
        value="Submitted"
        className="btn btn-disabled inline-block bg-invar-dark hover:bg-invar-main-purple rounded text-white px-8 normal-case text-base font-semibold cursor-pointer border-none"
      />
    );
  } else if (submitState == "submitting") {
    btnSubmit = (
      <button className="btn loading bg-invar-dark hover:bg-invar-main-purple rounded text-white px-8 normal-case text-base font-semibold cursor-pointer border-none">
        Submitting
      </button>
    );
  } else {
    btnSubmit = (
      <input
        type="submit"
        value={t("dashbaord_profile_table_next")}
        className="btn btn-disabled inline-block bg-invar-disabled hover:bg-invar-main-purple rounded text-white px-8 normal-case text-base font-semibold"
      />
    );
  }

  return (
    <form
      name="kycForm"
      className=" flex-grow pb-[117px]"
      onSubmit={handleSubmit}
    >
      {/* <label className="w-full mb-6 block">
        <p className="block text-invar-light-grey text-sm leading-4 font-normal mb-3">
          Language
        </p>
        <div className="relative">
          <select name="selectLanguage" onChange={handleChange} value={inputs.selectLanguage || ""}
            required className="appearance-none block bg-invar-main-purple w-full h-12 rounded 
            focus:border border-white focus:outline-none text-white font-normal px-[15px]">
            <SelectLocale />
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
          </div>
        </div>
      </label> */}
      <label className="w-full mb-6 block">
        <p className="block text-invar-light-grey text-sm leading-4 font-normal mb-3">
          {t("dashbaord_profile_table_country")}
        </p>
        <div className="relative">
          <select
            name="selectCountryRegion"
            onChange={handleChange}
            value={inputs.selectCountryRegion || ""}
            required
            className="appearance-none block bg-invar-main-purple w-full h-12 rounded 
            focus:border border-white focus:outline-none text-white font-normal px-[15px]"
          >
            <SelectCountryRegion />
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </label>
      <label className="w-full mb-6 block">
        <p className="block text-invar-light-grey text-sm leading-4 font-normal mb-3">
          {t("dashbaord_profile_table_fullname")}
        </p>
        <input
          name="inputName"
          type="text"
          onChange={handleChange}
          value={inputs.inputName || ""}
          required
          className="block bg-invar-main-purple w-full h-12 rounded focus:border border-white text-white font-normal px-[15px]"
        />
      </label>
      <label className="w-full mb-6 block">
        <p className="block text-invar-light-grey text-sm leading-4 font-normal mb-3">
          {t("dashbaord_profile_table_idtype")}
        </p>
        <div className="relative">
          <select
            name="selectIDtype"
            onChange={handleChange}
            value={inputs.selectIDtype || ""}
            required
            className="appearance-none block bg-invar-main-purple w-full h-12 rounded 
            focus:border border-white focus:outline-none text-white font-normal px-[15px]"
          >
            <option value="">
              {t("dashbaord_profile_table_country_select")}
            </option>
            <option value="ID_CARD">
              {t("dashbaord_profile_table_idtype_idcard")}
            </option>
            <option value="PASSPORT">
              {t("dashbaord_profile_table_idtype_passport")}
            </option>
            <option value="DRIVING_LICENSE">
              {t("dashbaord_profile_table_idtype_drivinglicense")}
            </option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </label>
      <label className="w-full mb-6 block">
        <p className=" text-invar-light-grey text-sm leading-4 font-normal mb-3">
          {t("dashbaord_profile_table_idnumber")}{" "}
        </p>
        <input
          name="inputIDnumber"
          type="text"
          onChange={handleChange}
          value={inputs.inputIDnumber || ""}
          required
          className="block bg-invar-main-purple w-full h-12 rounded focus:border border-white text-white font-normal px-[15px]"
        />
      </label>
      <label className="w-full mb-6 block">
        <p className="block text-invar-light-grey text-sm leading-4 font-normal mb-3">
          {t("dashbaord_profile_table_birthday")}
        </p>
        <div className="relative">
          <input
            name="selectDate"
            type="date"
            onChange={handleChange}
            value={inputs.selectDate || ""}
            required
            className="block bg-invar-main-purple w-full h-12 rounded focus:border border-white outline-none text-white font-normal px-[15px] appearance-none"
          />
          <div className=" pointer-events-none absolute inset-y-0 right-[15px] flex items-center  text-white">
            <img className=" w-6 h-6 " src="/icons/ic_calendar.png" alt="" />
          </div>
        </div>
        {!isAdult && (
          <p className="mt-2 text-pink-600 text-sm">
            {t("dashbaord_profile_table_overage")}
          </p>
        )}
      </label>
      <label className="w-full mb-6 block">
        <p className="block text-invar-light-grey text-sm leading-4 font-normal mb-3">
          {t("dashbaord_profile_table_email")}
        </p>
        <input
          name="inputEmail"
          type="email"
          onChange={handleChange}
          value={inputs.inputEmail || ""}
          required
          className="peer block bg-invar-main-purple w-full h-12 rounded focus:border border-white focus:outline-none
          text-white font-normal px-4 focus:px-[15px]"
        />
        {emailChange && (
          <p className="mt-2 hidden peer-invalid:flex text-pink-600 text-sm">
            {t("dashbaord_profile_table_invalidemailformat")}
          </p>
        )}
      </label>

      <label className="w-full mb-6 block">
        <p className="text-invar-light-grey text-sm leading-4 font-normal mb-3">
          {t("dashbaord_profile_table_fulladdress")}
        </p>
        <input
          name="inputAddress"
          type="text"
          onChange={handleChange}
          value={inputs.inputAddress || ""}
          required
          className="block bg-invar-main-purple w-full h-12 rounded focus:border border-white focus:outline-none text-white font-normal px-4 focus:px-[15px]"
        />
      </label>
      {btnSubmit}
    </form>
  );
};

export default Form;
