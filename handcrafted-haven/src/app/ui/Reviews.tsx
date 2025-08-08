import { Review } from "../lib/definitions";
import { StarIcon } from "@heroicons/react/16/solid";
import { Session } from "next-auth";
import Link from "next/link";
import { ReviewTrigger } from "./ReviewTrigger";
import AverageRating from "./catalog/RateAverage";

type Props = {
  reviews: Review[];
  authenticated: Session | null;
  product_id: string;
};

export default async function ReviewList({
  reviews,
  authenticated,
  product_id,
}: Props) {
  return (
    <div className="lg:w-4xl w-lg pb-5 space-y-6 rounded-2xl border border-black bg-[#F4EDE4] ">
      <AverageRating product_id={product_id} />
      {reviews.length === 0 ? (
        <p className="p-5">No reviews :c, Be the first one to review!</p>
      ) : (
        reviews.map((review) => {
          const reviewDate = new Date(review.created_at);
          return (
            <div key={review.review_id} className="border-b mb-0 py-2">
              <div className="flex justify-between items-center px-5">
                <p className="font-semibold">
                  {review.firstname} {review.lastname}
                </p>
                <p className="text-sm text-gray-500">
                  {reviewDate.toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center py-2 p-5">
                {[...Array(Number(review.rating))].map((_, index) => (
                  <StarIcon key={index} className="w-5 h-5 text-yellow-500" />
                ))}
              </div>
              <p className="px-5">{review.review}</p>
            </div>
          );
        })
      )}

      <div className="mt-6 px-5">
        {authenticated?.user ? (
          <ReviewTrigger
            user_id={authenticated.user.id}
            product_id={product_id}
          />
        ) : (
          <Link
            href="/login"
            className="w-36 text-center mt-auto bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Log in to leave a review
          </Link>
        )}
      </div>
    </div>
  );
}
