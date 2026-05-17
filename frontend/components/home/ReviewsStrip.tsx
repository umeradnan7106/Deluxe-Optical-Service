"use client";

import { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { reviewsApi } from "@/lib/api";
import type { Review } from "@/types";
import { formatDate } from "@/lib/utils";

export default function ReviewsStrip() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    reviewsApi.featured()
      .then((res) => setReviews((res.data as Review[]).slice(0, 3)))
      .catch(() => {});
  }, []);

  if (!reviews.length) return null;

  return (
    <section className="bg-[#111111] py-16">
      <div className="max-w-[1500px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-10">
          <div>
            <p className="text-[#E8670A] text-sm font-medium uppercase tracking-widest mb-1">Customer Reviews</p>
            <h2 className="font-['Cormorant_Garamond'] text-4xl text-white font-semibold">What Our Customers Say</h2>
          </div>
          <div className="md:ml-auto flex items-center gap-3 pb-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <StarIcon
                  key={i}
                  className={`w-5 h-5 ${i <= 4 ? "text-[#E8670A]" : "text-gray-600"}`}
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-white">4.8</span>
            <span className="text-gray-500 text-sm">average</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-[#1a1a1a] rounded-lg p-6 flex flex-col">
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${i <= review.rating ? "text-[#E8670A]" : "text-gray-700"}`}
                  />
                ))}
              </div>
              <h4 className="text-white font-semibold mb-2 leading-snug">{review.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">{review.body}</p>
              <div className="flex items-center justify-between text-xs border-t border-[#2a2a2a] pt-3 mt-auto">
                <span className="text-gray-300 font-medium">{review.customer_name}</span>
                <span className="text-gray-600">{formatDate(review.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
