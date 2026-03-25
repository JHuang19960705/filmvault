import React from "react";

import { TMDB_IMG_MD } from "../../../../utils/tmdb";

export default function TheaterItems({ poster }) {
  return (
    <div className="item">
      <div>
        <button className="item_image">
          <img src={TMDB_IMG_MD + poster} loading="lazy" decoding="async" />
        </button>
      </div>
      <div className="product-rent">
        <button className="add-to-cart-button">線上收看</button>
      </div>
    </div>
  );
}