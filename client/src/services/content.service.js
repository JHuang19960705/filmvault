import axios from "axios";
const API_URL = "http://localhost:3999/api/content";
// const API_URL = "https://practice-tmdb-server.vercel.app/api/content";

class ContentService {
  //發文
  post(title, content, tags, TMDBId, TMDBImg) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL,
      { title, content, tags, TMDBId, TMDBImg },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // 刪文
  delete(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.delete(API_URL + "/" + _id,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // 改文
  patch(_id, title, content, tags) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.patch(
      API_URL + "/" + _id,
      { title, content, tags },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // 以TMDBId，找到所有影評
  getReviewsByTMDBId(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/findByTMDBId/" + _id,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // 以影評Id，找到影評
  getReviewByReviewId(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/findByContentId/" + _id,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // 以用戶id，找到影評
  getReviewByUserId(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(API_URL + "/writer/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }

  // 按讚
  patchLike(contentId) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.patch(
      API_URL + "/clickLike/" + contentId,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // 獲取評論
  getComments(_id) {
    let token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : "";
    return axios.get(API_URL + "/findByContentId/" + _id,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // 添加評論
  postComment(contentId, commentContent) {
    let token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : "";
    return axios.post(
      API_URL + "/addComment/" + contentId,
      { content: commentContent },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // 刪除評論
  deleteComment(contentId, commentId) {
    let token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : "";
    return axios.delete(
      `${API_URL}/deleteComment/${contentId}/${commentId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

}

export default new ContentService();
