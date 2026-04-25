import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Search, Mic, Send, Sparkles, User, Bot, PieChart, TrendingUp, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType } from '../MobileSimulator';

type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  card?: React.ReactNode;
};

export const AISearchScreen: React.FC<{ onNavigate: (screen: ScreenType) => void }> = ({ onNavigate }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: '您好！我是您的专属AI金融助手。您可以直接用语音或文字问我任何问题，例如：',
      card: (
        <div className="mt-3 flex flex-col gap-2">
          {['帮我分析一下这个月的支出', '推荐一款稳健的理财产品', '我的信用卡还有多少额度？'].map((q, i) => (
            <div 
              key={i}
              className="bg-blue-50 text-blue-700 text-sm px-3 py-2 rounded-lg border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => handleSend(q)}
            >
              "{q}"
            </div>
          ))}
        </div>
      )
    }
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      let aiMsg: Message;

      if (text.includes('支出') || text.includes('分析')) {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: '好的，这是您本月的支出分析。本月总支出 ¥8,450.00，较上月下降 12%。主要支出集中在餐饮和购物。根据您的消费习惯，建议您将闲置资金转入天天宝，预计每月可多赚取一杯咖啡钱。',
          card: (
            <div className="mt-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-800">本月支出构成</span>
                <span className="text-xs text-gray-500">¥8,450.00</span>
              </div>
              <div className="flex items-end h-24 gap-2 mb-2">
                <div className="flex-1 bg-blue-100 rounded-t-md relative group">
                  <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-md h-[70%] transition-all"></div>
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-500">餐饮</span>
                </div>
                <div className="flex-1 bg-orange-100 rounded-t-md relative group">
                  <div className="absolute bottom-0 w-full bg-orange-500 rounded-t-md h-[45%] transition-all"></div>
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-500">购物</span>
                </div>
                <div className="flex-1 bg-green-100 rounded-t-md relative group">
                  <div className="absolute bottom-0 w-full bg-green-500 rounded-t-md h-[20%] transition-all"></div>
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-500">交通</span>
                </div>
                <div className="flex-1 bg-purple-100 rounded-t-md relative group">
                  <div className="absolute bottom-0 w-full bg-purple-500 rounded-t-md h-[30%] transition-all"></div>
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-500">其他</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-100 transition-colors">
                  查看详细账单
                </button>
                <button className="flex-1 py-2 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center">
                  <Sparkles className="w-3 h-3 mr-1" /> 智能省钱计划
                </button>
              </div>
            </div>
          )
        };
      } else if (text.includes('理财') || text.includes('推荐')) {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: '根据您的稳健型风险偏好和近期资金流动情况，我为您精选了以下理财产品。这款产品历史收益稳定，且支持T+1灵活申赎，非常适合您的闲钱打理：',
          card: (
            <div className="mt-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">兴银理财稳利系列</h4>
                  <div className="flex gap-1 mt-1">
                    <span className="text-[10px] px-1.5 py-0.5 bg-red-50 text-red-500 rounded">低风险</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">T+1可用</span>
                  </div>
                </div>
                <TrendingUp className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex items-end mt-4">
                <div className="flex-1">
                  <div className="text-2xl font-bold text-red-500">2.85<span className="text-sm">%</span></div>
                  <div className="text-xs text-gray-500 mt-0.5">近七日年化</div>
                </div>
                <button className="px-4 py-1.5 bg-red-500 text-white text-xs font-medium rounded-full hover:bg-red-600 transition-colors shadow-sm shadow-red-200">
                  立即买入
                </button>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-50 text-[10px] text-gray-400 flex items-center">
                <Sparkles className="w-3 h-3 mr-1 text-blue-400" /> AI 测算：买入一万元，预计每月收益约 23.7 元
              </div>
            </div>
          )
        };
      } else if (text.includes('额度') || text.includes('信用卡')) {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: '为您查询到信用卡账户信息：您的尾号 8888 信用卡当前可用额度为 ¥45,000.00。本期账单已出，应还款 ¥1,999.00，还款日为本月28日。',
          card: (
            <div className="mt-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 shadow-md text-white">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-blue-100">兴业银行信用卡 (8888)</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">正常</span>
              </div>
              <div className="mb-4">
                <div className="text-xs text-blue-100 mb-1">可用额度 (元)</div>
                <div className="text-2xl font-bold">45,000.00</div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-1.5 bg-white text-blue-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  立即还款
                </button>
                <button className="flex-1 py-1.5 bg-white/20 text-white text-xs font-medium rounded-lg hover:bg-white/30 transition-colors">
                  分期办理
                </button>
              </div>
            </div>
          )
        };
      } else {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: '我理解了您的需求。作为AI助手，我正在不断学习中。您可以尝试问我关于账单分析、理财推荐或账户查询的问题。',
        };
      }
      
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <div className="min-h-full bg-gray-50 flex flex-col relative">
      {/* Header */}
      <div className="pt-12 pb-3 px-4 bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center">
          <ChevronLeft className="w-6 h-6 text-gray-800 mr-2 cursor-pointer" onClick={() => onNavigate('search')} />
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">AI 搜</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Beta</div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-36" ref={scrollRef}>
        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className="shrink-0 mt-1">
                  {msg.sender === 'ai' ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className={`max-w-[75%] ${msg.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                  {msg.card && (
                    <div className="w-full mt-2">
                      {msg.card}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 flex-row"
              >
                <div className="shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                  <motion.div className="w-1.5 h-1.5 bg-blue-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                  <motion.div className="w-1.5 h-1.5 bg-blue-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                  <motion.div className="w-1.5 h-1.5 bg-blue-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-100 p-4 pb-8">
        {/* Quick Suggestions */}
        {!input && messages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4">
            {['分析本月支出', '推荐稳健理财', '查询信用卡额度', '最新优惠活动'].map((s, i) => (
              <button 
                key={i}
                className="whitespace-nowrap px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200 hover:bg-gray-200 transition-colors"
                onClick={() => handleSend(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-gray-100 rounded-3xl flex items-center px-4 py-2 border border-transparent focus-within:border-blue-300 focus-within:bg-white transition-colors shadow-inner">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="输入您的问题，例如：分析本月支出"
              className="flex-1 bg-transparent outline-none text-[15px] py-1 text-gray-800 placeholder:text-gray-400"
            />
            {input.trim() ? (
              <motion.button 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center ml-2 shrink-0 shadow-md"
                onClick={() => handleSend(input)}
              >
                <Send className="w-4 h-4 text-white ml-0.5" />
              </motion.button>
            ) : (
              <button className="w-8 h-8 flex items-center justify-center ml-2 shrink-0">
                <Mic className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-center mt-3">
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> AI 生成内容仅供参考
          </span>
        </div>
      </div>
    </div>
  );
};
