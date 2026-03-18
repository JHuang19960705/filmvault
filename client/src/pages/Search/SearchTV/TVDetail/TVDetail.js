import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Information from "../../Video/Information"; 
import Charater from "../../Video/Charater"; 
import Loader from "../../../../components/Loader";

const API_KEY = process.env.REACT_APP_API_KEY; 

export default function TVDetail() {
  const { TMDBId } = useParams(); // 從URL中獲取TMDBId
  const [isLoading, setLoading] = useState(true);
  let [TVAll, setTVAll] = useState(null); 
  let [casts, setCasts] = useState(null); 
  const TVURL = `https://api.themoviedb.org/3/tv/${TMDBId}?api_key=${API_KEY}&language=ja-JP`; // 影集API URL
  const CastURL = `https://api.themoviedb.org/3/tv/${TMDBId}/credits?api_key=${API_KEY}&language=ja-JP`; // 角色API URL

  // 發送請求
  const search = async (URL1, URL2) => {
    let result1 = await axios.get(URL1); // 發送影集資訊請求
    let result2 = await axios.get(URL2); // 發送角色資訊請求
    setTVAll(result1.data); // 設定影集詳細資訊
    setCasts(result2.data.cast); // 設定角色資訊
    setLoading(false); // 加載完成
  };

  useEffect(()=>{
    search(TVURL, CastURL); // 初始載入時進行資料搜尋
  }, [TMDBId])
  
  return (
    <div className="kondo-wrap">
      {isLoading && <div>Loading...<Loader /></div>}
      {/* 顯示影集資訊 */}
      {TVAll && <Information videoAll={TVAll} />}
      {/* 如果角色資訊存在且角色數大於4，顯示角色組件 */}
      {casts && casts.length > 4 && <Charater casts={casts}/>}
    </div>
  )
}
