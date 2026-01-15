import { FiFacebook, FiInstagram, FiYoutube } from 'react-icons/fi';

export default function ShopFooter() {
  return (
    <footer className="bg-[#396254] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-8 brightness-0 invert" />
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-full cursor-pointer">
              <FiFacebook className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full cursor-pointer">
              <FiInstagram className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full cursor-pointer">
              <FiYoutube className="h-5 w-5" />
            </button>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
