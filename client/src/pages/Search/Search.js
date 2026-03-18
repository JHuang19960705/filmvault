import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import UserNav from "../../components/UserNav";

export default function Search({ currentUser, setCurrentUser }) {
  const [selectedLink, setSelectedLink] = useState("Movie");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    checkCurrentUser();
    handleLinkClick();
  }, [location.pathname]);

  // 確保使用者已登入，否則導向首次註冊頁面
  const checkCurrentUser = () => {
    if (!currentUser) {
      navigate("/firstEnroll");
    }
  };

  // 點擊連結時觸發的函式
  const handleLinkClick = (linkName) => {
    const Char8  = location.pathname.charAt(8)

    setSelectedLink(linkName);
    if (Char8 === "M") {
      setSelectedLink("Movie"); // 顯示呼籲點擊
    } else if (Char8 === "T") {
      setSelectedLink("TV"); // 隱藏呼籲點擊
    };
  };

  // 定義影片和電視連結
  const links = [
    { name: "Movie", label: "Movie" },
    { name: "TV", label: "TV" }
  ];

  return (
    <div className="flex h-full flex-grow flex-col overflow-hidden">
      {/* 上導覽 */}
      <div className="flex justify-between w-full border-b border-gray-200 dark:border-gray-800">
        {/* LOGO */}
        <Link to="/" className="pl-5 flex items-center justify-center text-blue-500 md:hidden dark:text-blue-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-9" viewBox="0 0 24 24" fill="currentColor">
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 5V19M21 5V19M3 7.20608V16.7939C3 17.7996 3 18.3024 3.19886 18.5352C3.37141 18.7373 3.63025 18.8445 3.89512 18.8236C4.20038 18.7996 4.55593 18.4441 5.26704 17.733L10.061 12.939C10.3897 12.6103 10.554 12.446 10.6156 12.2565C10.6697 12.0898 10.6697 11.9102 10.6156 11.7435C10.554 11.554 10.3897 11.3897 10.061 11.061L5.26704 6.26704C4.55593 5.55593 4.20038 5.20038 3.89512 5.17636C3.63025 5.15551 3.37141 5.26273 3.19886 5.46476C3 5.69759 3 6.20042 3 7.20608Z" />
          </svg>
        </Link>
        {/* TV & Movie */}
        <div className="md:flex hidden h-full text-gray-600 pl-5 dark:text-gray-400">
          {links.map(({ name, label }) => (
            <Link
              key={name}
              to={name}
              onClick={() => handleLinkClick(name)}
              className={`cursor-pointer h-full border-b-2 inline-flex mr-8 items-center ${selectedLink === name ? "border-blue-500 text-blue-500 dark:text-white dark:border-white" : "dark:text-gray-400 border-transparent"
                }`}
            >
              {label}
            </Link>
          ))}
        </div>
        {/* 自己 */}
        <div className="sticky z-50 top-0 flex border-b border-gray-200 bg-gray-100 px-4 md:px-10 dark:border-gray-800 dark:bg-gray-900">
          <UserNav currentUser={currentUser} setCurrentUser={setCurrentUser} />
        </div>
      </div>
      {/* 手機板上導覽 */}
      <div className="pt-5 flex w-full items-end justify-around md:hidden">
        {links.map(({ name, label }) => (
          <Link
            key={name}
            to={name}
            onClick={() => handleLinkClick(name)}
            className={`pb-1 cursor-pointer flex flex-grow justify-center w-full truncate border-b-2 ${selectedLink === name ? "border-blue-500 text-blue-500 dark:border-gray-100  dark:text-gray-100" : "dark:text-gray-400 border-transparent"
              }`}
          >
            {label}
          </Link>
        ))}
      </div>
      {/* 下內容 */}
      <Outlet />
    </div>
  );
}
