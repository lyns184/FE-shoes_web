import shoeImg from '../../assets/shoe.png';

interface BrandCardProps {
  name: string;
  imageUrl: string;
  logoUrl?: string;
}

export default function BrandCard({ name, imageUrl, logoUrl }: BrandCardProps) {
  return (
    <div className="overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 rounded-lg bg-white">
      <div className="relative aspect-4/3 bg-[#396254]">
        <img src={imageUrl || shoeImg} alt={name} className="w-full h-full object-contain p-4" />
      </div>
      <div className="p-4 flex items-center justify-between">
        <span className="font-semibold">{name}</span>
        {logoUrl && (
          <img
            src={logoUrl || shoeImg}
            alt={`${name} logo`}
            className="w-5 h-5 object-contain"
          />
        )}
      </div>
    </div>
  );
}
