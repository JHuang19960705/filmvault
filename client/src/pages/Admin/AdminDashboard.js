import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminService from "../../services/admin.service";
import UserNav from "../../components/UserNav";
import { useUser } from "../../context/UserContext";

// ──────────────────────────────────────────────────────────
//  角色顏色 badge
// ──────────────────────────────────────────────────────────
const roleBadge = (role) => {
  const map = {
    admin: "bg-red-100 text-red-600",
    premium: "bg-yellow-100 text-yellow-600",
    standard: "bg-blue-100 text-blue-600",
    free: "bg-gray-100 text-gray-500",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
        map[role] || "bg-gray-100 text-gray-500"
      }`}
    >
      {role}
    </span>
  );
};

// ──────────────────────────────────────────────────────────
//  Modal 通用容器
// ──────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
//  編輯用戶 Modal
// ──────────────────────────────────────────────────────────
function EditUserModal({ user, onClose, onSave }) {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");
    try {
      await AdminService.patchUser(user._id, { username, email, role });
      onSave();
      onClose();
    } catch (e) {
      setError(e.response?.data || "更新失敗");
    }
  };

  return (
    <Modal title={`編輯用戶：${user.username}`} onClose={onClose}>
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">用戶名</label>
          <input
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Email</label>
          <input
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">身分</label>
          <select
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="free">free</option>
            <option value="standard">standard</option>
            <option value="premium">premium</option>
            <option value="admin">admin</option>
          </select>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-2 justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border dark:border-gray-600 dark:text-gray-300"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            儲存
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ──────────────────────────────────────────────────────────
//  編輯文章 Modal
// ──────────────────────────────────────────────────────────
function EditContentModal({ content, onClose, onSave }) {
  const [title, setTitle] = useState(content.title);
  const [body, setBody] = useState(content.content);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");
    try {
      await AdminService.patchContent(content._id, { title, content: body });
      onSave();
      onClose();
    } catch (e) {
      setError(e.response?.data || "更新失敗");
    }
  };

  return (
    <Modal title={`編輯文章：${content.title}`} onClose={onClose}>
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">標題</label>
          <input
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">內容</label>
          <textarea
            rows={8}
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-2 justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border dark:border-gray-600 dark:text-gray-300"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            儲存
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ──────────────────────────────────────────────────────────
//  查看文章詳細 / 評論管理 Modal
// ──────────────────────────────────────────────────────────
function ContentDetailModal({ contentId, onClose, onChanged }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = () => {
    setLoading(true);
    AdminService.getContentById(contentId)
      .then((res) => {
        setDetail(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetail();
  }, [contentId]);

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("確定要刪除這則評論？")) return;
    try {
      await AdminService.deleteComment(contentId, commentId);
      fetchDetail();
      onChanged();
    } catch (e) {
      alert(e.response?.data || "刪除失敗");
    }
  };

  return (
    <Modal title="文章詳細 & 評論管理" onClose={onClose}>
      {loading && <p className="text-gray-500">載入中...</p>}
      {detail && (
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">標題</p>
            <p className="font-semibold dark:text-white">{detail.title}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">作者</p>
            <p className="text-sm dark:text-gray-300">
              {detail.writer?.username}{" "}
              <span className="text-gray-400">({detail.writer?.email})</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">內容</p>
            <p className="text-sm dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 rounded p-3 max-h-40 overflow-y-auto">
              {detail.content}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-2">
              評論（{detail.commenters?.length || 0} 則）
            </p>
            {(!detail.commenters || detail.commenters.length === 0) && (
              <p className="text-sm text-gray-400">尚無評論</p>
            )}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {detail.commenters?.map((c) => (
                <div
                  key={c._id}
                  className="flex items-start justify-between bg-gray-50 dark:bg-gray-900 rounded p-3"
                >
                  <div className="flex-1 pr-2">
                    <p className="text-xs text-blue-500 font-medium mb-1">
                      {c.commenterId?.username || "已刪除用戶"}
                    </p>
                    <p className="text-sm dark:text-gray-300">{c.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {c.date?.slice(0, 10)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteComment(c._id)}
                    className="flex-shrink-0 text-xs text-red-500 hover:text-red-700 border border-red-300 rounded px-2 py-1"
                  >
                    刪除
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ──────────────────────────────────────────────────────────
//  設定管理員 Modal
// ──────────────────────────────────────────────────────────
function SetupAdminModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setMsg("");
    setError("");
    try {
      const res = await AdminService.makeAdmin(email, secret);
      setMsg(res.data.message);
    } catch (e) {
      setError(e.response?.data || "設置失敗");
    }
  };

  return (
    <Modal title="設定管理員帳號" onClose={onClose}>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        輸入要設為管理員的帳號 Email，以及 .env 中的 <code>ADMIN_SECRET</code> 密鑰。
      </p>
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Email</label>
          <input
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">ADMIN_SECRET 密鑰</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="輸入密鑰"
          />
        </div>
        {msg && <p className="text-green-600 text-sm">{msg}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-2 justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border dark:border-gray-600 dark:text-gray-300"
          >
            關閉
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            設為管理員
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ══════════════════════════════════════════════════════════
//  主 Dashboard
// ══════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [tab, setTab] = useState("users"); // "users" | "content"

  // 用戶管理狀態
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [userSearch, setUserSearch] = useState("");

  // 文章管理狀態
  const [contents, setContents] = useState([]);
  const [contentsLoading, setContentsLoading] = useState(true);
  const [editContent, setEditContent] = useState(null);
  const [detailContentId, setDetailContentId] = useState(null);
  const [contentSearch, setContentSearch] = useState("");

  // 共用
  const [showSetupModal, setShowSetupModal] = useState(false);

  // ── 權限守衛 ──
  useEffect(() => {
    if (!currentUser) return navigate("/firstEnroll");
    if (currentUser.user.role !== "admin") return navigate("/");
  }, [currentUser]);

  // ── 載入資料 ──
  useEffect(() => {
    fetchUsers();
    fetchContents();
  }, []);

  const fetchUsers = () => {
    setUsersLoading(true);
    AdminService.getAllUsers()
      .then((res) => { setUsers(res.data); setUsersLoading(false); })
      .catch(() => setUsersLoading(false));
  };

  const fetchContents = () => {
    setContentsLoading(true);
    AdminService.getAllContent()
      .then((res) => { setContents(res.data); setContentsLoading(false); })
      .catch(() => setContentsLoading(false));
  };

  // ── 刪除用戶 ──
  const handleDeleteUser = async (user) => {
    if (!window.confirm(`確定要刪除用戶「${user.username}」？此操作無法復原。`)) return;
    try {
      await AdminService.deleteUser(user._id);
      fetchUsers();
    } catch (e) {
      alert(e.response?.data || "刪除失敗");
    }
  };

  // ── 刪除文章 ──
  const handleDeleteContent = async (content) => {
    if (!window.confirm(`確定要刪除文章「${content.title}」？此操作無法復原。`)) return;
    try {
      await AdminService.deleteContent(content._id);
      fetchContents();
    } catch (e) {
      alert(e.response?.data || "刪除失敗");
    }
  };

  // ── 篩選 ──
  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredContents = contents.filter(
    (c) =>
      c.title?.toLowerCase().includes(contentSearch.toLowerCase()) ||
      c.writer?.username?.toLowerCase().includes(contentSearch.toLowerCase())
  );

  // ──────────────────────────────────────────────────────
  //  Render
  // ──────────────────────────────────────────────────────
  return (
    <div className="flex h-full flex-grow flex-col overflow-hidden">
      {/* ── 頂部導覽 ── */}
      <div className="flex justify-between w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center pl-5 gap-4">
          {/* 標題 */}
          <span className="text-red-500 font-bold text-lg flex items-center gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            管理後台
          </span>
          {/* Tab 切換 */}
          <div className="flex h-full">
            <button
              onClick={() => setTab("users")}
              className={`px-4 h-full text-sm border-b-2 transition-colors ${
                tab === "users"
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              用戶管理
            </button>
            <button
              onClick={() => setTab("content")}
              className={`px-4 h-full text-sm border-b-2 transition-colors ${
                tab === "content"
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              文章管理
            </button>
          </div>
        </div>
        {/* 右上：設定管理員 + UserNav */}
        <div className="flex items-center gap-3 pr-4">
          <button
            onClick={() => setShowSetupModal(true)}
            className="text-xs text-red-500 border border-red-300 rounded px-3 py-1 hover:bg-red-50 dark:hover:bg-red-900"
          >
            設定管理員
          </button>
          <UserNav />
        </div>
      </div>

      {/* ── 主內容 ── */}
      <div className="flex-grow overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
        {/* ═══════════════════ 用戶管理 ═══════════════════ */}
        {tab === "users" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold dark:text-white">
                用戶管理
                <span className="ml-2 text-sm font-normal text-gray-400">
                  共 {users.length} 位
                </span>
              </h1>
              <input
                className="border rounded px-3 py-1.5 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white w-48"
                placeholder="搜尋名稱 / email / 身分"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>

            {usersLoading && (
              <p className="text-gray-400 text-center py-10">載入中...</p>
            )}

            {!usersLoading && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                {/* 桌面版表格 */}
                <table className="hidden md:table w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">用戶名</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">身分</th>
                      <th className="px-4 py-3 text-left">影評數</th>
                      <th className="px-4 py-3 text-left">加入日期</th>
                      <th className="px-4 py-3 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-700">
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                        <td className="px-4 py-3 font-medium dark:text-white">{u.username}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.email}</td>
                        <td className="px-4 py-3">{roleBadge(u.role)}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                          {u.contentId?.length || 0}
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                          {u.date?.slice(0, 10)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setEditUser(u)}
                              className="text-xs text-blue-500 border border-blue-300 rounded px-2 py-1 hover:bg-blue-50 dark:hover:bg-blue-900"
                            >
                              編輯
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="text-xs text-red-500 border border-red-300 rounded px-2 py-1 hover:bg-red-50 dark:hover:bg-red-900"
                            >
                              刪除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* 手機版卡片 */}
                <div className="md:hidden divide-y dark:divide-gray-700">
                  {filteredUsers.map((u) => (
                    <div key={u._id} className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium dark:text-white">{u.username}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                        {roleBadge(u.role)}
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>影評 {u.contentId?.length || 0} 篇</span>
                        <span>{u.date?.slice(0, 10)}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditUser(u)}
                          className="flex-1 text-xs text-blue-500 border border-blue-300 rounded py-1 hover:bg-blue-50"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="flex-1 text-xs text-red-500 border border-red-300 rounded py-1 hover:bg-red-50"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredUsers.length === 0 && (
                  <p className="text-center text-gray-400 py-10">查無符合的用戶</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════ 文章管理 ═══════════════════ */}
        {tab === "content" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold dark:text-white">
                文章管理
                <span className="ml-2 text-sm font-normal text-gray-400">
                  共 {contents.length} 篇
                </span>
              </h1>
              <input
                className="border rounded px-3 py-1.5 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white w-48"
                placeholder="搜尋標題 / 作者"
                value={contentSearch}
                onChange={(e) => setContentSearch(e.target.value)}
              />
            </div>

            {contentsLoading && (
              <p className="text-gray-400 text-center py-10">載入中...</p>
            )}

            {!contentsLoading && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                {/* 桌面版表格 */}
                <table className="hidden md:table w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">標題</th>
                      <th className="px-4 py-3 text-left">作者</th>
                      <th className="px-4 py-3 text-left">讚</th>
                      <th className="px-4 py-3 text-left">評論</th>
                      <th className="px-4 py-3 text-left">發文日期</th>
                      <th className="px-4 py-3 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-700">
                    {filteredContents.map((c) => (
                      <tr key={c._id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                        <td className="px-4 py-3 max-w-xs">
                          <p className="font-medium dark:text-white truncate">{c.title}</p>
                          {c.tags?.length > 0 && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate">
                              {c.tags.join(", ")}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                          <p>{c.writer?.username}</p>
                          {roleBadge(c.writer?.role)}
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                          {c.like?.length || 0}
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                          {c.commenters?.length || 0}
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                          {c.date?.slice(0, 10)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setDetailContentId(c._id)}
                              className="text-xs text-green-600 border border-green-300 rounded px-2 py-1 hover:bg-green-50 dark:hover:bg-green-900"
                            >
                              詳細
                            </button>
                            <button
                              onClick={() => setEditContent(c)}
                              className="text-xs text-blue-500 border border-blue-300 rounded px-2 py-1 hover:bg-blue-50 dark:hover:bg-blue-900"
                            >
                              編輯
                            </button>
                            <button
                              onClick={() => handleDeleteContent(c)}
                              className="text-xs text-red-500 border border-red-300 rounded px-2 py-1 hover:bg-red-50 dark:hover:bg-red-900"
                            >
                              刪除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* 手機版卡片 */}
                <div className="md:hidden divide-y dark:divide-gray-700">
                  {filteredContents.map((c) => (
                    <div key={c._id} className="p-4 space-y-2">
                      <p className="font-medium dark:text-white">{c.title}</p>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>作者：{c.writer?.username}</span>
                        <span>{c.date?.slice(0, 10)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>讚 {c.like?.length || 0}</span>
                        <span>評論 {c.commenters?.length || 0}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDetailContentId(c._id)}
                          className="flex-1 text-xs text-green-600 border border-green-300 rounded py-1"
                        >
                          詳細
                        </button>
                        <button
                          onClick={() => setEditContent(c)}
                          className="flex-1 text-xs text-blue-500 border border-blue-300 rounded py-1"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleDeleteContent(c)}
                          className="flex-1 text-xs text-red-500 border border-red-300 rounded py-1"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredContents.length === 0 && (
                  <p className="text-center text-gray-400 py-10">查無符合的文章</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={fetchUsers}
        />
      )}
      {editContent && (
        <EditContentModal
          content={editContent}
          onClose={() => setEditContent(null)}
          onSave={fetchContents}
        />
      )}
      {detailContentId && (
        <ContentDetailModal
          contentId={detailContentId}
          onClose={() => setDetailContentId(null)}
          onChanged={fetchContents}
        />
      )}
      {showSetupModal && (
        <SetupAdminModal onClose={() => setShowSetupModal(false)} />
      )}
    </div>
  );
}
