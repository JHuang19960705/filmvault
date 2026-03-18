import React, { useState, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import UserAllReview from "./UserAllReview/UserAllReview";
import ContentService from "../../../../services/content.service";
import Loader from "../../../../components/Loader";

export default function UserReviews() {
  const { userId } = useParams();
  const [userAllReviews, setUserAllReviews] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    getAllReviews(userId);
  }, [userId]);

  // 拿取該用戶的全部影評
  const getAllReviews = (_id) => {
    ContentService.getReviewByUserId(_id)
      .then((data) => {
        setUserAllReviews(data.data);
        setLoading(false); // 資料取得後設置 loading 為 false
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      {loading && <div>Loading...<Loader /></div>}
      {!loading && userAllReviews.length === 0 && (<div className="flex justify-center text-xl pt-24">該用戶無影評!</div>)}
      <section className="archive">
        <div>
          {userAllReviews &&
            userAllReviews.map((ur) => {
              return <UserAllReview key={ur.id} review={ur} />;
            })}
        </div>
      </section>
      <Outlet />
    </div>
  );
}
