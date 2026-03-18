import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../../services/auth.service";
import Review from "./Review/Review";
import ChangeReview from "./ChangeReview/ChangeReview";
import ContentService from "../../../../services/content.service"

export default function HandleReview({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();
  const [recommendReviews, setRecommendReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [newReview, setNewReview] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      getAllReviews();
    }
  }, [currentUser]);

  // 取得所有影評
  const getAllReviews = () => {
    let _id;
    if (currentUser) {
      _id = currentUser.user._id;
      ContentService.getReviewByUserId(_id)
        .then((data) => {
          setAllReviews(data.data);
          setRecommendReviews(data.data)
          getRecommendReviews()
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  // 篩選推薦影評
  const getRecommendReviews = () => {
    setRecommendReviews(prevReviews => prevReviews.filter(r => currentUser.user.contentId.includes(r._id)));
  };

  // 開啟變更影評視窗
  const handleChangeOpen = () => {
    setIsOpen(true)
  };

  // 關閉變更影評視窗
  const handleChangeClose = () => {
    setIsOpen(false)
  };

  // 檢查是否為重複影評並加入推薦列表
  const checkIfDouble = (newR) => {
    if (recommendReviews[0]) {
      if (!recommendReviews.includes(newR)) {
        setRecommendReviews([...recommendReviews, newR]);
        setIsOpen(false)
      } else {
        window.alert(`已經有${newR.title}囉~`)
        setIsOpen(false)
      }
    } else {
      setRecommendReviews([...recommendReviews, newR]);
      setIsOpen(false)
    }
  };

  // 刪除所選影評
  const deleteReview = (id) => {
    setRecommendReviews(recommendReviews.filter(r => r !== id))
  };

  // 修改影評
  const patchReview = async (upDatedRecommendReviewsId) => {
    const newAllReviewsId = upDatedRecommendReviewsId;
    try {
      let response = await AuthService.patchReviews(currentUser.user._id, newAllReviewsId)
      window.alert("主題修改成功~");
      localStorage.setItem("user", JSON.stringify(response.data));
      setCurrentUser(AuthService.getCurrentUser());
      navigate(0);
    } catch (e) {
      console.error(e);
    };

  };

  return (
    <div>
      {/* 上傳影評區 */}
      <div className="sticky left-0 top-0 z-10">
        <div className="dark:bg-gray-800 flex w-full flex-col items-center rounded-b-3xl bg-white p-3 shadow">
          {!recommendReviews[0] && <div className="text-center">你還沒選擇要推薦的影評唷~<br />▼快來選▼</div>}
          {recommendReviews[0] && <button onClick={() => { patchReview(recommendReviews) }} className="mb-5 border border-blue-500 px-3 text-blue-500">確定</button>}
          <div className="flex flex-wrap justify-center max-h-24 overflow-y-auto">
            {recommendReviews &&
              recommendReviews.map((r) => {
                return (
                  <div className="mb-3 mr-3 rounded-md bg-gray-200 dark:bg-gray-950 px-4 py-1 w-28 flex cursor-default items-center justify-between">
                    <span className="w-20 truncate">{r.title}</span>
                    <svg onClick={() => { deleteReview(r) }} xmlns="http://www.w3.org/2000/svg" className="ml-2 h-full w-4 transform cursor-pointer text-gray-600 dark:text-gray-100 transition duration-300 hover:scale-150 hover:text-blue-700 active:scale-50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
      {/* 所有影評 */}
      <section className="archive">
        <div>
          {allReviews && allReviews.map((r) => {
            return <Review review={r} setNewReview={setNewReview} handleChangeOpen={handleChangeOpen} />
          })}
        </div>
      </section>
      {/* 變更影評視窗 */}
      {isOpen &&
        <ChangeReview newReview={newReview} checkIfDouble={checkIfDouble} handleChangeClose={handleChangeClose} currentUser={currentUser} setCurrentUser={setCurrentUser} />
      }
    </div>
  );
}
