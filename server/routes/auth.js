const router = require("express").Router();
const User = require("../models").user;
const jwt = require("jsonwebtoken");
const passport = require("passport");
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 10, // 同一 IP 在 15 分鐘內最多 10 次嘗試
  standardHeaders: true,
  legacyHeaders: false,
  message: "登入嘗試次數過多，請 15 分鐘後再試。",
  skipSuccessfulRequests: true, // 成功登入不計入次數
});

router.use((req, res, next) => {
  console.log("allowing access to a request about auth...");
  next();
})

// 登入
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const foundUser = await User.findOne({ email: req.body.email });

    if (!foundUser) {
      return res.status(401).send("此信箱未註冊。");
    }

    foundUser.comparePassword(req.body.password, (err, isMatch) => {
      if (err) return res.status(500).send("伺服器錯誤，請稍後再試。");

      if (isMatch) {
        // 製作 JSON Web Token
        const tokenObject = { _id: foundUser._id, email: foundUser.email };
        const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET, { expiresIn: "7d" });
        return res.send({
          token: "JWT " + token,
          user: {
            _id: foundUser._id,
            username: foundUser.username,
            email: foundUser.email,
            role: foundUser.role,
            date: foundUser.date,
            slide: foundUser.slide,
            slideImg: foundUser.slideImg,
            contentId: foundUser.contentId,
            cast: foundUser.cast,
            favoritePerson: foundUser.favoritePerson,
            theme: foundUser.theme,
            theater: foundUser.theater
          }
        });
      } else {
        return res.status(401).send("密碼錯誤。");
      }
    });
  } catch (error) {
    console.error("登入時發生錯誤:", error);
    return res.status(500).send("登入時發生錯誤，請稍後再試。");
  }
});

