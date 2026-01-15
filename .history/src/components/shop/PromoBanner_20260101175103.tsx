interface PromoBannerProps {
  imageUrl: string;
  title?: string;
  buttonText?: string;
  variant?: 'default' | 'dark';
}

export default function PromoBanner({ imageUrl, title, buttonText, variant = 'default' }: PromoBannerProps) {
  return (
    <div className="overflow-hidden group hover:shadow-lg transition-shadow border border-gray-200 rounded-lg">
      <div className={`relative aspect-[3/2] ${variant === 'dark' ? 'bg-[#396254]' : 'bg-blue-50'}`}>
        <img src={imageUrl || '/shoe.png'} alt={title || 'Promo'} className="w-full h-full object-cover" />
        {(title || buttonText) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            {title && <h3 className="text-2xl font-bold text-white">{title}</h3>}
            {buttonText && (
              <button className="bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 cursor-pointer">
                {buttonText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
