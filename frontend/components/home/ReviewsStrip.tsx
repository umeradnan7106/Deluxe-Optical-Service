"use client";

import { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { reviewsApi } from "@/lib/api";
import type { Review } from "@/types";
import { formatDate } from "@/lib/utils";

const PLACEHOLDER_REVIEWS: Review[] = [
  { id: 1, customer_name: "Ahmed K.", product_id: 1, rating: 5, title: "Amazing quality!", body: "The frames are absolutely stunning. Great quality and fast delivery. Will definitely order again.", is_approved: true, is_featured: false, images: [], created_at: "2026-04-15T10:00:00Z" },
  { id: 2, customer_name: "Sara M.", product_id: 2, rating: 5, title: "Perfect fit, perfect style", body: "Exactly as described. The lenses are crystal clear and the frame is very comfortable. Highly recommend!", is_approved: true, is_featured: false, images: [], created_at: "2026-04-10T10:00:00Z" },
  { id: 3, customer_name: "Usman T.", product_id: 3, rating: 4, title: "Great value for money", body: "Very happy with my purchase. The blue cut lenses really help with screen fatigue. Delivery was quick too.", is_approved: true, is_featured: false, images: [], created_at: "2026-04-05T10:00:00Z" },
];

export default function ReviewsStrip() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    reviewsApi.featured()
      .then((res) => {
        const data = res.data as Review[];
        setReviews(data.slice(0, 3).length ? data.slice(0, 3) : PLACEHOLDER_REVIEWS);
      })
      .catch(() => setReviews(PLACEHOLDER_REVIEWS));
  }, []);

  const displayReviews = reviews.length ? reviews : PLACEHOLDER_REVIEWS;

  return (
    <section className="bg-[#f9fafb] py-16">
      <div className="max-w-[1500px] mx-auto px-6">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="font-['Cormorant_Garamond'] text-5xl text-[#1a1a1a] font-bold">4.8</span>
          </div>
          <div className="flex justify-center gap-0.5 mb-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon key={i} className={`w-5 h-5 ${i <= 5 ? "text-[#E8670A]" : "text-gray-300"}`} />
            ))}
          </div>
          <p className="text-[#6b7280] text-sm">Based on 240+ reviews</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayReviews.map((review) => (
            <div key={review.id} className="bg-white border border-[#e5e7eb] rounded-lg p-6 flex flex-col">
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${i <= review.rating ? "text-[#E8670A]" : "text-gray-200"}`}
                  />
                ))}
              </div>
              <h4 className="text-[#1a1a1a] font-semibold mb-2 leading-snug">{review.title}</h4>
              <p className="text-[#6b7280] text-sm leading-relaxed italic line-clamp-3 flex-1 mb-4">{review.body}</p>
              <div className="flex items-center justify-between text-xs border-t border-[#f3f4f6] pt-3 mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#E8670A]/10 flex items-center justify-center text-[#E8670A] font-bold text-xs">
                    {review.customer_name[0]}
                  </div>
                  <span className="text-[#1a1a1a] font-medium">{review.customer_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#6b7280]">{formatDate(review.created_at)}</span>
                  <span className="bg-green-50 text-green-700 text-[9px] font-semibold px-1.5 py-0.5 rounded">Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
