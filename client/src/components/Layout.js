import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const [selectedLink, setSelectedLink] = useState("");

  useEffect(() => {
    handleClick();
  }, [location.pathname]);

  // 根據URL判斷點擊
  const handleClick = () => {
    // 獲取URL中的第一個字母
    const firstLetter = location.pathname.charAt(1); // 抓取URL第一個字母

    switch (firstLetter) {
      case 'a':
        setSelectedLink("allUser");
        break;
      case 'b':
        setSelectedLink("back");
        break;
      case 's':
        setSelectedLink("search");
        break;
      default:
        setSelectedLink("");
        break;
    };
  };

  return (
    <div className="relative">
      <div className="h-screen overflow-hidden bg-gray-100 text-sm text-gray-600 md:flex flex-grow dark:bg-gray-900 dark:text-white">
        {/* <!-- 左導覽 --> */}
        <div className="fixed bottom-0 z-20 flex w-full flex-shrink-0 border-t md:border-r border-gray-200 bg-white md:static md:w-20 md:flex-col dark:border-gray-800 dark:bg-gray-900">
          {/* 首頁 */}
          <Link to="/" className="hidden h-16 items-center justify-center text-blue-500 md:flex dark:text-blue-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-9" viewBox="0 0 24 24" fill="currentColor">
              <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M15 5V19M21 5V19M3 7.20608V16.7939C3 17.7996 3 18.3024 3.19886 18.5352C3.37141 18.7373 3.63025 18.8445 3.89512 18.8236C4.20038 18.7996 4.55593 18.4441 5.26704 17.733L10.061 12.939C10.3897 12.6103 10.554 12.446 10.6156 12.2565C10.6697 12.0898 10.6697 11.9102 10.6156 11.7435C10.554 11.554 10.3897 11.3897 10.061 11.061L5.26704 6.26704C4.55593 5.55593 4.20038 5.20038 3.89512 5.17636C3.63025 5.15551 3.37141 5.26273 3.19886 5.46476C3 5.69759 3 6.20042 3 7.20608Z" />
            </svg>
          </Link>
          {/* 子分頁 */}
          <div className="flex w-full items-center justify-around text-gray-400 md:mx-auto md:mt-4 md:flex-col md:space-y-4">
            {/* 大廳 */}
            <Link to="allUser" onClick={() => setSelectedLink("allUser")} className={`h-10 w-12 rounded-md flex items-center justify-center ${selectedLink === "allUser" ? "bg-blue-100 text-blue-500 dark:text-gray-500" : "hover:bg-gray-100 hover:dark:bg-gray-700 hover:dark:text-white"}`}>
              <svg viewBox="0 0 24 24" className="h-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </Link>
            {/* 後台 */}
            <Link to="back/yourReviews" onClick={() => setSelectedLink("back")} className={`h-10 w-12 rounded-md flex items-center justify-center ${selectedLink === "back" ? "bg-blue-100 text-blue-500 dark:text-gray-500" : "hover:bg-gray-100 hover:dark:bg-gray-700 hover:dark:text-white"}`}>
              <svg viewBox="0 0 24 24" className="h-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </Link>
            {/* 搜尋 */}
            <Link to="search/Movie" onClick={() => setSelectedLink("search")} className={`h-10 w-12 rounded-md flex items-center justify-center ${selectedLink === "search" ? "bg-blue-100 text-blue-500 dark:text-gray-500" : "hover:bg-gray-100 hover:dark:bg-gray-700 hover:dark:text-white"}`}>
              <svg viewBox="0 0 24 24" className="h-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </Link>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}