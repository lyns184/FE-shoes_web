export default function Logo() {
  return (
    <header className="border-b bg-white py-4">
      <div className="container mx-auto px-4 flex items-center justify-center gap-2">
        <img src="/logo.png" alt="Logo" className="w-8 h-8" />
        <span className="text-2xl font-semibold text-gray-800">Logo.</span>
      </div>
    </header>
  );
}
