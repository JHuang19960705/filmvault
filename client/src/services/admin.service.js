import axios from "axios";
const API_URL = process.env.REACT_APP_API_BASE_URL + "/api/admin";

class AdminService {
  _token() {
    return localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).token
      : "";
  }

  _headers() {
    return { Authorization: this._token() };
  }

  // ── 設定第一位管理員（需 ADMIN_SECRET 密鑰） ──
  makeAdmin(email, adminSecret) {
    return axios.post(API_URL + "/makeAdmin", { email, adminSecret });
  }

  // ════════════════════════════════════════════
  //  用戶管理
  // ════════════════════════════════════════════

  // 取得所有用戶（完整資料）
  getAllUsers() {
    return axios.get(API_URL + "/users", { headers: this._headers() });
  }

  // 取得單一用戶
  getUserById(_id) {
    return axios.get(API_URL + "/users/" + _id, { headers: this._headers() });
  }

  // 修改任意用戶（username、email、role）
  patchUser(_id, fields) {
    return axios.patch(API_URL + "/users/" + _id, fields, {
      headers: this._headers(),
    });
  }

  // 刪除任意用戶
  deleteUser(_id) {
    return axios.delete(API_URL + "/users/" + _id, {
      headers: this._headers(),
    });
  }

  // ════════════════════════════════════════════
  //  文章管理
  // ════════════════════════════════════════════

  // 取得所有文章
  getAllContent() {
    return axios.get(API_URL + "/content", { headers: this._headers() });
  }

  // 取得單一文章（含評論）
  getContentById(_id) {
    return axios.get(API_URL + "/content/" + _id, {
      headers: this._headers(),
    });
  }

  // 修改任意文章
  patchContent(_id, fields) {
    return axios.patch(API_URL + "/content/" + _id, fields, {
      headers: this._headers(),
    });
  }

  // 刪除任意文章
  deleteContent(_id) {
    return axios.delete(API_URL + "/content/" + _id, {
      headers: this._headers(),
    });
  }

  // 刪除任意評論
  deleteComment(contentId, commentId) {
    return axios.delete(
      `${API_URL}/content/${contentId}/comment/${commentId}`,
      { headers: this._headers() }
    );
  }
}

export default new AdminService();
