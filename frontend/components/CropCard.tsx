interface CropCardProps {
  name: string
  description: string
  imageUrl: string
}

export default function CropCard({ name, description, imageUrl }: CropCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}