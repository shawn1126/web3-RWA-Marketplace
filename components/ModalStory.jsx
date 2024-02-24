import { useTranslation } from "next-i18next";
import React from "react";
import { enableScroll } from "../src/utils/disableScroll";

const ModalStory = () => {
  const { t } = useTranslation("storyline");
  return (
    <div>
      <input type="checkbox" id="my-modal-1" className="modal-toggle" />
      <div className="modal justify-center items-start bg-[#000000b6] text-2xl text-white">
        <div className="modal-box hidden md:flex flex-col relative w-[800px] max-w-5xl mt-[80px] mx-0 p-0 pb-[48px] rounded-[4px] bg-gradient-to-b from-primary to-[#1E1722]  scrollbar-hide">
          <label
            htmlFor="my-modal-1"
            onClick={() => enableScroll()}
            className="btn btn-sm p-0 absolute right-[32px] top-[35px] bg-transparent border-none hover:bg-transparent"
          >
            <img
              className="h-[20px] w-[20px]"
              src="/icons/ic_close.svg"
              alt=""
            />
          </label>
          <h3 className="text-2xl font-semibold m-[36px] mb-5">Storyline</h3>
          <p className="py-4 text-sm font-normal mx-[36px] mb-[24px]">
            {t("storyline_popup_title")}
            <br /> <br />
            {t("storyline_popup_description1")}
            <br /> <br />
            {t("storyline_popup_description2")}
          </p>
          {/* story 1 */}
          <div className="h-[188px] w-full flex p-[36px] bg-primary justify-start items-start">
            <img
              className="h-[86px] w-[154px] mr-[44px]"
              src="/story/img_story1.png"
              alt=""
            />
            <div className="flex flex-col items-center justify-center mr-6">
              <span className="flex h-3 w-3 justify-center items-center">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <div className="h-[202px] w-[1px] border-l bg-white -mt-1 z-0"></div>
            </div>
            <div className=" w-[485px] font-noraml text-sm">
              {t("storyline_popup_story1")}
              <br /> <br />
              {t("storyline_popup_story1a")}
            </div>
          </div>
          {/* story 1 */}
          {/* story 2 */}
          <div className="h-[188px] w-full flex px-[36px] pt-[54px] justify-start items-start">
            <img
              className="h-[86px] w-[154px] mr-[44px]"
              src="/story/img_story2.png"
              alt=""
            />
            <div className="flex flex-col items-center justify-center mr-6">
              <span className="flex h-3 w-3 justify-center items-center">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <div className="h-[192px] w-[1px] border-l bg-white -mt-1 z-0"></div>
            </div>
            <div className=" w-[485px] font-noraml text-sm">
              {t("storyline_popup_story2")}
            </div>
          </div>
          {/* story 2 */}
          {/* story 3 */}
          <div className="h-[188px] w-full flex px-[36px] pt-[34px] bg-primary justify-start items-start">
            <img
              className="h-[86px] w-[154px] mr-[44px]"
              src="/story/img_story3.png"
              alt=""
            />
            <div className="flex flex-col items-center justify-center mr-6">
              <span className="flex h-3 w-3 justify-center items-center">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <div className="h-[192px] w-[1px] border-l bg-white -mt-1 z-0"></div>
            </div>
            <div className=" w-[485px] font-noraml text-sm">
              {t("storyline_popup_story3")}
            </div>
          </div>
          {/* story 3 */}
          {/* story 4 */}
          <div className="h-[188px] w-full flex px-[36px] pt-[44px] justify-start items-start">
            <img
              className="h-[86px] w-[154px] mr-[44px]"
              src="/story/img_story4.png"
              alt=""
            />
            <div className="flex flex-col items-center justify-center mr-6">
              <span className="flex h-3 w-3 justify-center items-center">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <div className="h-[192px] w-[1px] border-l bg-white -mt-1 z-0"></div>
            </div>
            <div className=" w-[485px] font-noraml text-sm">
              {t("storyline_popup_story4")}
            </div>
          </div>
          {/* story 4 */}
          {/* story 5 */}
          <div className="h-[188px] w-full flex px-[36px] pt-[24px] bg-primary justify-start items-start">
            <img
              className="h-[86px] w-[154px] mr-[44px]"
              src="/story/img_story5.png"
              alt=""
            />
            <div className="flex flex-col items-center justify-center mr-6">
              <span className="flex h-3 w-3 justify-center items-center">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <div className="h-[210px] w-[1px] border-l bg-white -mt-1 z-0"></div>
            </div>
            <div className=" w-[485px] font-noraml text-sm">
              {t("storyline_popup_story5")}{" "}
            </div>
          </div>
          {/* story 5 */}
          {/* story 6 */}
          <div className="h-[188px] w-full flex px-[36px] pt-[44px] justify-start items-start">
            <img
              className="h-[86px] w-[154px] mr-[44px] rounded"
              src="/story/img_story6.png"
              alt=""
            />
            <div className="flex flex-col items-center justify-center mr-6">
              <span className="flex h-3 w-3 justify-center items-center">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <div className="h-[192px] w-[1px] border-l bg-white -mt-1 z-0"></div>
            </div>
            <div className=" w-[485px] font-noraml text-sm">
              {t("storyline_popup_story6")}{" "}
            </div>
          </div>

          {/* story 6 */}
          {/* story 7 */}
          <div className="h-[188px] w-full flex px-[36px] pt-[24px] bg-primary justify-start items-start">
            <img
              className="h-[86px] w-[154px] mr-[44px]"
              src="/story/img_story7.png"
              alt=""
            />
            <div className="flex flex-col items-center justify-center mr-6">
              <span className="flex h-3 w-3 justify-center items-center">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <div className="h-[210px] w-[1px] border-l bg-white -mt-1 z-0"></div>
            </div>
            <div className=" w-[485px] font-noraml text-sm">
              {t("storyline_popup_story7")}{" "}
            </div>
          </div>
          {/* story 7*/}
          {/* story 8 */}
          {/* <div className="h-[188px] w-full flex px-[36px] pt-[44px] justify-start items-start">
            <img
              className="h-[86px] w-[154px] mr-[44px] rounded"
              src="/story/img_story6.png"
              alt=""
            />
            <div className="flex flex-col items-center justify-center mr-6">
              <span className="flex h-3 w-3 justify-center items-center">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <div className="h-[192px] w-[1px] border-l bg-white -mt-1 z-0"></div>
            </div>
            <div className=" w-[485px] font-noraml text-sm">
              {t("story_8")}{" "}
            </div>
          </div> */}
        </div>

        <div className="modal-box h-screen max-h-screen flex flex-col md:hidden relative w-full max-w-5xl mx-0 p-0 pb-[48px] rounded-[4px] bg-gradient-to-b from-primary to-[#1E1722]">
          <label
            htmlFor="my-modal-1"
            onClick={() => enableScroll()}
            className="btn btn-sm p-0 absolute right-[26px] top-[17px] bg-transparent border-none hover:bg-transparent"
          >
            <img
              className="h-[20px] w-[20px]"
              src="/icons/ic_close.svg"
              alt=""
            />
          </label>
          <h3 className="text-2xl font-semibold m-[16px] mb-5">Storyline</h3>
          <p className="py-4 text-sm font-normal mx-[16px] mb-[13px]">
            {t("storyline_popup_title")}
            <br /> <br />
            {t("storyline_popup_description1")}
            <br /> <br />
            {t("storyline_popup_description2")}
          </p>
          {/* story 1 */}
          <div className=" relative w-full flex px-[24px] py-[24px] bg-primary justify-start items-start">
            <div className="flex flex-col items-center justify-center mr-6">
              <span className="flex h-3 w-3 justify-center items-center z-20">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <div className=" absolute top-[27px] h-[450px] w-[1px] border-l bg-white z-10"></div>
            </div>
            <div className="flex flex-col">
              <img
                className="h-[86px] w-[154px] mr-[44px] mb-[24px]"
                src="/story/img_story1.png"
                alt=""
              />
              <div className=" w-full font-noraml text-sm">
                {t("storyline_popup_story1")}
                <br /> <br />
                {t("storyline_popup_story1a")}
              </div>
            </div>
          </div>
          {/* story 1 */}
          {/* story 2 */}
          <div className=" relative w-full flex px-[24px] py-[24px] justify-start items-start">
            <div className="flex flex-col items-center justify-center mr-6">
              <span className="flex h-3 w-3 justify-center items-center z-20">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <div className=" absolute top-[27px] h-[450px] w-[1px] border-l bg-white  z-10"></div>
            </div>
            <div className="flex flex-col">
              <img
                className="h-[86px] w-[154px] mr-[44px] mb-[24px]"
                src="/story/img_story2.png"
                alt=""
              />
              <div className=" w-full font-noraml text-sm">
                {t("storyline_popup_story2")}
              </div>
            </div>
          </div>
          {/* story 2 */}
          {/* story 3 */}
          <div className=" relative w-full flex px-[24px] py-[24px] bg-primary justify-start items-start">
            <div className="flex flex-col items-center justify-center mr-6">
              <span className="flex h-3 w-3 justify-center items-center z-20">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <div className=" absolute top-[27px] h-[450px] w-[1px] border-l bg-white  z-10"></div>
            </div>
            <div className="flex flex-col">
              <img
                className="h-[86px] w-[154px] mr-[44px] mb-[24px]"
                src="/story/img_story3.png"
                alt=""
              />
              <div className=" w-full font-noraml text-sm">
                {t("storyline_popup_story3")}
              </div>
            </div>
          </div>
          {/* story 3 */}
          {/* story 4 */}
          <div className=" relative w-full flex px-[24px] py-[24px] justify-start items-start">
            <div className="flex flex-col items-center justify-center mr-6">
              <span className="flex h-3 w-3 justify-center items-center z-20">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <div className=" absolute top-[27px] h-[420px] w-[1px] border-l bg-white  z-10"></div>
            </div>
            <div className="flex flex-col">
              <img
                className="h-[86px] w-[154px] mr-[44px] mb-[24px]"
                src="/story/img_story4.png"
                alt=""
              />

              <div className=" w-full font-noraml text-sm">
                {t("storyline_popup_story4")}
              </div>
            </div>
          </div>
          {/* story 4 */}
          {/* story 5 */}
          <div className=" relative w-full flex px-[24px] py-[24px] bg-primary justify-start items-start">
            <div className="flex flex-col items-center justify-center mr-6">
              <span className="flex h-3 w-3 justify-center items-center z-20">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <div className=" absolute top-[27px] h-[420px] w-[1px] border-l bg-white  z-10"></div>
            </div>
            <div className="flex flex-col">
              <img
                className="h-[86px] w-[154px] mr-[44px] mb-[24px]"
                src="/story/img_story5.png"
                alt=""
              />
              <div className=" w-full font-noraml text-sm">
                {t("storyline_popup_story5")}
              </div>
            </div>
          </div>
          {/* story 5 */}
          {/* story 6 */}
          <div className=" relative w-full flex px-[24px] py-[24px] justify-start items-start">
            <div className="flex flex-col items-center justify-center mr-6">
              <span className="flex h-3 w-3 justify-center items-center z-20">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <div className=" absolute top-[27px] h-[360px] w-[1px] border-l bg-white  z-10"></div>
            </div>
            <div className="flex flex-col">
              <img
                className="h-[86px] w-[154px] mr-[44px] mb-[24px] rounded"
                src="/story/img_story6.png"
                alt=""
              />
              <div className=" w-full font-noraml text-sm">
                {t("storyline_popup_story6")}
              </div>
            </div>
          </div>
          {/* story 6 */}
          {/* story 7 */}
          <div className=" relative w-full flex px-[24px] py-[24px] bg-primary justify-start items-start">
            <div className="flex flex-col items-center justify-center mr-6">
              <span className="flex h-3 w-3 justify-center items-center z-20">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <div className=" absolute top-[27px] h-[360px] w-[1px] border-l bg-white  z-10"></div>
            </div>
            <div className="flex flex-col">
              <img
                className="h-[86px] w-[154px] mr-[44px] mb-[24px]"
                src="/story/img_story7.png"
                alt=""
              />
              <div className=" w-full font-noraml text-sm">
                {t("storyline_popup_story7")}
              </div>
            </div>
          </div>
          {/* story 7 */}
          {/* <div className=" relative w-full flex px-[24px] py-[24px] justify-start items-start">
            <div className="flex flex-col items-center justify-center mr-6">
              <span className="flex h-3 w-3 justify-center items-center z-20">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <div className=" absolute top-[27px] h-[360px] w-[1px] border-l bg-white  z-10"></div>
            </div>
            <div className="flex flex-col">
              <img
                className="h-[86px] w-[154px] mr-[44px] mb-[24px] rounded"
                src="/story/img_story6.png"
                alt=""
              />
              <div className=" w-full font-noraml text-sm">{t("story_8")}</div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ModalStory;
