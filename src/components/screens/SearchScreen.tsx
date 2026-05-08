import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronLeft, Search, Mic, Trash2, Flame, ChevronDown, ChevronUp, X, RefreshCw, Sparkles, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType } from '../MobileSimulator';
import { useConfig } from '../../store';
import { generateRecommendations, mockUsers } from '../../services/recommendationEngine';

const CollapsibleTagGroup: React.FC<{ items: any[], renderItem: (item: any, i: number) => React.ReactNode }> = ({ items, renderItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkHeight = () => {
      if (containerRef.current) {
        if (containerRef.current.scrollHeight > 70) {
          setShowToggle(true);
        } else {
          setShowToggle(false);
        }
      }
    };
    // Use a small timeout to ensure DOM is fully rendered before measuring
    const timer = setTimeout(checkHeight, 0);
    window.addEventListener('resize', checkHeight);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkHeight);
    };
  }, [items]);

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className={`flex flex-wrap gap-2 ${isExpanded ? '' : 'max-h-[68px] overflow-hidden'}`}
      >
        {items.map((item, i) => renderItem(item, i))}
        {showToggle && isExpanded && (
          <div 
            className="w-8 h-[30px] bg-white/80 backdrop-blur-sm rounded-lg shadow-sm flex items-center justify-center border border-gray-100 cursor-pointer shrink-0"
            onClick={() => setIsExpanded(false)}
          >
            <ChevronUp className="w-4 h-4 text-gray-500" />
          </div>
        )}
      </div>
      {showToggle && !isExpanded && (
        <div 
          className="absolute bottom-0 right-0 pl-8 h-[30px] bg-gradient-to-l from-gray-50 via-gray-50 to-transparent flex items-center justify-end cursor-pointer"
          onClick={() => setIsExpanded(true)}
        >
          <div className="w-8 h-[30px] bg-white/80 backdrop-blur-sm rounded-lg shadow-sm flex items-center justify-center border border-gray-100">
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export const SearchScreen: React.FC<{ onNavigate: (screen: ScreenType, query?: string) => void }> = ({ onNavigate }) => {
  const { config, users, setUsers, currentUserIndex } = useConfig();
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('search_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['基金', '外汇', '购汇', '稳健', '积分', '滴滴', '黄金', '领优惠', '医保', '蚂蚁访客'];
  });
  const [activeTab, setActiveTab] = useState('全部热搜');
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [discoveryPageIndex, setDiscoveryPageIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showMiddleAd, setShowMiddleAd] = useState(true);
  const [aiQuestionIndex, setAiQuestionIndex] = useState(0);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    localStorage.setItem('search_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    setDiscoveryPageIndex(0);
  }, [config.searchDiscovery]);

  // Handle Debounced Search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    const trimmedQuery = query.trim();
    if (trimmedQuery.length > 2) {
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(trimmedQuery);
      }, 1000);
    }
    
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [query]);

  // Generate Suggestions
  const getSuggestions = () => {
    const q = query.trim();
    if (!q) return [];
    
    // Evaluate History Match & Hot Search
    const historyMatch = history.find(h => h.toLowerCase().includes(q.toLowerCase()));
    
    let hotText = `${q}明细`;
    let altHotText = `${q}办理`;
    let hotTag = '热搜';
    
    if (q === '理' || q === '理财') {
      hotText = '理财产品';
      altHotText = '热门理财推荐';
    } else if (q === '信' || q === '信用卡') {
      hotText = '信用卡申请';
      altHotText = '信用卡特惠';
    } else if (q === '贷' || q === '贷款') {
      hotText = '我要贷款';
      altHotText = '个人消费贷';
    } else if (q === '丰' || q === '丰利') {
      hotText = '丰利系列理财';
      altHotText = '丰利精选理财';
      hotTag = '热搜';
    }

    if (historyMatch === hotText) {
      hotText = altHotText;
    }

    const hotItem = { type: 'hot', text: hotText, rightTag: hotTag };
    
    // Evaluate Related & Recommend Words
    let related: string[] = [];
    let recommends: any[] = [];
    
    if (q === '理' || q === '理财') {
      related = ['稳健理财', '我的理财', '理财证明', '理财转让'];
      recommends = [{ 
        type: 'recommend', 
        text: '兴银添利天天盈一号', 
        badge: '代销', 
        rate: '1.086%', 
        rateDesc: '七日年化', 
        risk: '安逸型R1', 
        rightTag: '推荐'
      }];
    } else if (q === '丰' || q === '丰利') {
      related = ['丰利灵动1年持有1A', '丰利逸动14天最短持有A', '丰利合享封闭式182号A'];
      recommends = [
        { 
          type: 'recommend', 
          text: '丰利逸动日开1A', 
          badge: '代销', 
          rate: '5.669%', 
          rateDesc: '成立以来年化', 
          risk: '谨慎型R2', 
          rightTag: '新品'
        },
        { 
          type: 'recommend', 
          text: '丰利灵动6M持有1A', 
          badge: '代销', 
          rate: '5.431%', 
          rateDesc: '成立以来年化', 
          risk: '稳健型R3', 
          rightTag: '推荐'
        }
      ];
    } else if (q === '信' || q === '信用卡') {
      related = ['信用卡还款', '信用卡额度查询', '信用卡激活', '信用卡账单'];
      recommends = [{ 
        type: 'recommend', 
        text: '兴业尊尚白金卡', 
        badge: '推荐', 
        rate: '免年费', 
        rateDesc: '首年免', 
        risk: '商旅必备', 
        rightTag: '推荐'
      }];
    } else if (q === '贷' || q === '贷款') {
      related = ['贷款进度查询', '提前还款', '我的贷款', '贷款计算器'];
      recommends = [{ 
        type: 'recommend', 
        text: '兴闪贷', 
        badge: '自营', 
        rate: '3.65%', 
        rateDesc: '年化起', 
        risk: '凭信用', 
        rightTag: '推荐'
      }];
    } else {
      related = [`我的${q}`, `${q}明细查询`, `${q}办理`, `${q}设置`];
    }
    
    const result: any[] = [];
    const seen = new Set<string>();

    const addText = (text: string) => seen.add(text.toLowerCase());
    const hasText = (text: string) => seen.has(text.toLowerCase());
    
    if (historyMatch) {
      result.push({ type: 'history', text: historyMatch, rightTag: '搜过' });
      addText(historyMatch);
    }

    if (hotItem) {
      if (hasText(hotItem.text)) {
        hotItem.text = altHotText;
      }
      if (!hasText(hotItem.text)) {
        result.push(hotItem);
        addText(hotItem.text);
      }
    }
    
    // Determine where to place recommend item to prevent 3 tags clustering
    const validRecommends = recommends.filter(rec => !hasText(rec.text));
    
    const filteredRelated = related.filter(text => 
      !hasText(text) && !validRecommends.some(r => r.text.toLowerCase() === text.toLowerCase())
    );

    // We want all items to fit in 8 slots. Recommends go at the END.
    const maxRelatedCount = Math.max(0, 8 - result.length - validRecommends.length);

    let addedRelated = 0;
    while (filteredRelated.length > 0 && addedRelated < maxRelatedCount) {
      const text = filteredRelated.shift()!;
      result.push({ type: 'related', text });
      addText(text);
      addedRelated++;
    }
    
    for (const rec of validRecommends) {
      if (result.length < 8) {
        result.push(rec);
        addText(rec.text);
      }
    }
    
    while (filteredRelated.length > 0 && result.length < 8) {
      const text = filteredRelated.shift()!;
      result.push({ type: 'related', text });
      addText(text);
    }
    
    return result.slice(0, 8); // Max 8 suggestions
  };

  const highlightMatch = (text: string) => {
    const q = query.trim().toLowerCase();
    const lText = text.toLowerCase();
    const idx = lText.indexOf(q);
    if (idx === -1) return <span>{text}</span>;
    return (
      <span>
        {text.substring(0, idx)}
        <span className="text-blue-600 font-medium">{text.substring(idx, idx + q.length)}</span>
        {text.substring(idx + q.length)}
      </span>
    );
  };

  const renderSuggestions = () => {
    const suggestions = getSuggestions();
    
    return (
      <div className="absolute top-0 left-0 w-full min-h-full bg-gray-50/50 backdrop-blur-sm z-50">
        <div className="bg-white border-t border-gray-100 shadow-sm p-2 pb-4">
          {suggestions.map((item, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between px-3 py-2.5 border-b border-gray-50 last:border-b-0 cursor-pointer active:bg-gray-50 transition-colors"
              onClick={() => handleSearch(item.text)}
            >
              <div className="flex-1 min-w-0 pr-4 flex flex-col justify-center">
                <div className="flex items-center gap-2 truncate">
                  <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <div className="flex items-center text-[15px] text-gray-800 truncate">
                    <span className="truncate">{highlightMatch(item.text)}</span>
                    {item.badge && (
                      <span className="ml-1.5 px-1 py-[1px] border border-gray-200 text-gray-400 text-[9px] rounded-sm whitespace-nowrap leading-none shrink-0">
                        {item.badge}
                      </span>
                    )}
                    {item.type === 'recommend' && item.subtext && !item.rate && !item.risk && (
                      <span className="ml-2 text-xs text-gray-400 font-normal">
                        - {item.subtext}
                      </span>
                    )}
                  </div>
                </div>
                {item.type === 'recommend' && (item.rate || item.rateDesc) && (
                  <div className="flex flex-col ml-[22px]">
                    {item.rate && (
                      <span className="text-red-500 font-semibold text-[14px] leading-tight">
                        {item.rate}
                      </span>
                    )}
                    {(item.rateDesc || item.risk) && (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400 text-[10px] leading-none">{item.rateDesc}</span>
                        {item.rateDesc && item.risk && <span className="text-gray-300 text-[10px] leading-none">|</span>}
                        <span className="text-gray-400 text-[10px] leading-none">{item.risk}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="shrink-0 flex items-center">
                {item.rightTag === '搜过' && (
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{item.rightTag}</span>
                )}
                {item.rightTag === '热搜' && (
                  <span className="text-[10px] text-red-500 bg-red-50 border border-red-100/50 px-1.5 py-0.5 rounded">{item.rightTag}</span>
                )}
                {item.rightTag === '推荐' && (
                  <span className="text-[10px] text-orange-500 bg-orange-50 border border-orange-100/50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Flame className="w-2.5 h-2.5" />
                    {item.rightTag}
                  </span>
                )}
                {item.rightTag === '新品' && (
                  <span className="text-[10px] text-purple-600 bg-purple-50 border border-purple-100/50 px-1.5 py-0.5 rounded flex items-center gap-0.5 leading-none">
                    <Sparkles className="w-2.5 h-2.5" />
                    {item.rightTag}
                  </span>
                )}
                {!item.rightTag && <ArrowUpRight className="w-4 h-4 text-gray-300 ml-1" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!config.aiSearch?.visible || !config.aiSearch?.questions?.length) return;
    
    const interval = setInterval(() => {
      setAiQuestionIndex((prev) => (prev + 1) % config.aiSearch.questions.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [config.aiSearch?.visible, config.aiSearch?.questions]);

  const allDiscoveryItems = useMemo(() => {
    const currentUser = users[currentUserIndex] || users[0];
    return generateRecommendations(currentUser, config.searchDiscovery);
  }, [config.searchDiscovery, users, currentUserIndex]);

  const handleRefreshDiscovery = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
    
    if (allDiscoveryItems.length > 0) {
      const totalPages = Math.ceil(allDiscoveryItems.length / 7);
      setDiscoveryPageIndex(prev => (prev + 1) % totalPages);
    }
  };

  const currentDiscoveryItems = useMemo(() => {
    const start = discoveryPageIndex * 7;
    return allDiscoveryItems.slice(start, start + 7);
  }, [allDiscoveryItems, discoveryPageIndex]);

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    const newHistory = [q, ...history.filter(item => item !== q)].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
    
    // Update user's historySearch
    setUsers(prevUsers => {
      const newUsers = [...prevUsers];
      if (newUsers[currentUserIndex]) {
        newUsers[currentUserIndex] = {
          ...newUsers[currentUserIndex],
          historySearch: [q, ...newUsers[currentUserIndex].historySearch.filter(w => w !== q)].slice(0, 10)
        };
      }
      return newUsers;
    });

    onNavigate('results', q);
  };

  const handleBrowse = (word: string) => {
    setUsers(prevUsers => {
      const newUsers = [...prevUsers];
      if (newUsers[currentUserIndex]) {
        newUsers[currentUserIndex] = {
          ...newUsers[currentUserIndex],
          recentBrowse: [word, ...newUsers[currentUserIndex].recentBrowse.filter(w => w !== word)].slice(0, 10)
        };
      }
      return newUsers;
    });
  };

  const handleBannerClick = (link: string, title?: string) => {
    if (title) handleBrowse(title);
    if (link && link !== '#') {
      onNavigate(link as any);
    }
  };

  const renderHotSearchList = () => {
    return (
      <div className="bg-white rounded-xl overflow-hidden mt-2">
        {/* Hot Search Banner */}
        {config.hotSearchBanner.visible && (
          <div className="flex justify-between items-center p-4 border-b border-gray-50 cursor-pointer" onClick={() => handleBannerClick(config.hotSearchBanner.link)}>
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">{config.hotSearchBanner.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{config.hotSearchBanner.subtitle}</p>
            </div>
            {config.hotSearchBanner.imageUrl && (
              <img src={config.hotSearchBanner.imageUrl} alt="banner" className="h-16 w-auto max-w-[100px] object-contain rounded" referrerPolicy="no-referrer" />
            )}
          </div>
        )}

        {/* Hot Search Items */}
        <div className="px-4 py-2">
          {config.hotSearches.map((item, i) => (
            <div key={i} className="flex items-center py-3 cursor-pointer" onClick={() => handleSearch(item.title)}>
              <div className="flex items-center justify-center w-6 h-6 mr-3 shrink-0">
                {i < 3 ? (
                  <div 
                    className={`w-5 h-5 flex items-center justify-center ${
                      i === 0 ? 'bg-yellow-100' :
                      i === 1 ? 'bg-gray-100' :
                      'bg-red-50'
                    }`} 
                    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                  >
                    <div 
                      className={`w-4 h-4 flex items-center justify-center text-white text-[10px] font-bold ${
                        i === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                        i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                        'bg-gradient-to-br from-red-300 to-red-400'
                      }`} 
                      style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                    >
                      {i + 1}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400 text-lg font-bold italic">
                    {i + 1}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0 flex items-center justify-between">
                <div className="text-[15px] text-gray-900 font-medium truncate">{item.title}</div>
                {item.rightAdUrl && (
                  <img src={item.rightAdUrl} alt="ad" className="h-[22px] w-auto object-contain shrink-0 ml-2" referrerPolicy="no-referrer" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProductList = () => {
    const products = activeTab === '理财热搜' ? config.productRankings.wealth : config.productRankings.funds;
    
    return (
      <div className="mt-2 bg-white rounded-xl px-4 py-1 shadow-sm">
        {products.map((item, i) => (
          <div key={item.id} className="py-[14px] flex items-center border-b border-[#F5F5F5] last:border-0 cursor-pointer" onClick={() => handleSearch(item.name)}>
            <div className={`w-6 text-center text-[18px] shrink-0 ${
              i === 0 ? 'text-[#ef4444] font-semibold' :
              i === 1 ? 'text-[#f97316] font-semibold' :
              i === 2 ? 'text-[#eab308] font-semibold' :
              'text-[#8A96AC] font-medium'
            }`} style={{ fontFamily: 'Arial, sans-serif' }}>
              {i + 1}
            </div>
            
            <div className="flex-1 min-w-0 ml-2.5 mr-3">
              <div className="flex items-center">
                <div className="text-[15px] text-[#222222] font-medium truncate leading-tight">{item.name}</div>
                {item.badge === 'hot' && (
                  <span className="ml-[5px] text-[#ef4444] text-[10px] font-medium px-[3px] py-[1px] bg-[#fef1f1] rounded-[3px] whitespace-nowrap leading-tight">热</span>
                )}
              </div>
              <div className="text-[11px] text-[#999999] mt-[5px] flex items-center truncate">
                {item.code && (
                  <>
                    <span>{item.code}</span>
                    <span className="mx-1.5 text-[#e5e5e5]">|</span>
                  </>
                )}
                {item.tags && item.tags.map((tag, idx) => (
                  <React.Fragment key={idx}>
                    <span>{tag}</span>
                    {idx < item.tags.length - 1 && <span className="mx-1.5 text-[#e5e5e5]">|</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            <div className="text-right shrink-0">
              <div className={`text-[16px] font-semibold ${item.value.includes('%') || item.value.includes('热销') ? 'text-[#ef4444]' : 'text-[#333333]'}`} style={{ fontFamily: 'Arial, sans-serif' }}>
                {item.value}
              </div>
              {item.valueDesc && <div className="text-[11px] text-[#999999] mt-[3px]">{item.valueDesc}</div>}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-full bg-gray-50 flex flex-col relative">
      {/* Top Banner Background (Alipay Style) */}
      {config.topBanner.visible && (
        <div 
          className="absolute top-0 left-0 w-full h-[170px] bg-[length:100%_auto] bg-no-repeat bg-top z-0 cursor-pointer"
          onClick={() => handleBannerClick(config.topBanner.link)}
          style={{ 
            backgroundImage: `url(${config.topBanner.imageUrl})`,
            maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
          }}
        />
      )}

      <div className="relative z-10 flex flex-col h-full pt-12">
        {/* Search Header */}
        <div className="flex items-center px-4 mb-4 shrink-0">
          <ChevronLeft className="w-6 h-6 text-gray-800 mr-2 cursor-pointer" onClick={() => onNavigate('home')} />
          <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-full h-9 flex items-center px-3 border border-gray-200 shadow-sm">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-sm"
              placeholder="滴滴"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query || '滴滴')}
              autoFocus
            />
            <span className="text-blue-500 text-sm font-medium ml-2 border-l border-gray-200 pl-2 cursor-pointer" onClick={() => handleSearch(query || '滴滴')}>搜索</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6 relative">
          {/* Suggestions Dropdown Layer */}
          {query.trim().length > 0 && query.trim().length <= 2 && renderSuggestions()}

          {/* Spacer to push history down to align with banner bottom */}
          {config.topBanner.visible && (
            <div 
              className="w-full h-[70px] cursor-pointer" 
              onClick={() => handleBannerClick(config.topBanner.link)}
            ></div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[14px] font-bold text-gray-900">搜索历史</h3>
                {isDeleteMode ? (
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="cursor-pointer" onClick={() => { setHistory([]); setIsDeleteMode(false); }}>全部删除</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="cursor-pointer" onClick={() => setIsDeleteMode(false)}>完成</span>
                  </div>
                ) : (
                  <Trash2 className="w-4 h-4 text-gray-500 cursor-pointer" onClick={() => setIsDeleteMode(true)} />
                )}
              </div>
              <CollapsibleTagGroup 
                items={history}
                renderItem={(item, i) => (
                  <span 
                    key={i} 
                    className={`px-3 py-1.5 bg-white/80 backdrop-blur-sm text-gray-700 text-xs rounded-lg shadow-sm border border-gray-100 flex items-center ${isDeleteMode ? '' : 'cursor-pointer'}`}
                    onClick={() => !isDeleteMode && handleSearch(item)}
                  >
                    {item}
                    {isDeleteMode && (
                      <X 
                        className="w-3 h-3 ml-1.5 text-gray-400 cursor-pointer" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setHistory(prev => prev.filter(h => h !== item));
                        }} 
                      />
                    )}
                  </span>
                )}
              />
            </div>
          )}

          {/* Discovery */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[14px] font-bold text-gray-900">猜你想搜</h3>
              <RefreshCw 
                className={`w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors ${isRefreshing ? 'animate-spin' : ''}`} 
                onClick={handleRefreshDiscovery} 
              />
            </div>
            <CollapsibleTagGroup 
              items={currentDiscoveryItems}
              renderItem={(item, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1.5 backdrop-blur-sm text-xs rounded-lg flex items-center cursor-pointer shadow-sm border border-gray-100"
                  style={{
                    backgroundColor: item.bgColor || 'rgba(255, 255, 255, 0.8)',
                    color: item.textColor || '#374151'
                  }}
                  onClick={() => handleSearch(item.text)}
                >
                  {item.iconUrl && <img src={item.iconUrl} alt="icon" className="w-4 h-4 mr-1 object-contain" />}
                  {item.text}
                </span>
              )}
            />
          </div>

          {/* AI Search Entry */}
          {config.aiSearch?.visible && config.aiSearch.questions.length > 0 && (
            <motion.div 
              className="mb-6 flex items-center gap-2 group cursor-pointer"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => handleSearch(config.aiSearch.questions[aiQuestionIndex])}
            >
              <div className="text-[13px] text-gray-500 font-medium whitespace-nowrap pl-1">
                试试问
              </div>
              <div 
                className="flex h-8 rounded-full border border-[#5D5FEF]/15 bg-gradient-to-r from-[#5D5FEF]/15 via-[#5D5FEF]/[0.04] to-transparent items-center pl-0.5 pr-4 shadow-[0_2px_10px_-3px_rgba(93,95,239,0.1)] group-hover:shadow-[0_4px_12px_-4px_rgba(93,95,239,0.2)] transition-all relative overflow-hidden"
              >
                {/* AI Shimmer Effect */}
                <motion.div 
                  className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-20deg] z-0"
                  animate={{ left: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                />

                <div className="w-[26px] h-[26px] rounded-full shrink-0 flex items-center justify-center overflow-hidden z-10 bg-white shadow-sm ring-1 ring-white/50">
                  <img src="https://s1.img-e.com/20260420/69e6142086a5d.png" alt="兴福龙" className="w-full h-full object-cover" />
                </div>
                
                <div className="overflow-hidden ml-1 h-full relative z-10">
                  <div 
                    className="transition-transform duration-500 flex flex-col relative"
                    style={{ transform: `translateY(-${aiQuestionIndex * 32}px)`, transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
                  >
                    {config.aiSearch.questions.map((q, idx) => (
                      <div key={idx} className="h-8 flex items-center text-[13px] text-gray-800 font-medium whitespace-nowrap">
                        {q}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Middle Ad Banner */}
          {config.middleAdBanner?.visible && showMiddleAd && (
            <div 
              className="mb-4 bg-red-50/80 rounded-lg flex items-center justify-between px-3 py-2 cursor-pointer border border-red-100/50"
              onClick={() => handleSearch(config.middleAdBanner.link)}
            >
              <div className="flex items-center flex-1 min-w-0">
                {config.middleAdBanner.iconUrl && (
                  <img src={config.middleAdBanner.iconUrl} alt="ad icon" className="w-4 h-4 mr-2 object-contain shrink-0" />
                )}
                <div className="text-xs text-gray-800 truncate">
                  {config.middleAdBanner.text}
                  {config.middleAdBanner.highlightText && (
                    <span className="text-red-500 ml-1">{config.middleAdBanner.highlightText}</span>
                  )}
                </div>
              </div>
              <div 
                className="shrink-0 ml-2 p-1 bg-white/50 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMiddleAd(false);
                }}
              >
                <X className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex space-x-6 border-b border-gray-200 mb-2">
            {['全部热搜', '理财热搜', '基金热搜'].map(tab => (
              <span 
                key={tab}
                className={`pb-2 text-[15px] cursor-pointer relative ${activeTab === tab ? 'font-bold text-gray-900' : 'text-gray-500'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-500 rounded-full"></div>}
              </span>
            ))}
          </div>

          {/* Content based on tab */}
          {activeTab === '全部热搜' ? renderHotSearchList() : renderProductList()}
        </div>
      </div>
    </div>
  );
};
