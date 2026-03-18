import React, { useState } from "react"
import AuthService from "../../../../../services/auth.service";

export default function ChangeFavorite({newFavorite, oldFavorite, handleChangeClose2, favorite, currentUser, setCurrentUser, handleChangeClose1}) {
  const [message, setMessage] = useState("");
  
  // 將選擇的角色修改為新的角色
  const ChangeServerFavorite = async(choosedFavorite) => {
    favorite = choosedFavorite;
    try{  
      let response = await AuthService.patchFavoritePerson(currentUser.user._id, choosedFavorite)
      window.alert("修改成功~");
      localStorage.setItem("user", JSON.stringify(response.data));
      setCurrentUser(AuthService.getCurrentUser());
      // 關閉彈窗
      handleChangeClose2();
      handleChangeClose1();
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
      setMessage(error.response.data);
    };
  };

  return (
    <div className="bg-white dark:bg-gray-900 box-border p-5 rounded-xl shadow-md absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 md:w-2/5 z-10 flex flex-col">
      <div>
        {newFavorite && oldFavorite && <div className="text-left md:text-xl">把{oldFavorite.name}換成{newFavorite.name}</div>}
      </div>
      <div className="flex justify-center mt-6 w-full md:justify-end text-nowrap">
        <button onClick={handleChangeClose2} className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-2 py-1 rounded-md">取消</button>
        <button onClick={() => {ChangeServerFavorite(newFavorite.id)}} className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-md">確定</button>
      </div>
      {message && <div className="text-red-500">{message}</div>}
    </div>
  );
}
