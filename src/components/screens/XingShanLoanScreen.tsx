import React from 'react';
import { ChevronLeft, ShieldCheck, Zap, Clock } from 'lucide-react';
import { ScreenType } from '../MobileSimulator';

interface Props {
  onNavigate: (screen: ScreenType) => void;
}

export const XingShanLoanScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-full bg-slate-50 flex flex-col relative overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-4 shrink-0 relative z-10 bg-white shadow-sm">
        <ChevronLeft className="w-6 h-6 text-slate-800 cursor-pointer" onClick={() => onNavigate('search')} />
        <h1 className="flex-1 text-center text-slate-900 font-bold text-lg mr-6">兴闪贷</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-10 flex flex-col relative z-10">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-800 px-6 pt-8 pb-12 rounded-b-[40px] shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
          
          <h2 className="text-white/90 text-sm font-medium mb-1 relative z-10">最高可借额度(元)</h2>
          <div className="text-white text-5xl font-bold tracking-tight mb-4 relative z-10">
            300,000
          </div>
          
          <div className="flex items-center space-x-4 text-white/80 text-sm relative z-10">
            <div className="flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2"></span>
              年化利率 3.0% 起
            </div>
            <div className="flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mr-2"></span>
              按日计息
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="px-5 -mt-6 relative z-20">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
            <button className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all text-lg mb-4">
              立即申请
            </button>
            <p className="text-center text-xs text-slate-400">
              *具体额度及利率以实际审批为准
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="px-5 mt-8">
          <h3 className="text-slate-800 font-bold text-lg mb-4">产品优势</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-start">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-4 shrink-0">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-slate-800 font-bold text-sm mb-1">极速审批</h4>
                <p className="text-slate-500 text-xs">全流程线上操作，最快1分钟放款</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-start">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mr-4 shrink-0">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-slate-800 font-bold text-sm mb-1">随借随还</h4>
                <p className="text-slate-500 text-xs">按日计息，提前还款无违约金</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-start">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mr-4 shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-slate-800 font-bold text-sm mb-1">安全可靠</h4>
                <p className="text-slate-500 text-xs">银行官方信贷产品，信息安全有保障</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
