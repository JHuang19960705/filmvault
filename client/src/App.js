import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";
import Loader from "./components/Loader";

// 懶載入所有頁面元件（Code Splitting）
const FirstEnroll = lazy(() => import(/* webpackChunkName: "first-enroll" */ "./pages/FirstEnroll/FirstEnroll"));
const RegisterComponent = lazy(() => import(/* webpackChunkName: "register" */ "./pages/FirstEnroll/Register/RegisterComponent"));
const LoginComponent = lazy(() => import(/* webpackChunkName: "login" */ "./pages/FirstEnroll/Login/LoginComponent"));
import Layout from "./components/Layout";
const Homepage = lazy(() => import(/* webpackChunkName: "homepage" */ "./pages/Homepage/Homepage"));
const PatchProfile = lazy(() => import(/* webpackChunkName: "patch-profile" */ "./pages/Homepage/PatchProfile/PatchProfile"));
const PatchRole = lazy(() => import(/* webpackChunkName: "patch-role" */ "./pages/Homepage/PatchRole/PatchRole"));
const MockPayment = lazy(() => import(/* webpackChunkName: "mock-payment" */ "./pages/Homepage/MockPayment/MockPayment"));
const AllUser = lazy(() => import(/* webpackChunkName: "all-user" */ "./pages/AllUser/AllUser"));
const ThisUser = lazy(() => import(/* webpackChunkName: "this-user" */ "./pages/AllUser/ThisUser/ThisUser"));
const UserReviews = lazy(() => import(/* webpackChunkName: "user-reviews" */ "./pages/AllUser/ThisUser/UserReviews/UserReviews"));
const UserReviewsComment = lazy(() => import(/* webpackChunkName: "user-reviews-comment" */ "./pages/AllUser/ThisUser/UserReviews/UserReviewsComment/UserReviewsComment"));
const UserRecommend = lazy(() => import(/* webpackChunkName: "user-recommend" */ "./pages/AllUser/ThisUser/UserRecommend/UserRecommend"));
const UserTheater = lazy(() => import(/* webpackChunkName: "user-theater" */ "./pages/AllUser/ThisUser/UserTheater/UserTheater"));
const Back = lazy(() => import(/* webpackChunkName: "back" */ "./pages/Back/Back"));
const YourReviews = lazy(() => import(/* webpackChunkName: "your-reviews" */ "./pages/Back/YourReviews/YourReviews"));
const ReviewsComment = lazy(() => import(/* webpackChunkName: "reviews-comment" */ "./pages/Back/YourReviews/ReviewsComment/ReviewsComment"));
const PatchYourReview = lazy(() => import(/* webpackChunkName: "patch-your-review" */ "./pages/Back/YourReviews/PatchYourReview/PatchYourReview"));
const Recommend = lazy(() => import(/* webpackChunkName: "recommend" */ "./pages/Back/Recommend/Recommend"));
const HandleSlide = lazy(() => import(/* webpackChunkName: "handle-slide" */ "./pages/Back/Recommend/HandleSlide/HandleSlide"));
const HandleCasts = lazy(() => import(/* webpackChunkName: "handle-casts" */ "./pages/Back/Recommend/HandleCasts/HandleCasts"));
const HandleReview = lazy(() => import(/* webpackChunkName: "handle-review" */ "./pages/Back/Recommend/HandleReview/HandleReview"));
const HandleTheme = lazy(() => import(/* webpackChunkName: "handle-theme" */ "./pages/Back/Recommend/HandleTheme/HandleTheme"));
const HandleFavorite = lazy(() => import(/* webpackChunkName: "handle-favorite" */ "./pages/Back/Recommend/HandleFavorite/HandleFavorite"));
const HandleTheater = lazy(() => import(/* webpackChunkName: "handle-theater" */ "./pages/Back/Theater/HandleTheater"));
const ComingSoon = lazy(() => import(/* webpackChunkName: "coming-soon" */ "./pages/Back/Theater/ComingSoon/ComingSoon"));
const OnTime = lazy(() => import(/* webpackChunkName: "on-time" */ "./pages/Back/Theater/OnTime/OnTime"));
const LeavingSoon = lazy(() => import(/* webpackChunkName: "leaving-soon" */ "./pages/Back/Theater/LeavingSoon/LeavingSoon"));
const Search = lazy(() => import(/* webpackChunkName: "search" */ "./pages/Search/Search"));
const SearchTV = lazy(() => import(/* webpackChunkName: "search-tv" */ "./pages/Search/SearchTV/SearchTV"));
const TVDetail = lazy(() => import(/* webpackChunkName: "tv-detail" */ "./pages/Search/SearchTV/TVDetail/TVDetail"));
const PostTVContent = lazy(() => import(/* webpackChunkName: "post-tv-content" */ "./pages/Search/SearchTV/PostTVContent/PostTVContent"));
const SearchMovie = lazy(() => import(/* webpackChunkName: "search-movie" */ "./pages/Search/SearchMovie/SearchMovie"));
const MovieDetail = lazy(() => import(/* webpackChunkName: "movie-detail" */ "./pages/Search/SearchMovie/MovieDetail/MovieDetail"));
const PostMovieContent = lazy(() => import(/* webpackChunkName: "post-movie-content" */ "./pages/Search/SearchMovie/PostMovieContent/PostMovieContent"));
const Reviews = lazy(() => import(/* webpackChunkName: "reviews" */ "./pages/Search/Reviews/Reviews"));
const Page404 = lazy(() => import(/* webpackChunkName: "page-404" */ "./components/Page404"));
const AdminDashboard = lazy(() => import(/* webpackChunkName: "admin-dashboard" */ "./pages/Admin/AdminDashboard"));

// 集中授權守衛：未登入直接導回首頁
function ProtectedRoute({ children, redirectTo = "/firstEnroll" }) {
  const { currentUser } = useUser();
  if (!currentUser) return <Navigate to={redirectTo} replace />;
  return children;
}

// 管理員守衛：未登入導回 firstEnroll，非 admin 導回首頁
function AdminRoute({ children }) {
  const { currentUser } = useUser();
  if (!currentUser) return <Navigate to="/firstEnroll" replace />;
  if (currentUser.user?.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <UserProvider>
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/firstEnroll" element={<FirstEnroll />}>
              <Route path="register/:clickRole" element={<RegisterComponent />} />
              <Route path="login" element={<LoginComponent />} />
            </Route>
            <Route path="/" element={<Layout />}>
              <Route index element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
              <Route path="profile/patchProfile" element={<ProtectedRoute><PatchProfile /></ProtectedRoute>} />
              <Route path="profile/patchRole" element={<ProtectedRoute><PatchRole /></ProtectedRoute>} />
              <Route path="profile/mockPayment" element={<ProtectedRoute><MockPayment /></ProtectedRoute>} />
              <Route path="allUser" element={<ProtectedRoute><AllUser /></ProtectedRoute>}>
                <Route path=":userId" element={<ProtectedRoute><ThisUser /></ProtectedRoute>}>
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
              <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="*" element={<Page404 />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </UserProvider>
  );
}