// 獲得系統中的所有會員（需要登入）
router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    let userFound = await User.find({}, { username: 1, role: 1, _id: 1, date: 1 })
      .exec();
    return res.send(userFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 透過Id拿到該會員基本資料（需要登入）
router.get("/getUserById/:userId", passport.authenticate("jwt", { session: false }), async (req, res) => {
  let { userId } = req.params;
  try {
    let userFound = await User.findOne({ _id: userId }, { username: 1, role: 1, _id: 1, date: 1 })
      .exec();
    return res.send(userFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 透過Id拿到該會員recommend資料（需要登入）
router.get("/getUserRecommendById/:userId", passport.authenticate("jwt", { session: false }), async (req, res) => {
  let { userId } = req.params;
  try {
    let userFound = await User.findOne({ _id: userId }, { slide: 1, cast: 1, favoritePerson: 1, theme: 1, _id: 1, contentId: 1, theater: 1 })
      .exec();
    return res.send(userFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 註冊
router.post("/register", async (req, res) => {
  let { email, username, password } = req.body;
  let newUser = new User({ email, username, password, role: "free" }); // 角色永遠從 free 開始，不接受前端傳入的 role

  try {
    await newUser.save();
    return res.send({ msg: "歡迎加入" });
  } catch (e) {
    res.status(500).send("無法儲存使用者...");
  }
})

// 修改名字、信箱
router.patch("/patchProfile/:_id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  // 身分確認後確認文章存在，再儲存新資料
  let { _id } = req.params;
  try {
    let profileFound = await User.findOne({ _id }).exec();
    if (!profileFound) {
      return res.status(400).send("找不到個資。無法刪除課程。");
    }

    if (req.user._id.equals(_id)) {
      const tokenObject = { _id: profileFound._id, email: profileFound.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET, { expiresIn: "7d" });
      // 只允許更新 username 和 email，防止大量賦值攻擊（mass assignment）覆蓋 role 等敏感欄位
      let updatedProfile = await User.findOneAndUpdate(
        { _id },
        { username: req.body.username, email: req.body.email },
        {
          new: true,
          runValidators: true,
        }
      );
      return res.send({
        message: "你的資料更新成功~",
        token: "JWT " + token,
        user: updatedProfile,
      });
    } else {
      return res.status(403).send("只有用戶本人才能修改資料。");
    }
  } catch (e) {
    return res.status(500).send("無法修改資料");
  };
})

// 修改身分（降級專用）
// ⚠️ 升級（standard / premium）需透過後台付款驗證流程，不允許用戶自行設定
router.patch("/patchRole/:_id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const VALID_ROLES = ["free", "standard", "premium"];
  const SELF_DOWNGRADE_ALLOWED = ["free"]; // 用戶只能自行降回 free，升級需管理員操作

  let { _id } = req.params;
  let { role } = req.body;

  // 1. 驗證傳入的 role 必須是合法值
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).send("無效的身分類型。");
  }

  try {
    let profileFound = await User.findOne({ _id }).exec();
    if (!profileFound) {
      return res.status(400).send("找不到個資。");
    }
    if (profileFound.role === role) {
      return res.status(400).send("與原本身分一致，無法更改");
    }

    if (!req.user._id.equals(_id)) {
      return res.status(403).send("只有用戶本人才能修改資料。");
    }

    // 2. 用戶本人只能降級回 free，不能自行升級為 standard / premium
    if (!SELF_DOWNGRADE_ALLOWED.includes(role)) {
      return res.status(403).send("升級方案需透過付款流程，無法自行變更。");
    }

    const tokenObject = { _id: profileFound._id, email: profileFound.email };
    const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET, { expiresIn: "7d" });
    let updatedProfile = await User.findOneAndUpdate(
      { _id },
      { role },
      { new: true, runValidators: true }
    );
    return res.send({
      message: "你的身分更新成功~",
      token: "JWT " + token,
      user: updatedProfile,
    });
  } catch (e) {
    return res.status(500).send("無法修改資料");
  };
})

// 刪除
router.delete("/:_id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  let { _id } = req.params;
  // 確認用戶存在
  try {
    let userFound = await User.findOne({ _id }).exec();
    if (!userFound) {
      return res.status(400).send("找不到User。無法刪除。");
    }
    // 只有本人才能刪除自己的帳號
    if (!req.user._id.equals(_id)) {
      return res.status(403).send("只有用戶本人才能刪除自己的帳號。");
    }
    await User.deleteOne({ _id }).exec();
    return res.send("刪除成功~");
  } catch (e) {
    return res.status(500).send(e);
  }
})

//放入幻燈片
router.patch("/patchSlide/:_id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  let { _id } = req.params;
  try {
    let profileFound = await User.findOne({ _id }).exec();
    if (!profileFound) {
      return res.status(400).send("找不到個資。無法放入幻燈片。");
    }

    if (req.user._id.equals(_id)) {
      const tokenObject = { _id: profileFound._id, email: profileFound.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET, { expiresIn: "7d" });
      // 只允許更新 slide 欄位，防止大量賦值攻擊
      let patchSlide = await User.findOneAndUpdate({ _id }, { slide: req.body.slide }, {
        new: true,
      });
      return res.send({
        message: "你的資料更新成功~",
        token: "JWT " + token,
        user: patchSlide,
      });
    } else {
      return res.status(403).send("只有用戶本人才能放入幻燈片。");
    }
  } catch (e) {
    return res.status(500).send("無法修改資料");
  };
})

//放入文章Id
router.patch("/patchReviews/:_id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  let { _id } = req.params;
  try {
    let profileFound = await User.findOne({ _id }).exec();
    if (!profileFound) {
      return res.status(400).send("找不到個資。無法放入幻燈片。");
    }

    if (req.user._id.equals(_id)) {
      const tokenObject = { _id: profileFound._id, email: profileFound.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET, { expiresIn: "7d" });
      // 只允許更新 contentId 欄位，防止大量賦值攻擊
      let patchReviews = await User.findOneAndUpdate({ _id }, { contentId: req.body.contentId }, {
        new: true,
        runValidators: true,
      });
      return res.send({
        message: "你的資料更新成功~",
        token: "JWT " + token,
        user: patchReviews,
      });
    } else {
      return res.status(403).send("只有用戶本人才能放入幻燈片。");
    }
  } catch (e) {
    return res.status(500).send("無法修改資料");
  };
})

//修改人物
router.patch("/patchCast/:_id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  let { _id } = req.params;
  try {
    let profileFound = await User.findOne({ _id }).exec();
    if (!profileFound) {
      return res.status(400).send("找不到個資。無法放入幻燈片。");
    }

    if (req.user._id.equals(_id)) {
      const tokenObject = { _id: profileFound._id, email: profileFound.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET, { expiresIn: "7d" });
      // 只允許更新 cast 欄位，防止大量賦值攻擊
      let patchCast = await User.findOneAndUpdate(
        { _id },
        { cast: req.body.cast },
        { new: true, runValidators: true },
      );
      return res.send({
        message: "你的資料更新成功~",
        token: "JWT " + token,
        user: patchCast,
      });
    } else {
      return res.status(403).send("只有用戶本人才能放入幻燈片。");
    }
  } catch (e) {
    return res.status(500).send("無法修改資料");
  };
})

