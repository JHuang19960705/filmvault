import React from "react";

import { TMDB_IMG_MD } from "../../../../utils/tmdb";

export default function ThemePic({ genresVideo }) {
  return (
    <div className="theme-pic js-theme-pic">
      {genresVideo && genresVideo.poster_path &&
        <img src={TMDB_IMG_MD + genresVideo.poster_path} loading="lazy" decoding="async" />
      }
    </div>
  );
}