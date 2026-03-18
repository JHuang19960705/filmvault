import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/auth.service";
import Loader from "../../../components/Loader";
import Overlay from "../../../components/Overlay";

export default function LoginComponent({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // 初始化加載狀態為 false
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // 處理郵件輸入
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  // 處理密碼輸入
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  // 處理登入
  const handleLogin = async () => {
    try {
      setLoading(true); // 設置加載狀態為 true，顯示 Loader
      let response = await AuthService.login(email, password);
      if (response) {
        localStorage.setItem("user", JSON.stringify(response.data)); // 將登入用戶存在localStorage中
        window.alert("登入成功。您現在將被導向到首頁。");
        setCurrentUser(AuthService.getCurrentUser());
        navigate("/"); // 導航至首頁
      }
    } catch (error) {
      // 捕獲錯誤並顯示訊息
      setMessage(error.message);
    } finally {
      setLoading(false); // 無論登入成功與否，都隱藏 Loader
    }
  };


  // 檢查是否有登入，若有則導航至首頁
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <>
      {loading && <Overlay />} {/* 如果 loading 為 true，顯示 Overlay */}
      <div className="fixed left-1/2 top-44 z-10 w-3/5 min-w-52 -translate-x-1/2 rounded-lg border border-blue-400 bg-blue-100 p-5 shadow-xl dark:bg-gray-700 dark:border-gray-400">
        {loading && <Loader />} {/* 如果 loading 為 true，顯示 Loader */}
        {loading && <Overlay />} {/* 如果 loading 為 true，顯示 Overlay */}
        {/* 返回按鈕 */}
        <div onClick={() => { navigate("/firstEnroll") }} className="absolute right-1 top-1 h-5 w-5 cursor-pointer bg-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M12 10.586l-4.293-4.293-1.414 1.414L10.586 12l-4.293 4.293 1.414 1.414L12 13.414l4.293 4.293 1.414-1.414L13.414 12l4.293-4.293-1.414-1.414L12 10.586z" />
          </svg>
        </div>
        {/* 郵件輸入框 */}
        <div className="mb-5 h-full">
          <label htmlFor="email"><div className="mb-2 ml-2 text-sm">電子信箱</div></label>
          <input
            onChange={handleEmail}
            type="text"
            className="h-9 w-full cursor-text rounded-2xl bg-gray-50 pl-4 text-xs outline-none hover:border hover:border-blue-500 dark:text-black"
            name="email"
          />
        </div>
        {/* 密碼輸入框 */}
        <div className="mb-5 h-full">
          <label htmlFor="password"><div className="mb-2 ml-2 text-sm">密碼</div></label>
          <input
            onChange={handlePassword}
            type="password"
            className="h-9 w-full cursor-text rounded-2xl bg-gray-50 pl-4 text-xs outline-none hover:border hover:border-blue-500 dark:text-black"
            name="password"
          />
        </div>
        {/* 按鈕區域 */}
        <div className="mt-6 grid w-full md:grid-cols-2">
          {/* 顯示錯誤消息 */}
          <span className="flex items-center text-sm md:text-base justify-center text-red-600 md:justify-start">{message && message}</span>
          {/* 登入按鈕 */}
          <div className="mt-3 flex justify-center md:mt-0 md:justify-end">
            <button onClick={handleLogin} className="rounded border border-blue-300 bg-blue-500 px-2 py-1 text-sm font-bold text-white shadow-sm md:px-5 md:py-1 md:text-base">登入系統</button>
          </div>
        </div>
      </div>
    </>
  );
}
