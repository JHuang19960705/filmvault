import React from "react";
import CharacterPic from "./CharacterPic";

export default function Character({ userRecommend }) {
  return (
    <div className="character-wrap">
      {/* <!-- 標題 --> */}
      <div className="character-title">
        <div className="character-title-p">
          <div>當紅演員 ／</div>
        </div>
      </div>
      {/* <!-- 四個圈圈 --> */}
      <div className="character-container js-character-container-wrap">
        {userRecommend && <CharacterPic castId={userRecommend.cast.cast1} />}
        {userRecommend && <CharacterPic castId={userRecommend.cast.cast2} />}
        {userRecommend && <CharacterPic castId={userRecommend.cast.cast3} />}
        {userRecommend && <CharacterPic castId={userRecommend.cast.cast4} />}
      </div>
    </div>
  );
}
