# 影視評論網站 | TMDB Movie Review App

一個整合 TMDB API 的影視評論平台，支援使用者註冊、登入、收藏電影、撰寫影評等功能。

## 功能特色

- 瀏覽熱門電影、劇集資訊（串接 TMDB API）
- 使用者註冊 / 登入（JWT 驗證）
- 收藏電影 / 影集
- 撰寫、編輯、刪除影評
- 管理員後台
- 深色 / 淺色主題切換

## 技術架構

| 前端 | 後端 |
|------|------|
| React 18 | Node.js + Express |
| React Router v6 | MongoDB + Mongoose |
| TanStack Query | Passport JWT |
| Styled Components | bcrypt |
| Tailwind CSS | Express Rate Limit |

## 安裝與啟動

### 前置需求
- Node.js 18+
- MongoDB（本地或 Atlas）
- TMDB API Key（[申請連結](https://www.themoviedb.org/settings/api)）

### 啟動後端

```bash
cd server
npm install
# 複製 .env.example 為 .env 並填入設定
cp .env.example .env
npm start
```

### 啟動前端

```bash
cd client
npm install
# 複製 .env.example 為 .env 並填入設定
cp .env.example .env
npm start
```

## 環境變數

請參考 `client/.env.example` 和 `server/.env.example`。

## 專案結構

```
practice-TMDB/
├── client/          # React 前端
│   └── src/
│       ├── pages/   # 頁面元件
│       ├── services/# API 呼叫層
│       ├── context/ # 全域狀態
│       └── styles/  # CSS 樣式
└── server/          # Express 後端
    ├── routes/      # API 路由
    ├── models/      # MongoDB 資料模型
    └── config/      # 設定檔（Passport 等）
```
