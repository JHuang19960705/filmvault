import React from "react";

const tmdbBaseURL = "https://image.tmdb.org/t/p/original";

// 顯示影片資訊的組件
export default function Information({ videoAll }) {
    return (
        <div>
            {/* 影片圖片 */}
            <div className="movie-pic">
                <img src={videoAll.backdrop_path && tmdbBaseURL + videoAll.backdrop_path} alt="影片圖片" />
            </div>
            {/* 影片標題 */}
            <div className="movie-title">
                <p>{videoAll.original_name || videoAll.original_title}</p>
            </div>
            {/* 影片上映日期 */}
            <div className="movie-time">
                <p>{(videoAll.release_date || videoAll.first_air_date) && (videoAll.release_date || videoAll.first_air_date).slice(0, 4)}年</p>
                <p>{(videoAll.release_date || videoAll.first_air_date) && (videoAll.release_date || videoAll.first_air_date).slice(5, 7)}月{(videoAll.release_date || videoAll.first_air_date) && (videoAll.release_date || videoAll.first_air_date).slice(8, 10)}日</p>
                <p>ON AIR</p>
            </div>
            {/* 影片詳細資訊 */}
            <div className="movie-detail">
                <div className="movie-detail-wrap">
                    <div>
                        <p>{videoAll.production_countries[0]?.name || videoAll.origin_country[0]}</p>
                    </div>
                    <div>
                        <p>{videoAll.release_date || videoAll.first_air_date}</p>
                    </div>
                    <div>
                        <p>評分　{videoAll.popularity}</p>
                    </div>
                </div>
            </div>
            {/* 影片簡介和背景圖 */}
            {videoAll.overview && videoAll.backdrop_path &&
                <div className="movie-video-and-story">
                    {/* 影片播放連結 */}
                    <div className="movie-video">
                        <a className="movie-video-play">
                            <img src={videoAll.backdrop_path && (tmdbBaseURL + videoAll.backdrop_path)} alt="影片背景" />
                        </a>
                    </div>
                    {/* 影片簡介 */}
                    <div className="movie-story">
                        <div className="movie-story-wrap">
                            <p>{videoAll.overview}</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
