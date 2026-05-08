import { mockUsers, generateRecommendations } from '../services/recommendationEngine';
import { defaultConfig } from '../store';

console.log('====== 用户推荐词测试报告 ======');
mockUsers.forEach(user => {
  console.log(`\n用户：${user.name} (${user.email})`);
  console.log(`特征：${JSON.stringify(user.status)}`);
  console.log(`近期浏览：${user.recentBrowse.join(', ')}`);
  console.log(`历史搜索：${user.historySearch.join(', ')}`);
  
  const recommendations = generateRecommendations(user, []);
  console.log(`\n最终生成的 ${recommendations.length} 个推荐词：`);
  recommendations.forEach((rec, idx) => {
    console.log(`[${idx + 1}] ${rec.text}`);
  });
  console.log('---------------------------');
});
