import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";
import Loader from "./components/Loader";
import routeConfig from "./routes";

// 集中授權守衛：未登入直接導回首頁
function ProtectedRoute({ children, redirectTo = "/first-enroll" }) {
  const { currentUser } = useUser();
  if (!currentUser) return <Navigate to={redirectTo} replace />;
  return children;
}

// 管理員守衛：未登入導回 first-enroll，非 admin 導回首頁
function AdminRoute({ children }) {
  const { currentUser } = useUser();
  if (!currentUser) return <Navigate to="/first-enroll" replace />;
  if (currentUser.user?.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

// 遞迴將 routeConfig 轉成 <Route> JSX
function renderRoutes(routes) {
  return routes.map((route, i) => {
    const { Component, protected: isProtected, admin: isAdmin, children, ...rest } = route;

    let element = Component ? <Component /> : null;
    if (isAdmin)      element = <AdminRoute>{element}</AdminRoute>;
    else if (isProtected) element = <ProtectedRoute>{element}</ProtectedRoute>;

    return (
      <Route key={i} {...rest} element={element}>
        {children && renderRoutes(children)}
      </Route>
    );
  });
}

export default function App() {
  return (
    <UserProvider>
      <Router>
        {/* 外層 Suspense：殼層尚未渲染時（如 FirstEnroll）顯示全螢幕 Loader */}
        {/* Layout 內部的頁面切換由 Layout.js 裡的 <Suspense> 接手，只更新內容區 */}
        <Suspense fallback={<Loader />}>
          <Routes>
            {renderRoutes(routeConfig)}
          </Routes>
        </Suspense>
      </Router>
    </UserProvider>
  );
}
