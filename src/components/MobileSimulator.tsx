import React, { useState } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { SpringFestivalScreen } from './screens/SpringFestivalScreen';
import { XingShanLoanScreen } from './screens/XingShanLoanScreen';
import { AISearchScreen } from './screens/AISearchScreen';

export type ScreenType = 'home' | 'search' | 'results' | 'spring-festival' | 'xingshan-loan' | 'ai-search' | 'feature';

const FeatureScreen: React.FC<{ title: string, onBack: () => void }> = ({ title, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white px-4 pt-14 pb-3 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-700 active:bg-gray-100 rounded-full transition-colors flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <span className="flex-1 text-center font-bold text-gray-900 mr-8">{title}</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white m-4 rounded-2xl shadow-sm">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-500 text-sm">此功能页面正在开发中...</p>
        <div className="mt-8 bg-orange-50 border border-orange-100 p-4 rounded-xl text-left w-full">
            <p className="text-xs text-orange-600 flex items-start">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
               您的访问已被记录，此记录将用于“猜你想搜”及其他特征推荐页面的计算。
            </p>
        </div>
      </div>
    </div>
  );
}

export const MobileSimulator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = (screen: ScreenType, query?: string) => {
    if (query !== undefined) setSearchQuery(query);
    setCurrentScreen(screen);
  };

  return (
    <div className="w-[375px] h-[812px] bg-white border-[8px] border-gray-900 rounded-[40px] overflow-hidden relative shadow-2xl flex flex-col">
      {/* Status Bar Mock */}
      <div className="h-11 w-full bg-transparent absolute top-0 z-50 flex justify-between items-center px-6 text-xs font-medium pointer-events-none">
        <span>15:30</span>
        <div className="flex space-x-1 items-center">
          <div className="w-4 h-3 bg-black rounded-sm"></div>
          <div className="w-4 h-3 bg-black rounded-sm"></div>
          <div className="w-6 h-3 bg-black rounded-sm"></div>
        </div>
      </div>

      {/* Dynamic Island Mock */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-full z-50 pointer-events-none"></div>

      {/* Screens */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-gray-50">
        {currentScreen === 'home' && <HomeScreen onNavigate={navigate} />}
        {currentScreen === 'search' && <SearchScreen onNavigate={navigate} />}
        {currentScreen === 'results' && <ResultsScreen onNavigate={navigate} query={searchQuery} />}
        {currentScreen === 'spring-festival' && <SpringFestivalScreen onNavigate={navigate} />}
        {currentScreen === 'xingshan-loan' && <XingShanLoanScreen onNavigate={navigate} />}
        {currentScreen === 'ai-search' && <AISearchScreen onNavigate={navigate} />}
        {currentScreen === 'feature' && <FeatureScreen title={searchQuery} onBack={() => navigate('home')} />}
      </div>
    </div>
  );
};
