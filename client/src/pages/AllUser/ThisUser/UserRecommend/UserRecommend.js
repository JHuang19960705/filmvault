import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slide from "./Slide/Slide";
import Character from "./Character/Character";
import Reviews from "./Reviews/Reviews";
import BestChoose from "./BestChoose/BestChoose";
import Theme from "./Theme/Theme";
import AuthService from "../../../../services/auth.service";
import Loader from "../../../../components/Loader";

export default function UserRecommend() {
  const [isLoading, setLoading] = useState(true);
  const { userId } = useParams(); // 從路由中獲取用戶 ID
  const [userRecommend, setUserRecommend] = useState();

  useEffect(() => {
    fatchData();
  }, [userId]);

  // 從後端獲取該用戶的推薦的資料
  const fatchData = () => {
    AuthService.getUserRecommendById(userId)
      .then((data) => {
        setUserRecommend(data.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      {isLoading && <div>Loading...<Loader /></div>}
      {userRecommend && (
        <>
          <Slide userRecommend={userRecommend} />
          <Character userRecommend={userRecommend} />
          <Reviews userRecommend={userRecommend} />
          <Theme userRecommend={userRecommend} />
          <BestChoose userRecommend={userRecommend} />
        </>
      )}
    </div>
  );
}