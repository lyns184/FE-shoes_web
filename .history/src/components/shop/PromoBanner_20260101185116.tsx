interface PromoBannerProps {
  imageUrl: string;
  title?: string;
  buttonText?: string;
  variant?: 'default' | 'dark';
}

export default function PromoBanner({ imageUrl, buttonText }: PromoBannerProps) {
  return (
    <div className="overflow-hidden group hover:shadow-lg transition-shadow border border-gray-200 rounded-lg cursor-pointer">
      <div className="relative aspect-[3/2] bg-blue-50">
        <img src={imageUrl || '/shoe.png'} alt='Promo' className="w-full h-full object-contain p-4" />
        {buttonText && (
          <button className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 cursor-pointer">
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}
