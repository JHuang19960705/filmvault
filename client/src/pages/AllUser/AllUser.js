import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import AuthService from "../../services/auth.service";
import UserNav from "../../components/UserNav";
import Loader from "../../components/Loader";

export default function AllUser({ currentUser, setCurrentUser }) {
  const [allUser, setAllUser] = useState(null); // 定義所有用戶資料的狀態
  const [clickUser, setClickUser] = useState(true);
  const [clickTitle, setClickTitle] = useState(null);
  const [isHidden, setIsHidden] = useState("hidden");
  const [isDisplay, setIsDisplay] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    checkCurrentUser();
    fetchData();
    handleClick();
  }, [location.pathname]);

  // 如果沒有當前用戶，導向首次登錄頁面
  const checkCurrentUser = () => {
    if (!currentUser) {
      navigate("/firstEnroll");
    };
  };

  // 從後端獲取所有用戶資訊
  const fetchData = () => {
    AuthService.getAllUser()
      .then((data) => {
        setAllUser(data.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 根據路由的字來決定呼籲點擊的顯示與否
  const handleClick = () => {
    if (location.pathname === "/allUser") {
      setClickUser(false); // 顯示呼籲點擊
    } else {
      setClickUser(true); // 隱藏呼籲點擊
    };
  };

  // 當點擊用戶名稱時的處理函數
  const handleClickTitle = (title) => {
    setClickTitle(title);
    setIsHidden(null);
    setIsDisplay("hidden");
  };

  // 控制導航顯示的函數
  const handleNavDisplay = () => {
    setIsDisplay(null);
    setClickTitle(null);
    setIsHidden("hidden");
  };

  // 當選擇用戶時的處理函數
  const handleChange = (id) => {
    setClickUser(id);
  };

  return (
    <div className="flex h-full flex-grow flex-col overflow-hidden mb-10 md:mb-0">
      {/* <!--  上導覽   --> */}
      <div className="flex justify-between w-full border-b border-gray-200 dark:border-gray-800">
        {/* LOGO */}
        <Link to="/" className="pl-5 flex items-center justify-center text-blue-500 md:hidden dark:text-blue-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-9" viewBox="0 0 24 24" fill="currentColor">
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 5V19M21 5V19M3 7.20608V16.7939C3 17.7996 3 18.3024 3.19886 18.5352C3.37141 18.7373 3.63025 18.8445 3.89512 18.8236C4.20038 18.7996 4.55593 18.4441 5.26704 17.733L10.061 12.939C10.3897 12.6103 10.554 12.446 10.6156 12.2565C10.6697 12.0898 10.6697 11.9102 10.6156 11.7435C10.554 11.554 10.3897 11.3897 10.061 11.061L5.26704 6.26704C4.55593 5.55593 4.20038 5.20038 3.89512 5.17636C3.63025 5.15551 3.37141 5.26273 3.19886 5.46476C3 5.69759 3 6.20042 3 7.20608Z" />
          </svg>
        </Link>
        {/* <!--    按鈕     --> */}
        <div className="cursor-default hidden h-full pl-5 text-gray-600 md:flex dark:text-gray-400">
          <div className={`h-full border-b-2 inline-flex mr-8 items-center border-blue-500 text-blue-500 dark:text-white dark:border-white`}>Users</div>
        </div>
        {/* <!--  自己   --> */}
        <div className="sticky z-50 top-0 flex border-b border-gray-200 bg-gray-100 px-4 md:px-10 dark:border-gray-800 dark:bg-gray-900">
          <UserNav currentUser={currentUser} setCurrentUser={setCurrentUser} />
        </div>
      </div>
      {/* 手機板上導覽 */}
      <div className={`cursor-default pt-5 flex w-full items-end justify-center md:hidden ${isDisplay}`}>
        <div className="pb-1 flex justify-center truncate border-b-2 border-blue-500 text-blue-500 dark:border-gray-100 dark:text-gray-100">Users</div>
      </div>
      {/* 下區 */}
      <div className="flex flex-col flex-grow overflow-x-hidden mb-10 md:mb-0">
        <div className="flex flex-col flex-grow overflow-x-hidden">
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
          <div className="flex flex-grow overflow-x-hidden">
            {/* <!--   左導覽   --> */}
            <div className={`${isDisplay} w-full flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-100 p-5 md:static md:block md:w-1/4 md:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 md:dark:bg-gray-900`}>
              {/* 各個User */}
              <div className="space-y-4 mt-3 relative">
                {isLoading && <div>Loading...<Loader /></div>}
                {allUser && allUser.map((user) => {
                  return (
                    <Link to={`${user._id}/userReviews`} onClick={() => { handleChange(user._id); handleClickTitle(user.username) }} className="bg-white p-3 w-full flex flex-col rounded-md dark:bg-gray-800 shadow">
                      <div className="truncate flex md:flex-row flex-col items-center font-medium text-gray-900 dark:text-white pb-2 mb-2 md:border-b border-gray-200 border-opacity-75 dark:border-gray-700 w-full">
                        {user.username}
                      </div>
                      <div className="flex items-center w-full">
                        <div className="text-xs py-1 px-2 leading-none dark:bg-gray-900 bg-blue-100 text-blue-500 rounded-md">
                          {user.role}
                        </div>
                        <div className="truncate ml-auto text-xs text-gray-500">{user.date.slice(0, 10)}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
            {/* 右內容 */}
            <div className="flex-grow bg-white dark:bg-gray-900 overflow-y-auto">
              {!clickUser && <div className="flex justify-center text-center md:text-2xl md:pt-32">點選一位用戶 <br /> 觀看他的影評、推薦片單、電影院</div>}
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
