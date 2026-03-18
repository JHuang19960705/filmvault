import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/auth.service";

export default function PatchProfile({ currentUser, setCurrentUser }) {
  let [username, setUsername] = useState(""); // 用戶名狀態
  let [email, setEmail] = useState(""); // 電子信箱狀態
  let [message, setMessage] = useState(""); // 訊息狀態，用於顯示錯誤訊息
  const navigate = useNavigate();

  // 初始化表單數值
  useEffect(() => {
    setUsername(currentUser.user.username);
    setEmail(currentUser.user.email);
  }, [])

  // 處理用戶名稱變更
  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  // 處理電子信箱變更
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  // 處理修改個人資料
  const handlePatchProfile = async () => {
    const confirmResult = window.confirm("您確定要修改資料嗎？");
    if (confirmResult) {
      try {
        let response = await AuthService.patchProfile(currentUser.user._id, username, email);
        window.alert("修改成功。您現在將被導向到首頁");
        localStorage.setItem("user", JSON.stringify(response.data));
        setCurrentUser(AuthService.getCurrentUser());
        navigate("/"); // 導航至首頁
      } catch (e) {
        setMessage(e.response.data);
      };
    };
  };

  // 處裡刪除個人資料
  const handleDeleteProfile = async () => {
    const confirmResult = window.confirm("您確定要刪除帳號嗎？");
    if (confirmResult) {
      try {
        await AuthService.deleteUser(currentUser.user._id);
        window.alert("刪除帳號成功。您現在將被導向到登入畫面");
        setCurrentUser(null);
        navigate("/firstEnroll");
      } catch (e) {
        if (e.response && e.response.data) {
          window.alert(e.response.data.message);
        } else {
          window.alert("發生了一些錯誤，請稍後再試。");
        };
      };
    };
  };

  return (
    <div className="flex justify-center w-full h-full items-center">
      {/* 修改個人資料表單 */}
      <div className="relative rounded-lg border border-blue-400 bg-blue-100 dark:text-black p-5 shadow-xl dark:bg-gray-800 dark:border-gray-700 w-3/5 min-w-52">
        {/* 返回鍵 */}
        <div onClick={() => navigate("/")} className="absolute right-1 top-1 h-5 w-5 cursor-pointer bg-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M12 10.586l-4.293-4.293-1.414 1.414L10.586 12l-4.293 4.293 1.414 1.414L12 13.414l4.293 4.293 1.414-1.414L13.414 12l4.293-4.293-1.414-1.414L12 10.586z" />
          </svg>
        </div>
        {/* 用戶名稱輸入框 */}
        <div className="mb-5">
          <label for="username"><div className="mb-2 ml-2 text-sm dark:text-white">用戶名稱</div></label>
          <input
            onChange={handleUsername}
            type="text"
            className="h-9 w-full cursor-text rounded-2xl bg-gray-50 pl-4 text-xs outline-none hover:border hover:border-blue-500"
            name="username"
            defaultValue={currentUser.user.username}
          />
        </div>
        {/* 電子信箱輸入框 */}
        <div className="mb-5">
          <label for="email"><div className="mb-2 ml-2 text-sm dark:text-white">電子信箱</div></label>
          <input
            onChange={handleEmail}
            type="text"
            className="h-9 w-full cursor-text rounded-2xl bg-gray-50 pl-4 text-xs outline-none hover:border hover:border-blue-500"
            name="email"
            defaultValue={currentUser.user.email}
          />
        </div>
        {/* 訊息顯示 */}
        <div className="mt-6 grid w-full md:grid-cols-2">
          <span className="flex items-center text-sm md:text-base justify-center text-red-600 md:justify-start">{message && message}</span>
          {/* 返回按鈕和確認按鈕 */}
          <div className="mt-3 flex justify-center md:mt-0 md:justify-end">
            <button onClick={handleDeleteProfile} className="text-nowrap rounded border border-gray-300 bg-gray-200 px-2 py-1 text-sm font-bold text-white shadow-sm md:px-5 md:py-1 md:text-base dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 hover:bg-gray-600 hover:text-red-400">刪除帳號</button>
            <button onClick={handlePatchProfile} className="text-nowrap rounded border border-blue-300 bg-blue-500 px-2 py-1 text-sm font-bold text-white shadow-sm md:px-5 md:py-1 md:text-base dark:bg-gray-900 dark:text-blue-500 dark:border-gray-700 hover:bg-blue-500 hover:text-black">確認修改</button>
          </div>
        </div>
      </div>
    </div>
  );

}
