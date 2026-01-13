import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import bannerImg from '../../assets/banner.png';

const slides = [
  {
    id: 1,
    image: bannerImg,
    title: "SALE",
    subtitle: "Up to 50% off on selected items",
    titleColor: "text-red-600"
  },
  {
    id: 2,
    image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_1920,h_600/global/312587/01/sv01/fnd/VNM/fmt/png/Darter-Pro-2-Running-Shoes-Unisex",
    title: "NEW ARRIVALS",
    subtitle: "Fresh styles just landed",
    titleColor: "text-blue-600"
  },
  {
    id: 3,
    image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_1920,h_600/global/302517/02/sv01/fnd/VNM/fmt/png/RS-X-Sneakers-Unisex",
    title: "TRENDING",
    subtitle: "Most popular sneakers this season",
    titleColor: "text-emerald-600"
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative h-75 flex items-center justify-center overflow-hidden">
          {/* Slides Container */}
          <div 
            className="flex transition-transform duration-500 ease-in-out w-full h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide) => (
              <div key={slide.id} className="relative w-full h-full flex-shrink-0">
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <h1 className={`text-8xl font-bold tracking-wider mb-4 ${slide.titleColor} drop-shadow-lg`}>
                    {slide.title}
                  </h1>
                  <p className="text-xl font-medium text-white drop-shadow-md">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 z-10"
          >
            <FiChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 z-10"
          >
            <FiChevronRight className="h-6 w-6" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 cursor-pointer ${
                  index === currentSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
