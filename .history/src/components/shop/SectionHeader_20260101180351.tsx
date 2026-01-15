import { FiInfo } from 'react-icons/fi';

interface SectionHeaderProps {
  title: string;
  showInfo?: boolean;
  actionText?: string;
  onActionClick?: () => void;
}

export default function SectionHeader({ title, showInfo, actionText, onActionClick }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        {showInfo && <FiInfo className="h-4 w-4 text-gray-400" />}
      </div>
      {actionText && (
        <button
          onClick={onActionClick}
          className="text-sm font-medium text-[#396254] hover:text-[#2d4d3f] flex items-center gap-1 cursor-pointer"
        >
          {actionText}
          <span>→</span>
        </button>
      )}
    </div>
  );
}
