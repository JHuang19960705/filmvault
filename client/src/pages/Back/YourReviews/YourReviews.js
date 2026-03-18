import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import ContentService from "../../../services/content.service";
import Loader from "../../../components/Loader";

export default function YourReviews({ currentUser }) {
  const [isLoading, setLoading] = useState(true);
  const [contentData, setContentData] = useState([]);
  const [clickContent, setClickContent] = useState(true);
  const [clickTitle, setClickTitle] = useState(null);
  const [isHidden, setIsHidden] = useState("hidden");
  const [isDisplay, setIsDisplay] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []); // 初始加載時進行一次

  useEffect(() => {
    handleClick();
  }, [location.pathname]);

  // 從後端拿全部的影評
  const fetchData = async () => {
    setLoading(true);
    try {
      let _id;
      if (currentUser) {
        _id = currentUser.user._id;
        let data;
        if (currentUser.user.role === "standard" || currentUser.user.role === "premium") {
          data = await ContentService.getReviewByUserId(_id);
        } else if (currentUser.user.role === "free") {
          navigate("/");
        };
        setContentData(data.data);
      };
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    };
  };

  // 根據路由中的字來決定呼籲點擊的顯示與否
  const handleClick = () => {
    if (location.pathname === "/back/yourReviews") {
      setClickContent(false); // 顯示呼籲點擊
    } else {
      setClickContent(true); // 隱藏呼籲點擊
    };
  };

  const displayContent = (id) => {
    setClickContent(id)
  };

  const handleClickTitle = (title) => {
    setClickTitle(title);
    setIsHidden(null);
    setIsDisplay("hidden");
  };

  const handleNavDisplay = () => {
    setIsDisplay(null);
    setClickTitle(null);
    setIsHidden("hidden");
  };

  return (
    <div className="flex flex-col flex-grow overflow-x-hidden mb-10 md:mb-0">
      {/* 手機板返回導覽 */}
      <div className={`pt-2 flex w-full items-center justify-right md:hidden ${isHidden}`}>
        <div className="cursor-pointer" onClick={handleNavDisplay}>
          <svg class="w-6 mx-1 text-gray-700 transform dark:text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </div>
        <div className="w-1/2 truncate">{clickTitle}</div>
      </div>
      {/* 下內容 */}
      <div className="flex flex-grow overflow-x-hidden">
        {/* <!--   左導覽  --> */}
        <div className={`${isDisplay} w-full flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-100 p-5 md:static md:block md:w-1/4 md:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 md:dark:bg-gray-900`}>
          <div className="space-y-4 mt-3">
            {isLoading && <div>Loading...<Loader /></div>}
            {!contentData.length && <div className="flex justify-center text-xl pt-24">無影評!</div>}
            {contentData && contentData.map((content) => {
              return (
                <Link
                  to={`${content._id}`}
                  onClick={() => { displayContent(content._id); handleClickTitle(content.title) }}
                  className="bg-white p-3 w-full flex flex-col rounded-md dark:bg-gray-800 shadow">
                  <div className="truncate flex md:flex-row flex-col items-center font-medium text-gray-900 dark:text-white pb-2 mb-2 md:border-b border-gray-200 border-opacity-75 dark:border-gray-700 w-full">
                    {content.title}
                  </div>
                  <div className="flex items-center w-full">
                    <div className="text-xs py-1 px-2 leading-none dark:bg-gray-900 bg-blue-100 text-blue-500 rounded-md">{content.tags}</div>
                    <div className="ml-auto text-xs text-gray-500 truncate">{content.date.slice(0, 10)}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
        {/* <!--   右內容    --> */}
        <div className="h-full flex-grow bg-white dark:bg-gray-900 overflow-y-auto">
          {!clickContent && <div className="flex justify-center text-center md:text-2xl md:pt-32">編輯你的影評</div>}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
