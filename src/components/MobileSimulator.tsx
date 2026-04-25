import React, { useState } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { SpringFestivalScreen } from './screens/SpringFestivalScreen';
import { XingShanLoanScreen } from './screens/XingShanLoanScreen';
import { AISearchScreen } from './screens/AISearchScreen';

export type ScreenType = 'home' | 'search' | 'results' | 'spring-festival' | 'xingshan-loan' | 'ai-search';

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
      </div>
    </div>
  );
};
