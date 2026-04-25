import React, { useRef, useEffect, useState } from 'react';
import { Search, ScanLine, User, CreditCard, PiggyBank, Calendar, Coins, ArrowRightLeft, FileText, HandCoins, UserCircle, Grid, ChevronRight, Sparkles, Zap, Bell, ShieldCheck, TrendingUp } from 'lucide-react';
import { ScreenType } from '../MobileSimulator';

const SmartPushLogo = () => (
  <div className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 pl-1.5 pr-2 py-1 rounded-bl-xl absolute top-0 right-0 shadow-sm z-20">
    <div className="w-[14px] h-[14px] rounded-full overflow-hidden bg-white mr-1 shrink-0 flex items-center justify-center">
      <img src="https://s1.img-e.com/20260420/69e6142086a5d.png" alt="兴福龙" className="w-full h-full object-cover" />
    </div>
    <span className="text-[10px] font-bold text-white italic tracking-wider leading-none">
      小兴智推
    </span>
  </div>
);

const smartCards = [
  {
    id: 'repayment',
    title: '信用卡还款',
    content: (
      <div>
        <div className="text-gray-500 text-xs mb-0.5">本期待还</div>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-gray-900">1,999</span>
          <span className="text-sm text-gray-900 ml-0.5">.00元</span>
        </div>
      </div>
    ),
    extra: '还款日 03月28日',
    buttonText: '去还款',
    icon: <CreditCard className="w-4 h-4 text-blue-500" />,
    bgClass: 'bg-gradient-to-br from-blue-50/40 to-white',
    btnClass: 'bg-blue-600 text-white shadow-md shadow-blue-200/50'
  },
  {
    id: 'loan_repayment',
    title: '贷款还款',
    content: (
      <div>
        <div className="text-gray-500 text-xs mb-0.5">本期应还</div>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-gray-900">3,500</span>
          <span className="text-sm text-gray-900 ml-0.5">.00元</span>
        </div>
      </div>
    ),
    extra: '还款日 03月26日',
    buttonText: '立即还款',
    icon: <HandCoins className="w-4 h-4 text-red-500" />,
    bgClass: 'bg-gradient-to-br from-red-50/40 to-white',
    btnClass: 'bg-red-600 text-white shadow-md shadow-red-200/50'
  },
  {
    id: 'suggestion_salary',
    title: '发薪理财',
    content: (
      <div className="mt-1">
        <div className="text-sm text-gray-800 leading-relaxed">
          <span className="text-orange-500 font-bold text-lg mr-1">¥8,500</span>工资入账
        </div>
        <div className="text-xs text-gray-500 mt-0.5">转入天天宝，享受每日收益</div>
      </div>
    ),
    extra: '七日年化 2.1%',
    buttonText: '去转入',
    icon: <Sparkles className="w-4 h-4 text-orange-500" />,
    bgClass: 'bg-gradient-to-br from-orange-50/40 to-white',
    btnClass: 'bg-orange-500 text-white shadow-md shadow-orange-200/50'
  },
  {
    id: 'suggestion_market',
    title: '基金异动',
    content: (
      <div className="mt-1">
        <div className="text-sm text-gray-800 leading-relaxed">
          新能源基金预估 <span className="text-red-500 font-bold text-lg mx-0.5">+2.5%</span>
        </div>
        <div className="text-xs text-gray-500 mt-0.5">行情向好，建议追加投资</div>
      </div>
    ),
    extra: '近一年收益 15.2%',
    buttonText: '去查看',
    icon: <TrendingUp className="w-4 h-4 text-red-500" />,
    bgClass: 'bg-gradient-to-br from-red-50/40 to-white',
    btnClass: 'bg-red-600 text-white shadow-md shadow-red-200/50'
  },
  {
    id: 'suggestion_security',
    title: '账户安全',
    content: (
      <div className="mt-1">
        <div className="text-sm text-gray-800 leading-relaxed">
          密码已超 <span className="font-bold text-lg mx-0.5">90天</span> 未修改
        </div>
        <div className="text-xs text-gray-500 mt-0.5">建议定期修改以保障资金安全</div>
      </div>
    ),
    extra: '安全等级：中',
    buttonText: '去修改',
    icon: <ShieldCheck className="w-4 h-4 text-blue-500" />,
    bgClass: 'bg-gradient-to-br from-blue-50/40 to-white',
    btnClass: 'bg-blue-600 text-white shadow-md shadow-blue-200/50'
  }
];

