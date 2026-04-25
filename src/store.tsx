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
    { text: '薪动有礼', iconUrl: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ef4444' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='8' width='18' height='4' rx='1'/%3E%3Cpath d='M12 8v13'/%3E%3Cpath d='M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7'/%3E%3Cpath d='M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5'/%3E%3C/svg%3E" },
    { text: '黄金', iconUrl: 'https://s1.img-e.com/20260420/69e60b13368aa.png' },
    { text: '购汇' },
    { text: '积分兑换' },
    { text: '换卡' },
    { text: '积点' },
    { text: '新丰利' },
    { text: '外汇' },
    { text: '贷款' },
    { text: '限额' },
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
      { 
        id: 'f1', 
        name: '中欧盈欣稳健6个月持有混合(FOF)A', 
        code: '025218', 
        tags: ['FOF-偏债混合型'], 
        value: '96.12%', 
        valueDesc: '近1年涨跌幅',
        mainDesc: { text: '收益排名', color: '#000000', fontSize: 14 },
        subDesc: { text: '前1%', color: '#ef4444', fontSize: 12 }
      },
      { 
        id: 'f2', 
        name: '浦银安盛盈丰多元3个月持有混合(F...', 
        code: '025269', 
        tags: ['FOF-偏债混合型'], 
        value: '66.86%', 
        valueDesc: '近1年涨跌幅',
        mainDesc: { text: '热度排名', color: '#000000', fontSize: 14 },
        subDesc: { text: '前1%', color: '#ef4444', fontSize: 12 }
      },
      { id: 'f3', name: '易方达原油A美元现汇QDII', code: '003322', tags: ['QDII-另类'], value: '41.83%', valueDesc: '近1年涨跌幅' },
      { id: 'f4', name: '国投瑞银白银期货(LOF)A', code: '161226', tags: ['商品(不含QDII)'], value: '157.41%', valueDesc: '近1年涨跌幅' },
    ],
    wealth: [
      { 
        id: 'w1', 
        name: '招银理财多资产FOF平衡日开3A', 
        code: '100753A', 
        tags: ['代销理财'], 
        value: '9.06%', 
        valueDesc: '近1年年化',
        mainDesc: { text: '热度排名', color: '#000000', fontSize: 14 },
        subDesc: { text: '前1%', color: '#ef4444', fontSize: 12 }
      },
      { 
        id: 'w2', 
        name: '交银理财稳享固收精选日开42号180天', 
        code: 'JY040220', 
        tags: ['代销理财'], 
        value: '近期热销', 
        valueDesc: '', 
        badge: 'hot',
        mainDesc: { text: '收益排名', color: '#000000', fontSize: 14 },
        subDesc: { text: '前1%', color: '#ef4444', fontSize: 12 }
      },
      { id: 'w3', name: '定期宝 招银理财增利指南针(和...', code: '106921A', tags: ['代销理财'], value: '2.00%-2.60%', valueDesc: '业绩比较基准' },
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
