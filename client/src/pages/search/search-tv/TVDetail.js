import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Information from "../Video/Information";
import Character from "../Video/Character";
import Loader from "../../../components/Loader";

const API_KEY = process.env.REACT_APP_API_KEY;

export default function TVDetail() {
  const { TMDBId } = useParams(); // 從URL中獲取TMDBId
  const TVURL = `https://api.themoviedb.org/3/tv/${TMDBId}?api_key=${API_KEY}&language=ja-JP`;
  const CastURL = `https://api.themoviedb.org/3/tv/${TMDBId}/credits?api_key=${API_KEY}&language=ja-JP`;

  const { data: TVAll, isLoading: tvLoading } = useQuery({
    queryKey: ["tv", TMDBId],
    queryFn: () => axios.get(TVURL).then((r) => r.data),
  });

  const { data: casts, isLoading: castLoading } = useQuery({
    queryKey: ["tv-cast", TMDBId],
    queryFn: () => axios.get(CastURL).then((r) => r.data.cast),
  });

  const isLoading = tvLoading || castLoading;

  return (
    <div className="kondo-wrap">
      {isLoading && <div>Loading...<Loader /></div>}
      {/* 顯示影集資訊 */}
      {TVAll && <Information videoAll={TVAll} />}
      {/* 如果角色資訊存在且角色數大於4，顯示角色組件 */}
      {casts && casts.length > 4 && <Character casts={casts}/>}
    </div>
  )
}
