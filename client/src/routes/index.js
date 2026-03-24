import { lazy } from "react";
import Layout from "../components/Layout";

// 懶載入所有頁面元件（Code Splitting）
const FirstEnroll       = lazy(() => import(/* webpackChunkName: "first-enroll" */         "../pages/FirstEnroll/FirstEnroll"));
const RegisterComponent = lazy(() => import(/* webpackChunkName: "register" */             "../pages/FirstEnroll/Register/RegisterComponent"));
const LoginComponent    = lazy(() => import(/* webpackChunkName: "login" */                "../pages/FirstEnroll/Login/LoginComponent"));
const Homepage          = lazy(() => import(/* webpackChunkName: "homepage" */             "../pages/Homepage/Homepage"));
const PatchProfile      = lazy(() => import(/* webpackChunkName: "patch-profile" */        "../pages/Homepage/PatchProfile/PatchProfile"));
const PatchRole         = lazy(() => import(/* webpackChunkName: "patch-role" */           "../pages/Homepage/PatchRole/PatchRole"));
const MockPayment       = lazy(() => import(/* webpackChunkName: "mock-payment" */         "../pages/Homepage/MockPayment/MockPayment"));
const AllUser           = lazy(() => import(/* webpackChunkName: "all-user" */             "../pages/AllUser/AllUser"));
const ThisUser          = lazy(() => import(/* webpackChunkName: "this-user" */            "../pages/AllUser/ThisUser/ThisUser"));
const UserReviews       = lazy(() => import(/* webpackChunkName: "user-reviews" */         "../pages/AllUser/ThisUser/UserReviews/UserReviews"));
const UserReviewsComment= lazy(() => import(/* webpackChunkName: "user-reviews-comment" */ "../pages/AllUser/ThisUser/UserReviews/UserReviewsComment/UserReviewsComment"));
const UserRecommend     = lazy(() => import(/* webpackChunkName: "user-recommend" */       "../pages/AllUser/ThisUser/UserRecommend/UserRecommend"));
const UserTheater       = lazy(() => import(/* webpackChunkName: "user-theater" */         "../pages/AllUser/ThisUser/UserTheater/UserTheater"));
const Back              = lazy(() => import(/* webpackChunkName: "back" */                 "../pages/Back/Back"));
const YourReviews       = lazy(() => import(/* webpackChunkName: "your-reviews" */         "../pages/Back/YourReviews/YourReviews"));
const ReviewsComment    = lazy(() => import(/* webpackChunkName: "reviews-comment" */      "../pages/Back/YourReviews/ReviewsComment/ReviewsComment"));
const PatchYourReview   = lazy(() => import(/* webpackChunkName: "patch-your-review" */    "../pages/Back/YourReviews/PatchYourReview/PatchYourReview"));
const Recommend         = lazy(() => import(/* webpackChunkName: "recommend" */            "../pages/Back/Recommend/Recommend"));
const HandleSlide       = lazy(() => import(/* webpackChunkName: "handle-slide" */         "../pages/Back/Recommend/HandleSlide/HandleSlide"));
const HandleCasts       = lazy(() => import(/* webpackChunkName: "handle-casts" */         "../pages/Back/Recommend/HandleCasts/HandleCasts"));
const HandleReview      = lazy(() => import(/* webpackChunkName: "handle-review" */        "../pages/Back/Recommend/HandleReview/HandleReview"));
const HandleTheme       = lazy(() => import(/* webpackChunkName: "handle-theme" */         "../pages/Back/Recommend/HandleTheme/HandleTheme"));
const HandleFavorite    = lazy(() => import(/* webpackChunkName: "handle-favorite" */      "../pages/Back/Recommend/HandleFavorite/HandleFavorite"));
const HandleTheater     = lazy(() => import(/* webpackChunkName: "handle-theater" */       "../pages/Back/Theater/HandleTheater"));
const ComingSoon        = lazy(() => import(/* webpackChunkName: "coming-soon" */          "../pages/Back/Theater/ComingSoon/ComingSoon"));
const OnTime            = lazy(() => import(/* webpackChunkName: "on-time" */              "../pages/Back/Theater/OnTime/OnTime"));
const LeavingSoon       = lazy(() => import(/* webpackChunkName: "leaving-soon" */         "../pages/Back/Theater/LeavingSoon/LeavingSoon"));
const Search            = lazy(() => import(/* webpackChunkName: "search" */               "../pages/Search/Search"));
const SearchTV          = lazy(() => import(/* webpackChunkName: "search-tv" */            "../pages/Search/SearchTV/SearchTV"));
const TVDetail          = lazy(() => import(/* webpackChunkName: "tv-detail" */            "../pages/Search/SearchTV/TVDetail/TVDetail"));
const PostTVContent     = lazy(() => import(/* webpackChunkName: "post-tv-content" */      "../pages/Search/SearchTV/PostTVContent/PostTVContent"));
const SearchMovie       = lazy(() => import(/* webpackChunkName: "search-movie" */         "../pages/Search/SearchMovie/SearchMovie"));
const MovieDetail       = lazy(() => import(/* webpackChunkName: "movie-detail" */         "../pages/Search/SearchMovie/MovieDetail/MovieDetail"));
const PostMovieContent  = lazy(() => import(/* webpackChunkName: "post-movie-content" */   "../pages/Search/SearchMovie/PostMovieContent/PostMovieContent"));
const Reviews           = lazy(() => import(/* webpackChunkName: "reviews" */              "../pages/Search/Reviews/Reviews"));
const Page404           = lazy(() => import(/* webpackChunkName: "page-404" */             "../components/Page404"));
const AdminDashboard    = lazy(() => import(/* webpackChunkName: "admin-dashboard" */      "../pages/Admin/AdminDashboard"));

