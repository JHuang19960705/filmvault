import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";
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
function ProtectedRoute({ children }) {
  const { currentUser } = useUser();
  if (!currentUser) return <Navigate to="/firstEnroll" replace />;
  return children;
}

export default function App() {
  return (
    <UserProvider>
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="firstEnroll" element={<FirstEnroll />}>
              <Route path="register/:clickRole" element={<RegisterComponent />} />
              <Route path="login" element={<LoginComponent />} />
            </Route>
            <Route path="/" element={<Layout />}>
              <Route index element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
              <Route path="profile/patchProfile" element={<ProtectedRoute><PatchProfile /></ProtectedRoute>} />
              <Route path="profile/patchRole" element={<ProtectedRoute><PatchRole /></ProtectedRoute>} />
              <Route path="profile/mockPayment" element={<ProtectedRoute><MockPayment /></ProtectedRoute>} />
              <Route path="allUser" element={<ProtectedRoute><AllUser /></ProtectedRoute>}>
                <Route path=":userId" element={<ThisUser />}>
                  <Route path="userReviews" element={<UserReviews />}>
                    <Route path=":reviewId" element={<UserReviewsComment />} />
                  </Route>
                  <Route path="userRecommend" element={<UserRecommend />} />
                  <Route path="userTheater" element={<UserTheater />} />
                </Route>
              </Route>
              <Route path="back" element={<ProtectedRoute><Back /></ProtectedRoute>}>
                <Route path="yourReviews" element={<YourReviews />}>
                  <Route path=":reviewId" element={<PatchYourReview />}>
                    <Route path="reviewsComment" element={<ReviewsComment />} />
                  </Route>
                </Route>
                <Route path="yourRecommend" element={<Recommend />}>
                  <Route path="handleSlide" element={<HandleSlide />} />
                  <Route path="handleCasts" element={<HandleCasts />} />
                  <Route path="handleReview" element={<HandleReview />} />
                  <Route path="handleTheme" element={<HandleTheme />} />
                  <Route path="handleFavorite" element={<HandleFavorite />} />
                </Route>
                <Route path="yourTheater" element={<HandleTheater />}>
                  <Route path="onTime" element={<OnTime />} />
                  <Route path="comingSoon" element={<ComingSoon />} />
                  <Route path="leavingSoon" element={<LeavingSoon />} />
                </Route>
              </Route>
              <Route path="search" element={<Search />}>
                <Route path="tv" element={<SearchTV />}>
                  <Route path=":TMDBId" element={<TVDetail />} />
                  <Route path="postTVContent/:TMDBId" element={<PostTVContent />} />
                  <Route path="reviews/:TMDBId" element={<Reviews />} />
                </Route>
                <Route path="movie" element={<SearchMovie />}>
                  <Route path=":TMDBId" element={<MovieDetail />} />
                  <Route path="postMovieContent/:TMDBId" element={<PostMovieContent />} />
                  <Route path="reviews/:TMDBId" element={<Reviews />} />
                </Route>
              </Route>
              <Route path="admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="*" element={<Page404 />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </UserProvider>
  );
}
