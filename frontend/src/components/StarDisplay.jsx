import { Star } from "lucide-react";

export default function StarDisplay({ rating = 0, count = 0 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={16}
          className={
            s <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }
        />
      ))}
      <span className="text-sm text-gray-600">
        {rating > 0 ? rating.toFixed(1) : "No rating"}
        {count > 0 && ` (${count})`}
      </span>
    </div>
  );
}
