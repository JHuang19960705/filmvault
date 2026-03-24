import React, { useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthService from "./services/auth.service";
import Loader from "./components/Loader";

// 懶載入所有頁面元件（Code Splitting）
const FirstEnroll = lazy(() => import("./pages/First-Enroll/FirstEnroll"));
const RegisterComponent = lazy(() => import("./pages/First-Enroll/Register/register-component"));
const LoginComponent = lazy(() => import("./pages/First-Enroll/Login/login-component"));
const Layout = lazy(() => import("./components/Layout"));
const Homepage = lazy(() => import("./pages/Homepage/Homepage"));
const PatchProfile = lazy(() => import("./pages/Homepage/PatchProfile/PatchProfile"));
const PatchRole = lazy(() => import("./pages/Homepage/patchRole/PatchRole"));
const MockPayment = lazy(() => import("./pages/Homepage/MockPayment/MockPayment"));
const AllUser = lazy(() => import("./pages/AllUser/AllUser"));
const ThisUser = lazy(() => import("./pages/AllUser/ThisUser/ThisUser"));
const UserReviews = lazy(() => import("./pages/AllUser/ThisUser/UserReviews/UserReviews"));
const UserReviewsComment = lazy(() => import("./pages/AllUser/ThisUser/UserReviews/UserReviewsComment/UserReviewsComment"));
const UserRecommend = lazy(() => import("./pages/AllUser/ThisUser/UserRecommend/UserRecommend"));
const UserTheater = lazy(() => import("./pages/AllUser/ThisUser/UserTheater/UserTheater"));
const Back = lazy(() => import("./pages/Back/Back"));
const YourReviews = lazy(() => import("./pages/Back/YourReviews/YourReviews"));
const ReviewsComment = lazy(() => import("./pages/Back/YourReviews/ReviewsComment/ReviewsComment"));
const PatchYourReview = lazy(() => import("./pages/Back/YourReviews/PatchYourReview/PatchYourReview"));
const Recommend = lazy(() => import("./pages/Back/Recommend/Recommend"));
const HandleSlide = lazy(() => import("./pages/Back/Recommend/HandleSlide/HandleSlide"));
const HandleCasts = lazy(() => import("./pages/Back/Recommend/HandleCasts/HandleCasts"));
const HandleReview = lazy(() => import("./pages/Back/Recommend/HandleReview/HandleReview"));
const HandleTheme = lazy(() => import("./pages/Back/Recommend/HandleTheme/HandleTheme"));
const HandleFavorite = lazy(() => import("./pages/Back/Recommend/HandleFavorite/HandleFavorite"));
const HandleTheater = lazy(() => import("./pages/Back/Theater/HandleTheater"));
const ComingSoon = lazy(() => import("./pages/Back/Theater/ComingSoon/ComingSoon"));
const OnTime = lazy(() => import("./pages/Back/Theater/OnTime/OnTime"));
const LeavingSoon = lazy(() => import("./pages/Back/Theater/LeavingSoon/LeavingSoon"));
const Search = lazy(() => import("./pages/Search/Search"));
const SearchTV = lazy(() => import("./pages/Search/SearchTV/SearchTV"));
const TVDetail = lazy(() => import("./pages/Search/SearchTV/TVDetail/TVDetail"));
const PostTVContent = lazy(() => import("./pages/Search/SearchTV/PostTVContent/PostTVContent"));
const SearchMovie = lazy(() => import("./pages/Search/SearchMovie/SearchMovie"));
const MovieDetail = lazy(() => import("./pages/Search/SearchMovie/MovieDetail/MovieDetail"));
const PostMovieContent = lazy(() => import("./pages/Search/SearchMovie/PostMovieContent/PostMovieContent"));
const Reviews = lazy(() => import("./pages/Search/Reviews/Reviews"));
const Page404 = lazy(() => import("./components/Page404"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));

// 集中授權守衛：未登入直接導回首頁
function ProtectedRoute({ currentUser, children }) {
  if (!currentUser) return <Navigate to="/firstEnroll" replace />;
  return children;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

  // 避免每個 Route 重複寫兩次 prop
  const userProps = { currentUser, setCurrentUser };

  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="firstEnroll" element={<FirstEnroll {...userProps} />}>
            <Route path="register/:clickRole" element={<RegisterComponent {...userProps} />} />
            <Route path="login" element={<LoginComponent {...userProps} />} />
          </Route>
          <Route path="/" element={<Layout />}>
            <Route index element={<ProtectedRoute currentUser={currentUser}><Homepage {...userProps} /></ProtectedRoute>} />
            <Route path="profile/patchProfile" element={<ProtectedRoute currentUser={currentUser}><PatchProfile {...userProps} /></ProtectedRoute>} />
            <Route path="profile/patchRole" element={<ProtectedRoute currentUser={currentUser}><PatchRole {...userProps} /></ProtectedRoute>} />
            <Route path="profile/mockPayment" element={<ProtectedRoute currentUser={currentUser}><MockPayment {...userProps} /></ProtectedRoute>} />
            <Route path="allUser" element={<ProtectedRoute currentUser={currentUser}><AllUser {...userProps} /></ProtectedRoute>}>
              <Route path=":userId" element={<ThisUser {...userProps} />}>
                <Route path="userReviews" element={<UserReviews {...userProps} />}>
                  <Route path=":reviewId" element={<UserReviewsComment {...userProps} />} />
                </Route>
                <Route path="userRecommend" element={<UserRecommend {...userProps} />} />
                <Route path="userTheater" element={<UserTheater {...userProps} />} />
              </Route>
            </Route>
            <Route path="back" element={<ProtectedRoute currentUser={currentUser}><Back {...userProps} /></ProtectedRoute>}>
              <Route path="yourReviews" element={<YourReviews {...userProps} />}>
                <Route path=":reviewId" element={<PatchYourReview {...userProps} />}>
                  <Route path="reviewsComment" element={<ReviewsComment {...userProps} />} />
                </Route>
              </Route>
              <Route path="yourRecommend" element={<Recommend {...userProps} />}>
                <Route path="handleSlide" element={<HandleSlide {...userProps} />} />
                <Route path="handleCasts" element={<HandleCasts {...userProps} />} />
                <Route path="handleReview" element={<HandleReview {...userProps} />} />
                <Route path="handleTheme" element={<HandleTheme {...userProps} />} />
                <Route path="handleFavorite" element={<HandleFavorite {...userProps} />} />
              </Route>
              <Route path="yourTheater" element={<HandleTheater {...userProps} />}>
                <Route path="onTime" element={<OnTime {...userProps} />} />
                <Route path="comingSoon" element={<ComingSoon {...userProps} />} />
                <Route path="leavingSoon" element={<LeavingSoon {...userProps} />} />
              </Route>
            </Route>
            <Route path="search" element={<Search {...userProps} />}>
              <Route path="tv" element={<SearchTV {...userProps} />}>
                <Route path=":TMDBId" element={<TVDetail {...userProps} />} />
                <Route path="postTVContent/:TMDBId" element={<PostTVContent {...userProps} />} />
                <Route path="reviews/:TMDBId" element={<Reviews {...userProps} />} />
              </Route>
              <Route path="movie" element={<SearchMovie {...userProps} />}>
                <Route path=":TMDBId" element={<MovieDetail {...userProps} />} />
                <Route path="postMovieContent/:TMDBId" element={<PostMovieContent {...userProps} />} />
                <Route path="reviews/:TMDBId" element={<Reviews {...userProps} />} />
              </Route>
            </Route>
            <Route path="admin" element={<ProtectedRoute currentUser={currentUser}><AdminDashboard {...userProps} /></ProtectedRoute>} />
            <Route path="*" element={<Page404 />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}
