import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TMDB_IMG_MD } from "../../../../utils/tmdb";

const API_KEY = process.env.REACT_APP_API_KEY;

export default function BestChoose({ userRecommend }) {
  const personId = userRecommend?.favoritePerson;

  const { data: personVideo } = useQuery({
    queryKey: ["person-credits", personId],
    queryFn: () =>
      axios
        .get(`https://api.themoviedb.org/3/person/${personId}/combined_credits?&api_key=${API_KEY}`)
        .then((r) => r.data.cast),
    enabled: !!personId,
  });

  const { data: personDetail } = useQuery({
    queryKey: ["person-detail", personId],
    queryFn: () =>
      axios
        .get(`https://api.themoviedb.org/3/person/${personId}?api_key=${API_KEY}`)
        .then((r) => r.data),
    enabled: !!personId,
  });

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
                      {<img src={TMDB_IMG_MD + Video.poster_path} draggable="false" loading="lazy" decoding="async" />}
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
