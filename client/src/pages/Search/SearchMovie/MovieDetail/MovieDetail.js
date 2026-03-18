import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Information from "../../Video/Information";  
import Charater from "../../Video/Charater";  
import Loader from "../../../../components/Loader";

const API_KEY = process.env.REACT_APP_API_KEY;  

export default function MovieDetail() {
  const { TMDBId } = useParams(); // 從URL中獲取TMDBId
  const [isLoading, setLoading] = useState(true);  
  const [movieAll, setMovieAll] = useState(null);  
  const [casts, setCasts] = useState(null);  
  const movieURL = `https://api.themoviedb.org/3/movie/${TMDBId}?api_key=${API_KEY}&language=ja-JP`; // 電影API URL
  const CastURL = `https://api.themoviedb.org/3/movie/${TMDBId}/credits?api_key=${API_KEY}&language=ja-JP`; // 角色API URL
  
  // 發送請求
  const search = async (URL1, URL2) => {
    let result1 = await axios.get(URL1); 
    let result2 = await axios.get(URL2); 
    setMovieAll(result1.data); // 設定電影詳細資訊
    setCasts(result2.data.cast); // 設定角色陣列
    setLoading(false); 
  };

  // 初始載入時進行資料搜尋
  useEffect(()=>{
    search(movieURL, CastURL); 
  }, [TMDBId]);
  
  return (
    <div className="kondo-wrap">
      {isLoading && <div>Loading...<Loader /></div>}
      {/* 顯示影片資訊 */}
      {movieAll && <Information videoAll={movieAll} />}
      {/* 如果角色數量大於4，顯示角色元件 */}
      {casts && casts.length > 4 && <Charater casts={casts}/>}
    </div>
  )
}
