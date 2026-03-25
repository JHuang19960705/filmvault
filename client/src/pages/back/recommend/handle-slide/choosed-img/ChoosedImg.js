import React from "react";

export default function ChoosedImg({ ns, deleteSlideImg }) {
  return (
    <div className="ml-10 flex w-[100px] flex-col items-center">
      {/* 幻燈片海報 */}
      <img 
        className="rounded-md w-full transform cursor-pointer transition-transform duration-300 hover:scale-110" 
        src={`https://image.tmdb.org/t/p/original${ns.slidePoster}`}
        alt="Selected Slide"
      />
      {/* 刪除按鈕 */}
      <button onClick={() => {deleteSlideImg(ns)}} className="pt-1 hover:px-3 hover:bg-cyan-500 hover:rounded-md hover:shadow">刪除</button>
    </div>
  );
}
