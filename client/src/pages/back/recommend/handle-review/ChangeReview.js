import React from "react";

export default function ChangeReview({ handleChangeClose, newReview, checkIfDouble }) {
  return (
    <div className="bg-white dark:bg-gray-900 box-border p-5 rounded-xl shadow-md absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 md:w-2/5 z-10 flex flex-col">
      <div>
        {/* 顯示新增的文章標題 */}
        {newReview && <div className="text-left">{newReview.title}把文章加到推薦的主題裡</div>}
      </div>
      <div className="flex justify-center mt-6 w-full md:justify-end text-nowrap">
        {/* 取消按鈕 */}
        <button className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-2 py-1 rounded-md" onClick={handleChangeClose}>取消</button>
        {/* 確定按鈕 */}
        <button className={`ml-2 bg-blue-500 text-white px-2 py-1 rounded-md ${newReview ? '' : 'cursor-not-allowed opacity-50'}`} onClick={newReview ? () => checkIfDouble(newReview) : null}>確定</button>
      </div>
    </div>
  );
}
