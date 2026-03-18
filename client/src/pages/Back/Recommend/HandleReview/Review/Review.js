import React from "react";
const tmdbBaseURL = "https://image.tmdb.org/t/p/original";

export default function Review({ review, setNewReview, handleChangeOpen }) {
  const handleSelectReview = () => {
    handleChangeOpen();
    setNewReview(review);
  };

  return (
    <div>
      {/* 顯示評論內容 */}
      {review && (
        <div className="archive_item">
          {/* 顯示評論標籤 */}
          <div className="archive_heading">{review.tags[0]}</div>
          <div className="archive_index">
            <div className="num"></div>
            {/* 選擇按鈕 */}
            <div onClick={handleSelectReview} className="heading">
              選擇
            </div>
          </div>
          <div className="archive_content">
            <div className="archive_content_wrap">
              <div>
                {/* 顯示電影圖片 */}
                <a>
                  <img className="archive_kv" src={tmdbBaseURL + review.TMDBImg} />
                </a>
              </div>
              {/* 顯示評論標題 */}
              <h3 className="archive_title">
                <div className="jp">{review.title}</div>
              </h3>
              {/* 顯示評論內容 */}
              <p className="archive_description">{review.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
