import React from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/auth.service";
import { useUser } from "../../../context/UserContext";

export default function PatchRole() {
  const { currentUser, setCurrentUser } = useUser();
  const navigate = useNavigate(); // 使用useNavigate()鉤子來獲取導航功能

  // 只處理降級回 free，升級需透過付款流程
  const handleDowngradeToFree = async () => {
    const confirmResult = window.confirm("您確定要降級回 Free 方案嗎？");
    if (confirmResult) {
      try {
        let response = await AuthService.patchRole(currentUser.user._id, "free");
        window.alert("已降級回 Free 方案。");
        localStorage.setItem("user", JSON.stringify(response.data));
        setCurrentUser(AuthService.getCurrentUser());
        navigate("/"); // 導航至首頁
      } catch (e) {
        console.error(e); // 處理錯誤，顯示錯誤訊息
      };
    };
  };

  // 升級方案 → 導向假金流付款頁
  const handleUpgradeClick = (plan) => {
    navigate(`/profile/mockPayment?plan=${plan}`);
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
          <button onClick={handleDowngradeToFree} className="try">降級回 Free 方案</button>
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
          <button onClick={() => handleUpgradeClick("standard")} className="try">選擇Standard方案</button>
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
          <button onClick={() => handleUpgradeClick("premium")} className="try">選擇premium方案</button>
        </article>
      </div>
    </div>
  )
}
