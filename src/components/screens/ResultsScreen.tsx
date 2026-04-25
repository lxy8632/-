import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, X, Star, ChevronRight, Sparkles, Unlock, CreditCard, RefreshCw, ArrowRight, PiggyBank, ShieldCheck, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType } from '../MobileSimulator';
import { useConfig } from '../../store';
import { LegoCards } from '../LegoCards';

export const ResultsScreen: React.FC<{ onNavigate: (screen: ScreenType, query?: string) => void, query: string }> = ({ onNavigate, query }) => {
  const { config } = useConfig();
  const [activeTab, setActiveTab] = useState('全部');
  const tabs = ['全部', '服务', '产品', '微应用', '内容', '活动', '生活'];

  const [aiState, setAiState] = useState<'thinking' | 'typing' | 'complete'>('thinking');
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    setAiState('thinking');
    setTypedText('');

    let mockText = "正在为您搜索并提供相关建议...";
    if (query.includes('解控') || query.includes('限制') || query.includes('风控')) {
      mockText = '为您找到相关业务：您的账户可能存在非柜面交易限制或处于睡眠状态。您可以准备有效身份证件和实名认证手机号，尝试解除支付限制或进行睡眠户激活以恢复正常交易。';
    } else if (query.includes('信用卡还款') || query.includes('还款')) {
      mockText = '当前查询到本期应还：¥2,580.00，最后还款日：03月28日。您可以直接操作立即还款、分期还款，或者进入信用卡管理设置自动扣款。';
    } else if (query.includes('换卡')) {
      mockText = '支持同号换卡、损坏换卡、到期换卡等业务。办理换卡不换号您可以点击申请换卡，选择换卡原因并勾选保留原卡号。';
    } else if (query.includes('黄金')) {
      mockText = '今日黄金价格查询及存金通办理，近期超过1000万人正在关注。黄金可抗通胀，1元起购。';
    } else if (query.includes('理财') || query.includes('存款')) {
      mockText = '已为您筛选热门理财产品，涵盖低风险及稳健型投资。您可以下方查看具体七日年化收益和起购金额，也可以了解大额存单等服务。';
    }

    const thinkTimer = setTimeout(() => {
      setAiState('typing');
      let i = 0;
      // Fixed at 30ms per character to make sure it finishes within 3-4s
      const typeInterval = setInterval(() => {
        setTypedText(mockText.slice(0, i + 1));
        i++;
        if (i >= mockText.length) {
          clearInterval(typeInterval);
        }
      }, 30);

      // Force complete at 5 seconds (1.5s thinking + 3.5s typing)
      const completeTimer = setTimeout(() => {
        clearInterval(typeInterval);
        setAiState('complete');
      }, 3500);

      return () => {
        clearInterval(typeInterval);
        clearTimeout(completeTimer);
      };
    }, 1500);

    return () => clearTimeout(thinkTimer);
  }, [query]);

  // Check if query matches a Lego Card
  const matchedCard = config.legoCards.find(card => query.includes(card.keyword));

  const renderAISummary = () => {
    let intentData = null;
    
    if (query.includes('解控') || query.includes('限制')) {
      intentData = {
        title: '解除账户限制',
        icon: <Unlock className="w-5 h-5 text-blue-600" />,
        desc: '您的账户可能存在非柜面交易限制或处于睡眠状态',
        buttons: ['解除支付限制', '睡眠户激活'],
        faq: {
          q: '怎么解除非柜面交易限制？',
          steps: [
            '1. 准备好有效身份证件和实名认证的手机号',
            '2. 点击上方“解除支付限制”进行在线人脸识别',
            '3. 审核通过后即可恢复正常交易'
          ],
          actions: ['去解除', '查看详细说明']
        }
      };
    } else if (query.includes('限额') || query.includes('限额了')) {
      intentData = {
        title: '账户限额管理',
        icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
        desc: '如您遇到交易金额超限，可在此进行快捷调整',
        buttons: ['调整转账限额', '快捷支付限额设置'],
        faq: {
          q: '怎么提高我的转账限额？',
          steps: [
            '1. 点击上方“调整转账限额”',
            '2. 选择您需要提额的卡片',
            '3. 刷脸验证或使用兴业盾完成额度提升'
          ],
          actions: ['去提额', '查看限额规则']
        }
      };
    } else if (query.includes('证件') || query.includes('证件号')) {
      intentData = {
        title: '证件有效期更新',
        icon: <UserCircle className="w-5 h-5 text-blue-600" />,
        desc: '您的有效身份证件信息可在线进行快速更新',
        buttons: ['身份证更新', '护照及其他证件'],
        faq: {
          q: '身份证到期了如何更新？',
          steps: [
            '1. 请准备好您最新的二代身份证原件',
            '2. 点击上方“身份证更新”进入拍照环节',
            '3. 系统将自动识别并更新您的证件有效期'
          ],
          actions: ['立即更新', '视频办理']
        }
      };
    } else if (query.includes('信用卡还款') || query.includes('还款')) {
      intentData = {
        title: '信用卡查账还款',
        icon: <CreditCard className="w-5 h-5 text-blue-600" />,
        desc: '当前本期应还：¥2,580.00，最后还款日：03月28日',
        buttons: ['立即还款', '分期还款', '设置自动还款'],
        faq: {
          q: '信用卡怎么设置自动还款？',
          steps: [
            '1. 进入“信用卡-卡片管理”',
            '2. 选择“自动还款设置”',
            '3. 绑定本行借记卡并开启自动扣款'
          ],
          actions: ['去设置', '查看视频教程']
        }
      };
    } else if (query.includes('换卡')) {
      intentData = {
        title: '兴业卡换卡及激活',
        icon: <RefreshCw className="w-5 h-5 text-blue-600" />,
        desc: '支持同号换卡、损坏换卡、到期换卡等业务',
        buttons: ['申请换卡', '换卡激活', '进度查询'],
        faq: {
          q: '换卡不换号怎么办理？',
          steps: [
            '1. 点击上方“申请换卡”',
            '2. 选择需要更换的卡片，换卡原因选择“损坏换卡”或“到期换卡”',
            '3. 勾选“保留原卡号”并确认邮寄地址'
          ],
          actions: ['去办理', '查看网点']
        }
      };
    }

    if (!intentData) return null;

    return (
      <motion.div 
        className="mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* AI Header */}
        <div className="flex items-center gap-1.5 mb-2 px-1">
          <div className="w-[22px] h-[22px] rounded-full shadow-sm overflow-hidden bg-white ring-1 ring-blue-100 flex items-center justify-center shrink-0">
            <img src="https://s1.img-e.com/20260420/69e6142086a5d.png" alt="兴福龙" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-gray-900 text-sm tracking-wide">小兴智搜</span>
        </div>

        <div className="bg-gradient-to-b from-blue-50/80 to-white rounded-xl p-4 shadow-sm border border-blue-100/50 relative overflow-hidden transition-all duration-300">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          
          {aiState === 'thinking' && (
            <div className="h-10 flex items-center pl-1 relative z-10">
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}

          {aiState === 'typing' && (
            <div className="min-h-16 relative z-10">
              <div className="text-[13px] text-gray-700 leading-relaxed">
                {typedText}<span className="inline-block w-1.5 h-[14px] bg-blue-500 ml-1 animate-pulse align-middle"></span>
              </div>
            </div>
          )}

          {aiState === 'complete' && (
            <>
              {/* Intent Matching */}
              <div className="mb-4 relative z-10 animate-fade-in">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-blue-50 flex items-center justify-center shrink-0">
                {intentData.icon}
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 flex items-center gap-1">
                  您可能想办理：<span className="text-blue-600">{intentData.title}</span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{intentData.desc}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3 pl-[52px]">
              {intentData.buttons.map((btn, idx) => (
                <button key={idx} className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-transform active:scale-95 ${idx === 0 ? 'bg-blue-600 text-white shadow-sm shadow-blue-200' : 'bg-white text-blue-600 border border-blue-200'}`}>
                  {btn}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-blue-100 to-transparent my-3 relative z-10"></div>

          {/* Smart FAQ */}
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-[10px] text-orange-600 font-bold">Q</span>
              </div>
              <span className="text-sm font-bold text-gray-800">{intentData.faq.q}</span>
            </div>
            <div className="pl-5 space-y-1.5 mb-3">
              {intentData.faq.steps.map((step, idx) => (
                <div key={idx} className="text-xs text-gray-600 leading-relaxed">{step}</div>
              ))}
            </div>
            <div className="flex gap-4 pl-5">
              {intentData.faq.actions.map((action, idx) => (
                <button key={idx} className={`text-xs font-medium flex items-center ${idx === 0 ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                  {action} {idx === 0 && <ArrowRight className="w-3 h-3 ml-0.5" />}
                </button>
              ))}
            </div>
          </div>
            </>
          )}
        </div>
      </motion.div>
    );
  };

  const renderSearchPromotion = () => {
    let promoData = null;

    if (query.includes('理财') || query.includes('赚钱') || query.includes('存款')) {
      promoData = {
        title: '热门理财推荐',
        actionText: '更多理财',
        products: [
          {
            id: 1,
            name: '兴银理财稳利天天利1号',
            desc: '代销理财 | 1万元起购 | 低风险',
            rate: '2.55%',
            rateDesc: '七日年化',
            actionText: '立即查看',
            bgGradient: 'from-[#FFF8F0] to-[#FFEFE0]'
          },
          {
            id: 2,
            name: '兴银理财稳健半年定开',
            desc: '代销理财 | 1000元起购 | 中低风险',
            rate: '3.20%',
            rateDesc: '业绩比较基准',
            actionText: '立即查看',
            bgGradient: 'from-[#FFF8F0] to-[#FFEFE0]'
          },
          {
            id: 3,
            name: '兴业优选平衡混合型基金A',
            desc: '混合型 | 10元起购 | 中风险',
            rate: '+15.2%',
            rateDesc: '近一年收益',
            actionText: '立即查看',
            bgGradient: 'from-[#FFF8F0] to-[#FFEFE0]'
          }
        ]
      };
    } else if (query.includes('信用卡') || query.includes('办卡')) {
      promoData = {
        title: '热门信用卡推荐',
        actionText: '更多卡片',
        products: [
          {
            id: 1,
            name: '兴业银行兴福龙卡白金卡',
            desc: '新户达标享好礼 | 首年免年费',
            highlight: '限时新户礼',
            actionText: '立即申请',
            bgGradient: 'from-[#F4F6F9] to-[#E8EDF3]'
          },
          {
            id: 2,
            name: '兴业银行和花金卡',
            desc: '女性专属 | 消费达标免年费',
            highlight: '最高5万额度',
            actionText: '立即申请',
            bgGradient: 'from-[#F4F6F9] to-[#E8EDF3]'
          },
          {
            id: 3,
            name: '兴业银行行卡白金卡',
            desc: '商旅必备 | 尊享机场贵宾厅',
            highlight: '接送机权益',
            actionText: '立即申请',
            bgGradient: 'from-[#F4F6F9] to-[#E8EDF3]'
          }
        ]
      };
    } else if (query.includes('贷款') || query.includes('借钱') || query.includes('融资')) {
      promoData = {
        title: '热门贷款推荐',
        actionText: '更多贷款',
        products: [
          {
            id: 1,
            name: '兴闪贷 - 个人信用贷款',
            desc: '纯信用 | 秒批秒贷 | 随借随还',
            rate: '3.45%',
            rateDesc: '年化利率起',
            actionText: '测算额度',
            bgGradient: 'from-[#F0FDF4] to-[#DCFCE7]'
          },
          {
            id: 2,
            name: '个人经营性贷款',
            desc: '额度高 | 期限长 | 审批快',
            highlight: '最高1000万',
            actionText: '立即申请',
            bgGradient: 'from-[#F0FDF4] to-[#DCFCE7]'
          },
          {
            id: 3,
            name: '个人车位贷款',
            desc: '轻松购位 | 缓解资金压力',
            highlight: '最长贷5年',
            actionText: '立即申请',
            bgGradient: 'from-[#F0FDF4] to-[#DCFCE7]'
          }
        ]
      };
    } else if (query.includes('养老') || query.includes('退休')) {
      promoData = {
        title: '个人养老金专区',
        actionText: '进入专区',
        products: [
          {
            id: 1,
            name: '个人养老金资金账户',
            desc: '享税收优惠 | 每年最高节税5400元',
            highlight: '开户享好礼',
            actionText: '立即开户',
            bgGradient: 'from-[#FAF5FF] to-[#F3E8FF]'
          },
          {
            id: 2,
            name: '养老目标日期2040Y份额',
            desc: '专属基金 | 申购费率一折优惠',
            rate: '中风险',
            rateDesc: '风险等级',
            actionText: '立即查看',
            bgGradient: 'from-[#FAF5FF] to-[#F3E8FF]'
          },
          {
            id: 3,
            name: '安康养老理财产品',
            desc: '稳健增值 | 长期限理财',
            rate: '中低风险',
            rateDesc: '风险等级',
            actionText: '立即查看',
            bgGradient: 'from-[#FAF5FF] to-[#F3E8FF]'
          }
        ]
      };
    } else if (query.includes('跨境') || query.includes('外汇') || query.includes('出国') || query.includes('留学')) {
      promoData = {
        title: '跨境金融服务',
        actionText: '更多服务',
        products: [
          {
            id: 1,
            name: '寰宇人生借记卡',
            desc: '出国必备 | 境外取现免手续费',
            highlight: '多币种合一',
            actionText: '立即申请',
            bgGradient: 'from-[#F0F9FF] to-[#E0F2FE]'
          },
          {
            id: 2,
            name: '个人结售汇',
            desc: '在线便捷办理 | 支持主流币种',
            highlight: '享汇率优惠',
            actionText: '立即办理',
            bgGradient: 'from-[#F0F9FF] to-[#E0F2FE]'
          },
          {
            id: 3,
            name: '留学汇款',
            desc: '极速到账 | 全额到账',
            highlight: '进度可查',
            actionText: '立即汇款',
            bgGradient: 'from-[#F0F9FF] to-[#E0F2FE]'
          }
        ]
      };
    }

    if (!promoData) return null;

    return (
      <div className="mb-4 bg-white rounded-xl p-4 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-3.5 bg-red-500 rounded-full"></div>
            <span className="font-bold text-gray-900 text-[15px]">{promoData.title}</span>
          </div>
          <div className="text-xs text-gray-500 flex items-center">
            {promoData.actionText} <ChevronRight className="w-3 h-3 ml-0.5" />
          </div>
        </div>

        {/* Product Cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1 snap-x">
          {promoData.products.map((product) => (
            <div key={product.id} className={`flex-shrink-0 w-[260px] rounded-xl bg-gradient-to-br ${product.bgGradient} p-4 relative flex flex-col snap-center border border-black/5`}>
              <div className="text-[15px] font-bold text-gray-900 mb-1.5 leading-snug truncate">{product.name}</div>
              <div className="text-[11px] text-gray-500 mb-4 truncate">{product.desc}</div>
              
              <div className="mt-auto flex items-end justify-between">
                {product.rate ? (
                  <div>
                    <div className="text-red-500 font-bold text-xl leading-none mb-1.5">{product.rate}</div>
                    <div className="text-[10px] text-gray-500">{product.rateDesc}</div>
                  </div>
                ) : (
                  <div className="text-red-500 font-bold text-[15px] mb-1">{product.highlight}</div>
                )}
                <button className="px-3.5 py-1.5 bg-[#D4B59E]/20 text-[#8C6B4A] text-xs font-bold rounded-full">
                  {product.actionText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-orange-500 pt-12 pb-2 px-4 text-white">
        <div className="flex items-center mb-4">
          <ChevronLeft className="w-6 h-6 mr-2 cursor-pointer" onClick={() => onNavigate('search')} />
          <div className="flex-1 bg-white rounded-full h-9 flex items-center px-3">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-sm text-gray-900"
              value={query}
              readOnly
              onClick={() => onNavigate('search')}
            />
            <X className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" onClick={() => onNavigate('search')} />
          </div>
          <span className="text-sm ml-3 cursor-pointer" onClick={() => onNavigate('home')}>取消</span>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-6 overflow-x-auto no-scrollbar pb-1">
          {tabs.map(tab => (
            <span 
              key={tab} 
              className={`text-sm whitespace-nowrap pb-1 ${activeTab === tab ? 'font-bold border-b-2 border-white' : 'opacity-80'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Special Display Block (Only show one) */}
        {renderAISummary() || renderSearchPromotion() || (matchedCard && (
          <LegoCards card={matchedCard} />
        ))}

        {/* Services Floor (Only for 解控) */}
        {query.includes('解控') && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-900">服务</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { title: '解除支付限制', desc: '支持客户通过该功能申请解除支付限制类型的账...' },
                { title: '解除临时保护', desc: '信用卡' },
                { title: '睡眠户激活', desc: '借记卡睡眠户激活/解控' },
                { title: '信用卡-密码和安全码解锁', desc: '信用卡' },
              ].map((item, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0 flex items-start gap-4">
                  <div className="mt-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#FFF2ED" stroke="#E5E7EB" strokeWidth="1.5"/>
                      <path d="M12 18s-6-5.5-6-9.5c0-2.5 2-4.5 4.5-4.5 1.5 0 3 1 3.5 2.5.5-1.5 2-2.5 3.5-2.5 2.5 0 4.5 2 4.5 4.5 0 4-6 9.5-6 9.5z" fill="#FEF3C7" opacity="0.6"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-medium text-gray-900 mb-1">
                      {item.title.split('解控').map((part, i, arr) => (
                        <React.Fragment key={i}>
                          {part}
                          {i < arr.length - 1 && <span className="text-blue-500">解控</span>}
                        </React.Fragment>
                      ))}
                    </h4>
                    <div className="text-[13px] text-gray-500 truncate">
                      {item.desc.split('解控').map((part, i, arr) => (
                        <React.Fragment key={i}>
                          {part}
                          {i < arr.length - 1 && <span className="text-blue-500">解控</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wealth Floor */}
        {!query.includes('解控') && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-900">理财</h3>
            </div>
            
            <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-medium text-gray-900">兴银稳利天天利{i}号</h4>
                  <Star className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-xs text-gray-500">
                    <p>代销兴银理财 | 稳健型R2</p>
                    <p>每日可赎</p>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-500 font-bold text-lg">{(2.5 + i * 0.1).toFixed(2)}%</div>
                    <div className="text-xs text-gray-500">七日年化</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Floor Ad Banner */}
          {config.floorAdBanner?.visible && (
            <div 
              className="relative p-3 mt-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50/30 border border-amber-100/50 cursor-pointer"
              onClick={() => onNavigate('search')}
            >
              {config.floorAdBanner.tag && (
                <div className="absolute top-0 left-0 bg-gradient-to-r from-orange-400 to-red-500 text-white text-[10px] px-2 py-0.5 rounded-tl-lg rounded-br-lg font-medium">
                  {config.floorAdBanner.tag}
                </div>
              )}
              <div className="flex justify-between items-start mb-1 pt-2">
                <h4 className="text-sm font-medium text-gray-900">{config.floorAdBanner.title}</h4>
              </div>
              <div className="flex justify-between items-end">
                <div className="text-xs text-gray-500">
                  <p>{config.floorAdBanner.subtitle}</p>
                </div>
                <div className="text-right">
                  <div className="text-orange-500 font-bold text-lg">{config.floorAdBanner.rate}</div>
                  <div className="text-xs text-gray-500">{config.floorAdBanner.rateDesc}</div>
                </div>
              </div>
            </div>
          )}

          {/* View More */}
          <div className="text-center pt-4 border-t border-gray-100 mt-4 text-sm text-gray-500 flex items-center justify-center cursor-pointer">
            查看更多 <ChevronRight className="w-3 h-3 ml-0.5" />
          </div>
        </div>
        )}

        {/* Fund Floor */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-gray-900">基金</h3>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-medium text-gray-900">中欧医疗健康混合{i === 1 ? 'A' : 'C'}</h4>
                  <Star className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-xs text-gray-500">
                    <p>00309{i} | 混合型</p>
                  </div>
                  <div className="text-right">
                    <div className={`${i === 1 ? 'text-red-500' : 'text-green-500'} font-bold text-lg`}>{i === 1 ? '+' : '-'}3.45%</div>
                    <div className="text-xs text-gray-500">近一年收益率</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More */}
          <div className="text-center pt-4 border-t border-gray-100 mt-4 text-sm text-gray-500 flex items-center justify-center cursor-pointer">
            查看更多 <ChevronRight className="w-3 h-3 ml-0.5" />
          </div>
        </div>

        {/* Guess You Like */}
        {config.guessYouLike?.visible && (
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <div className="flex items-center justify-center mb-4 relative">
              <h3 className="text-[17px] font-bold text-gray-900 relative z-10 flex items-center tracking-wide">
                {config.guessYouLike.title}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gradient-to-r from-orange-200 to-orange-400 rounded-full opacity-60"></div>
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {config.guessYouLike.products.map((product, idx) => (
                <div key={product.id} className="bg-gradient-to-b from-orange-50/80 to-orange-50/10 rounded-xl p-3 border border-orange-100/50 relative overflow-hidden flex flex-col items-center">
                  <div className="flex items-center justify-center mb-2 w-full">
                    <h4 className="text-[14px] font-bold text-gray-800 truncate">{product.name}</h4>
                    {product.isHot && (
                      <span className="text-red-500 text-sm flex-shrink-0 ml-1">🔥</span>
                    )}
                  </div>
                  <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                    {product.tags.map((tag, tagIdx) => (
                      <span 
                        key={tagIdx} 
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          tagIdx === 0 
                            ? 'text-gray-500 border border-gray-300' 
                            : 'text-orange-600 bg-orange-100/60'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-center mt-auto">
                    <div className="text-red-500 font-bold text-[22px] leading-none mb-1.5">{product.rate}</div>
                    <div className="text-[11px] text-gray-400">{product.rateDesc}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {config.guessYouLike.disclaimer && (
              <div className="text-center text-[10px] text-gray-300 mt-4">
                {config.guessYouLike.disclaimer}
              </div>
            )}
          </div>
        )}

        {/* Related Searches */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3">相关搜索</h3>
          <div className="flex flex-wrap gap-2">
            {['理财产品推荐', '高收益理财', '稳健型基金', '大额存单'].map((tag, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs rounded-full border border-gray-100 cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
