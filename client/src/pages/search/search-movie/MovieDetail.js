import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Information from "../Video/Information";
import Character from "../Video/Character";
import Loader from "../../../components/Loader";

const API_KEY = process.env.REACT_APP_API_KEY;

export default function MovieDetail() {
  const { TMDBId } = useParams(); // 從URL中獲取TMDBId
  const movieURL = `https://api.themoviedb.org/3/movie/${TMDBId}?api_key=${API_KEY}&language=ja-JP`;
  const CastURL = `https://api.themoviedb.org/3/movie/${TMDBId}/credits?api_key=${API_KEY}&language=ja-JP`;

  const { data: movieAll, isLoading: movieLoading } = useQuery({
    queryKey: ["movie", TMDBId],
    queryFn: () => axios.get(movieURL).then((r) => r.data),
  });

  const { data: casts, isLoading: castLoading } = useQuery({
    queryKey: ["movie-cast", TMDBId],
    queryFn: () => axios.get(CastURL).then((r) => r.data.cast),
  });

  const isLoading = movieLoading || castLoading;

  return (
    <div className="kondo-wrap">
      {isLoading && <div>Loading...<Loader /></div>}
      {/* 顯示影片資訊 */}
      {movieAll && <Information videoAll={movieAll} />}
      {/* 如果角色數量大於4，顯示角色元件 */}
      {casts && casts.length > 4 && <Character casts={casts}/>}
    </div>
  )
}
