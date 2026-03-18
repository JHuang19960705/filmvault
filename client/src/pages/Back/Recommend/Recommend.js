import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

export default function Recommend() {
  const [clickTitle, setClickTitle] = useState(null);
  const [isHidden, setIsHidden] = useState("hidden");
  const [isDisplay, setIsDisplay] = useState(null);
  const [selectedLink, setSelectedLink] = useState("");
  const location = useLocation();

  useEffect(() => {
    checkURL();
  }, [location.pathname]);

  // 根據URL判斷點擊
  const checkURL = () => {
    // 抓取URL的第26個字母
    const char26 = location.pathname.charAt(26);

    if (char26 === "S") {
      setSelectedLink("電影介紹");
    } else if (char26 === "C") {
      setSelectedLink("當紅明星");
    } else if (char26 === "R") {
      setSelectedLink("影評推薦")
    } else if (char26 === "T") {
      setSelectedLink("主題分類")
    } else if (char26 === "F") {
      setSelectedLink("最愛人物")
    };
  };

  // 點擊標題的處理函數
  const handleClickTitle = (title) => {
    setClickTitle(title);
    setIsHidden(null);
    setIsDisplay("hidden");
  };

  // 控制導覽顯示的函數
  const handleNavDisplay = () => {
    setIsDisplay(null);
    setClickTitle(null);
    setIsHidden("hidden");
  };

  // 點擊導覽連結的處理函數
  const handleLinkClick = (linkName) => {
    setSelectedLink(linkName);
  };

  return (
    <div className="flex flex-col flex-grow overflow-x-hidden mb-10 md:mb-0">
      {/* 手機板返回導覽 */}
      <div className={`pt-2 flex w-full items-center justify-right md:hidden ${isHidden}`}>
        <div className="cursor-pointer" onClick={handleNavDisplay}>
          <svg className="w-6 mx-1 text-gray-700 transform dark:text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </div>
        <div>{clickTitle}</div>
      </div>
      {/* 下內容 */}
      <div className="flex flex-grow overflow-x-hidden md:relative">
        {/* 左導覽 */}
        <div className={`${isDisplay} w-full flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-100 p-5 md:static md:block md:w-1/4 md:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 md:dark:bg-gray-900`}>
          <div className="space-y-4 mt-3">
            <Link to="handleSlide" onClick={() => { handleClickTitle("電影介紹"); handleLinkClick("電影介紹") }} className={`${selectedLink === "電影介紹" ? "ring-2 ring-blue-500" : ""} bg-white p-3 w-full flex flex-col rounded-md dark:bg-gray-800 shadow focus:outline-none`}>
              <div className="flex xl:flex-row flex-col items-center font-medium text-gray-900 dark:text-white xl:border-b border-gray-200 border-opacity-75 dark:border-gray-700 w-full">電影介紹</div>
            </Link>
            <Link to="handleCasts" onClick={() => { handleClickTitle("當紅明星"); handleLinkClick("當紅明星") }} className={`${selectedLink === "當紅明星" ? "ring-2 ring-blue-500" : ""} bg-white p-3 w-full flex flex-col rounded-md dark:bg-gray-800 shadow focus:outline-none`}>
              <div className="flex xl:flex-row flex-col items-center font-medium text-gray-900 dark:text-white xl:border-b border-gray-200 border-opacity-75 dark:border-gray-700 w-full">當紅明星</div>
            </Link>
            <Link to="handleReview" onClick={() => { handleClickTitle("影評推薦"); handleLinkClick("影評推薦") }} className={`${selectedLink === "影評推薦" ? "ring-2 ring-blue-500" : ""} bg-white p-3 w-full flex flex-col rounded-md dark:bg-gray-800 shadow focus:outline-none`}>
              <div className="flex xl:flex-row flex-col items-center font-medium text-gray-900 dark:text-white xl:border-b border-gray-200 border-opacity-75 dark:border-gray-700 w-full">影評推薦</div>
            </Link>
            <Link to="handleTheme" onClick={() => { handleClickTitle("主題分類"); handleLinkClick("主題分類") }} className={`${selectedLink === "主題分類" ? "ring-2 ring-blue-500" : ""} bg-white p-3 w-full flex flex-col rounded-md dark:bg-gray-800 shadow focus:outline-none`}>
              <div className="flex xl:flex-row flex-col items-center font-medium text-gray-900 dark:text-white xl:border-b border-gray-200 border-opacity-75 dark:border-gray-700 w-full">主題分類</div>
            </Link>
            <Link to="handleFavorite" onClick={() => { handleClickTitle("最愛人物"); handleLinkClick("最愛人物") }} className={`${selectedLink === "最愛人物" ? "ring-2 ring-blue-500" : ""} bg-white p-3 w-full flex flex-col rounded-md dark:bg-gray-800 shadow focus:outline-none`}>
              <div className="flex xl:flex-row flex-col items-center font-medium text-gray-900 dark:text-white xl:border-b border-gray-200 border-opacity-75 dark:border-gray-700 w-full">最愛人物</div>
            </Link>
          </div>
        </div>
        {/* 右內容 */}
        <div className="flex-grow bg-white dark:bg-gray-900 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
