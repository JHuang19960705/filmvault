import React from "react";
import ReviewsContent from "./ReviewsContent";

export default function Reviews({ currentUser }) {
  return (
    <div className="blog-wrap">
      {/* 將currentUser傳遞給ReviewsContent組件 */}
      <ReviewsContent currentUser={currentUser} />
    </div>
  )
}
