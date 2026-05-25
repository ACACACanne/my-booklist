"use client";

export default function RatingStars({ rating = 0, onRate }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= rating;

        return (
          <button
            key={star}
            type="button"
            onClick={() => onRate(star)}
            className={`text-lg transition-colors ${
              filled ? "text-yellow-400" : "text-gray-500 hover:text-yellow-300"
            }`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
