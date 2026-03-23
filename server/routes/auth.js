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

// 獲得系統中的所有會員
router.get("/", async (req, res) => {
  try {
    let userFound = await User.find({}, { username: 1, email: 1, role: 1, _id: 1, date: 1 })
      .exec();
    return res.send(userFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 透過Id拿到該會員基本資料
router.get("/getUserById/:userId", async (req, res) => {
  let { userId } = req.params;
  try {
    let userFound = await User.findOne({ _id: userId }, { username: 1, email: 1, role: 1, _id: 1, date: 1 })
      .exec();
    return res.send(userFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 透過Id拿到該會員recommend資料
router.get("/getUserRecommendById/:userId", async (req, res) => {
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
    let savedUser = await newUser.save();
    return res.send({
      msg: "歡迎加入",
      savedUser,
    })
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
      let updatedProfile = await User.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
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

// 修改身分
router.patch("/patchRole/:_id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  // 身分確認後確認文章存在，再儲存新資料
  // 新身分不能跟舊身分一致
  let { _id } = req.params;
  let { role } = req.body;
  try {
    let profileFound = await User.findOne({ _id }).exec();
    if (!profileFound) {
      return res.status(400).send("找不到個資。無法刪除課程。");
    }
    if (profileFound.role === role) {
      return res.status(400).send("與原本身分一致，無法更改");
    }

    if (req.user._id.equals(_id)) {
      const tokenObject = { _id: profileFound._id, email: profileFound.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET, { expiresIn: "7d" });
      let updatedProfile = await User.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res.send({
        message: "你的身分更新成功~",
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
      let patchSlide = await User.findOneAndUpdate({ _id }, req.body, {
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
      let patchReviews = await User.findOneAndUpdate({ _id }, req.body, {
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
      let patchCast = await User.findOneAndUpdate(
        { _id },
        req.body,
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
      let patchFavoritePerson = await User.findOneAndUpdate(
        { _id },
        req.body,
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
      let patchTheme = await User.findOneAndUpdate(
        { _id },
        req.body,
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

module.exports = router;