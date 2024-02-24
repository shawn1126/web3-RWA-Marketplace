import { Dialog, Slide } from "@mui/material";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import React, { useContext } from "react";
import { ModalContext } from "../context/Modals-context";

const PropertyModal = () => {
  const { t } = useTranslation("propertyInfo");
  const modalOpen=useContext(ModalContext);
  return (
    <Dialog
    sx={{
      "& .MuiDialog-container": {
        justifyContent: "right",
      },
      "& .MuiDialog-paper": {
        marginRight: {xs:"0px",sm:"24px"},
        marginTop: {xs:"0px",sm:"24px"},
        marginBottom: "0px",
        marginLeft:"0px",
        maxHeight: {sm:"772px",xs:"100vh"},
        height: "100%",
        background: "linear-gradient(180deg, #44334C 0%, #1E1722 100%)",
        maxWidth:{
         xs:"100%", sm:"375px"
        },
        width:{
          xs:"100%"
         }
      },
      "& .MuiBackdrop-root": {
        backgroundColor: "rgba(0,0,0,0.7)",
      },
      "& .MuiDialog-container":{
          // alignItems:"flex-start"
          justifyContent:"flex-end",
          alignItems:"flex-start"
      }
    }}
    open={modalOpen.propertyModal}
  >
 
    <div className="relative ">
      <div className="bg-[#000000b6] text-2xl text-white bg-gradient-to-b from-primary to-[#1E1722] ">
        <div className="sm:max-w-[375px] pt-14 sm:px-6 px-9 pb-6 sm:h-full h-screen">
          <div className="btn btn-sm p-0 absolute right-[24px] top-[12px] bg-transparent border-none hover:bg-transparent" onClick={()=>modalOpen.setPropertyModal(false)}>
            <img
              className="h-[20px] w-[20px]"
              src="/icons/ic_close.svg"
              alt=""
            />
          </div>
          <img className="w-full" src="/bg/amwaj20.png" alt="" />
          <h3 className="text-2xl font-semibold mt-5">
            {t("homepage_property_title")}
          </h3>
          <p className="pt-1 pb-3 text-sm font-normal border-b border-invar-main-purple">
            {t("homepage_property_desc")}
          </p>
          <p className="mt-3 mb-1 text-xs font-normal text-invar-light-grey">
            {t("homepage_property_info_value")}
          </p>
          <p className="mb-[22px] text-base font-normal text-white">
            $38,000,000 USD
          </p>
          <p className=" mb-1 text-xs font-normal text-invar-light-grey">
            {t("homepage_property_info_apr")}
          </p>
          <p className="mb-[22px] text-base font-normal text-white">12%</p>
          <p className=" mb-1 text-xs font-normal text-invar-light-grey">
            {t("homepage_property_info_developer")}
          </p>
          <p className="mb-[22px] text-base font-normal text-white">
            {t("homepage_property_info_developer_mannaigroup")}
          </p>
          <p className=" mb-1 text-xs font-normal text-invar-light-grey">
            {t("homepage_property_info_manager")}
          </p>
          <p className="mb-[22px] text-base font-normal text-white">
            {t("homepage_property_info_manager_flowbay")}
          </p>
          <Link href="/propertyinfo">
            <button className=" btn w-full h-[48px] font-semibold text-base bg-invar-dark text-white rounded text-center normal-case border-none mb-6"
            onClick={()=>modalOpen.setPropertyModal(false)}
            >
              {t("homepage_property_info_researchmore")}
            </button>
          </Link>
        </div>
      </div>
    </div>
  </Dialog>
  );
};

export default PropertyModal;
