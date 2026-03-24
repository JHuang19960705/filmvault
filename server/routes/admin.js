const router = require("express").Router();
const passport = require("passport");
const User = require("../models").user;
const Content = require("../models").content;

// 管理員驗證中間件
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).send("需要管理員權限。");
  }
  next();
};

// ────────────────────────────────────────────
// 設定第一位管理員（無需 JWT，使用 ADMIN_SECRET 密鑰）
// POST /api/admin/makeAdmin
// Body: { email, adminSecret }
// ────────────────────────────────────────────
router.post("/makeAdmin", async (req, res) => {
  const { email, adminSecret } = req.body;
  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(403).send("管理員密鑰錯誤。");
  }
  if (!email) {
    return res.status(400).send("請提供 email。");
  }
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).send("找不到此 email 的用戶。");
    return res.send({ message: `${user.username} 已成功設為管理員。`, user });
  } catch (e) {
    return res.status(500).send("設置失敗。");
  }
});

// ── 以下所有路由都需要 JWT + 管理員身份 ──
router.use(passport.authenticate("jwt", { session: false }), requireAdmin);

// ════════════════════════════════════════════
//  用戶管理
// ════════════════════════════════════════════

// 取得所有用戶（含 email、完整資料）
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).exec();
    return res.send(users);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 取得單一用戶完整資料
router.get("/users/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const user = await User.findOne({ _id }).exec();
    if (!user) return res.status(404).send("找不到用戶。");
    return res.send(user);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 修改任意用戶資料（username、email、role）
router.patch("/users/:_id", async (req, res) => {
  const { _id } = req.params;
  const { username, email, role } = req.body;
  const VALID_ROLES = ["free", "standard", "premium", "admin"];

  if (role !== undefined && !VALID_ROLES.includes(role)) {
    return res.status(400).send("無效的身分類型。");
  }

  const updateFields = {};
  if (username !== undefined) updateFields.username = username;
  if (email !== undefined) updateFields.email = email;
  if (role !== undefined) updateFields.role = role;

  try {
    const updated = await User.findOneAndUpdate(
      { _id },
      updateFields,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).send("找不到用戶。");
    return res.send({ message: "用戶資料已更新。", user: updated });
  } catch (e) {
    if (e.code === 11000) return res.status(409).send("此 email 已被其他帳號使用。");
    return res.status(500).send("更新失敗。");
  }
});

// 刪除任意用戶（不能刪除管理員自己）
router.delete("/users/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const user = await User.findOne({ _id }).exec();
    if (!user) return res.status(404).send("找不到用戶。");
    if (req.user._id.equals(_id)) {
      return res.status(403).send("不能刪除自己的帳號。");
    }
    await User.deleteOne({ _id });
    return res.send("用戶已刪除。");
  } catch (e) {
    return res.status(500).send(e);
  }
});

// ════════════════════════════════════════════
//  文章管理
// ════════════════════════════════════════════

// 取得所有文章（含作者資訊、評論數）
router.get("/content", async (req, res) => {
  try {
    const content = await Content.find({})
      .populate("writer", ["username", "email", "role"])
      .exec();
    return res.send(content);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 取得單一文章（含評論、作者）
router.get("/content/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const content = await Content.findOne({ _id })
      .populate("writer", ["username", "email", "role"])
      .populate("commenters.commenterId", ["username"])
      .exec();
    if (!content) return res.status(404).send("找不到文章。");
    return res.send(content);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 修改任意文章
router.patch("/content/:_id", async (req, res) => {
  const { _id } = req.params;
  const { title, content, tags } = req.body;

  if (title !== undefined && title.trim().length > 100) {
    return res.status(400).send("標題不能超過 100 個字。");
  }
  if (content !== undefined && content.trim().length > 5000) {
    return res.status(400).send("影評內容不能超過 5000 個字。");
  }

  const updateFields = {};
  if (title !== undefined) updateFields.title = title;
  if (content !== undefined) updateFields.content = content;
  if (tags !== undefined) updateFields.tags = tags;

  try {
    const updated = await Content.findOneAndUpdate(
      { _id },
      updateFields,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).send("找不到文章。");
    return res.send({ message: "文章已更新。", content: updated });
  } catch (e) {
    return res.status(500).send("更新失敗。");
  }
});

// 刪除任意文章
router.delete("/content/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const content = await Content.findOne({ _id }).exec();
    if (!content) return res.status(404).send("找不到文章。");
    await Content.deleteOne({ _id });
    return res.send("文章已刪除。");
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 刪除任意文章的任意評論
router.delete("/content/:contentId/comment/:commentId", async (req, res) => {
  const { contentId, commentId } = req.params;
  try {
    const content = await Content.findOne({ _id: contentId }).exec();
    if (!content) return res.status(404).send("找不到文章。");

    const comment = content.commenters.find(
      (c) => c._id.toString() === commentId
    );
    if (!comment) return res.status(404).send("找不到評論。");

    content.commenters.pull(comment);
    await content.save();
    return res.send({ message: "評論已刪除。" });
  } catch (e) {
    return res.status(500).send("刪除評論失敗。");
  }
});

module.exports = router;
