import React, { useState, useMemo } from 'react';
import { useConfig, LegoCardType } from '../store';
import { Settings, Plus, Trash2, Save, Download, User, RefreshCw } from 'lucide-react';
import { generateRecommendations, UserProfile } from '../services/recommendationEngine';

const UserReportCard: React.FC<{
  user: UserProfile;
  index: number;
  isCurrent: boolean;
  onSetCurrent: () => void;
}> = ({ user, index, isCurrent, onSetCurrent }) => {
  const { config } = useConfig();
  const [pageIndex, setPageIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const recs = useMemo(() => generateRecommendations(user, config.searchDiscovery), [user, config.searchDiscovery]);
  const totalPages = Math.ceil(recs.length / 7);
  const start = pageIndex * 7;
  const currentRecs = recs.slice(start, start + 7);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
    if (recs.length > 0) {
      setPageIndex(prev => (prev + 1) % totalPages);
    }
  };

  return (
    <div className={`bg-white rounded-xl border ${isCurrent ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} p-4 flex flex-col`}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <User className="w-5 h-5 mr-2 text-gray-400" />
          <h4 className="font-bold text-gray-800">{user.name}</h4>
        </div>
        <button 
          onClick={onSetCurrent}
          className={`text-xs px-2.5 py-1 rounded-full border ${isCurrent ? 'bg-blue-50 text-blue-600 border-blue-200 font-medium' : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'}`}
        >
          {isCurrent ? '当前体验' : '切换体验'}
        </button>
      </div>
      
      <div className="text-xs space-y-2 mb-4 text-gray-600 bg-gray-50 p-2.5 rounded-lg flex-1">
        <div><span className="font-medium text-gray-700">特征：</span>{JSON.stringify(user.status)}</div>
        <div><span className="font-medium text-gray-700">近期浏览：</span>{user.recentBrowse.length > 0 ? user.recentBrowse.join(', ') : '无'}</div>
        <div><span className="font-medium text-gray-700">历史搜索：</span>{user.historySearch.length > 0 ? user.historySearch.join(', ') : '无'}</div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <h5 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">生成的推荐词 (批次 {pageIndex + 1}/{totalPages})</h5>
          <RefreshCw 
            className={`w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} 
            onClick={handleRefresh} 
          />
        </div>
        <div className="flex flex-wrap gap-1.5 min-h-[44px]">
          {currentRecs.map((rec, rIdx) => (
            <span key={rIdx} className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded border border-orange-100">
              {rec.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AdminPanel: React.FC = () => {
  const { config, setConfig, users, currentUserIndex, setCurrentUserIndex } = useConfig();
  const [activeTab, setActiveTab] = useState<'discovery' | 'lego' | 'banners' | 'products' | 'users'>('discovery');
  const [productTab, setProductTab] = useState<'funds' | 'wealth'>('funds');

  const addDiscovery = () => {
    setConfig(prev => ({
      ...prev,
      searchDiscovery: [...prev.searchDiscovery, { text: '新词条', iconUrl: '' }]
    }));
  };

  const updateDiscovery = (index: number, field: string, value: any) => {
    setConfig(prev => {
      const newDiscovery = [...prev.searchDiscovery];
      newDiscovery[index] = { ...newDiscovery[index], [field]: value };
      return { ...prev, searchDiscovery: newDiscovery };
    });
  };

  const removeDiscovery = (index: number) => {
    setConfig(prev => ({
      ...prev,
      searchDiscovery: prev.searchDiscovery.filter((_, i) => i !== index)
    }));
  };

  const addLegoCard = () => {
    setConfig(prev => ({
      ...prev,
      legoCards: [
        ...prev.legoCards,
        {
          id: Date.now().toString(),
          keyword: '外汇',
          type: 'exchange' as LegoCardType,
          title: '外汇牌价',
          data: {}
        }
      ]
    }));
  };

  const updateLegoCard = (id: string, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      legoCards: prev.legoCards.map(card => card.id === id ? { ...card, [field]: value } : card)
    }));
  };

  const removeLegoCard = (id: string) => {
    setConfig(prev => ({
      ...prev,
      legoCards: prev.legoCards.filter(card => card.id !== id)
    }));
  };

  const updateProduct = (index: number, field: string, value: any, isMainDesc = false, isSubDesc = false) => {
    setConfig(prev => {
      const newRankings = { ...prev.productRankings };
      const product = { ...newRankings[productTab][index] };

      if (isMainDesc) {
        product.mainDesc = { ...product.mainDesc, [field]: value } as any;
      } else if (isSubDesc) {
        product.subDesc = { ...product.subDesc, [field]: value } as any;
      } else {
        (product as any)[field] = value;
      }

      newRankings[productTab][index] = product;
      return { ...prev, productRankings: newRankings };
    });
  };

  const handleExportConfig = () => {
    const configString = JSON.stringify(config, null, 2);
    const blob = new Blob([configString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'search-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col h-[812px]">
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          <h2 className="text-lg font-bold">搜索配置后管系统</h2>
        </div>
        <button 
          onClick={handleExportConfig}
          className="flex items-center text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded transition-colors"
          title="导出当前配置"
        >
          <Download className="w-4 h-4 mr-1.5" />
          导出配置
        </button>
      </div>

      <div className="flex border-b border-gray-200">
        <button 
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'discovery' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('discovery')}
        >
          猜你想搜配置
        </button>
        <button 
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'lego' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('lego')}
        >
          乐高卡片配置
        </button>
        <button 
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'banners' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('banners')}
        >
          运营位配置
        </button>
        <button 
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'products' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('products')}
        >
          产品榜单配置
        </button>
        <button 
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('users')}
        >
          千人千面报表
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {activeTab === 'discovery' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">猜你想搜词条</h3>
              <button onClick={addDiscovery} className="flex items-center text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md">
                <Plus className="w-4 h-4 mr-1" /> 添加词条
              </button>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 max-h-[400px] overflow-y-auto">
              {config.searchDiscovery.map((item, i) => (
                <div key={i} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <div className="flex flex-col space-y-2 flex-1">
                    <div className="flex space-x-2">
                      <input 
                        type="text" 
                        value={item.text}
                        onChange={(e) => updateDiscovery(i, 'text', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-blue-500"
                        placeholder="词条名称"
                      />
                      <input 
                        type="text" 
                        value={item.iconUrl || ''}
                        onChange={(e) => updateDiscovery(i, 'iconUrl', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-blue-500"
                        placeholder="图标URL (可选)"
                      />
                      {item.iconUrl && (
                        <img src={item.iconUrl} alt="icon" className="w-6 h-6 object-cover rounded" />
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex items-center space-x-2 flex-1">
                        <span className="text-xs text-gray-500 whitespace-nowrap">背景色</span>
                        <input 
                          type="color" 
                          value={item.bgColor || '#ffffff'}
                          onChange={(e) => updateDiscovery(i, 'bgColor', e.target.value)}
                          className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
                        />
                        <input 
                          type="text" 
                          value={item.bgColor || ''}
                          onChange={(e) => updateDiscovery(i, 'bgColor', e.target.value)}
                          className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-blue-500"
                          placeholder="例如: #fef2f2"
                        />
                      </div>
                      <div className="flex items-center space-x-2 flex-1">
                        <span className="text-xs text-gray-500 whitespace-nowrap">字体色</span>
                        <input 
                          type="color" 
                          value={item.textColor || '#374151'}
                          onChange={(e) => updateDiscovery(i, 'textColor', e.target.value)}
                          className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
                        />
                        <input 
                          type="text" 
                          value={item.textColor || ''}
                          onChange={(e) => updateDiscovery(i, 'textColor', e.target.value)}
                          className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-blue-500"
                          placeholder="例如: #ef4444"
                        />
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeDiscovery(i)} className="p-1.5 text-red-500 hover:bg-red-50 rounded h-fit">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              提示：修改后可在左侧模拟器中实时预览效果。
            </div>
          </div>
        )}

        {activeTab === 'lego' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">乐高卡片触发规则</h3>
              <button onClick={addLegoCard} className="flex items-center text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md">
                <Plus className="w-4 h-4 mr-1" /> 新增卡片
              </button>
            </div>

            <div className="space-y-4">
              {config.legoCards.map((card) => (
                <div key={card.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-gray-900">卡片 ID: {card.id}</h4>
                    <button onClick={() => removeLegoCard(card.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">触发关键词 (Query)</label>
                      <input 
                        type="text" 
                        value={card.keyword}
                        onChange={(e) => updateLegoCard(card.id, 'keyword', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">卡片组件类型</label>
                      <select 
                        value={card.type}
                        onChange={(e) => updateLegoCard(card.id, 'type', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
                      >
                        <option value="wealth">理财组件 (Wealth)</option>
                        <option value="gold">黄金组件 (Gold)</option>
                        <option value="exchange">外汇组件 (Exchange)</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">卡片标题</label>
                      <input 
                        type="text" 
                        value={card.title}
                        onChange={(e) => updateLegoCard(card.id, 'title', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              提示：在左侧模拟器搜索框输入触发关键词（如“理财”、“黄金”），即可在结果页看到对应的乐高卡片。
            </div>
          </div>
        )}

        {activeTab === 'banners' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">顶部活动图 (Top Banner)</h3>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <div className={`w-10 h-6 rounded-full transition-colors ${config.topBanner.visible ? 'bg-blue-600' : 'bg-gray-300'} relative`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${config.topBanner.visible ? 'translate-x-5' : 'translate-x-1'}`}></div>
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={config.topBanner.visible}
                    onChange={(e) => setConfig(prev => ({ ...prev, topBanner: { ...prev.topBanner, visible: e.target.checked } }))}
                  />
                </label>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">图片 URL</label>
                  <input 
                    type="text" 
                    value={config.topBanner.imageUrl}
                    onChange={(e) => setConfig(prev => ({ ...prev, topBanner: { ...prev.topBanner, imageUrl: e.target.value } }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">跳转链接 (Route/URL)</label>
                  <input 
                    type="text" 
                    value={config.topBanner.link}
                    onChange={(e) => setConfig(prev => ({ ...prev, topBanner: { ...prev.topBanner, link: e.target.value } }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                    placeholder="例如：spring-festival"
                  />
                </div>
                {config.topBanner.visible && (
                  <div className="mt-2 rounded-lg overflow-hidden h-20 border border-gray-200 bg-gray-50 flex items-center justify-center">
                    <img src={config.topBanner.imageUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">热搜榜活动图 (Hot Search Banner)</h3>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <div className={`w-10 h-6 rounded-full transition-colors ${config.hotSearchBanner.visible ? 'bg-blue-600' : 'bg-gray-300'} relative`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${config.hotSearchBanner.visible ? 'translate-x-5' : 'translate-x-1'}`}></div>
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={config.hotSearchBanner.visible}
                    onChange={(e) => setConfig(prev => ({ ...prev, hotSearchBanner: { ...prev.hotSearchBanner, visible: e.target.checked } }))}
                  />
                </label>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">主标题</label>
                  <input 
                    type="text" 
                    value={config.hotSearchBanner.title || ''}
                    onChange={(e) => setConfig(prev => ({ ...prev, hotSearchBanner: { ...prev.hotSearchBanner, title: e.target.value } }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                    placeholder="例如：沈腾领衔飞驰人生3"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">副标题</label>
                  <input 
                    type="text" 
                    value={config.hotSearchBanner.subtitle || ''}
                    onChange={(e) => setConfig(prev => ({ ...prev, hotSearchBanner: { ...prev.hotSearchBanner, subtitle: e.target.value } }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                    placeholder="例如：制作升级燃爽加倍"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">图片 URL</label>
                  <input 
                    type="text" 
                    value={config.hotSearchBanner.imageUrl}
                    onChange={(e) => setConfig(prev => ({ ...prev, hotSearchBanner: { ...prev.hotSearchBanner, imageUrl: e.target.value } }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">跳转链接 (Route/URL)</label>
                  <input 
                    type="text" 
                    value={config.hotSearchBanner.link}
                    onChange={(e) => setConfig(prev => ({ ...prev, hotSearchBanner: { ...prev.hotSearchBanner, link: e.target.value } }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                    placeholder="例如：xingshan-loan"
                  />
                </div>
                {config.hotSearchBanner.visible && (
                  <div className="mt-2 rounded-lg overflow-hidden h-16 border border-gray-200">
                    <img src={config.hotSearchBanner.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">AI搜索入口 (AI Search)</h3>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <div className={`w-10 h-6 rounded-full transition-colors ${config.aiSearch?.visible ? 'bg-blue-600' : 'bg-gray-300'} relative`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${config.aiSearch?.visible ? 'translate-x-5' : 'translate-x-1'}`}></div>
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={config.aiSearch?.visible || false}
                    onChange={(e) => setConfig(prev => ({ ...prev, aiSearch: { ...prev.aiSearch, visible: e.target.checked } }))}
                  />
                </label>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">预设问题 (每行一个)</label>
                  <textarea 
                    rows={4}
                    value={config.aiSearch?.questions?.join('\n') || ''}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      aiSearch: { 
                        ...prev.aiSearch, 
                        questions: e.target.value.split('\n').filter(q => q.trim() !== '') 
                      } 
                    }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none"
                    placeholder="请输入预设问题..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">中部文字广告 (Middle Ad Banner)</h3>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <div className={`w-10 h-6 rounded-full transition-colors ${config.middleAdBanner.visible ? 'bg-blue-600' : 'bg-gray-300'} relative`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${config.middleAdBanner.visible ? 'translate-x-5' : 'translate-x-1'}`}></div>
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={config.middleAdBanner.visible}
                    onChange={(e) => setConfig(prev => ({ ...prev, middleAdBanner: { ...prev.middleAdBanner, visible: e.target.checked } }))}
                  />
                </label>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">图标 URL</label>
                  <input 
                    type="text" 
                    value={config.middleAdBanner.iconUrl || ''}
                    onChange={(e) => setConfig(prev => ({ ...prev, middleAdBanner: { ...prev.middleAdBanner, iconUrl: e.target.value } }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">广告文案</label>
                  <input 
                    type="text" 
                    value={config.middleAdBanner.text}
                    onChange={(e) => setConfig(prev => ({ ...prev, middleAdBanner: { ...prev.middleAdBanner, text: e.target.value } }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">高亮文案 (红色)</label>
                  <input 
                    type="text" 
                    value={config.middleAdBanner.highlightText || ''}
                    onChange={(e) => setConfig(prev => ({ ...prev, middleAdBanner: { ...prev.middleAdBanner, highlightText: e.target.value } }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">跳转链接 (Route/URL)</label>
                  <input 
                    type="text" 
                    value={config.middleAdBanner.link}
                    onChange={(e) => setConfig(prev => ({ ...prev, middleAdBanner: { ...prev.middleAdBanner, link: e.target.value } }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">楼层底部广告 (Floor Ad Banner)</h3>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <div className={`w-10 h-6 rounded-full transition-colors ${config.floorAdBanner.visible ? 'bg-blue-600' : 'bg-gray-300'} relative`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${config.floorAdBanner.visible ? 'translate-x-5' : 'translate-x-1'}`}></div>
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={config.floorAdBanner.visible}
                    onChange={(e) => setConfig(prev => ({ ...prev, floorAdBanner: { ...prev.floorAdBanner, visible: e.target.checked } }))}
                  />
                </label>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">左上角标签</label>
                  <input 
                    type="text" 
                    value={config.floorAdBanner.tag}
                    onChange={(e) => setConfig(prev => ({ ...prev, floorAdBanner: { ...prev.floorAdBanner, tag: e.target.value } }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">主标题</label>
                  <input 
                    type="text" 
                    value={config.floorAdBanner.title}
                    onChange={(e) => setConfig(prev => ({ ...prev, floorAdBanner: { ...prev.floorAdBanner, title: e.target.value } }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">副标题</label>
                  <input 
                    type="text" 
                    value={config.floorAdBanner.subtitle}
                    onChange={(e) => setConfig(prev => ({ ...prev, floorAdBanner: { ...prev.floorAdBanner, subtitle: e.target.value } }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">收益率 (如: 4.12%)</label>
                  <input 
                    type="text" 
                    value={config.floorAdBanner.rate}
                    onChange={(e) => setConfig(prev => ({ ...prev, floorAdBanner: { ...prev.floorAdBanner, rate: e.target.value } }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">收益率描述 (如: 成立以来年化)</label>
                  <input 
                    type="text" 
                    value={config.floorAdBanner.rateDesc}
                    onChange={(e) => setConfig(prev => ({ ...prev, floorAdBanner: { ...prev.floorAdBanner, rateDesc: e.target.value } }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">跳转链接 (Route/URL)</label>
                  <input 
                    type="text" 
                    value={config.floorAdBanner.link}
                    onChange={(e) => setConfig(prev => ({ ...prev, floorAdBanner: { ...prev.floorAdBanner, link: e.target.value } }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">猜您喜欢 (Guess You Like)</h3>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <div className={`w-10 h-6 rounded-full transition-colors ${config.guessYouLike.visible ? 'bg-blue-600' : 'bg-gray-300'} relative`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${config.guessYouLike.visible ? 'translate-x-5' : 'translate-x-1'}`}></div>
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={config.guessYouLike.visible}
                    onChange={(e) => setConfig(prev => ({ ...prev, guessYouLike: { ...prev.guessYouLike, visible: e.target.checked } }))}
                  />
                </label>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">模块标题</label>
                  <input 
                    type="text" 
                    value={config.guessYouLike.title}
                    onChange={(e) => setConfig(prev => ({ ...prev, guessYouLike: { ...prev.guessYouLike, title: e.target.value } }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">免责声明</label>
                  <input 
                    type="text" 
                    value={config.guessYouLike.disclaimer}
                    onChange={(e) => setConfig(prev => ({ ...prev, guessYouLike: { ...prev.guessYouLike, disclaimer: e.target.value } }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">产品榜单配置</h3>
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button 
                  className={`px-4 py-1.5 text-sm rounded-md ${productTab === 'funds' ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-600'}`}
                  onClick={() => setProductTab('funds')}
                >
                  基金热搜
                </button>
                <button 
                  className={`px-4 py-1.5 text-sm rounded-md ${productTab === 'wealth' ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-600'}`}
                  onClick={() => setProductTab('wealth')}
                >
                  理财热搜
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {config.productRankings[productTab].map((product, i) => (
                <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <h4 className="font-medium text-gray-900 mb-3 border-b border-gray-100 pb-2">排名 {i + 1}: {product.name}</h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">产品名称</label>
                      <input 
                        type="text" 
                        value={product.name}
                        onChange={(e) => updateProduct(i, 'name', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">收益率/数值</label>
                      <input 
                        type="text" 
                        value={product.value}
                        onChange={(e) => updateProduct(i, 'value', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">
                    <h5 className="text-xs font-bold text-gray-700 mb-2">描述 (例如: 前1%)</h5>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] text-gray-500 mb-1">文本</label>
                        <input 
                          type="text" 
                          value={product.mainDesc?.text || ''}
                          onChange={(e) => updateProduct(i, 'text', e.target.value, true, false)}
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 mb-1">颜色 (Hex)</label>
                        <input 
                          type="text" 
                          value={product.mainDesc?.color || '#000000'}
                          onChange={(e) => updateProduct(i, 'color', e.target.value, true, false)}
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 mb-1">字号 (px)</label>
                        <input 
                          type="number" 
                          value={product.mainDesc?.fontSize || 16}
                          onChange={(e) => updateProduct(i, 'fontSize', parseInt(e.target.value), true, false)}
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <h5 className="text-xs font-bold text-gray-700 mb-2">标题 (例如: 热度排名)</h5>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] text-gray-500 mb-1">文本</label>
                        <input 
                          type="text" 
                          value={product.subDesc?.text || ''}
                          onChange={(e) => updateProduct(i, 'text', e.target.value, false, true)}
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 mb-1">颜色 (Hex)</label>
                        <input 
                          type="text" 
                          value={product.subDesc?.color || '#9ca3af'}
                          onChange={(e) => updateProduct(i, 'color', e.target.value, false, true)}
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 mb-1">字号 (px)</label>
                        <input 
                          type="number" 
                          value={product.subDesc?.fontSize || 12}
                          onChange={(e) => updateProduct(i, 'fontSize', parseInt(e.target.value), false, true)}
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && users && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800">千人千面报表</h3>
            <p className="text-sm text-gray-500">查看当前配置和交互产生的各用户推荐词表，切换当前生效用户以在模拟器中体验</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user, i) => (
                  <UserReportCard 
                    key={user.id} 
                    user={user} 
                    index={i} 
                    isCurrent={i === currentUserIndex} 
                    onSetCurrent={() => setCurrentUserIndex(i)} 
                  />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
