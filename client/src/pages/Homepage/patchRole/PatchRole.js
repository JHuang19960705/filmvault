import React from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/auth.service";

export default function PatchRole({ currentUser, setCurrentUser }) {
  const navigate = useNavigate(); // 使用useNavigate()鉤子來獲取導航功能

  // 處理更改方案功能，根據選擇的方案進行更新
  const handlePlanChanging = async (e) => {
    const confirmResult = window.confirm("您確定要修改身分嗎？");
    if (confirmResult) {
      try {
        let newRole = e.target.dataset.role; // 獲取選擇的新方案
        let response = await AuthService.patchRole(currentUser.user._id, newRole);
        window.alert("身分修改成功。您現在將被導向到個人資料頁面");
        localStorage.setItem("user", JSON.stringify(response.data));
        setCurrentUser(AuthService.getCurrentUser());
        navigate("/"); // 導航至首頁
      } catch (e) {
        console.error(e); // 處理錯誤，顯示錯誤訊息
      };
    };
  };

  return (
    <div className="flex h-full flex-grow flex-col justify-between overflow-y-scroll dark:bg-gray-900 dark:text-white">
      {/* 返回按鈕 */}
      <div className="mb-1 flex items-center justify-end"><button onClick={() => { navigate("/") }} type="button" className="m-1 rounded-lg bg-blue-500 p-2 text-white" >返回</button></div>
      {/* 選擇方案提示 */}
      <div className="flex justify-center"><p className="text-3xl">選擇你的新身份</p></div>
      {/* 方案選擇卡片 */}
      <div className="pricing-container">
        {/* Free方案 */}
        <article className="pricing-card">
          <h3>Free</h3>
          <div>基本功能</div>
          <div className="pricing-card__price--original"><s>$0.99</s></div>
          <div className="pricing-card__price">$0.00</div>
          <div className="period">/ 月</div>
          <ul>
            <li>基本電影、電視節目搜尋功能。</li>
            <li>瀏覽各種影迷的電影評論。</li>
            <li>對您喜歡的電影評論提供回饋。</li>
          </ul>
          <button data-role="free" onClick={handlePlanChanging} className="try">選擇Free方案</button>
        </article>
        {/* Standard方案 */}
        <article className="pricing-card">
          <h3>Standard</h3>
          <div>進階功能</div>
          <div className="pricing-card__price--original"><s>$15.00</s></div>
          <div className="pricing-card__price">$4.99</div>
          <div className="period">/ 月</div>
          <ul>
            <li>所有基本方案功能。</li>
            <li>建立自己的推薦電影精選列表。</li>
            <li>撰寫電影評論以記錄您的印象和經歷。</li>
          </ul>
          <button data-role="standard" onClick={handlePlanChanging} className="try">選擇Standard方案</button>
        </article>
        {/* Premium方案 */}
        <article className="pricing-card pricing-card--primary">
          <h3>Premium</h3>
          <div>高級功能</div>
          <div className="pricing-card__price--original"><s>$25.00</s></div>
          <div className="pricing-card__price">$5.49</div>
          <div className="period">/ 月</div>
          <ul>
            <li>所有進階方案功能。</li>
            <li>撰寫電影評論以記錄您的印象和經歷。</li>
            <li>發布具有您獨特品味的電影院。</li>
          </ul>
          <button data-role="premium" onClick={handlePlanChanging} className="try">選擇premium方案</button>
        </article>
      </div>
    </div>
  )
}
