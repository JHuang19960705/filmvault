import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../../services/auth.service";
import Theme from "./Theme/Theme";
import ChangeTheme from "./ChangeTheme/ChangeTheme";

export default function HandleTheme({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();
  const [theme, setTheme] = useState([]);
  const [newThemeId, setNewThemeId] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setTheme(currentUser.user.theme)
    }
  }, [currentUser])

  // 打開主題選擇對話框
  const handleOpenChange = () => {
    setIsOpen(true)
  }

  // 關閉主題選擇對話框
  const handleCloseChange = () => {
    setIsOpen(false)
  }

  // 檢查是否已經選擇了相同的主題
  const checkIfDouble = (id) => {
    if (theme[0]) {
      if (!theme.includes(id)) {
        // 如果沒有選擇相同的主題，則將主題添加到列表中
        setTheme([...theme, id]);
        setIsOpen(false)
      } else {
        // 如果已經選擇相同的主題，則顯示警告訊息
        window.alert(`已經有${id}囉~`)
        setIsOpen(false)
      }
    } else {
      // 如果尚未選擇主題，則添加主題到列表中
      setTheme([...theme, id]);
      setIsOpen(false)
    }
  }

  // 刪除主題
  const deleteTheme = (id) => {
    setTheme(theme.filter(t => t !== id))
  }

  // 更新主題到後端
  const patchTheme = async (updatedTheme) => {
    try {
      let response = await AuthService.patchTheme(currentUser.user._id, updatedTheme)
      window.alert("主題修改成功~");
      localStorage.setItem("user", JSON.stringify(response.data));
      // 更新當前使用者資訊
      setCurrentUser(AuthService.getCurrentUser());
      // 重新整理
      navigate(0);
    } catch (e) {
      console.error(e);
    };
  }

  // 定義主題類型和 ID 的列表
  const genres = [
    { "id": "10759", "name": "動作片" },
    { "id": "16", "name": "動畫片" },
    { "id": "35", "name": "喜劇片" },
    { "id": "80", "name": "犯罪片" },
    { "id": "99", "name": "紀錄片" },
    { "id": "18", "name": "戲劇片" },
    { "id": "10751", "name": "闔家片" },
    { "id": "10762", "name": "兒童片" },
    { "id": "9648", "name": "懸疑片" },
    { "id": "10765", "name": "科幻片" }
  ]

  return (
    <div>
      <div className="sticky left-0 top-0 z-10">
        <div className="dark:bg-gray-800 flex w-full flex-col items-center rounded-b-3xl bg-white p-3 shadow">
          {/* 如果尚未選擇主題，則顯示提示訊息 */}
          {!theme[0] && <div className="text-center">你還沒選擇推薦的主題唷~<br />▼快來選▼</div>}
          {/* 如果已選擇主題，則顯示確定按鈕 */}
          {theme[0] && <button onClick={() => { patchTheme(theme) }} className="mb-5 border border-blue-500 px-3 text-blue-500">確定</button>}
          <div className="flex flex-wrap justify-center max-h-24 overflow-y-auto">
            {theme && genres &&
              theme.map((t) => {
                return (
                  <div key={t}>
                    {genres.map((g) => {
                      if (g.id === t) {
                        return (
                          <div key={g.id} className="mb-3 mr-3 rounded-md bg-gray-200 dark:bg-gray-950 px-4 py-1 w-24 flex cursor-default items-center justify-between">
                            {/* 顯示選擇的主題，並提供刪除按鈕 */}
                            <span className="w-16 truncate">{g.name}</span>
                            <svg onClick={() => { deleteTheme(g.id) }} xmlns="http://www.w3.org/2000/svg" className="ml-2 h-full w-4 transform cursor-pointer text-gray-600 dark:text-gray-100 transition duration-300 hover:scale-150 hover:text-blue-700 active:scale-50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </div>
                        )
                      }
                    })}
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
      <section className="archive">
        <div>
          {/* 顯示可選擇的主題列表 */}
          {genres && genres.map((g) => (
            <Theme key={g.id} genre={g} setNewThemeId={setNewThemeId} handleOpenChange={handleOpenChange} />
          ))}
        </div>
      </section>
      {/* 如果主題選擇對話框為開啟狀態，則顯示主題選擇對話框 */}
      {isOpen &&
        <ChangeTheme newThemeId={newThemeId} checkIfDouble={checkIfDouble} handleCloseChange={handleCloseChange} currentUser={currentUser} setCurrentUser={setCurrentUser} />
      }
    </div>
  )
}