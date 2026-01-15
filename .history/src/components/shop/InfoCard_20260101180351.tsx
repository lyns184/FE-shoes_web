import { FiPackage } from 'react-icons/fi';

interface InfoCardProps {
  title: string;
  description: string;
}

export default function InfoCard({ title, description }: InfoCardProps) {
  return (
    <div className="p-6 hover:shadow-md transition-shadow border border-gray-200 rounded-lg bg-white">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <FiPackage className="h-5 w-5 text-[#396254]" />
        </div>
        <div>
          <h3 className="font-semibold text-sm mb-1">{title}</h3>
          <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
