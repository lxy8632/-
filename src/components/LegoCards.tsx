import React from 'react';
import { LegoCardConfig } from '../store';
import { ChevronRight, TrendingUp, ShieldCheck, PiggyBank, ArrowUpRight } from 'lucide-react';

export const LegoCards: React.FC<{ card: LegoCardConfig }> = ({ card }) => {
  if (card.type === 'wealth') {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-blue-50">
        <div className="bg-gradient-to-r from-blue-50 to-white px-4 py-3 flex justify-between items-center border-b border-blue-50">
          <div className="flex items-center">
            <PiggyBank className="w-5 h-5 text-blue-600 mr-2" />
            <span className="font-bold text-gray-900">{card.title}</span>
          </div>
          <span className="text-xs text-blue-600 flex items-center">全部理财 <ChevronRight className="w-3 h-3 ml-0.5" /></span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 flex flex-col justify-center">
            <span className="text-xs text-gray-600 mb-1">我的理财</span>
            <span className="text-sm font-medium text-gray-900">查看持仓</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 flex flex-col justify-center">
            <span className="text-xs text-gray-600 mb-1">风险评估</span>
            <span className="text-sm font-medium text-gray-900">稳健型</span>
          </div>
        </div>
        <div className="px-4 pb-4 flex justify-between text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-6 h-6 text-green-500 mb-1" />
            <span className="text-xs text-gray-700">安稳增值</span>
          </div>
          <div className="flex flex-col items-center">
            <TrendingUp className="w-6 h-6 text-orange-500 mb-1" />
            <span className="text-xs text-gray-700">稳中求进</span>
          </div>
          <div className="flex flex-col items-center">
            <ArrowUpRight className="w-6 h-6 text-red-500 mb-1" />
            <span className="text-xs text-gray-700">收益进阶</span>
          </div>
        </div>
      </div>
    );
  }

  if (card.type === 'gold') {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-yellow-100">
        <div className="bg-gradient-to-r from-yellow-50 to-white px-4 py-3 flex justify-between items-center border-b border-yellow-100">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">金</div>
            <span className="font-bold text-gray-900">{card.title}</span>
          </div>
          <span className="text-xs text-yellow-600 flex items-center">全部黄金 <ChevronRight className="w-3 h-3 ml-0.5" /></span>
        </div>
        <div className="p-4 flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-500 mb-1">最新金价 ({card.data.date})</div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-red-500">{card.data.price}</span>
              <span className="text-xs text-red-500 bg-red-50 px-1 py-0.5 rounded">{card.data.change}</span>
            </div>
          </div>
          <button className="bg-yellow-500 text-white text-sm px-4 py-1.5 rounded-full font-medium">
            去交易
          </button>
        </div>
      </div>
    );
  }

  return null;
};
