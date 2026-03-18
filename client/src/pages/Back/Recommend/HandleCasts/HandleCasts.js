import React, { useState, useEffect } from "react";
import Cast from "./Cast/Cast";
import SearchCast from "./SearchCast/SearchCast";
import ChangeCast from "./ChangeCast/ChangeCast";

export default function HandleCasts({ currentUser, setCurrentUser }) {
  const [castAll, setCastAll] = useState("");
  const [newCast, setNewCast] = useState("");
  const [oldCast, setOldCast] = useState("");
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  useEffect(() => {
    setCastAll(currentUser.user.cast);
  }, [currentUser]);

  const handleChangeOpen1 = () => {
    setIsOpen1(true)
  };

  const handleChangeClose1 = () => {
    setIsOpen1(false)
  };

  const handleChangeOpen2 = () => {
    setIsOpen2(true)
  };

  const handleChangeClose2 = () => {
    setIsOpen2(false)
  };

  return (
    <div>
      <section className="archive">
        {castAll && currentUser &&
          <div>
            <Cast key={currentUser.user.cast.cast1} castId={currentUser.user.cast.cast1} setOldCast={setOldCast} handleChangeOpen1={handleChangeOpen1} />
            <Cast key={currentUser.user.cast.cast2} castId={currentUser.user.cast.cast2} setOldCast={setOldCast} handleChangeOpen1={handleChangeOpen1} />
            <Cast key={currentUser.user.cast.cast3} castId={currentUser.user.cast.cast3} setOldCast={setOldCast} handleChangeOpen1={handleChangeOpen1} />
            <Cast key={currentUser.user.cast.cast4} castId={currentUser.user.cast.cast4} setOldCast={setOldCast} handleChangeOpen1={handleChangeOpen1} />
          </div>
        }
      </section>
      {isOpen1 &&
        <SearchCast setNewCast={setNewCast} handleChangeOpen2={handleChangeOpen2} handleChangeClose2={handleChangeClose2} handleChangeClose1={handleChangeClose1} />
      }
      {isOpen2 &&
        <ChangeCast key={oldCast} newCast={newCast} oldCast={oldCast} castAll={castAll} handleChangeClose1={handleChangeClose1} handleChangeClose2={handleChangeClose2} currentUser={currentUser} setCurrentUser={setCurrentUser} />
      }
    </div>
  );
}
