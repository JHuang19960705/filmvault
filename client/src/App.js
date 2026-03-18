import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthService from "./services/auth.service";
import FirstEnroll from "./pages/First-Enroll/FirstEnroll";
import RegisterComponent from "./pages/First-Enroll/Register/register-component";
import LoginComponent from "./pages/First-Enroll/Login/login-component";
import Layout from "./components/Layout";
import Homepage from "./pages/Homepage/Homepage";
import PatchProfile from "./pages/Homepage/PatchProfile/PatchProfile";
import PatchRole from "./pages/Homepage/patchRole/PatchRole";
import AllUser from "./pages/AllUser/AllUser";
import ThisUser from "./pages/AllUser/ThisUser/ThisUser";
import UserReviews from "./pages/AllUser/ThisUser/UserReviews/UserReviews";
import UserReviewsComment from "./pages/AllUser/ThisUser/UserReviews/UserReviewsComment/UserReviewsComment";
import UserRecommend from "./pages/AllUser/ThisUser/UserRecommend/UserRecommend";
import UserTheater from "./pages/AllUser/ThisUser/UserTheater/UserTheater";
import Back from "./pages/Back/Back";
import YourReviews from "./pages/Back/YourReviews/YourReviews";
import ReviewsComment from "./pages/Back/YourReviews/ReviewsComment/ReviewsComment";
import PatchYourReview from "./pages/Back/YourReviews/PatchYourReview/PatchYourReview";
import Recommend from "./pages/Back/Recommend/Recommend";
import HandleSlide from "./pages/Back/Recommend/HandleSlide/HandleSlide";
import HandleCasts from "./pages/Back/Recommend/HandleCasts/HandleCasts";
import HandleReview from "./pages/Back/Recommend/HandleReview/HandleReview";
import HandleTheme from "./pages/Back/Recommend/HandleTheme/HandleTheme";
import HandleFavorite from "./pages/Back/Recommend/HandleFavorite/HandleFavorite";
import HandleTheater from "./pages/Back/Theater/HandleTheater";
import ComingSoon from "./pages/Back/Theater/ComingSoon/ComingSoon";
import OnTime from "./pages/Back/Theater/OnTime/OnTime";
import LeavingSoon from "./pages/Back/Theater/LeavingSoon/LeavingSoon";
import Search from "./pages/Search/Search";
import SearchTV from "./pages/Search/SearchTV/SearchTV";
import TVDetail from "./pages/Search/SearchTV/TVDetail/TVDetail";
import PostTVContent from "./pages/Search/SearchTV/PostTVContent/PostTVContent";
import SearchMovie from "./pages/Search/SearchMovie/SearchMovie";
import MovieDetail from "./pages/Search/SearchMovie/MovieDetail/MovieDetail";
import PostMovieContent from "./pages/Search/SearchMovie/PostMovieContent/PostMovieContent";
import Reviews from "./pages/Search/Reviews/Reviews";
import Page404 from "./components/Page404";

export default function App() {
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

  return (
    <Router>
      <Routes>
        <Route path="firstEnroll" element={<FirstEnroll currentUser={currentUser} setCurrentUser={setCurrentUser} />}>
          <Route path="register/:clickRole" element={<RegisterComponent currentUser={currentUser} setCurrentUser={setCurrentUser} />}></Route>
          <Route path="login" element={<LoginComponent currentUser={currentUser} setCurrentUser={setCurrentUser} />}></Route>
        </Route>
        <Route path="/" element={<Layout currentUser={currentUser} setCurrentUser={setCurrentUser} />}>
          <Route index element={<Homepage currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          <Route path="profile/patchProfile" element={<PatchProfile currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          <Route path="profile/patchRole" element={<PatchRole currentUser={currentUser} setCurrentUser={setCurrentUser} />}></Route>
          <Route path="allUser" element={<AllUser currentUser={currentUser} setCurrentUser={setCurrentUser} />}>
            <Route path=":userId" element={<ThisUser currentUser={currentUser} setCurrentUser={setCurrentUser} />}>
              <Route path="userReviews" element={<UserReviews currentUser={currentUser} setCurrentUser={setCurrentUser} />}>
                <Route path=":reviewId" element={<UserReviewsComment currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
              </Route>
              <Route path="userRecommend" element={<UserRecommend currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
              <Route path="userTheater" element={<UserTheater currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
            </Route>
          </Route>
          <Route path="back" element={<Back currentUser={currentUser} setCurrentUser={setCurrentUser} />}>
            <Route path="yourReviews" element={<YourReviews currentUser={currentUser} setCurrentUser={setCurrentUser} />}>
              <Route path=":reviewId" element={<PatchYourReview currentUser={currentUser} setCurrentUser={setCurrentUser} />}>
                <Route path="reviewsComment" element={<ReviewsComment currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
              </Route>
            </Route>
            <Route path="yourRecommend" element={<Recommend currentUser={currentUser} setCurrentUser={setCurrentUser} />}>
              <Route path="handleSlide" element={<HandleSlide currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
              <Route path="handleCasts" element={<HandleCasts currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
              <Route path="handleReview" element={<HandleReview currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
              <Route path="handleTheme" element={<HandleTheme currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
              <Route path="handleFavorite" element={<HandleFavorite currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
            </Route>
            <Route path="yourTheater" element={<HandleTheater currentUser={currentUser} setCurrentUser={setCurrentUser} />}>
              <Route path="onTime" element={<OnTime currentUser={currentUser} setCurrentUser={setCurrentUser} />}></Route>
              <Route path="comingSoon" element={<ComingSoon currentUser={currentUser} setCurrentUser={setCurrentUser} />}></Route>
              <Route path="leavingSoon" element={<LeavingSoon currentUser={currentUser} setCurrentUser={setCurrentUser} />}></Route>
            </Route>
          </Route>
          <Route path="search" element={<Search currentUser={currentUser} setCurrentUser={setCurrentUser} />}>
            <Route path="TV" element={<SearchTV currentUser={currentUser} setCurrentUser={setCurrentUser} />} >
              <Route path=":TMDBId" element={<TVDetail currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
              <Route path="postTVContent/:TMDBId" element={<PostTVContent currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
              <Route path="reviews/:TMDBId" element={<Reviews currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
            </Route>
            <Route path="Movie" element={<SearchMovie currentUser={currentUser} setCurrentUser={setCurrentUser} />} >
              <Route path=":TMDBId" element={<MovieDetail currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
              <Route path="postMovieContent/:TMDBId" element={<PostMovieContent currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
              <Route path="reviews/:TMDBId" element={<Reviews currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
            </Route>
          </Route>
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </Router>
  );
}