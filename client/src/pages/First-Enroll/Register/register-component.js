import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "../../../services/auth.service";

export default function RegisterComponent({ currentUser }) {
  const { clickRole } = useParams(); // 獲取URL參數
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(clickRole);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // 處理用戶名輸入
  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  // 處理郵件輸入
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  // 處理密碼輸入
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  // 處理角色輸入
  const handleRole = (e) => {
    setRole(e.target.value);
  };

  // 處理註冊
  const handleRegister = () => {
    AuthService.register(username, email, password, role)
      .then(() => {
        // 註冊成功，導航至登錄頁面
        window.alert("註冊成功。您現在將被導向到登入頁面");
        navigate("/firstEnroll/login");
      })
      .catch((e) => {
        // 若註冊失敗，則顯示錯誤消息
        setMessage(e.response.data);
      });
  };

  // 檢查是否有登入，若有則導航至首頁
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div className="fixed left-1/2 top-24 z-10 w-3/5 min-w-52 -translate-x-1/2 rounded-lg border border-blue-400 bg-blue-100 p-5 shadow-xl dark:bg-gray-700 dark:border-gray-400">
      {/* 返回按鈕 */}
      <div onClick={() => { navigate("/firstEnroll") }} className="absolute right-1 top-1 h-5 w-5 cursor-pointer bg-white">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M12 10.586l-4.293-4.293-1.414 1.414L10.586 12l-4.293 4.293 1.414 1.414L12 13.414l4.293 4.293 1.414-1.414L13.414 12l4.293-4.293-1.414-1.414L12 10.586z" />
        </svg>
      </div>
      {/* 用戶名輸入框 */}
      <div className="mb-5 h-full">
        <label htmlFor="username"><div className="mb-2 ml-2 text-sm">用戶名稱</div></label>
        <input
          onChange={handleUsername}
          type="text"
          className="h-9 w-full cursor-text rounded-2xl bg-gray-50 pl-4 text-xs outline-none hover:border hover:border-blue-500 dark:text-black"
          name="username"
        />
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
          placeholder="長度至少超過6個英文或數字"
        />
      </div>
      {/* 角色輸入框 */}
      <div className="mb-5 h-full">
        <label htmlFor="password"><div className="mb-2 ml-2 text-sm">身份</div></label>
        <input
          onChange={handleRole}
          type="text"
          className="h-9 w-full cursor-text rounded-2xl bg-gray-50 pl-4 text-xs outline-none hover:border hover:border-blue-500 dark:text-black"
          name="role"
          placeholder="只能填入free, standard, premium其中之一"
          defaultValue={role} // Use defaultValue to set initial value
        />
      </div>
      {/* 按鈕區域 */}
      <div className="mt-6 grid w-full md:grid-cols-2">
        {/* 顯示錯誤消息 */}
        <span className="flex items-center text-sm md:text-base justify-center text-red-600 md:justify-start">{message && message}</span>
        {/* 註冊按鈕 */}
        <div className="mt-3 flex justify-center md:mt-0 md:justify-end">
          <button onClick={handleRegister} className="rounded border border-blue-300 bg-blue-500 px-2 py-1 text-sm font-bold text-white shadow-sm md:px-5 md:py-1 md:text-base">註冊會員</button>
        </div>
      </div>
    </div>
  );
}
