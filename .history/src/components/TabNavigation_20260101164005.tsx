interface TabNavigationProps {
  activeTab: 'signup' | 'login';
  onTabChange: (tab: 'signup' | 'login') => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex border-b">
      <button
        onClick={() => onTabChange('signup')}
        className={`flex-1 py-3 text-sm font-medium transition-colors ${
          activeTab === 'signup'
            ? 'text-gray-900 border-b-2 border-gray-900'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Sign Up
      </button>
      <button
        onClick={() => onTabChange('login')}
        className={`flex-1 py-3 text-sm font-medium transition-colors ${
          activeTab === 'login'
            ? 'text-gray-900 border-b-2 border-gray-900'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Log In
      </button>
    </div>
  );
}
