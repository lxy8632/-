import React, { createContext, useContext, useState } from 'react';

export type LegoCardType = 'wealth' | 'gold' | 'exchange' | 'banner';

export interface LegoCardConfig {
  id: string;
  keyword: string;
  type: LegoCardType;
  title: string;
  data: any;
}

export interface BannerConfig {
  imageUrl: string;
  link: string;
  visible: boolean;
  title?: string;
  subtitle?: string;
}

export interface ProductDescConfig {
  text: string;
  color: string;
  fontSize: number;
}

export interface ProductRanking {
  id: string;
  name: string;
  code: string;
  tags: string[];
  value: string;
  valueDesc: string;
  badge?: 'hot' | 'new' | 'realtime';
  mainDesc?: ProductDescConfig;
  subDesc?: ProductDescConfig;
}

export interface SearchDiscoveryItem {
  text: string;
  iconUrl?: string;
  bgColor?: string;
  textColor?: string;
}

export interface AppConfig {
  searchDiscovery: SearchDiscoveryItem[];
  hotSearches: { title: string; desc: string; type: string; heat?: number; rightAdUrl?: string }[];
  legoCards: LegoCardConfig[];
  topBanner: BannerConfig;
  hotSearchBanner: BannerConfig;
  aiSearch: {
    visible: boolean;
    questions: string[];
  };
  middleAdBanner: {
    visible: boolean;
    iconUrl?: string;
    text: string;
    highlightText?: string;
    link: string;
  };
  floorAdBanner: {
    visible: boolean;
    tag: string;
    title: string;
    subtitle: string;
    rate: string;
    rateDesc: string;
    link: string;
  };
  guessYouLike: {
    visible: boolean;
    title: string;
    products: {
      id: string;
      name: string;
      tags: string[];
      rate: string;
      rateDesc: string;
      isHot?: boolean;
    }[];
    disclaimer: string;
  };
  productRankings: {
    funds: ProductRanking[];
    wealth: ProductRanking[];
  };
}

