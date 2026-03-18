import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, Outlet } from "react-router-dom";
import ContentService from "../../../../services/content.service";
import Loader from "../../../../components/Loader";

const tmdbBaseURL = "https://image.tmdb.org/t/p/original";

export default function PatchYourReview({ currentUser }) {
  const navigate = useNavigate();
  const { reviewId } = useParams();
  const [reviewData, setReviewData] = useState({});
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [tags, setTags] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [reviewId]); // 初始加載時進行一次

  // 從後台拿該影評內容
  const fetchData = () => {
    if (currentUser) {
      if (currentUser.user.role === "standard" || currentUser.user.role === "premium") {
        ContentService.getReviewByReviewId(reviewId)
          .then((data) => {
            setReviewData(data.data[0]);
            setTitle(data.data[0].title);
            setReview(data.data[0].content);
            setTags(data.data[0].tags);
            setLoading(false);
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (currentUser.user.role === "free") {
        window.alert("你不是該篇文章的主人。您現在將被重新導向到首頁。");
        navigate("/");
      }
    }
  };

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleChangeReview = (e) => {
    setReview(e.target.value);
  };

  const handleChangeTags = (e) => {
    setTags(e.target.value);
  };

  const patchReview = () => {
    ContentService.patch(reviewId, title, review, tags)
      .then(() => {
        window.alert("修改成功");
        navigate(0);
      })
      .catch((error) => {
        setMessage(error.response);
      });
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("確定要刪除該評論嗎？");
    if (confirmDelete) {
      try {
        await ContentService.delete(reviewId);
        navigate("/back/yourReviews");
        setTimeout(() => { navigate(0); }, 1);
      } catch (error) {
        setMessage(error.response);
      };
    };
  };

  return (
    <div className="box-border p-4 pb-8 md:p-8">
      {isLoading && <div>Loading...<Loader /></div>}
      <img className="mb-5 rounded-2xl" src={tmdbBaseURL + reviewData.TMDBImg} alt={reviewData.title} />
      <div>
        <div className="mb-5 h-full">
          <label htmlFor="title"><div className="mb-2 ml-2 text-sm">標題</div></label>
          <input value={title} onChange={handleChangeTitle} className="h-9 w-full cursor-text rounded-2xl bg-gray-50 p-3 text-xs outline-none hover:border hover:border-blue-500 dark:text-black" name="title" type="text" placeholder="Type Title..." />
        </div>
        <div className="mb-5 h-full">
          <label htmlFor="reviews"><div className="mb-2 ml-2 text-sm">內容</div></label>
          <textarea value={review} onChange={handleChangeReview} rows="1" className="h-auto min-h-24 w-full cursor-text rounded-2xl bg-gray-50 p-3 text-xs outline-none hover:border hover:border-blue-500 dark:text-black" id="reviews" name="reviews" placeholder="Type Here..."></textarea>
        </div>
        <div className="mb-5 h-full">
          <label htmlFor="tag"><div className="mb-2 ml-2 text-xs">TAG</div></label>
          <div className="relative">
            <input value={tags} onChange={handleChangeTags} name="tag" type="text" className="h-9 w-full cursor-text rounded-2xl bg-gray-50 p-3 text-xs outline-none hover:border hover:border-blue-500 dark:text-black" id="tag" placeholder="Add New Tag..." />
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-3 top-1.5 h-6 w-6 transform cursor-pointer text-gray-300 transition duration-300 hover:scale-110 hover:text-blue-700 active:scale-50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
        </div>
        <div className="mb-5 flex justify-between md:justify-end">
          <button onClick={handleDelete} className="text-xs px-2 py-1 rounded border border-gray-200 bg-gray-50 md:px-5 md:py-1 font-bold text-gray-300 shadow-sm">刪除影評</button>
          <Link to="reviewsComment" className="text-xs px-2 py-1 rounded border border-blue-200 bg-blue-50 md:px-5 md:py-1 font-bold text-blue-400 shadow-sm">查看回覆</Link>
          <button onClick={patchReview} className="text-xs px-2 py-1 rounded border border-blue-300 bg-blue-100 md:px-5 md:py-1 font-bold text-blue-500 shadow-sm">修改上傳</button>
        </div>
        {message && (
          <div className="relative flex justify-center">
            <div className="absolute bottom-0 mx-auto bg-red-50 px-20 py-5 rounded-2xl" role="alert">{message}</div>
          </div>
        )}
      </div>
      <Outlet />
    </div>
  );
}
