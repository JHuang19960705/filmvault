import axios from "axios";
const API_URL = "http://localhost:3999/api/user";
// const API_URL = "https://practice-tmdb-server.vercel.app/api/user";

class AuthService {
  // 登入
  async login(email, password) {
    try {
      const response = await axios.post(API_URL + "/login", { email, password });
      return response;
    } catch (error) {
      throw new Error(error.response.data);
    }
  }

  // 登出
  logout() {
    localStorage.removeItem("user");
  }

  // 註冊
  register(username, email, password, role) {
    return axios.post(API_URL + "/register", { username, email, password, role });
  }

  // 拿到所有會員
  getAllUser() {
    let token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : "";
    return axios.get(API_URL + "/", { headers: { Authorization: token } });
  }

  // 透過Id拿到該會員
  getUserById(_id) {
    let token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : "";
    return axios.get(API_URL + "/getUserById/" + _id, { headers: { Authorization: token } });
  }

  // 透過Id拿到該會員recommend資料
  getUserRecommendById(_id) {
    let token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : "";
    return axios.get(API_URL + "/getUserRecommendById/" + _id, { headers: { Authorization: token } });
  }

  // 改個資
  patchProfile(_id, username, email) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.patch(
      API_URL + "/patchProfile/" + _id,
      { username, email },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // 改身分
  patchRole(_id, role) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.patch(
      API_URL + "/patchRole/" + _id,
      { role },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // 改slide
  patchSlide(_id, slide) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.patch(
      API_URL + "/patchSlide/" + _id,
      { slide },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // 改評論
  patchReviews(_id, contentId) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.patch(
      API_URL + "/patchReviews/" + _id,
      { contentId },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // 改卡司
  patchCast(_id, cast) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.patch(
      API_URL + "/patchCast/" + _id,
      { cast },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // 改人物
  patchFavoritePerson(_id, favoritePerson) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.patch(
      API_URL + "/patchFavoritePerson/" + _id,
      { favoritePerson },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // 改主題
  patchTheme(_id, theme) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.patch(
      API_URL + "/patchTheme/" + _id,
      { theme },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // 放電影院
  // 更新 releases 屬性
  patchTheaterReleases(_id, releases) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.patch(
      API_URL + "/patchTheater/releases/" + _id,
      { releases },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // 更新 upcoming 屬性
  patchTheaterUpcoming(_id, upcoming) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.patch(
      API_URL + "/patchTheater/upcoming/" + _id,
      { upcoming },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // 更新 leaving 屬性
  patchTheaterLeaving(_id, leaving) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.patch(
      API_URL + "/patchTheater/leaving/" + _id,
      { leaving },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  //拿到登入後的會員
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  //刪除用戶
  deleteUser(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.delete(API_URL + "/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }
}

export default new AuthService();