export default function Logo() {
  return (
    <div className="mb-8 flex items-center gap-2">
      <svg className="w-8 h-8 text-teal-700" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
      <span className="text-2xl font-bold text-gray-800">Logo.</span>
    </div>
  );
}