const defaultConfig: AppConfig = {
  searchDiscovery: [
    { 
      text: '薪动有礼', 
      iconUrl: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ef4444' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='8' width='18' height='4' rx='1'/%3E%3Cpath d='M12 8v13'/%3E%3Cpath d='M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7'/%3E%3Cpath d='M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5'/%3E%3C/svg%3E",
      bgColor: '#fef2f2',
      textColor: '#ef4444'
    },
    { text: '黄金', iconUrl: 'https://s1.img-e.com/20260420/69e60b13368aa.png' },
    { text: '购汇' },
    { text: '积分兑换' },
    { text: '换卡' },
    { text: '积点' },
    { text: '新丰利' },
    { text: '外汇' },
    { text: '贷款' },
    { text: '限额' },
    { text: '理财' },
    { text: '基金' },
    { text: '消费贷' },
    { text: '信用卡' },
    { text: '转账' },
    { text: '存款' },
    { text: '养老金' },
    { text: '贵金属' },
    { text: '大额存单' },
    { text: '结构性存款' },
    { text: '数字人民币' }
  ],
  hotSearches: [
    { title: '积存金', desc: '', type: 'hot' },
    { title: '我的贷款', desc: '', type: 'hot', rightAdUrl: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='22' viewBox='0 0 60 22' fill='none'%3E%3Cpath d='M4 0h52a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z' fill='%23FEF2F2' stroke='%23EF4444' stroke-width='1'/%3E%3Ccircle cx='0' cy='11' r='3' fill='%23fff' stroke='%23EF4444' stroke-width='1'/%3E%3Ccircle cx='60' cy='11' r='3' fill='%23fff' stroke='%23EF4444' stroke-width='1'/%3E%3Ctext x='30' y='15' fill='%23EF4444' font-size='12' font-weight='bold' font-family='sans-serif' text-anchor='middle'%3E红包%3C/text%3E%3C/svg%3E" },
    { title: '购汇', desc: '', type: 'hot' },
    { title: '换卡激活', desc: '', type: 'hot' },
    { title: '积分与兑换', desc: '', type: 'hot' },
  ],
  legoCards: [
    {
      id: '1',
      keyword: '理财',
      type: 'wealth',
      title: '理财产品',
      data: {
        products: [
          { name: '华夏理财现金管理类理财产品84号C', code: 'Y424012084C', rate: '1.123%', type: '七日年化' },
          { name: '华夏理财现金管理类理财产品88号U', code: 'Y424012088U', rate: '1.518%', type: '七日年化' },
        ]
      }
    },
    {
      id: '2',
      keyword: '黄金',
      type: 'gold',
      title: '实时金价',
      data: { price: '762.16', change: '+0.151%', date: '今日' }
    }
  ],
  topBanner: {
    imageUrl: 'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAERuUlptmNtnF-27c3yIBusHovf0ylcGAACmCAAAlpcsFVvPLY-GpqpgToE.png',
    link: 'spring-festival',
    visible: false,
  },
  hotSearchBanner: {
    imageUrl: 'https://s1.img-e.com/20260420/69e60b49297ae.png',
    link: 'xingshan-loan',
    visible: true,
    title: '“兴”春有礼',
    subtitle: '兴闪贷年化利率（单利）3.0%起',
  },
  aiSearch: {
    visible: true,
    questions: [
      '帮我推荐一款理财产品',
      '账户限额了怎么办？',
      '证件号怎么更新？'
    ]
  },
  middleAdBanner: {
    visible: false,
    iconUrl: 'https://fangke.ogmua.cn/fangke/20260315/1e3ad934ecc75c79538c642821322c59.png', // We can use a ticket icon or similar
    text: '理财产品推荐|近七日收益率',
    highlightText: '4.61%',
    link: 'raincoat-promo'
  },
  floorAdBanner: {
    visible: true,
    tag: '猜你喜欢',
    title: '丰利灵动3M持有期1号A',
    subtitle: '每日可赎T+1日到账|稳健型R3',
    rate: '4.12%',
    rateDesc: '成立以来年化',
    link: 'wealth-promo'
  },
  guessYouLike: {
    visible: true,
    title: '猜您喜欢',
    products: [
      {
        id: 'g1',
        name: '产品标题产品标题',
        tags: ['代销', '安逸型R1'],
        rate: '3.221%',
        rateDesc: '成立以来年化',
        isHot: true
      },
      {
        id: 'g2',
        name: '产品标题产品标题...',
        tags: ['代销', '安逸型R1'],
        rate: '3.221%',
        rateDesc: '成立以来年化',
        isHot: false
      }
    ],
    disclaimer: '过往业绩和业绩比较基准不代表产品未来表现和实际收益'
  },
  productRankings: {
    funds: [
      { id: 'f1', name: '大成高鑫股票A', badge: 'hot', code: '000628', tags: ['股票型基金', '增长型R4'], value: '432.88%', valueDesc: '成立至今涨幅' },
      { id: 'f2', name: '博道衍晟混合C', code: '026352', tags: ['混合型基金', '稳健型R3'], value: '4.65%', valueDesc: '成立至今涨幅' },
      { id: 'f3', name: '大成高鑫股票C', code: '011066', tags: ['股票型基金', '增长型R4'], value: '69.18%', valueDesc: '成立至今涨幅' },
      { id: 'f4', name: '人保民富债券C', code: '018323', tags: ['债券型基金', '稳健型R3'], value: '近期热销', valueDesc: '' },
      { id: 'f5', name: '易方达黄金ETF联接A', code: '000307', tags: ['指数型基金', '增长型R4'], value: '1.30%', valueDesc: '成立至今涨幅' },
      { id: 'f6', name: '南方东英神州基金', code: '968153', tags: ['债券型基金', '谨慎型R2'], value: '6.70%', valueDesc: '成立至今涨幅' },
      { id: 'f7', name: '国泰中证新能源汽车ETF联结A', code: '009067', tags: ['指数型基金', '增长型R4'], value: '172.48%', valueDesc: '成立至今涨幅' },
      { id: 'f8', name: '国泰CES半导体芯片行业', code: '008281', tags: ['指数型基金', '增长型R4'], value: '175.11%', valueDesc: '成立至今涨幅' },
      { id: 'f9', name: '博时黄金交易型开放式', code: '008281', tags: ['指数型基金', '增长型R4'], value: '234.47%', valueDesc: '成立至今涨幅' },
      { id: 'f10', name: '汇添富中证1000指数增强A', code: '017953', tags: ['指数型基金', '增长型R4'], value: '82.10%', valueDesc: '成立至今涨幅' }
    ],
    wealth: [
      { id: 'w1', name: '富竹纯债14天持有期26号E', badge: 'hot', code: 'MSFBAE60226E', tags: ['安逸型R1', '代销'], value: '1.30%', valueDesc: '成立以来年化' },
      { id: 'w2', name: '兴银添利天天利77号N', code: 'MSFBAE60226E', tags: ['安逸型R1', '代销'], value: '1.231%', valueDesc: '7日年化' },
      { id: 'w3', name: '兴银理财稳添利日盈块享', code: 'Y09YJ01251052R', tags: ['安逸型R1', '代销'], value: '3.82%', valueDesc: '成立以来年化' },
      { id: 'w4', name: '丰利兴动科技成长3', code: 'Y09YJ01251052R', tags: ['稳健型R3', '代销'], value: '10.012%', valueDesc: '成立以来年化' },
      { id: 'w5', name: '兴银添利天天利64号N', code: 'Y09YJ01251052R', tags: ['稳健型R3', '代销'], value: '1.30%', valueDesc: '7日年化' },
      { id: 'w6', name: '添利1号', code: 'Y09YJ01251052', tags: ['安逸型R1', '代销'], value: '1.230%', valueDesc: '七日年化' },
      { id: 'w7', name: '丰利逸动日开1A', code: 'Y09YJ01251052', tags: ['谨慎型R2', '代销'], value: '5.650%', valueDesc: '成立以来年化' },
      { id: 'w8', name: '兴银添利天天利37号N', code: 'YO5A9K21807', tags: ['安逸型R1', '代销'], value: '1.205%', valueDesc: '七日年化' },
      { id: 'w9', name: '稳添利日盈增利稳定', code: 'YO5A9S65078A', tags: ['谨慎型R2', '代销'], value: '2.002%', valueDesc: '成立以来年化' },
      { id: 'w10', name: '丰利悦动1年持有期3号A', code: 'YO5A9MX0001B', tags: ['谨慎型R2', '代销'], value: '4.354%', valueDesc: '成立以来年化' }
    ]
  }
};

const ConfigContext = createContext<{
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}>({ config: defaultConfig, setConfig: () => {} });

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);
  return <ConfigContext.Provider value={{ config, setConfig }}>{children}</ConfigContext.Provider>;
};

export const useConfig = () => useContext(ConfigContext);
