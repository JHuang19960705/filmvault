import React from 'react';

const tmdbBaseURL = "https://image.tmdb.org/t/p/original";

// 角色組件
export default function Character({ casts }) {
    return (
        <div className="movie-character">
            <p className="movie-character-title">登場人物</p>
            <div className="movie-character-wrap">
                <div className="movie-character-left">
                    <div className="movie-character-list1">
                        {/* 第一個角色 */}
                        <img className="movie-first-img" src={casts[0]?.profile_path && (tmdbBaseURL + casts[0].profile_path)} alt="" data-cast={casts[0]?.id} />
                        <div className="movie-character-list2">
                            {/* 其他角色 */}
                            {casts.slice(1, 4).map(cast => (
                                <img key={cast.id} src={cast.profile_path && (tmdbBaseURL + cast.profile_path)} alt="" data-cast={cast.id} />
                            ))}
                        </div>
                    </div>
                    <div className="movie-character-profile">
                        <p className="movie-character-name">
                            {casts[0]?.name}
                        </p>
                        <p className="movie-character-real-name">
                            演 - <span>{casts[0]?.character}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
