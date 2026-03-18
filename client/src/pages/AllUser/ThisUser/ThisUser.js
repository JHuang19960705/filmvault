import React, { useState, useEffect } from "react";
import { Outlet, Link, useParams, useLocation } from "react-router-dom";
import AuthService from "../../../services/auth.service";
import Loader from "../../../components/Loader";

export default function ThisUser() {
  const [thisUser, setThisUser] = useState(null); // 定義用戶資料的狀態
  const [isLoading, setLoading] = useState(true);
  const { userId } = useParams(); // 從URL中獲取用戶 ID
  const [selectedLink, setSelectedLink] = useState(""); // 定義當前選擇的連結
  const location = useLocation(); // 獲取URL

  useEffect(() => {
    fetchData();
    checkURL();
  }, [location.pathname]);
  
  // 從後端獲取該用戶的資料
  const fetchData = () => {
    AuthService.getUserById(userId)
      .then((data) => {
        setThisUser(data.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 根據URL判斷點擊
  const checkURL = () => {
    // 抓取URL最後的字母
    const lastChar  = location.pathname.charAt(location.pathname.length - 1);
    
    if (lastChar === "s") {
      setSelectedLink("Reviews");
    } else if (lastChar === "d") {
      setSelectedLink("Recommend");
    } else if (lastChar === "r") {
      setSelectedLink("Theater")
    }
  };

  // 點擊連結時更新 selectedLink 的函式
  const handleLinkClick = (linkName) => {
    setSelectedLink(linkName);
  };

  return (
    <div className="flex-grow bg-white dark:bg-gray-900">
      {isLoading && <div><Loader /></div>}
      {/* 用戶頭像 */}
      {thisUser && (
        <div className="md:px-7 md:pt-7 px-4 pt-4 flex flex-col w-full border-b border-gray-200 bg-white dark:bg-gray-900 dark:text-white dark:border-gray-800">
          <div className="flex w-full items-center">
            <div className="flex items-center text-3xl text-gray-900 dark:text-white">
              <img
                src="https://assets.codepen.io/344846/internal/avatars/users/default.png?fit=crop&amp;format=auto&amp;height=512&amp;version=1582611188&amp;width=512"
                className="w-12 mr-4 rounded-full"
                alt="profile"
              />
              {/* 顯示用戶名稱 */}
              {thisUser.username}
            </div>
            <div className="ml-auto sm:flex hidden items-center justify-end">
              <div className="text-right">
                {/* 顯示用戶角色 */}
                <div className="text-xs text-gray-400 dark:text-gray-400">{thisUser.role}</div>
                {/* 顯示註冊日期 */}
                <div className="text-gray-900 text-lg dark:text-white">{thisUser.date.slice(0, 10)}</div>
              </div>
              <button className="w-8 h-8 ml-4 text-gray-400 shadow dark:text-gray-400 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
                <svg viewBox="0 0 24 24" className="w-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </button>
            </div>
          </div>
          {/* 設置連結 */}
          <div className="flex items-center justify-between md:justify-start space-x-3 md:mt-7 mt-4">
            {["Reviews", "Recommend", "Theater"].map((linkName) => (
              <Link
                key={linkName}
                to={`user${linkName}`}
                onClick={() => handleLinkClick(linkName)}
                className={`truncate md:px-3 pb-1.5 border-b-2 cursor-pointer ${selectedLink === linkName ? "border-blue-500 text-blue-500 dark:border-gray-100  dark:text-gray-100" : "dark:text-gray-400 border-transparent"
                  }`}
              >
                {/* 連結名稱 */}
                {linkName}
              </Link>
            ))}
          </div>
        </div>
      )}
      <Outlet />
    </div>
  );
}
