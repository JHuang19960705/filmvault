import React from "react"
import AuthService from "../../../../../services/auth.service";

export default function ChangeCast({newCast, oldCast, handleChangeClose2, castAll, currentUser, setCurrentUser, handleChangeClose1}) {
  const handleChangeCast = (oldCast, newCast) => {
    if (castAll.cast1 == oldCast){
      castAll.cast1 = newCast;
      ChangeServerCast();
    } else if (castAll.cast2 == oldCast) {
      castAll.cast2 = newCast;
      ChangeServerCast();
    } else if (castAll.cast3 == oldCast) {
      castAll.cast3 = newCast;
      ChangeServerCast();
    } else if (castAll.cast4 == oldCast) {
      castAll.cast4 = newCast;
      ChangeServerCast();
    }
  };

  const ChangeServerCast = async() => {
    try{  
      let response = await AuthService.patchCast(currentUser.user._id, castAll)
      window.alert("修改成功。您現在將被導向到個人資料頁面");
      localStorage.setItem("user", JSON.stringify(response.data));
      setCurrentUser(AuthService.getCurrentUser());
      handleChangeClose2();
      handleChangeClose1();
    } catch (e) {
      console.error("Error fetching cast:", e);
    };
  };

  return (
    <div className="bg-white dark:bg-gray-900 box-border p-5 rounded-xl shadow-md absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 md:w-2/5 z-10 flex flex-col">
      <div>
        {newCast && oldCast && <div className="text-left md:text-xl">把{oldCast.name}換成{newCast.name}</div>}
      </div>
      <div className="flex justify-center mt-6 w-full md:justify-end text-nowrap">
        <button onClick={handleChangeClose2} className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-2 py-1 rounded-md">取消</button>
        <button onClick={() => {handleChangeCast(oldCast.id, newCast.id)}} className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-md">確定</button>
      </div>
    </div>
  );
}
