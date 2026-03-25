import React, { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;
const tmdbBaseURL = "https://image.tmdb.org/t/p/original";

export default function Theme({ genre, setNewThemeId, handleOpenChange }) {
  const [isLoading, setLoading] = useState(true);
  // 定義 video 狀態，用於存儲 API 返回的影片資料
  const [video, setVideo] = useState(null);
  
  // 向 TMDB API 發送請求
  const search = async(URL) => {
    let result = await axios.get(URL);
    setVideo(result.data.results);
    setLoading(false);
  }

  useEffect(() => {
    if(genre){
      const genresURL = `https://api.themoviedb.org/3/discover/tv?with_origin_country=JP&api_key=${API_KEY}&with_genres=${genre.id}`
      search(genresURL)
    }
  },[genre])

  // 如果資料正在加載，則顯示 Loading...
  if (isLoading) {
    return <div className="App"></div>;
  }

  return (
    <div>
      {/* 如果存在 genre 和 video，則顯示影片資料 */}
      {genre && video && 
        <div className="archive_item mb-12">
          {/* 顯示影片類型名稱 */}
          <h2 className="archive_heading">{genre.name}</h2>
          <div className="archive_index">
            <div className="num"></div>
            {/* 點擊此處可以選擇主題 */}
            <div onClick={() => { handleOpenChange(); setNewThemeId(genre.id)}} className="heading">選擇</div>
          </div>
          <div className="archive_content">
            <div className="archive_col1">
              <div>
                {/* 顯示第一部影片的海報 */}
                <a><img className="archive_kv" src={tmdbBaseURL + video[0].poster_path} /></a>
              </div>
            </div>
              <div className="archive_col2">
                {/* 顯示第二部至第五部影片的海報 */}
                {video.slice(1, 5).map((v) => {
                  return <img src={tmdbBaseURL + v.poster_path} />
                })}
              </div>
          </div>
        </div>
      }
    </div>
  );
}
