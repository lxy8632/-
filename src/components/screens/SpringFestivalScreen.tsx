import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { ScreenType } from '../MobileSimulator';

interface Props {
  onNavigate: (screen: ScreenType) => void;
}

export const SpringFestivalScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-full bg-red-600 flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-4 shrink-0 relative z-10">
        <ChevronLeft className="w-6 h-6 text-white cursor-pointer" onClick={() => onNavigate('search')} />
        <h1 className="flex-1 text-center text-white font-bold text-lg mr-6">新春狂欢季</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-10 flex flex-col items-center relative z-10">
        <div className="w-full h-48 bg-red-500 rounded-2xl mt-4 border-2 border-yellow-300 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-400/20 via-transparent to-transparent"></div>
          <h2 className="text-3xl font-black text-yellow-300 tracking-widest drop-shadow-md">迎新春 贺新年</h2>
          <p className="text-white mt-2 font-medium">参与活动抽最高 888 元红包</p>
        </div>

        <div className="w-full bg-white rounded-2xl mt-6 p-6 shadow-xl">
          <h3 className="text-red-600 font-bold text-lg mb-4 text-center">每日签到抽大奖</h3>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div key={day} className={`flex flex-col items-center justify-center p-2 rounded-lg ${day === 1 ? 'bg-red-100 border border-red-300' : 'bg-gray-50'}`}>
                <span className={`text-xs ${day === 1 ? 'text-red-600 font-bold' : 'text-gray-500'}`}>第{day}天</span>
                <div className={`w-8 h-8 mt-1 rounded-full flex items-center justify-center ${day === 1 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  ¥
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-full shadow-md active:scale-95 transition-transform">
            立即签到
          </button>
        </div>

        <div className="w-full bg-white/10 rounded-2xl mt-6 p-4 border border-white/20">
          <h3 className="text-yellow-300 font-bold text-sm mb-2">活动规则</h3>
          <ul className="text-white/80 text-xs space-y-1 list-disc pl-4">
            <li>活动时间：即日起至2026年3月31日</li>
            <li>每日签到可获得一次抽奖机会</li>
            <li>红包奖励将直接发放至您的账户</li>
            <li>本活动最终解释权归兴业银行所有</li>
          </ul>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-red-700 to-transparent pointer-events-none"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400 rounded-full mix-blend-overlay filter blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute top-40 -left-10 w-32 h-32 bg-yellow-400 rounded-full mix-blend-overlay filter blur-3xl opacity-50 pointer-events-none"></div>
    </div>
  );
};