export const HomeScreen: React.FC<{ onNavigate: (screen: ScreenType) => void }> = ({ onNavigate }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const totalSlides = smartCards.length + 1; // +1 for recent messages

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let interval: NodeJS.Timeout;
    
    const startAutoScroll = () => {
      interval = setInterval(() => {
        if (!container) return;
        const cardHeight = container.clientHeight;
        const maxScroll = container.scrollHeight - container.clientHeight;
        
        if (container.scrollTop >= maxScroll - 10) {
          container.scrollTo({ top: 0, behavior: 'smooth' });
          setActiveCardIndex(0);
        } else {
          container.scrollBy({ top: cardHeight, behavior: 'smooth' });
          setActiveCardIndex(prev => (prev + 1) % totalSlides);
        }
      }, 5000); // Increased interval to 5 seconds for better reading time
    };

    startAutoScroll();

    const handleTouchStart = () => clearInterval(interval);
    const handleTouchEnd = () => startAutoScroll();
    
    const handleScroll = () => {
        if(!container) return;
        const cardHeight = container.clientHeight;
        const index = Math.round(container.scrollTop / cardHeight);
        setActiveCardIndex(index);
    }

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(interval);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [totalSlides]);

  return (
    <div className="min-h-full bg-gray-50 pb-20">
      {/* Header Area */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-500 pt-14 pb-16 px-4 rounded-b-[40px] text-white">
        <div className="flex items-center space-x-3 mb-6">
          <ScanLine className="w-6 h-6" />
          <div 
            className="flex-1 bg-white/20 rounded-full h-9 flex items-center px-3 text-white/80 cursor-text"
            onClick={() => onNavigate('search')}
          >
            <Search className="w-4 h-4 mr-2" />
            <span className="text-sm">理财</span>
          </div>
          <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2">
              <PiggyBank className="w-6 h-6" />
            </div>
            <span className="text-xs">财富总览</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="text-xs">信用卡</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
            <span className="text-xs">转账汇款</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2">
              <UserCircle className="w-6 h-6" />
            </div>
            <span className="text-xs">账户查询</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-sm p-4 grid grid-cols-4 gap-y-6 text-center">
          <div className="flex flex-col items-center">
            <PiggyBank className="w-8 h-8 text-yellow-600 mb-1" strokeWidth={1.5} />
            <span className="text-xs text-gray-700">理财产品</span>
          </div>
          <div className="flex flex-col items-center">
            <Coins className="w-8 h-8 text-blue-600 mb-1" strokeWidth={1.5} />
            <span className="text-xs text-gray-700">基金</span>
          </div>
          <div className="flex flex-col items-center">
            <PiggyBank className="w-8 h-8 text-orange-500 mb-1" strokeWidth={1.5} />
            <span className="text-xs text-gray-700">存款</span>
          </div>
          <div className="flex flex-col items-center">
            <Calendar className="w-8 h-8 text-green-600 mb-1" strokeWidth={1.5} />
            <span className="text-xs text-gray-700">天天宝</span>
          </div>
          <div className="flex flex-col items-center">
            <Coins className="w-8 h-8 text-yellow-500 mb-1" strokeWidth={1.5} />
            <span className="text-xs text-gray-700">黄金</span>
          </div>
          <div className="flex flex-col items-center">
            <FileText className="w-8 h-8 text-gray-600 mb-1" strokeWidth={1.5} />
            <span className="text-xs text-gray-700">交易明细</span>
          </div>
          <div className="flex flex-col items-center">
            <HandCoins className="w-8 h-8 text-blue-500 mb-1" strokeWidth={1.5} />
            <span className="text-xs text-gray-700">我要贷款</span>
          </div>
          <div className="flex flex-col items-center">
            <Grid className="w-8 h-8 text-gray-400 mb-1" strokeWidth={1.5} />
            <span className="text-xs text-gray-700">全部</span>
          </div>
        </div>
      </div>

      {/* 消息与智推线框 (Message & Smart Push Wireframe) */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative h-[124px]">
        
        <div 
          ref={scrollContainerRef}
          className="flex flex-col overflow-y-auto snap-y snap-mandatory h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {/* Slide 0: Recent Messages */}
          <div className="w-full h-[124px] shrink-0 snap-center p-3.5 pr-6 flex flex-col justify-between bg-white relative">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Bell className="w-4 h-4 text-blue-500 mr-1.5" />
                <span className="font-bold text-gray-800 text-sm">最近消息</span>
              </div>
              <span className="text-[11px] text-gray-400 flex items-center">2条新消息 <ChevronRight className="w-3 h-3 ml-0.5"/></span>
            </div>
            
            <div className="flex-1 flex flex-col justify-center space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center overflow-hidden flex-1 pr-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 shrink-0"></div>
                  <span className="text-xs text-gray-600 truncate">您尾号1234的卡转入 1,000.00元</span>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">10:30</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center overflow-hidden flex-1 pr-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2 shrink-0"></div>
                  <span className="text-xs text-gray-600 truncate">您的个人信息需完善，请及时更新</span>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">昨天</span>
              </div>
            </div>
          </div>

          {/* Slide 1...N: Smart Cards */}
          {smartCards.map((card) => (
            <div 
              key={card.id} 
              className={`w-full h-[124px] shrink-0 snap-center p-3.5 pr-6 flex flex-col justify-between relative ${card.bgClass}`}
            >
              <SmartPushLogo />
              
              {/* Header */}
              <div className="flex items-center relative z-10">
                <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center shadow-sm mr-2">
                  {card.icon}
                </div>
                <span className="font-bold text-gray-800 text-sm">{card.title}</span>
              </div>

              {/* Content */}
              <div className="relative z-10 pl-1">
                {card.content}
              </div>

              {/* Footer / Button */}
              <div className="flex justify-between items-end relative z-10 pl-1">
                <span className="text-xs text-gray-500 mb-0.5">{card.extra}</span>
                <button className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center transition-transform active:scale-95 ${card.btnClass}`}>
                  {card.buttonText} <ChevronRight className="w-3 h-3 ml-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination Indicators (Vertical on the right) */}
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex flex-col justify-center gap-1.5 z-30 pointer-events-none">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <div 
              key={idx} 
              className={`w-1 rounded-full transition-all duration-300 ${idx === activeCardIndex ? 'h-3 bg-blue-500' : 'h-1.5 bg-gray-300'}`}
            />
          ))}
        </div>
      </div>

      {/* Banner */}
      <div className="px-4 mt-4">
        <div className="bg-red-50 rounded-xl p-4 flex justify-between items-center border border-red-100">
          <div>
            <h3 className="text-red-600 font-bold text-lg">"兴"春有礼</h3>
            <p className="text-red-500 text-xs mt-1">兴闪贷年化利率（单利）3.0%起</p>
          </div>
          <div className="text-3xl font-bold text-red-600">3.0<span className="text-lg">%</span></div>
        </div>
      </div>
    </div>
  );
};
