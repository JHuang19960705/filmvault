import React from "react";
import { Link } from "react-router-dom";

import { TMDB_IMG_MD } from "../../../../utils/tmdb";

export default function UserAllReview({ review }) {
  return (
    <div>
      {review && (
        <div className="archive_item">
          <div className="archive_heading">{review.tags[0]}</div>
          <div className="archive_index">
            <div className="num"></div>
            <Link to={`${review._id}`} className="heading">瀏覽</Link>
          </div>
          <div className="archive_content">
            <div className="archive_content_wrap">
              <div>
                <a href="#"><img className="archive_kv" src={TMDB_IMG_MD + review.TMDBImg} alt={review.title} loading="lazy" decoding="async" /></a>
              </div>
              <h3 className="archive_title">
                <div>{review.title}</div>
              </h3>
              <p className="archive_description">{review.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
