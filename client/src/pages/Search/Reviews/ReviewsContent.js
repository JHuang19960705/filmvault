import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ContentService from "../../../services/content.service";
import Loader from "../../../components/Loader";

const tmdbBaseURL = "https://image.tmdb.org/t/p/original";

export default function ReviewsContent({ currentUser }) {
  const { TMDBId } = useParams(); // 從URL中獲取TMDBId
  const [contentData, setContentData] = useState([]); // 影評資料
  const [isLoading, setLoading] = useState(true); // 加載狀態

  const fetchData = () => {
    if (currentUser) {
      ContentService.getReviewsByTMDBId(TMDBId)
        .then((data) => {
          setContentData(data.data);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, [TMDBId]);

  const handleClickLike = async () => {
    if (!currentUser) return;
    const reviewId = contentData[contentData.length - 1]._id;
    try {
      let response = await ContentService.patchLike(reviewId);
      window.alert(response.data.message);
      fetchData();
    } catch (error) {
      if (error.response && error.response.data) {
        window.alert(error.response.data);
      } else {
        window.alert("按讚時發生錯誤。");
      }
    }
  };

  const last = contentData.length - 1;

  return (
    <div className="blog">
      {isLoading && <div>Loading...<Loader /></div>}
      {/* 如果沒有影評資料，顯示提示 */}
      {!contentData[contentData.length - 1] && <div className="flex items-center mt-20 md:mt-10 justify-center text-base md:text-2xl">這篇還沒有影評唷～</div>}
      {/* 如果有影評資料，顯示最後一篇影評 */}
      {contentData && contentData[contentData.length - 1] && (
        <div className="blog-title">
          <div>
            <div className="blog-title-text">
              <p>{contentData[last].title}</p>
            </div>
            <div className="blog-title-date">
              <p>{contentData[last].date.slice(0, 10)}</p>
            </div>
          </div>
        </div>
      )}
      {/* 如果有影評資料，顯示作者資訊和標籤 */}
      {contentData && contentData[contentData.length - 1] && (
        <div className="blog-content">
          <div className="blog-writer">
            <div className="writer-now">
              <div className="writer-wrap">
                <div className="writer-pic">
                  <img src="https://images.unsplash.com/photo-1521587765099-8835e7201186?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ" alt="" />
                </div>
                <p>{contentData[last].writer.username}</p>
              </div>
              <div className="blog-content-hr"><hr /></div>
              <div className="blog-tags">
                {contentData[last] && (
                  <div><p>#{contentData[last].tags[0]}</p></div>
                )}
              </div>
            </div>
            {/* 如果有影評資料，顯示前面的作者資訊 */}
            {contentData && contentData.slice(0, -1).map((cw) => {
              return (
                <div className="writer-next">
                  <p>{cw.writer.username}</p>
                  <p>の感想・評価</p>
                </div>
              )
            })}
          </div>
          {/* 如果有影評資料，顯示影評內容 */}
          {contentData[last] && (
            <div className="blog-article">
              <div className="blog-article-content">
                <div className="blog-articale-pic">
                  <img src={tmdbBaseURL + contentData[last].TMDBImg} alt="" />
                </div>
                <div className="blog-articale-paragraph">
                  {contentData[last].content}
                </div>
                <div className="blog-title-like">
                  <div onClick={handleClickLike} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px", cursor: "pointer" }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      stroke="#1e478a"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ width: "20px", fill: contentData[last] && contentData[last].like.map(String).includes(String(currentUser.user._id)) ? "#1e478a" : "none" }}
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span>{contentData[last].like.length} 個讚</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
