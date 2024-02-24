import { ArrowUpIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";

const ScrollToTop = () => {
  const scrollTopHandler = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    var toTop = document.querySelector("#to-top");
    var footer = document.querySelector("#footer");

    function checkOffset() {
      function getRectTop(el) {
        var rect = el.getBoundingClientRect();
        return rect.top;
      }

      if (window.scrollY > screen.height - 600) {
        toTop.style.display = "block";

        if (
          getRectTop(toTop) + document.body.scrollTop + toTop.offsetHeight >=
          getRectTop(footer) + document.body.scrollTop - 10
        ) {
          toTop.style.position = "absolute";
          toTop.style.bottom = `${footer.scrollHeight + 16}px`;
        }
        if (
          document.body.scrollTop + window.innerHeight <
          getRectTop(footer) + document.body.scrollTop
        ) {
          toTop.style.position = "fixed";
          toTop.style.bottom = "28px";
        }
      } else {
        toTop.style.display = "none";
      }
    }

    document.addEventListener("scroll", function () {
      checkOffset();
    });
    return () => {
      document.removeEventListener("scroll", function () {
        checkOffset();
      });
    };
  }, []);

  return (
    <div
      id="to-top"
      className={`fixed bottom-7 sm:right-6 right-4 inline-block p-2 bg-invar-dark rounded text-white cursor-pointer z-20 hidden`}
      onClick={scrollTopHandler}
    >
      <ArrowUpIcon className="w-6" />
    </div>
  );
};

export default ScrollToTop;