/**
 * Route Config（Route Config Pattern）
 *
 * 欄位說明：
 *   path       - 路由路徑（省略時搭配 index: true 代表 index route）
 *   index      - true 表示 index route
 *   Component  - 要渲染的 lazy/元件
 *   protected  - true → 以 ProtectedRoute 包裹
 *   admin      - true → 以 AdminRoute 包裹
 *   children   - 子路由（遞迴相同結構）
 */
const routeConfig = [
  {
    path: "/firstEnroll",
    Component: FirstEnroll,
    children: [
      { path: "register/:clickRole", Component: RegisterComponent },
      { path: "login",               Component: LoginComponent },
    ],
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true,                      Component: Homepage,       protected: true },
      { path: "profile/patchProfile",     Component: PatchProfile,   protected: true },
      { path: "profile/patchRole",        Component: PatchRole,      protected: true },
      { path: "profile/mockPayment",      Component: MockPayment,    protected: true },
      {
        path: "allUser",
        Component: AllUser,
        protected: true,
        children: [
          {
            path: ":userId",
            Component: ThisUser,
            protected: true,
            children: [
              {
                path: "userReviews",
                Component: UserReviews,
                children: [
                  { path: ":reviewId", Component: UserReviewsComment },
                ],
              },
              { path: "userRecommend", Component: UserRecommend },
              { path: "userTheater",   Component: UserTheater },
            ],
          },
        ],
      },
      {
        path: "back",
        Component: Back,
        protected: true,
        children: [
          {
            path: "yourReviews",
            Component: YourReviews,
            children: [
              {
                path: ":reviewId",
                Component: PatchYourReview,
                children: [
                  { path: "reviewsComment", Component: ReviewsComment },
                ],
              },
            ],
          },
          {
            path: "yourRecommend",
            Component: Recommend,
            children: [
              { path: "handleSlide",    Component: HandleSlide },
              { path: "handleCasts",    Component: HandleCasts },
              { path: "handleReview",   Component: HandleReview },
              { path: "handleTheme",    Component: HandleTheme },
              { path: "handleFavorite", Component: HandleFavorite },
            ],
          },
          {
            path: "yourTheater",
            Component: HandleTheater,
            children: [
              { path: "onTime",      Component: OnTime },
              { path: "comingSoon",  Component: ComingSoon },
              { path: "leavingSoon", Component: LeavingSoon },
            ],
          },
        ],
      },
      {
        path: "search",
        Component: Search,
        children: [
          {
            path: "tv",
            Component: SearchTV,
            children: [
              { path: ":TMDBId",                Component: TVDetail },
              { path: "postTVContent/:TMDBId",  Component: PostTVContent },
              { path: "reviews/:TMDBId",         Component: Reviews },
            ],
          },
          {
            path: "movie",
            Component: SearchMovie,
            children: [
              { path: ":TMDBId",                   Component: MovieDetail },
              { path: "postMovieContent/:TMDBId",   Component: PostMovieContent },
              { path: "reviews/:TMDBId",             Component: Reviews },
            ],
          },
        ],
      },
      { path: "admin", Component: AdminDashboard, admin: true },
      { path: "*",     Component: Page404 },
    ],
  },
];

export default routeConfig;
