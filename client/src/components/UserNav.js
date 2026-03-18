import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

export default function UserNav({ currentUser, setCurrentUser }) {
  const [isOpen, setIsOpen] = useState(false);  // 控制下拉選單的開啟與關閉狀態
  const navigate = useNavigate();

  // 點擊登出按鈕的處理函數
  const handleUserLogout = () => {
    window.alert("登出成功。您現在將被重新導向到首頁。");
    setCurrentUser(null); // 清空當前使用者狀態
    AuthService.logout(); // 呼叫後端服務進行登出
    navigate("/"); // 導向首頁
  };

  // 點擊修改個人資料按鈕的處理函數，導向修改個人資料頁面
  const handleUserPatch = () => {
    navigate("/profile/patchProfile");
  };

  // 點擊修改方案按鈕的處理函數，導向修改方案頁面
  const handleUserPlan = () => {
    navigate("/profile/patchRole");
  };

  // 控制下拉選單的開啟與關閉
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="ml-auto flex items-center space-x-7">
      {/* 顯示使用者頭像和名稱 */}
      <button onClick={toggleDropdown} className="relative flex items-center">
        <span className="relative flex-shrink-0">
          <img className="w-7 h-7 rounded-full" src="https://images.unsplash.com/photo-1521587765099-8835e7201186?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ" alt="profile" />
          {/* 若使用者為在線狀態，顯示綠色圓點 */}
          <span className="absolute right-0 -mb-0.5 bottom-0 w-2 h-2 rounded-full bg-green-500 border border-white dark:border-gray-900"></span>
        </span>
        {/* 顯示使用者名稱 */}
        {currentUser && (
          <span className="ml-2 truncate w-20">{currentUser.user.username}</span>
        )}
        {/* 下拉箭頭圖示 */}
        <svg viewBox="0 0 24 24" className="w-4 ml-1 flex-shrink-0" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
        {/* 下拉選單內容 */}
        <div className={`${isOpen ? "-bottom-[140px] md:-bottom-[167px] opacity-100" : "bottom-[170px] opacity-0"} absolute w-full flex flex-col ease-linear duration-300 bg-blue-500 text-white justify-center`}>
          {/* 方案修改按鈕 */}
          <button onClick={handleUserPlan} className="w-full py-2 md:py-3 hover:scale-125 ease-linear duration-100">方案</button>
          {/* 個人資料修改按鈕 */}
          <button onClick={handleUserPatch} className="w-full py-2 md:py-3 hover:scale-125 ease-linear duration-100">修改</button>
          {/* 登出按鈕 */}
          <button onClick={handleUserLogout} className="w-full py-2 md:py-3 hover:scale-125 ease-linear duration-100">登出</button>
        </div>
      </button>
    </div>
  );
}
