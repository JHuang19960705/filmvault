import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;
const tmdbBaseURL = "https://image.tmdb.org/t/p/original";

export default function Cast({ castId, setOldCast, handleChangeOpen1 }) {
  const [isLoading, setLoading] = useState(true);
  const [cast, setCast] = useState([]);
  const [castVideoImg, setCastVideoImg] = useState([]);

  useEffect(() => {
    fetchData();
  }, [castId]);

  const fetchData = async () => {
    try {
      if (castId) {
        const castURL = `https://api.themoviedb.org/3/person/${castId}?api_key=${API_KEY}`;
        const castVidoeImgURL = `https://api.themoviedb.org/3/person/${castId}/combined_credits?&api_key=${API_KEY}`;
        const [castResponse, castVideoImgResponse] = await Promise.all([
          axios.get(castURL),
          axios.get(castVidoeImgURL)
        ]);
        setCast(castResponse.data);
        setCastVideoImg(castVideoImgResponse.data.cast);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching cast data:", error);
      setLoading(false);
    };
  };

  if (isLoading) {
    return <div className="App"></div>;
  };

  return (
    <div>
      {cast &&
        <div className="archive_item">
          <h2 className="archive_heading">CHARACHER</h2>
          <div className="archive_index">
            <div className="num"></div>
            <div onClick={() => {
              handleChangeOpen1();
              setOldCast({ id: cast.id, name: cast.name })
            }}
              data-cast-id={cast.id}
              className="heading">修改</div>
          </div>
          <div className="archive_content">
            <div className="archive_col1">
              <div>
                {cast.profile_path && <a><img src={tmdbBaseURL + cast.profile_path} /></a>}
              </div>
              <h3 className="archive_title">
                {cast.also_known_as && <div className="jp">{cast.also_known_as[0]}</div>}
                {cast.also_known_as && cast.also_known_as[2] && <div className="year">{cast.also_known_as[2]}</div>}
              </h3>
              {cast.biography && <p className="archive_description">{cast.biography}</p>}
            </div>
            <div className="archive_col2">
              {castVideoImg && castVideoImg.slice(0, 4).map((img) => {
                return (<img key={img.id} src={tmdbBaseURL + img.poster_path} />)
              })}
            </div>
          </div>
        </div>
      }
    </div>
  );
}