//修改人物主題
router.patch("/patchFavoritePerson/:_id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  let { _id } = req.params;
  try {
    let profileFound = await User.findOne({ _id }).exec();
    if (!profileFound) {
      return res.status(400).send("找不到個資。無法放入幻燈片。");
    }

    if (req.user._id.equals(_id)) {
      const tokenObject = { _id: profileFound._id, email: profileFound.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET, { expiresIn: "7d" });
      // 只允許更新 favoritePerson 欄位，防止大量賦值攻擊
      let patchFavoritePerson = await User.findOneAndUpdate(
        { _id },
        { favoritePerson: req.body.favoritePerson },
        { new: true, runValidators: true },
      );
      return res.send({
        message: "你的資料更新成功~",
        token: "JWT " + token,
        user: patchFavoritePerson,
      });
    } else {
      return res.status(403).send("只有用戶本人才能放入幻燈片。");
    }
  } catch (e) {
    return res.status(500).send("無法修改資料");
  };
})

//修改主題
router.patch("/patchTheme/:_id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  let { _id } = req.params;
  try {
    let profileFound = await User.findOne({ _id }).exec();
    if (!profileFound) {
      return res.status(400).send("找不到個資。無法放入幻燈片。");
    }

    if (req.user._id.equals(_id)) {
      const tokenObject = { _id: profileFound._id, email: profileFound.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET, { expiresIn: "7d" });
      // 只允許更新 theme 欄位，防止大量賦值攻擊
      let patchTheme = await User.findOneAndUpdate(
        { _id },
        { theme: req.body.theme },
        { new: true, runValidators: true },
      );
      return res.send({
        message: "你的資料更新成功~",
        token: "JWT " + token,
        user: patchTheme,
      });
    } else {
      return res.status(403).send("只有用戶本人才能放入幻燈片。");
    }
  } catch (e) {
    return res.status(500).send("無法修改資料");
  };
})

//放入電影院
// 更新 releases 屬性
router.patch("/patchTheater/releases/:_id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { _id } = req.params;
  try {
    const profileFound = await User.findOne({ _id }).exec();
    if (!profileFound) {
      return res.status(400).send("找不到個資。無法放入幻燈片。");
    }

    if (req.user._id.equals(_id)) {
      const tokenObject = { _id: profileFound._id, email: profileFound.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET, { expiresIn: "7d" });

      let updateFields = {};
      if (req.body.releases !== undefined) { // 檢查 releases 是否為 undefined
        updateFields['theater.releases'] = req.body.releases;
      } else {
        return res.status(400).send("前端資料為null。");
      }

      let patchTheater = await User.findOneAndUpdate(
        { _id },
        { $set: updateFields },
        { new: true, runValidators: true },
      );

      return res.send({
        message: "保存成功",
        token: "JWT " + token,
        user: patchTheater,
      });
    } else {
      return res.status(403).send("只有用戶本人才能放入幻燈片。");
    }
  } catch (e) {
    return res.status(500).send("無法修改資料");
  };
});

