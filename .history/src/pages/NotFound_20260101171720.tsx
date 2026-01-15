export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b bg-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-12" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Error Message */}
            <div className="space-y-6">
              <div>
                <h1 className="text-5xl font-bold text-[#396254] mb-4">UH-Oh!</h1>
                <p className="text-2xl font-semibold text-gray-900 leading-tight">
                  The page you was looking for cannot be found
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Possible reason</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-gray-900 mt-2 shrink-0" />
                    <span className="text-gray-700">The address may have been typed incorrectly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-gray-900 mt-2 shrink-0" />
                    <span className="text-gray-700">This maybe a broken or outdated link</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-[#396254] hover:bg-[#2d4d3f] text-white px-8 py-6 rounded-full font-medium transition-colors"
                >
                  Go Home
                </button>
                <button
                  onClick={() => window.location.href = '/help'}
                  className="border-2 border-gray-900 text-gray-900 hover:bg-gray-100 px-8 py-6 rounded-full font-medium bg-transparent transition-colors"
                >
                  Help
                </button>
              </div>
            </div>

            {/* Right Side - 404 Image */}
            <div className="relative flex items-center justify-center">
              <img src="/404.png" alt="404 Not Found" className="w-full h-auto max-w-md" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
