interface FarmerReviewProps {
  name: string
  rating: number
  comment: string
  date: string
}

export default function FarmerReview({ name, rating, comment, date }: FarmerReviewProps) {
  const stars = '⭐'.repeat(rating) + '☆'.repeat(5 - rating)

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">{name}</h4>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
      <div className="mb-2">{stars}</div>
      <p className="text-gray-700">{comment}</p>
    </div>
  )
}