// 更新 leaving 屬性
router.patch("/patchTheater/leaving/:_id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { _id } = req.params;
  try {
    const profileFound = await User.findOne({ _id }).exec();
    if (!profileFound) {
      return res.status(400).send("找不到個資。無法放入幻燈片。");
    }

    if (req.user._id.equals(_id)) {
      const tokenObject = { _id: profileFound._id, email: profileFound.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET, { expiresIn: "7d" });

      let updateFields = {};
      if (req.body.leaving !== undefined) {
        updateFields['theater.leaving'] = req.body.leaving;
      } else {
        return res.status(400).send("前端資料為null。");
      }

      let patchTheater = await User.findOneAndUpdate(
        { _id },
        { $set: updateFields },
        { new: true, runValidators: true },
      );

      return res.send({
        message: "保存成功",
        token: "JWT " + token,
        user: patchTheater,
      });
    } else {
      return res.status(403).send("只有用戶本人才能放入幻燈片。");
    }
  } catch (e) {
    return res.status(500).send("無法修改資料");
  };
});

// 更新 upcoming 屬性
router.patch("/patchTheater/upcoming/:_id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { _id } = req.params;
  try {
    const profileFound = await User.findOne({ _id }).exec();
    if (!profileFound) {
      return res.status(400).send("找不到個資。無法放入幻燈片。");
    }

    if (req.user._id.equals(_id)) {
      const tokenObject = { _id: profileFound._id, email: profileFound.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET, { expiresIn: "7d" });

      let updateFields = {};
      if (req.body.upcoming !== undefined) {
        updateFields['theater.upcoming'] = req.body.upcoming;
      } else {
        return res.status(400).send("前端資料為null。");
      }

      let patchTheater = await User.findOneAndUpdate(
        { _id },
        { $set: updateFields },
        { new: true, runValidators: true },
      );

      return res.send({
        message: "保存成功",
        token: "JWT " + token,
        user: patchTheater,
      });
    } else {
      return res.status(403).send("只有用戶本人才能放入幻燈片。");
    }
  } catch (e) {
    return res.status(500).send("無法修改資料");
  };
});

// 假金流升級身分（模擬付款驗證）
router.post("/mockPayment/:_id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const UPGRADABLE_ROLES = ["standard", "premium"];
  const { _id } = req.params;
  const { targetRole, cardNumber, cardHolder, expiry, cvv } = req.body;

  // 1. 驗證目標身分必須是可升級的方案
  if (!UPGRADABLE_ROLES.includes(targetRole)) {
    return res.status(400).send("無效的升級方案。");
  }

  // 2. 只有本人才能為自己付款
  if (!req.user._id.equals(_id)) {
    return res.status(403).send("無法為他人付款。");
  }

  // 3. 模擬基本卡號格式驗證（去掉空格後必須是 16 位數字）
  const rawCard = (cardNumber || "").replace(/\s/g, "");
  if (!/^\d{16}$/.test(rawCard)) {
    return res.status(400).send("卡號格式錯誤，請輸入 16 位數字。");
  }
  if (!cardHolder || cardHolder.trim().length < 2) {
    return res.status(400).send("請填寫持卡人姓名。");
  }
  if (!/^\d{2}\/\d{2}$/.test(expiry || "")) {
    return res.status(400).send("到期日格式錯誤，請輸入 MM/YY。");
  }
  if (!/^\d{3}$/.test(cvv || "")) {
    return res.status(400).send("CVV 格式錯誤，請輸入 3 位數字。");
  }

  try {
    let profileFound = await User.findOne({ _id }).exec();
    if (!profileFound) {
      return res.status(400).send("找不到用戶。");
    }
    if (profileFound.role === targetRole) {
      return res.status(400).send("您已經是此方案，無需重複購買。");
    }

    // 模擬付款成功，升級角色
    const updatedProfile = await User.findOneAndUpdate(
      { _id },
      { role: targetRole },
      { new: true, runValidators: true }
    );

    const tokenObject = { _id: updatedProfile._id, email: updatedProfile.email };
    const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET, { expiresIn: "7d" });

    return res.send({
      message: `付款成功！已升級為 ${targetRole} 方案。`,
      token: "JWT " + token,
      user: updatedProfile,
    });
  } catch (e) {
    return res.status(500).send("付款處理失敗，請稍後再試。");
  }
});

module.exports = router;