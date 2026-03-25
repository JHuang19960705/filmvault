import React from "react";

// 用於 Layout 內部的 Suspense fallback
// 殼層（側邊欄）已顯示，只有內容區還在載入
export default function ContentLoader() {
  return (
    <div className="content-loader-wrap">
      <div className="loader"></div>
    </div>
  );
}
