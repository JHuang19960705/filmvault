import React, { useState, useEffect } from "react";
import Navigation from "./component/Navigation"
import TheaterItems from "./component/TheaterItems";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthService from "../../../../services/auth.service";

export default function UserTheater() {
  const { userId } = useParams(); // 從路由中獲取使用者ID
  const [userRecommend, setUserRecommend] = useState(); // 使用者推薦資料
  const [isOpen, setIsOpen] = useState(1); // 展開狀態，預設為展開熱映中
  const navigate = useNavigate(); // 導航功能

  useEffect(() => {
    fetchData();
  }, [userId]);

  // 返回上一頁
  const goBackHandler = () => {
    navigate(`/all-user/${userId}/user-reviews`);
  };

  // 獲取使用者推薦資料
  const fetchData = () => {
    AuthService.getUserRecommendById(userId)
      .then((data) => {
        setUserRecommend(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 處理展開的函式
  const toggleOpen = (tabNumber) => {
    setIsOpen(tabNumber);
  };

  // 點擊展開後的數據
  const getPosters = () => {
    switch (isOpen) {
      case 1:
        return userRecommend?.theater?.releases?.tmdbImgPoster || [];
      case 2:
        return userRecommend?.theater?.leaving?.tmdbImgPoster || [];
      case 3:
        return userRecommend?.theater?.upcoming?.tmdbImgPoster || [];
      default:
        return [];
    }
  };

  // 滾動橫向區域的事件處理
  const handleScroll = (event) => {
    const scrollAmount = 20; // 可調整滾動速度
    scrollableContent.scrollLeft += scrollAmount * Math.sign(event.deltaY); // -1: 向上滾動, 1: 向下滾動
    event.preventDefault(); // 防止滾動事件的默認行為
  };

  // 觸摸橫向區域的事件處理
  let touchStartX = null;
  const handleTouchStart = (event) => {
    touchStartX = event.touches[0].clientX;
  };
  const handleTouchMove = (event) => {
    if (!touchStartX) return;
    const touchEndX = event.touches[0].clientX;
    const touchDeltaX = touchStartX - touchEndX;
    const scrollAmount = 1; // 可調整滾動速度
    scrollableContent.scrollLeft += touchDeltaX * scrollAmount;
    touchStartX = touchEndX;
    event.preventDefault(); // 防止滾動事件的默認行為
  };
  const handleTouchEnd = () => {
    touchStartX = null;
  };

  const scrollableContent = document.querySelector(".sideScrollPage");
  if (scrollableContent) {
    scrollableContent.addEventListener("wheel", handleScroll);
    scrollableContent.addEventListener("touchstart", handleTouchStart);
    scrollableContent.addEventListener("touchmove", handleTouchMove);
    scrollableContent.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <div>
      <main className="pageWrap">
        <div className="sideScrollPage">
          {/* 頁數+產品 */}
          <div className="sideScrollPage_content">
            <div className="gallery">
              {/* 頁數 */}
              <Navigation toggleOpen={toggleOpen} />
              {/* 產品 */}
              <div className="gallery_inner">
                <div className="items">
                  {getPosters().map((poster) => (
                    <TheaterItems key={poster.id} poster={poster} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* 右下角箭頭 */} {/* 如果只有1、2張圖片就不顯示箭頭  */}
          {getPosters().length >= 3 && (
            <div className="scrollProgress">
              <div className="scrollProgress_attention">
                <div className="scrollProgress_text">Scroll or Drag Sideways</div>
                <div className="scrollProgress_arrow">→</div>
              </div>
              <div className="scrollProgress_current"></div>
            </div>
          )}
        </div>
      </main>
      <div onClick={goBackHandler} className="cancel-btn">
        <Link to="" className="cursor-pointer">
          <svg className="w-4 mx-1 md:w-5 text-gray-700 dark:text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
        <p>Theater</p>
      </div>
    </div>
  );
}
