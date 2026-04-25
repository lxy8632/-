/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ConfigProvider } from './store';
import { MobileSimulator } from './components/MobileSimulator';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  return (
    <ConfigProvider>
      <div className="min-h-screen bg-gray-100 p-8 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">兴业银行搜索改版体验平台</h1>
            <p className="text-gray-600 mt-2">左侧为手机银行客户端模拟器，右侧为搜索配置后管系统。修改右侧配置可实时在左侧生效。</p>
          </div>
          
          <div className="flex gap-12 items-start justify-center">
            {/* Mobile Simulator */}
            <div className="flex-shrink-0">
              <MobileSimulator />
            </div>
            
            {/* Admin Panel */}
            <div className="flex-1 max-w-3xl">
              <AdminPanel />
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
