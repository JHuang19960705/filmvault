import React, { useState, useEffect } from "react";
import axios from "axios";

const tmdbBaseURL = "https://image.tmdb.org/t/p/original";
const API_KEY = process.env.REACT_APP_API_KEY;

export default function SlidePic({ TMDBId }) {
  let [videoAll, setVideoAll] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const videoURL = `https://api.themoviedb.org/3/tv/${TMDBId}?api_key=${API_KEY}&language=ja-JP`;

  useEffect(() => {
    search(videoURL);
  }, []);

  const search = async (URL) => {
    let result = await axios.get(URL);
    setVideoAll(result.data);
    setLoading(false);
  };

  if (isLoading) {
    return <div className="App">Loading...</div>;
  };

  return (
    <button className="slide js-slide">
      <img src={tmdbBaseURL + videoAll.backdrop_path} />
    </button>
  );
}