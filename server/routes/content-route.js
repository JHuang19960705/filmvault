const router = require("express").Router();
const mongoose = require('mongoose');
const Content = require("../models").content;
const User = require("../models").user;
const jwt = require("jsonwebtoken");

router.use("/", (req, res, next) => {
  next();
});

router.get("/test", (req, res) => {
  return res.send("...");
});

// 發文
router.post("/", async (req, res) => {
  if (req.user.isFree()) {
    return res.status(400).send("只有加入會員才可以發文唷~");
  }
  // 身分確認後儲存
  let { title, content, tags, TMDBId, TMDBImg } = req.body;
  try {
    let newContent = new Content({
      title,
      content,
      tags,
      TMDBId,
      TMDBImg,
      writer: req.user._id,
    });
    let savedContent = await newContent.save();
    return res.send({
      message: "新文章已經保存",
      savedContent
    });
  } catch (e) {
    return res.status(500).send("無法新增內容");
  };
});

// 改文
router.patch("/:_id", async (req, res) => {
  if (req.user.isFree()) {
    return res.status(400).send("只有加入會員才可以發文唷~");
  }
  // 身分確認後確認文章存在，再儲存新資料
  let { _id } = req.params;
  try {
    let contentFound = await Content.findOne({ _id }).exec();
    if (!contentFound) {
      return res.status(400).send("找不到文章。無法修改文章。");
    }

    if (contentFound.writer.equals(req.user._id)) {
      let updatedContent = await Content.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res.send({
        message: "課程更新成功~",
        updatedContent
      });
    } else {
      return res.status(403).send("只有此文章的用戶才能刪除課程。");
    }
  } catch (e) {
    return res.status(500).send("無法修改內容");
  };
});

// 刪文
router.delete("/:_id", async (req, res) => {
  if (req.user.isFree()) {
    return res.status(400).send("只有加入會員才可以發文唷~");
  }
  let { _id } = req.params;
  // 確認文章存在
  try {
    let contentFound = await Content.findOne({ _id }).exec();
    if (!contentFound) {
      return res.status(400).send("找不到課程。無法刪除課程。");
    }

    // 使用者必須是此課程講師，才能刪除課程
    if (contentFound.writer.equals(req.user._id)) {
      await Content.deleteOne({ _id }).exec();
      return res.send("課程刪除成功~");
    } else {
      return res.status(403).send("只有此課程的講師才能刪除課程。");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 獲得系統中的所有發文
router.get("/", async (req, res) => {
  try {
    let contentFound = await Content.find({})
      .populate(
        "writer",
        ["username", "email"]
      )
      .exec();
    return res.send(contentFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用作者Id找發文
router.get("/writer/:_writer_id", async (req, res) => {
  let { _writer_id } = req.params;
  let contentFound = await Content.find({ writer: _writer_id })
    .populate("writer", ["username", "email"])
    .exec();
  return res.send(contentFound);
});

// 用標題尋找文章
router.get("/findByContentTitle/:title", async (req, res) => {
  let { title } = req.params;
  try {
    let contentFound = await Content.find({ title: title })
      .populate("writer", ["email", "username"])
      .exec();
    return res.send(contentFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用TMDBId尋找文章
router.get("/findByTMDBId/:TMDBId", async (req, res) => {
  let { TMDBId } = req.params;
  try {
    let TMDBIdFound = await Content.find({ TMDBId: TMDBId })
      .populate("writer", ["email", "username", "role"])
      .exec();
    return res.send(TMDBIdFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用文章ID尋找文章
router.get("/findByContentId/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let contentFound = await Content.find({ _id: _id })
      .populate("writer", ["email", "username", "role"])
      .populate("commenters.commenterId", ["username"])
      .exec();
    return res.send(contentFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 按讚
router.patch("/clickLike/:contentId", async (req, res) => {
  let { contentId } = req.params;
  let commenterId = req.user._id; // 從 JWT 取得真實身份，不信任前端傳來的值
  try {
    // 檢查用戶是否已經按過讚
    let content = await Content.findById(contentId).exec();
    if (!content) {
      return res.status(404).send("找不到文章，無法按讚。");
    }
    if (content.like.includes(commenterId)) {
      // 如果已經按過讚，則刪除該用戶的讚
      let ContentLikes = await Content.findByIdAndUpdate(contentId, { $pull: { like: commenterId } }, { new: true, runValidators: true }).exec();
      return res.send({
        message: "取消讚成功～",
        content: ContentLikes
      });
    } else {
      // 沒有按過讚，則新增用戶的讚
      let ContentLikes = await Content.findByIdAndUpdate(contentId, { $push: { like: commenterId } }, { new: true, runValidators: true }).exec();
      return res.send({
        message: "按讚成功～",
        content: ContentLikes,
      });
    }
  } catch (e) {
    return res.status(500).send("無法按讚");
  };
});




// 新增評論
router.post("/addComment/:contentId", async (req, res) => {
  let { contentId } = req.params;
  let { content } = req.body;
  let commenterId = req.user._id; // 從 JWT 取得真實身份，不信任前端傳來的值
  try {

    // 確認用戶存在
    let profileFound = await User.findOne({ _id: commenterId }).exec();
    if (!profileFound) {
      return res.status(400).send("找不到用戶資訊，無法進行評論。");
    }

    // 確認文章存在
    let contentFound = await Content.findById(contentId).exec();
    if (!contentFound) {
      return res.status(400).send("找不到文章，無法進行評論。");
    }

    console.log(contentFound.commenters);

    // 存儲評論到資料庫
    contentFound.commenters.push({ commenterId, content });
    await contentFound.save();
    return res.send({
      message: "按讚成功～",
      content: contentFound.commenters[contentFound.commenters.length - 1]
    });
  } catch (e) {
    return res.status(500).send("評論失敗＠＠");
  }
});

// 刪除評論
router.delete("/deleteComment/:contentId/:commentId", async (req, res) => {
  const { contentId, commentId } = req.params;
  const requesterId = req.user._id; // 從 JWT 取得真實身份，不信任前端傳來的 body
  try {
    // 確認影評存在，並拿到內容，如果錯就跳error
    let contentFound = await Content.findOne({ _id: contentId }).exec();

    // 找到評論並删除
    const commentToDelete = contentFound.commenters.find(comment => comment._id == commentId);
    if (!commentToDelete) {
      return res.status(404).send("找不到評論，無法刪除。");
    }

    // 評論作者本人，或文章作者（版主），才能刪除評論
    const isCommentAuthor = commentToDelete.commenterId.equals(requesterId);
    const isContentAuthor = contentFound.writer.equals(requesterId);

    if (!isCommentAuthor && !isContentAuthor) {
      return res.status(403).send("只有評論作者或文章作者才能刪除評論。");
    }

    // 找到評論後直接删除
    contentFound.commenters.pull(commentToDelete);

    // 保存更新後的文章
    await contentFound.save();
    return res.send({ message: "評論刪除成功" });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).send("找不到這篇影評。");
    }
    console.error(error);
    return res.status(500).send("刪除評論失敗＠＠");
  }
});






module.exports = router;