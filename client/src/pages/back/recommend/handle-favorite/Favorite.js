import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;
const tmdbBaseURL = "https://image.tmdb.org/t/p/original";

export default function Favorite({ favoriteId, setOldFavorite, handleChangeOpen1 }) {
  const [isLoading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState({});
  const [favoriteVideoImg, setFavoriteVideoImg] = useState([]);

  useEffect(() => {
    fetchData();
  }, [favoriteId]);

  const fetchData = async () => {
    try {
      if (favoriteId) {
        const favoriteURL = `https://api.themoviedb.org/3/person/${favoriteId}?api_key=${API_KEY}`;
        const favoriteVidoeImgURL = `https://api.themoviedb.org/3/person/${favoriteId}/combined_credits?&api_key=${API_KEY}`;
        const [result1, result2] = await Promise.all([axios.get(favoriteURL), axios.get(favoriteVidoeImgURL)]);
        setFavorite(result1.data);
        setFavoriteVideoImg(result2.data.cast);
        setLoading(false);
      }
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div className="App"></div>;
  };

  return (
    <div>
      {favorite && (
        <div className="archive_item">
          <h2 className="archive_heading">CHARACHER</h2>
          <div className="archive_index">
            <div className="num"></div>
            <div onClick={() => { handleChangeOpen1(); setOldFavorite({ id: favorite.id, name: favorite.name }) }} data-favorite-id={favorite.id} className="heading">修改</div>
          </div>
          <div className="archive_content">
            <div className="archive_col1">
              <div>{favorite.profile_path && <a><img className="archive_kv" src={tmdbBaseURL + favorite.profile_path} alt={favorite.name} /></a>}</div>
              <h3 className="archive_title">
                {favorite.also_known_as && <div className="jp">{favorite.also_known_as[0]}</div>}
                {favorite.also_known_as && favorite.also_known_as[2] && <div className="year">{favorite.also_known_as[2]}</div>}
              </h3>
              {favorite.biography && <p className="archive_description">{favorite.biography}</p>}
            </div>
            <div className="archive_col2">
              {favoriteVideoImg && favoriteVideoImg.slice(0, 4).map((img) => <img key={img.id} src={tmdbBaseURL + img.poster_path} alt={img.name} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};