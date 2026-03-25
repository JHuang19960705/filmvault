import React, { useState, useEffect } from "react";
import axios from "axios";
import ThemePic from "./ThemePic";

const API_KEY = process.env.REACT_APP_API_KEY;

export default function Theme({ userRecommend }) {
  const [isLoading, setLoading] = useState(true);
  const [video, setVideo] = useState(null);

  // 定義主題類型和 ID 的列表
  const genres = [
    { "id": "10759", "name": "動作片" },
    { "id": "16", "name": "動畫片" },
    { "id": "35", "name": "喜劇片" },
    { "id": "80", "name": "犯罪片" },
    { "id": "99", "name": "紀錄片" },
    { "id": "18", "name": "戲劇片" },
    { "id": "10751", "name": "闔家片" },
    { "id": "10762", "name": "兒童片" },
    { "id": "9648", "name": "懸疑片" },
    { "id": "10765", "name": "科幻片" }
  ];

  useEffect(() => {
    if (userRecommend) {
      const genresURL = `https://api.themoviedb.org/3/discover/tv?with_origin_country=JP&api_key=${API_KEY}&with_genres=${userRecommend.theme[0]}`
      search(genresURL)
    }
  }, [userRecommend]);

  const search = async (URL) => {
    let result = await axios.get(URL);
    setVideo(result.data.results);
    setLoading(false);
  };

  if (isLoading) {
    return <div className="App">Loading...</div>;
  };

  const changeTheme = async (genreId) => {
    const genresURL = `https://api.themoviedb.org/3/discover/tv?with_origin_country=JP&api_key=${API_KEY}&with_genres=${genreId}`
    await search(genresURL);
  };


  return (
    <div className="theme-wrap">
      <div className="theme-title">主題推薦</div>
      <div className="theme">
        <div className="theme-up">
          {userRecommend && userRecommend.theme && userRecommend.theme.length > 0 &&
            userRecommend.theme.map((t) => {
              return genres.map((g) => {
                if (g.id === t) {
                  return (<button onClick={() => changeTheme(t)}><p>{g.name}</p></button>)
                }
              })
            })
          }
        </div>
        <div className="theme-down">
          <div className="theme-down-wrap">
            <div className="theme-pic-wrap">
              {video &&
                video.map((v) => {
                  return (
                    <ThemePic genresVideo={v} />
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}