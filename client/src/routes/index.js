import { lazy } from "react";
import Layout from "../components/Layout";

// 懶載入所有頁面元件（Code Splitting）
const FirstEnroll       = lazy(() => import(/* webpackChunkName: "first-enroll" */         "../pages/first-enroll/FirstEnroll"));
const Register          = lazy(() => import(/* webpackChunkName: "register" */             "../pages/first-enroll/Register"));
const Login             = lazy(() => import(/* webpackChunkName: "login" */                "../pages/first-enroll/Login"));
const Homepage          = lazy(() => import(/* webpackChunkName: "homepage" */             "../pages/Homepage/Homepage"));
const PatchProfile      = lazy(() => import(/* webpackChunkName: "patch-profile" */        "../pages/Homepage/PatchProfile"));
const PatchRole         = lazy(() => import(/* webpackChunkName: "patch-role" */           "../pages/Homepage/PatchRole"));
const MockPayment       = lazy(() => import(/* webpackChunkName: "mock-payment" */         "../pages/Homepage/MockPayment"));
const AllUser           = lazy(() => import(/* webpackChunkName: "all-user" */             "../pages/all-user/AllUser"));
const ThisUser          = lazy(() => import(/* webpackChunkName: "this-user" */            "../pages/all-user/this-user/ThisUser"));
const UserReviews       = lazy(() => import(/* webpackChunkName: "user-reviews" */         "../pages/all-user/this-user/user-reviews/UserReviews"));
const UserReviewsComment= lazy(() => import(/* webpackChunkName: "user-reviews-comment" */ "../pages/all-user/this-user/user-reviews/UserReviewsComment"));
const UserRecommend     = lazy(() => import(/* webpackChunkName: "user-recommend" */       "../pages/all-user/this-user/user-recommend/UserRecommend"));
const UserTheater       = lazy(() => import(/* webpackChunkName: "user-theater" */         "../pages/all-user/this-user/user-theater/UserTheater"));
const Back              = lazy(() => import(/* webpackChunkName: "back" */                 "../pages/Back/Back"));
const YourReviews       = lazy(() => import(/* webpackChunkName: "your-reviews" */         "../pages/Back/your-reviews/YourReviews"));
const ReviewsComment    = lazy(() => import(/* webpackChunkName: "reviews-comment" */      "../pages/Back/your-reviews/ReviewsComment"));
const PatchYourReview   = lazy(() => import(/* webpackChunkName: "patch-your-review" */    "../pages/Back/your-reviews/PatchYourReview"));
const Recommend         = lazy(() => import(/* webpackChunkName: "recommend" */            "../pages/Back/Recommend/Recommend"));
const HandleSlide       = lazy(() => import(/* webpackChunkName: "handle-slide" */         "../pages/Back/Recommend/handle-slide/HandleSlide"));
const HandleCasts       = lazy(() => import(/* webpackChunkName: "handle-casts" */         "../pages/Back/Recommend/handle-casts/HandleCasts"));
const HandleReview      = lazy(() => import(/* webpackChunkName: "handle-review" */        "../pages/Back/Recommend/handle-review/HandleReview"));
const HandleTheme       = lazy(() => import(/* webpackChunkName: "handle-theme" */         "../pages/Back/Recommend/handle-theme/HandleTheme"));
const HandleFavorite    = lazy(() => import(/* webpackChunkName: "handle-favorite" */      "../pages/Back/Recommend/handle-favorite/HandleFavorite"));
const HandleTheater     = lazy(() => import(/* webpackChunkName: "handle-theater" */       "../pages/Back/Theater/HandleTheater"));
const ComingSoon        = lazy(() => import(/* webpackChunkName: "coming-soon" */          "../pages/Back/Theater/coming-soon/ComingSoon"));
const OnTime            = lazy(() => import(/* webpackChunkName: "on-time" */              "../pages/Back/Theater/on-time/OnTime"));
const LeavingSoon       = lazy(() => import(/* webpackChunkName: "leaving-soon" */         "../pages/Back/Theater/leaving-soon/LeavingSoon"));
const Search            = lazy(() => import(/* webpackChunkName: "search" */               "../pages/Search/Search"));
const SearchTV          = lazy(() => import(/* webpackChunkName: "search-tv" */            "../pages/Search/search-tv/SearchTV"));
const TVDetail          = lazy(() => import(/* webpackChunkName: "tv-detail" */            "../pages/Search/search-tv/TVDetail"));
const PostTVContent     = lazy(() => import(/* webpackChunkName: "post-tv-content" */      "../pages/Search/search-tv/PostTVContent"));
const SearchMovie       = lazy(() => import(/* webpackChunkName: "search-movie" */         "../pages/Search/search-movie/SearchMovie"));
const MovieDetail       = lazy(() => import(/* webpackChunkName: "movie-detail" */         "../pages/Search/search-movie/MovieDetail"));
const PostMovieContent  = lazy(() => import(/* webpackChunkName: "post-movie-content" */   "../pages/Search/search-movie/PostMovieContent"));
const Reviews           = lazy(() => import(/* webpackChunkName: "reviews" */              "../pages/Search/Reviews/Reviews"));
const Page404           = lazy(() => import(/* webpackChunkName: "page-404" */             "../components/Page404"));
const AdminDashboard    = lazy(() => import(/* webpackChunkName: "admin-dashboard" */      "../pages/admin/AdminDashboard"));

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
    path: "/first-enroll",
    Component: FirstEnroll,
    children: [
      { path: "register/:clickRole", Component: Register },
      { path: "login",               Component: Login },
    ],
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true,                       Component: Homepage,       protected: true },
      { path: "profile/patch-profile",     Component: PatchProfile,   protected: true },
      { path: "profile/patch-role",        Component: PatchRole,      protected: true },
      { path: "profile/mock-payment",      Component: MockPayment,    protected: true },
      {
        path: "all-user",
        Component: AllUser,
        protected: true,
        children: [
          {
            path: ":userId",
            Component: ThisUser,
            protected: true,
            children: [
              {
                path: "user-reviews",
                Component: UserReviews,
                children: [
                  { path: ":reviewId", Component: UserReviewsComment },
                ],
              },
              { path: "user-recommend", Component: UserRecommend },
              { path: "user-theater",   Component: UserTheater },
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
            path: "your-reviews",
            Component: YourReviews,
            children: [
              {
                path: ":reviewId",
                Component: PatchYourReview,
                children: [
                  { path: "reviews-comment", Component: ReviewsComment },
                ],
              },
            ],
          },
          {
            path: "your-recommend",
            Component: Recommend,
            children: [
              { path: "handle-slide",    Component: HandleSlide },
              { path: "handle-casts",    Component: HandleCasts },
              { path: "handle-review",   Component: HandleReview },
              { path: "handle-theme",    Component: HandleTheme },
              { path: "handle-favorite", Component: HandleFavorite },
            ],
          },
          {
            path: "your-theater",
            Component: HandleTheater,
            children: [
              { path: "on-time",      Component: OnTime },
              { path: "coming-soon",  Component: ComingSoon },
              { path: "leaving-soon", Component: LeavingSoon },
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
              { path: ":TMDBId",                    Component: TVDetail },
              { path: "post-tv-content/:TMDBId",    Component: PostTVContent },
              { path: "reviews/:TMDBId",            Component: Reviews },
            ],
          },
          {
            path: "movie",
            Component: SearchMovie,
            children: [
              { path: ":TMDBId",                    Component: MovieDetail },
              { path: "post-movie-content/:TMDBId", Component: PostMovieContent },
              { path: "reviews/:TMDBId",            Component: Reviews },
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
