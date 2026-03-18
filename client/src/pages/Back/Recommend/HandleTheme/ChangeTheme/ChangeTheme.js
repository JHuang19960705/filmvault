import React from "react";

export default function ChangeTheme({ handleCloseChange, newThemeId, checkIfDouble }) {
  return (
    <div className="bg-white dark:bg-gray-900 box-border p-5 rounded-xl shadow-md absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 md:w-2/5 z-10 flex flex-col">
      {/* 如果有新主題，顯示將新主題加入推薦主題的提示 */}
      <div>
        {newThemeId && <div className="text-left">將{newThemeId}加入推薦的主題裡</div>}
      </div>
      {/* 底部按鈕區域，包含取消和確定按鈕 */}
      <div className="flex justify-center mt-6 w-full md:justify-end text-nowrap">
        {/* 取消變更主題 */}
        <button onClick={handleCloseChange} className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-2 py-1 rounded-md">取消</button>
        {/* 確定變更主題 */}
        <button onClick={() => {checkIfDouble(newThemeId)}}  className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-md">確定</button>
      </div>
    </div>
  );
}
