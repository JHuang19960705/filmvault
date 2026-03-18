import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ContentService from "../../../../services/content.service"; 
import axios from "axios";
import Loader from "../../../../components/Loader";

const API_KEY = process.env.REACT_APP_API_KEY; 
const tmdbBaseURL = "https://image.tmdb.org/t/p/original";

export default function PostTVContent () {
  const { TMDBId } = useParams(); // 從URL中獲取TMDBId
  const [isLoading, setLoading] = useState(true); 
  let [tvAll, setTVAll] = useState(null); 
  let [getTMDBId, setGetTMDBId] = useState(""); 
  let [TMDBImg, setTMDBImg] = useState("");
  const TVURL = `https://api.themoviedb.org/3/tv/${TMDBId}?api_key=${API_KEY}`; // 影集API URL
  
  // 發送請求函式
  const search = async (URL1) => {
    let result = await axios.get(URL1); 
    setTVAll(result.data); // 設定影集詳細資訊
    setGetTMDBId(result.data.id); // 設定獲取的TMDBId
    // 如果有背景圖片，設定TMDB圖片
    result.data.backdrop_path && (
      setTMDBImg(result.data.backdrop_path)
    )
    setLoading(false); 
  };

  // 初始載入時進行資料搜尋
  useEffect(()=>{
    search(TVURL); 
  }, [TMDBId])

  let [title, setTitle] = useState(""); // 標題
  let [content, setContent] = useState(""); // 內容
  let [tags, setTags] = useState(0); // 標籤
  let [message, setMessage] = useState(""); // 錯誤訊息
  const navigate = useNavigate(); // 路由導航函數

  // 處理標題變化
  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  // 處理內容變化
  const handleChangeContent = (e) => {
    setContent(e.target.value);
  };

  // 處理標籤變化
  const handleChangeTags = (e) => {
    setTags(e.target.value);
  };

  // 發佈內容
  const postContent = () => {
    ContentService.post(title, content, tags, getTMDBId, TMDBImg)
      .then(() => {
        window.alert("您的影評成功上傳");
        navigate("/back/yourReviews");
      })
      .catch((error) => {
        console.log(error.response);
        setMessage(error.response.data);
      });
  };

  return (
    <div className="box-border p-4 pb-8 md:p-8">
      {isLoading && <div>Loading...<Loader /></div>}
      {/* 顯示TMDB圖片 */}
      <img className="mb-5 rounded-2xl" src={ tmdbBaseURL + TMDBImg} />
      <div>
        <div className="mb-5 h-full">
          {/* 輸入標題 */}
          <label for="title"><div className="mb-2 ml-2 text-sm">標題</div></label>
          <input onChange={handleChangeTitle} className="h-9 w-full cursor-text rounded-2xl bg-gray-50 p-3 text-xs outline-none hover:border hover:border-blue-500 dark:text-black" name="title" type="text" placeholder="Type Title..." />
        </div>
        <div className="mb-5 h-full">
          {/* 輸入內容 */}
          <label for="reviews"><div className="mb-2 ml-2 text-sm">內容</div></label>
          <textarea onChange={handleChangeContent} rows="1" className="h-auto min-h-24 w-full cursor-text rounded-2xl bg-gray-50 p-3 text-xs outline-none hover:border hover:border-blue-500 dark:text-black" id="reviews" name="reviews" placeholder="Type Here..."></textarea>
        </div>
        <div className="mb-5 h-full">
          {/* 輸入標籤 */}
          <label for="tag"><div className="mb-2 ml-2 text-xs">TAG</div></label>
          <div className="relative">
            <input onChange={handleChangeTags} name="tag" type="text" className="h-9 w-full cursor-text rounded-2xl bg-gray-50 p-3 text-xs outline-none hover:border hover:border-blue-500 dark:text-black" id="tag" placeholder="Add New Tag..." />
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-3 top-1.5 h-6 w-6 transform cursor-pointer text-gray-300 transition duration-300 hover:scale-110 hover:text-blue-700 active:scale-50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <div className="mt-2 flex max-h-40 flex-wrap overflow-y-auto"></div>
        </div>
        <div className="mb-5 h-5">
          {/* 發佈按鈕 */}
          <button onClick={() => { postContent() }} className="float-end rounded border border-blue-300 bg-blue-100 px-5 py-1 font-bold text-blue-500 dark:text-blue-900 shadow-sm">刊登發表</button>
        </div>
        {/* 顯示錯誤訊息 */}
        {message && (
          <div className="relative flex justify-center">
            <div className="absolute bottom-0 mx-auto bg-red-50 px-20 py-5 rounded-2xl" role="alert">{message}</div>
          </div>
        )}
      </div>
    </div>
  );
};
