import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthService from "../../../services/auth.service";
import { useUser } from "../../../context/UserContext";

const PLAN_INFO = {
  standard: { name: "Standard", price: "$4.99" },
  premium: { name: "Premium", price: "$5.49" },
};

// 每個欄位的填寫規則說明
const FIELD_RULES = {
  cardNumber: "任意 16 位數字，例如：1234 5678 9012 3456",
  cardHolder: "任意英文姓名，至少 2 個字，例如：JOHN DOE",
  expiry: "MM/YY 格式，例如：12/28",
  cvv: "任意 3 位數字，例如：123",
};

function HintText({ text }) {
  return <p className="mt-1 text-xs text-blue-400 dark:text-blue-300">{text}</p>;
}

export default function MockPayment() {
  const { currentUser, setCurrentUser } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!plan || !PLAN_INFO[plan]) {
    navigate("/profile/patch-role");
    return null;
  }

  const planInfo = PLAN_INFO[plan];

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    const formatted = raw.length > 2 ? raw.slice(0, 2) + "/" + raw.slice(2) : raw;
    setExpiry(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    try {
      const response = await AuthService.mockPayment(
        currentUser.user._id, plan, cardNumber, cardHolder, expiry, cvv
      );
      localStorage.setItem("user", JSON.stringify(response.data));
      setCurrentUser(AuthService.getCurrentUser());
      setIsPaid(true);
    } catch (e) {
      setErrorMsg(e.response?.data || "付款失敗，請稍後再試。");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isPaid) {
    return (
      <div className="flex h-full flex-grow items-start justify-center overflow-y-auto px-4 pt-10 pb-14 md:pb-10 dark:bg-gray-900">
        <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-lg border border-green-400 bg-green-50 p-8 shadow-xl dark:bg-gray-800 dark:border-green-700">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-4xl dark:bg-green-900">✓</div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">付款成功！</p>
          <p className="text-center text-gray-600 dark:text-gray-300">
            您已升級為 <span className="font-bold">{planInfo.name}</span> 方案
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-2 w-full rounded-lg bg-blue-500 py-2 font-bold text-white hover:bg-blue-600"
          >
            返回首頁
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-grow items-start justify-center overflow-y-auto px-4 pt-6 pb-14 md:pb-8 dark:bg-gray-900 dark:text-white">
      <div className="w-full max-w-lg rounded-lg border border-blue-400 bg-blue-50 p-5 shadow-xl dark:bg-gray-800 dark:border-gray-700 sm:p-7">

        {/* 標題列 */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold sm:text-xl">付款資訊</h2>
          <button
            onClick={() => navigate("/profile/patch-role")}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
          >
            ← 返回
          </button>
        </div>

        {/* 練習提示橫幅 */}
        <div className="mb-5 rounded-md border border-yellow-300 bg-yellow-50 px-4 py-3 dark:bg-yellow-900/30 dark:border-yellow-700">
          <p className="text-xs font-bold text-yellow-700 dark:text-yellow-400">⚠️ 練習用模擬金流</p>
          <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-300">
            這不是真實付款系統，填寫任何符合格式的假資料即可通過，不會真的扣款。
          </p>
        </div>

        {/* 方案摘要 */}
        <div className="mb-6 rounded-md bg-white px-4 py-3 shadow-sm dark:bg-gray-700">
          <p className="text-xs text-gray-400 dark:text-gray-400">升級方案</p>
          <p className="mt-1 text-base font-bold sm:text-lg">{planInfo.name} — {planInfo.price} / 月</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* 卡號 */}
          <div>
            <label className="mb-1 block text-sm font-medium dark:text-white">卡號</label>
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              className="h-10 w-full rounded-2xl bg-gray-50 pl-4 text-sm outline-none hover:border hover:border-blue-500 dark:bg-gray-600 dark:text-white"
              required
            />
            <HintText text={`📋 ${FIELD_RULES.cardNumber}`} />
          </div>

          {/* 持卡人姓名 */}
          <div>
            <label className="mb-1 block text-sm font-medium dark:text-white">持卡人姓名</label>
            <input
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder="JOHN DOE"
              className="h-10 w-full rounded-2xl bg-gray-50 pl-4 text-sm outline-none hover:border hover:border-blue-500 dark:bg-gray-600 dark:text-white"
              required
            />
            <HintText text={`📋 ${FIELD_RULES.cardHolder}`} />
          </div>

          {/* 到期日 + CVV — 手機並排，平板以上各自有更多空間 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium dark:text-white">到期日</label>
              <input
                type="text"
                value={expiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                className="h-10 w-full rounded-2xl bg-gray-50 pl-4 text-sm outline-none hover:border hover:border-blue-500 dark:bg-gray-600 dark:text-white"
                required
              />
              <HintText text={`📋 ${FIELD_RULES.expiry}`} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium dark:text-white">CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                placeholder="123"
                className="h-10 w-full rounded-2xl bg-gray-50 pl-4 text-sm outline-none hover:border hover:border-blue-500 dark:bg-gray-600 dark:text-white"
                required
              />
              <HintText text={`📋 ${FIELD_RULES.cvv}`} />
            </div>
          </div>

          {/* 錯誤訊息 */}
          {errorMsg && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-500 dark:bg-red-900/30 dark:text-red-400">
              ❌ {errorMsg}
            </p>
          )}

          {/* 送出按鈕 */}
          <button
            type="submit"
            disabled={isProcessing}
            className="mt-1 w-full rounded-lg bg-blue-500 py-2.5 font-bold text-white hover:bg-blue-600 disabled:opacity-60 sm:py-3"
          >
            {isProcessing ? "處理中..." : `確認付款 ${planInfo.price}`}
          </button>
        </form>
      </div>
    </div>
  );
}
