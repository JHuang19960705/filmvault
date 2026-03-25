import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;
const tmdbBaseURL = "https://image.tmdb.org/t/p/original";

export default function BestChoose({ userRecommend }) {
  const [personVideo, setPersonVideo] = useState(null);
  const [personDetail, setPersonDetail] = useState(null);

  useEffect(() => {
    if (userRecommend) {
      const personVideoURL = `https://api.themoviedb.org/3/person/${userRecommend.favoritePerson}/combined_credits?&api_key=${API_KEY}`;
      const personDetailURL = `https://api.themoviedb.org/3/person/${userRecommend.favoritePerson}?api_key=${API_KEY}`;
      searchAll(personVideoURL, personDetailURL);
    }
  }, [userRecommend]);

  const searchAll = async (URL1, URL2) => {
    let result1 = await axios.get(URL1);
    let result2 = await axios.get(URL2);
    setPersonVideo(result1.data.cast);
    setPersonDetail(result2.data);
  };

  return (
    <div className="best-wrap">
      <div className="best">
        {/* 角色資訊 */}
        {personDetail && personDetail.also_known_as && personDetail.also_known_as.length > 0 &&
          < div className="best-up">
            <div className="best-title"><p>{personDetail.also_known_as[0]}作品精選</p></div>
            <div className="best-subtitle"><p>{personDetail.also_known_as[1]}</p></div>
            <div className="best-logline">
              <p>{personDetail.biography}</p>
            </div>
          </div>
        }
        <div className="best-down">
          <div className="best-pic-wrap">
            {/* 角色作品海報 */}
            {
              personVideo &&
              personVideo.map((Video) => {
                if (Video.poster_path) {
                  return (
                    <button className="best-pic">
                      {<img src={tmdbBaseURL + Video.poster_path} draggable="false" />}
                    </button>
                  )
                }
              })
            }
          </div>
        </div>
      </div>
    </div >
  );
}