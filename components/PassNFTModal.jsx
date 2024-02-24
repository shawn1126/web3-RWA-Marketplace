import { Dialog } from "@mui/material";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import React, { useContext } from "react";
import { ModalContext } from "../context/Modals-context";

const PassNFTModal = () => {
  const { t } = useTranslation("index");
  const modalOpen = useContext(ModalContext);

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
            maxHeight: {sm:"748px",xs:"100vh"},
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
      open={modalOpen.passNFTModal}
    >
      <div className="relative">
        <div className="bg-[#000000b6] text-2xl text-white bg-gradient-to-b from-primary to-[#1E1722] ">
          <div className="sm:max-w-[375px] pt-14 sm:px-6 px-9 pb-6 sm:h-auto h-screen">
            <div
              className="btn btn-sm p-0 absolute right-[24px] top-[12px] bg-transparent border-none hover:bg-transparent"
              onClick={() => modalOpen.setPassNFTModal(false)}
            >
              <img
                className="h-[20px] w-[20px]"
                src="/icons/ic_close.svg"
                alt=""
              />
            </div>
            <img className="w-full max-w-[327px] max-h-[235px]" width={327} height={235} src="/pass-nft/pass-nft-img.png" alt="" />
            <h3 className="text-2xl font-bold mt-6">PASS: InVariant</h3>
            <p className="pt-1 pb-3 text-base font-normal leading-6 border-b border-invar-main-purple">
              {t("pass_eco")}
            </p>
            <p className="mt-3 mb-1 text-xs font-normal text-invar-light-grey">
              {t("price_eth")}
            </p>
            <p className="mb-[10px] text-base font-normal text-white">
              0 ETH ~ 0.1 ETH
            </p>

            <p className=" mb-1 text-xs font-normal text-invar-light-grey">
              {t("type")}
            </p>
            <p className="mb-[10px] text-base font-normal text-white">
              {t("utility")}
            </p>

            <p className=" mb-1 text-xs font-normal text-invar-light-grey">
              {t("elements")}
            </p>
            <p className="mb-[52px] text-base font-normal text-white">
              {t("earth_ocean_sky")}
            </p>

            <Link href="/pass-nft">
              <button
                   onClick={() => modalOpen.setPassNFTModal(false)}
                className=" btn disabled:bg-invar-grey disabled:text-invar-light-grey w-full h-[48px] font-semibold text-base bg-invar-dark text-white rounded text-center normal-case border-none mb-6"
              >
                {t("research_more")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PassNFTModal;
