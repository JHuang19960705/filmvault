import React, { useState, useEffect } from "react";
import ContentService from "../../../../../services/content.service";

const tmdbBaseURL = "https://image.tmdb.org/t/p/original";

export default function ReviewsPic({ reviewId }) {
  const [reviewData, setReviewData] = useState(null);

  useEffect(() => {
    fatchData();
  }, []);

  const fatchData = () => {
    ContentService.getReviewByReviewId(reviewId)
      .then((data) => {
        setReviewData(data.data[0]);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="media-studies-article">
      {reviewData && reviewData.title && reviewData.content &&
        <>
          <button>
            <img src={tmdbBaseURL + reviewData.TMDBImg} alt="" className="js-review-click" datareviewid="${reviews[i].id}" />
          </button>
          <button className="media-studies-article-title js-review-click" datareviewid="${reviews[i].id}">
            <p>影評｜{reviewData.title}</p>
          </button>
          <p className="media-studies-article-text">
            {reviewData.content}
          </p>
        </>
      }
    </div>

  );
}