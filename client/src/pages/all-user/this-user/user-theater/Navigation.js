import React, { useState } from "react";

export default function Navigation({ toggleOpen }) {
  const [selectedLink, setSelectedLink] = useState("現正熱播");

  // 按鈕資料
  const buttons = [
    { id: 1, name: "現正熱播" },
    { id: 2, name: "準備下檔電影" },
    { id: 3, name: "下個月上映電影" }
  ];

  // 點擊按鈕事件處理
  const handleLinkClick = (linkName, tabNumber) => {
    setSelectedLink(linkName); // 設置選擇的連結
    toggleOpen(tabNumber); // 切換分類展開狀態
  };

  return (
    <div className="navigation navigation-start">
      <ul className="navigation_list">
        {buttons.map((button) => (
          <li className="navigation_item" key={button.id}>
            <button onClick={() => handleLinkClick(button.name, button.id)} className={`navigation_link ${selectedLink === button.name ? "link-exact-active" : ""}`}>
              <div className="navigation_index">{button.id}</div>
              <div className="navigation_content">
                <div className="_main">{button.name}</div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
