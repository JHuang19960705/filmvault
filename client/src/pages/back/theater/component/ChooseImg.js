import React from "react";

export default function ChoosedImg({slide, deleteSlideImg}) {
  return (
    <div className="w-20 ml-10 flex flex-col items-center">
      <img 
        className="w-20 cursor-pointer transition-transform duration-300 transform hover:scale-110" 
        src={`https://image.tmdb.org/t/p/original/${slide.slidePoster}`}
      />
      <button onClick={() => {deleteSlideImg(slide)}} className="pt-1 hover:px-3 hover:bg-cyan-500 hover:rounded-md hover:shadow">刪除</button>
    </div>
  );
}
