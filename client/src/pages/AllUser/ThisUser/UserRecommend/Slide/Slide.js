import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const tmdbBaseURL = "https://image.tmdb.org/t/p/original";

export default function Slide({ userRecommend }) {
  const slider = React.useRef(null);

  const settings = {
    dots: false,
    infinite: userRecommend.slide.tmdbImgBackdrop.length >= 2,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false
  };

  // 將圖片存在backdropElements中
  let backdropElements = null;
  if (userRecommend && userRecommend.slide.tmdbImgBackdrop) {
    backdropElements = userRecommend.slide.tmdbImgBackdrop.map((backdrop, index) => {
      return (
        <div key={index}>
          <img src={tmdbBaseURL + backdrop} style={{ width: "100%", margin: "auto" }} />
        </div>
      );
    });
  };

  return (
    <div id="carousel-wrap">
      <Slider ref={slider} {...settings}>
        {backdropElements}
      </Slider>
      {userRecommend && userRecommend.slide.tmdbImgBackdrop && userRecommend.slide.tmdbImgBackdrop.length >= 2 &&
        <div id="controls">
          <span id="prev" onClick={() => slider?.current?.slickPrev()}>
            <svg className="w-5 md:w-10 mx-1 text-blue-500 transform dark:text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </span>
          <span id="next" onClick={() => slider?.current?.slickNext()}>
            <svg className="w-5 md:w-10 mx-1 text-blue-500 transform dark:text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </span>
        </div>
      }
    </div>
  )
}