import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/auth.service";

export default function Profile({ currentUser, setCurrentUser }) {
  const [isOpen, setIsOpen] = useState(false); // 控制下拉選單的開關狀態
  const navigate = useNavigate();

  // 處理使用者登出功能，清除目前使用者資訊，執行登出操作並導航至首頁
  const handleUserLogout = () => {
    window.alert("登出成功。您現在將被重新導向到首頁。");
    setCurrentUser(null);
    AuthService.logout();
    navigate("/firstEnroll");
  };

  // 導航至修改個人資料頁面
  const handleUserPatch = () => {
    navigate("/profile/patchProfile");
  };

  // 導航至更改方案頁面
  const handleUserPlan = () => {
    navigate("/profile/patchRole");
  };

  // 控制下拉選單顯示與隱藏
  const openButton = () => {
    isOpen ? setIsOpen(false) : setIsOpen(true);
  };

  return (
    <div>
      {currentUser && ( // 如果有目前使用者，則顯示使用者個人資料和下拉選單
        <div onClick={() => { openButton() }} className={`relative text-xs md:text-sm cursor-pointer flex-col items-start justify-around md:min-h-[132px] space-y-2 md:space-y-4 overflow-hidden rounded-2xl bg-green-500 p-4 text-slate-950`}>
          <div className="truncate">{currentUser.user.username}</div> {/* 使用者名稱 */}
          <div className="truncate">{currentUser.user.email}</div> {/* 使用者電子郵件 */}
          <div className="truncate">{currentUser.user.role}</div> {/* 使用者角色 */}
          {/* 下拉選單 */}
          <div className={`${isOpen ? "bottom-0" : "-bottom-20"} absolute w-full ease-linear duration-300 left-0 bg-white flex justify-between`}>
            {/* 登出按鈕 */}
            <button onClick={handleUserLogout} className="w-full py-2 md:py-3 hover:scale-125 ease-linear duration-100">登出</button>
            {/* 修改個人資料按鈕 */}
            <button onClick={handleUserPatch} className="w-full py-2 md:py-3 hover:scale-125 ease-linear duration-100">修改</button>
            {/* 更改方案按鈕 */}
            <button onClick={handleUserPlan} className="w-full py-2 md:py-3 hover:scale-125 ease-linear duration-100">方案</button>
          </div>
        </div>
      )}
    </div>
  );
};
