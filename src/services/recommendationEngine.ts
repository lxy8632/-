import { SearchDiscoveryItem } from '../store';
import { WHITELIST } from '../constants/whitelist';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  status: {
    idCardExpiring?: boolean;
    riskAssessmentExpired?: boolean;
    limitReached?: boolean;
    hasWealth?: boolean;
    hasFund?: boolean;
  };
  recentBrowse: string[];
  historySearch: string[];
}

const GLOBAL_HOT_WORDS = [
  '积存金', '购汇', '大额存单', '养老金', '天天利', 
  '理财', '基金', '消费贷', '定期存款', '转账',
  '信用卡积分', '公积金', '外汇', '黄金', '数字人民币',
  '激活', '流水', '银期', '提前还款', '存款'
];

export const mockUsers: UserProfile[] = [
  {
    id: '1',
    name: '管理员',
    email: 'lxy960831@qq.com',
    status: {
      idCardExpiring: true,
      hasFund: true
    },
    recentBrowse: ['理财', '天天盈', '稳利恒盈'],
    historySearch: ['存款证明', '流水打印', '转账限额', '房贷']
  },
  {
    id: '2',
    name: '张三',
    email: 'user2@example.com',
    status: { riskAssessmentExpired: true },
    recentBrowse: ['理财'],
    historySearch: ['稳利安盈', '外币']
  },
  {
    id: '3',
    name: '李四',
    email: 'user3@example.com',
    status: { limitReached: true },
    recentBrowse: ['转账限额'],
    historySearch: ['转账额度', '非柜面交易限额']
  },
  {
    id: '4',
    name: '王五',
    email: 'user4@example.com',
    status: { hasWealth: true, hasFund: true },
    recentBrowse: ['定期存款', '收益'],
    historySearch: ['提额', '理财']
  },
  {
    id: '5',
    name: '赵六',
    email: 'user5@example.com',
    status: {},
    recentBrowse: ['个人养老金', '存款'],
    historySearch: ['养老金', '养老']
  },
  {
    id: '6',
    name: '钱七',
    email: 'user6@example.com',
    status: { idCardExpiring: true, riskAssessmentExpired: true },
    recentBrowse: [],
    historySearch: ['网点']
  },
  {
    id: '7',
    name: '孙八',
    email: 'user7@example.com',
    status: { hasWealth: true },
    recentBrowse: ['黄金', '实物金'],
    historySearch: ['贵金属', '积存金']
  },
  {
    id: '8',
    name: '周九',
    email: 'user8@example.com',
    status: { limitReached: true, hasFund: true },
    recentBrowse: ['外币', '换汇'],
    historySearch: ['额度', '跨境汇款']
  },
  {
    id: '9',
    name: '吴十',
    email: 'user9@example.com',
    status: {},
    recentBrowse: ['消费贷', '借钱'],
    historySearch: ['现金分期', '我的分期']
  },
  {
    id: '10',
    name: '郑十一',
    email: 'user10@example.com',
    status: { hasFund: true },
    recentBrowse: ['理财', '基金'],
    historySearch: ['天天宝', '天天金']
  },
  {
    id: '11',
    name: '王十二',
    email: 'user11@example.com',
    status: {},
    recentBrowse: [],
    historySearch: ['数字人民币', '卡片激活']
  }
];

export function generateRecommendations(user: UserProfile, manualConfig: SearchDiscoveryItem[]): SearchDiscoveryItem[] {
  const result: SearchDiscoveryItem[] = [];
  const usedWords = new Set<string>();

  const addWord = (text: string, source: 'manual' | 'personal' | 'history' | 'hot', itemConfig?: Partial<SearchDiscoveryItem>) => {
    if (!WHITELIST.includes(text)) return false;
    if (!usedWords.has(text)) {
      usedWords.add(text);
      result.push({ text, ...itemConfig });
      return true;
    }
    return false;
  };

  // 1. Manual Intervention (Highest priority)
  const manualWords = [...manualConfig];

  // 2. Personal Words
  const personalWords: string[] = [];
  if (user.status.idCardExpiring) personalWords.push('身份证更新', '证件更新');
  if (user.status.riskAssessmentExpired) personalWords.push('风评', '风险评估');
  if (user.status.limitReached) personalWords.push('提额', '额度');
  if (user.status.hasWealth) personalWords.push('投资理财', '理财');
  if (user.status.hasFund) personalWords.push('我的基金', '基金');
  personalWords.push(...user.recentBrowse);

  // 3. History Words
  const historyWords: string[] = [...user.historySearch];

  // 4. Hot Words
  const hotWords: string[] = [...GLOBAL_HOT_WORDS];

  // Build 3 batches of 7 words
  const finalBatches: SearchDiscoveryItem[] = [];

  for (let batch = 0; batch < 3; batch++) {
    for (let slot = 0; slot < 7; slot++) {
      let wordAdded = false;

      // Try Manual first
      if (manualWords.length > 0) {
        const item = manualWords.shift()!;
        if (addWord(item.text, 'manual', { iconUrl: item.iconUrl, bgColor: item.bgColor, textColor: item.textColor })) {
          finalBatches.push(result[result.length - 1]);
          continue;
        }
      }

      // Determine ideal source for this slot
      let idealSource = 'hot';
      if (slot < 2) idealSource = 'personal';
      else if (slot < 5) idealSource = 'history';

      // Fallback logic
      if (idealSource === 'personal') {
        while (personalWords.length > 0 && !wordAdded) {
          const w = personalWords.shift()!;
          if (addWord(w, 'personal')) { wordAdded = true; finalBatches.push(result[result.length - 1]); }
        }
        if (!wordAdded) idealSource = 'history';
      }

      if (idealSource === 'history') {
        while (historyWords.length > 0 && !wordAdded) {
          const w = historyWords.shift()!;
          if (addWord(w, 'history')) { wordAdded = true; finalBatches.push(result[result.length - 1]); }
        }
        if (!wordAdded) idealSource = 'hot';
      }

      if (idealSource === 'hot') {
        while (hotWords.length > 0 && !wordAdded) {
          const w = hotWords.shift()!;
          if (addWord(w, 'hot')) { wordAdded = true; finalBatches.push(result[result.length - 1]); }
        }
      }
      
      // Safety if we run out of words entirely
      if (!wordAdded) {
        const fallback = '推荐搜索' + Math.random().toString(36).substr(2, 4);
        addWord(fallback, 'hot');
        finalBatches.push(result[result.length - 1]);
      }
    }
  }

  return finalBatches;
}
