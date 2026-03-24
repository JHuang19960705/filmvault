import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileComponent from "./Profile/profile";
import { useUser } from "../../context/UserContext";

export default function Homepage() {
  const { currentUser } = useUser();
  const [fillColor, setFillColor] = useState("white");
  const navigate = useNavigate();


  // 檢查是否有用戶，若無則導航至首次註冊頁面
  useEffect(() => {
    if (!currentUser) {
      navigate("/firstEnroll");
    }
    const intervalId = setInterval(() => {
      setFillColor((prevColor) => (prevColor === "white" ? "none" : "white"));
    }, 400);

    return () => clearInterval(intervalId);
  }, [currentUser, navigate]);

  return (
    <div className="h-full z-30 fixed overflow-y-auto flex flex-col md:flex-row w-screen bg-gradient-to-r from-indigo-900 to-blue-700">
      {/* 左邊側邊欄 */}
      <div className="w-full h-full md:w-1/4">
        <div className="h-full flex flex-col py-5 md:py-5 px-5">
          {/* LOGO和選單 */}
          <div>
            <div onClick={() => { navigate("/allUser") }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer w-9 text-white" viewBox="0 0 24 24" fill="#FFFFFF">
                <path stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 5V19M21 5V19M3 7.20608V16.7939C3 17.7996 3 18.3024 3.19886 18.5352C3.37141 18.7373 3.63025 18.8445 3.89512 18.8236C4.20038 18.7996 4.55593 18.4441 5.26704 17.733L10.061 12.939C10.3897 12.6103 10.554 12.446 10.6156 12.2565C10.6697 12.0898 10.6697 11.9102 10.6156 11.7435C10.554 11.554 10.3897 11.3897 10.061 11.061L5.26704 6.26704C4.55593 5.55593 4.20038 5.20038 3.89512 5.17636C3.63025 5.15551 3.37141 5.26273 3.19886 5.46476C3 5.69759 3 6.20042 3 7.20608Z" />
              </svg>
            </div>
            <div className="hidden">漢堡</div>
          </div>
          {/* 右邊 */}
          <div className="md:hidden pt-10vh flex flex-col justify-end gap-40 w-full">
            <div className="flex-col items-start text-white box-border py-4">
              <h1 className="text-2xl leading-88">
                Film / TV Reviews <br />
                Platform
              </h1>
              <p className="page-subtitle mt-1 text-xs leading-48 text-green-500">Users can Write Reviews, Craft Showcase, and Experience Theater</p>
            </div>
          </div>
          {/* 導航 */}
          <div className="mb-8 md:mt-12 flex-grow overflow-y-auto">
            <nav>
              <ul className="list-none flex flex-col md:space-y-6">
                <li onClick={() => { navigate("/allUser") }} className="cursor-pointer text-base text-white flex items-center" style={{ textShadow: "1px 1px 0px rgb(34 197 94)" }}>
                  <svg className="mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="14" height="14">
                    <polygon points="0,0 100,50 0,100" fill={fillColor} />
                  </svg>
                  View Users
                </li>
                <li onClick={() => { navigate("/back/yourReviews") }} className="cursor-pointer text-base text-white flex items-center pl-4" style={{ textShadow: "1px 1px 0px rgb(34 197 94)" }}>
                  Admin Dashboard
                </li>
                <li onClick={() => { navigate("/search/movie") }} className="cursor-pointer text-base text-white flex items-center pl-4" style={{ textShadow: "1px 1px 0px rgb(34 197 94)" }}>
                  Search Video
                </li>
              </ul>
            </nav>
          </div>
          {/* 用戶資訊 */}
          <div>
            {currentUser && (
              <ProfileComponent />
            )}
          </div>
        </div>
      </div>
      {/* 右邊內容區域 */}
      <div className="hidden pt-10vh md:flex flex-col justify-end gap-40 w-full md:w-3/4">
        <div className="flex-col items-start text-white box-border md:pb-6 p-6">
          <h1 className="text-4xl leading-88 md:text-6xl">
            Film / TV Reviews <br />
            Platform
          </h1>
          <p className="page-subtitle mt-6 text-2xl md:text-3xl leading-48 text-green-500">Users can Write Reviews, Craft Showcase, and Experience Theater</p>
        </div>
      </div>
    </div>
  );
}
