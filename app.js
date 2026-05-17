/**
 * ASEAN Market Intelligence - 东盟市场数据库  * 专业级数据驱动决策平台
 */

const API_URL = "./data"; 
const VERSION = "v2.1.0-Static";

// 1. 多语言字典
const i18n = {
    zh: {
        navMacro: "宏观经济", navProducts: "热销品类", navConsumer: "人群洞察",
        navAI: "AI准入诊断", navLogistics: "关税计算", navProviders: "服务商库",
        navLegal: "法律法规", navNews: "经贸资讯", navCultural: "文化常识",
        viewDetail: "查看详情", currency: "货币", indicator: "指标", 
        value: "数值", year: "年份", unit: "单位", status: "状态",
        coverage: "覆盖", back: "返回", latestIndicators: "最新经济指标",
        market: "目标市场", category: "商品品类",
        btnAI: "生成AI分析报告", thinking: "AI正在分析市场数据...",
        placeholderCat: "输入商品品类，如：智能手机、化妆品...",
        liveUpdate: "实时更新", dataSynced: "数据已同步",
        loading: "加载中...", noData: "暂无数据",
        pageTitle: "东盟市场数据库", pageSubtitle: "实时经济数据与市场洞察"
    },
    en: {
        navMacro: "Macro Economy", navProducts: "Hot Products", navConsumer: "Consumer Insights",
        navAI: "AI Diagnostic", navLogistics: "Tax Calculator", navProviders: "Service Providers",
        navLegal: "Legal Regulations", navNews: "Trade News", navCultural: "Cultural Knowledge",
        viewDetail: "View Details", currency: "Currency", indicator: "Indicator",
        value: "Value", year: "Year", unit: "Unit", status: "Status",
        coverage: "Coverage", back: "Back", latestIndicators: "Latest Economic Indicators",
        market: "Target Market", category: "Product Category",
        btnAI: "Generate AI Report", thinking: "AI is analyzing market data...",
        placeholderCat: "Enter product category, e.g.: Smartphone, Cosmetics...",
        liveUpdate: "Live Update", dataSynced: "Data Synced",
        loading: "Loading...", noData: "No Data Available",
        pageTitle: "ASEAN Market Database", pageSubtitle: "Real-time Economic Data & Market Insights"
    }
};

// 全局变量
let currentLang = localStorage.getItem('asean_lang') || 'zh';
let currentView = 'macro';

// --- 工具函数 ---
const Utils = {
    formatNumber(num) {
        if (!num && num !== 0) return '0';
        return new Intl.NumberFormat(currentLang === 'zh' ? 'zh-CN' : 'en-US').format(num);
    },
    formatDate(date) {
        if (!date) return '-';
        return new Date(date).toLocaleDateString(currentLang, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const msg = document.getElementById('toast-msg');
        if(!toast || !msg) return;
        const icons = { success: 'fas fa-check-circle', error: 'fas fa-exclamation-circle', warning: 'fas fa-exclamation-triangle', info: 'fas fa-info-circle' };
        msg.innerHTML = `<div class="flex items-center gap-2"><i class="${icons[type]}"></i><span>${message}</span></div>`;
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('-translate-x-0', 'opacity-100');
        setTimeout(() => { toast.classList.remove('-translate-x-0', 'opacity-100'); toast.classList.add('translate-x-full', 'opacity-0'); }, 3000);
    },
    showLoading() {
        return `<div class="flex flex-col justify-center items-center py-20"><div class="relative mb-4"><div class="w-16 h-16 border-4 border-blue-100 rounded-full"></div><div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div></div><p class="text-gray-600 font-medium">${i18n[currentLang].loading}</p></div>`;
    }
};

// --- 实时时钟 ---
function startClock() {
    const clockEl = document.getElementById('realtime-clock');
    if(!clockEl) return;
    const update = () => {
        clockEl.textContent = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    };
    setInterval(update, 1000);
    update();
}

// --- 语言切换 ---
function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('asean_lang', lang);
    if(document.getElementById('lang-switcher')) document.getElementById('lang-switcher').value = lang;
    document.querySelectorAll('.t-key').forEach(el => {
        const key = el.getAttribute('data-key');
        if (i18n[lang] && i18n[lang][key]) el.textContent = i18n[lang][key];
    });
    refreshCurrentView();
}

// --- 渲染器 ---
const Renderers = {
    // 1. 宏观经济模块
    async macro() {
        try {
            const response = await fetch(`${API_URL}/countries.json`);
            const countries = await response.json();
            const t = i18n[currentLang];
            return `
                <div class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white">
                            <h3 class="text-2xl font-bold">10</h3><p class="text-sm opacity-90">成员国数量数据</p>
                        </div>
                        <div class="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white">
                            <h3 class="text-2xl font-bold">3.3T</h3><p class="text-sm opacity-90">总GDP (USD)</p>
                        </div>
                        <div class="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white">
                            <h3 class="text-2xl font-bold">680M</h3><p class="text-sm opacity-90">总人口</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${countries.map(c => `
                            <div class="metric-card cursor-pointer group" onclick="showCountryDetail(${c.country_id}, '${c.country_name_cn}')">
                                <div class="flex justify-between items-start">
                                    <h4 class="font-bold text-lg group-hover:text-blue-600">${c.country_name_cn}</h4>
                                    <span class="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs">${c.country_code_iso2}</span>
                                </div>
                                <p class="text-gray-500 text-sm mt-2">${c.region || 'ASEAN'}</p>
                                <div class="mt-4 pt-4 border-t text-blue-500 text-sm font-medium">查看详情 →</div>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
        } catch (e) { return `<div class="text-center py-20">无法加载国家数据，请检查 data/countries.json</div>`; }
    },

    // 2. 国家详情模块 (静态筛选版)
    async macroDetail(countryId, countryName) {
        try {
            const [indRes, cRes] = await Promise.all([
                fetch(`${API_URL}/macro.json`),
                fetch(`${API_URL}/countries.json`)
            ]);
            const allInd = await indRes.json();
            const allC = await cRes.json();
            const indicators = allInd.filter(i => i.country_id == countryId);
            const countryInfo = allC.find(c => c.country_id == countryId) || {};
            
            return `
                <div class="space-y-6">
                    <h2 class="text-3xl font-bold text-gray-900">${countryName} 概览</h2>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="metric-card">人口: <b>${Utils.formatNumber(countryInfo.population)}</b></div>
                        <div class="metric-card">GDP: <b>$${Utils.formatNumber(countryInfo.gdp)}</b></div>
                        <div class="metric-card">货币: <b>${countryInfo.currency_code}</b></div>
                        <div class="metric-card">指标数: <b>${indicators.length}</b>条</div>
                    </div>
                    <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
                        <table class="w-full text-left">
                            <thead class="bg-gray-50 text-xs"><tr><th class="px-6 py-3">年份</th><th class="px-6 py-3">指标名称</th><th class="px-6 py-3">数值</th></tr></thead>
                            <tbody class="divide-y text-sm">
                                ${indicators.slice(0, 20).map(i => `<tr><td class="px-6 py-4">${i.year}</td><td class="px-6 py-4">${i.indicator_type}</td><td class="px-6 py-4 font-bold">${Utils.formatNumber(i.indicator_value)} ${i.unit}</td></tr>`).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>`;
        } catch (e) { return `<div class="py-20 text-center">无法加载详情，请确保 data/macro.json 存在</div>`; }
    },

    // 3. 热销品类模块 (重点优化：适配你的 main_image_url 字段)
    async products() {
        try {
            const response = await fetch(`${API_URL}/products.json`);
            const allProducts = await response.json();
            
            // 针对 13MB 大文件进行截取，只显示前 100 条
            const products = allProducts.slice(0, 100);
            
            return `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    ${products.map(p => `
                        <div class="metric-card group">
                            <div class="aspect-square bg-gray-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                                ${p.main_image_url ? 
                                    `<img src="${p.main_image_url}" class="w-full h-full object-cover group-hover:scale-105 transition-transform" onerror="this.src='https://placehold.co/300x300?text=No+Image'">` :
                                    `<i class="fas fa-box text-gray-300 text-3xl"></i>`
                                }
                            </div>
                            <h4 class="font-bold text-gray-900 truncate" title="${p.product_title}">${p.product_title}</h4>
                            <div class="flex justify-between items-center mt-3">
                                <span class="text-blue-600 font-bold">${p.average_price ? '$' + p.average_price : '查看价格'}</span>
                                <span class="text-xs text-gray-400">ID: ${p.product_id}</span>
                            </div>
                            <div class="mt-4 pt-3 border-t flex justify-between">
                                <span class="text-xs text-gray-500">${p.brand || '东南亚选品'}</span>
                                <a href="${p.url}" target="_blank" class="text-xs text-blue-500 hover:underline">来源链接</a>
                            </div>
                        </div>
                    `).join('')}
                </div>`;
        } catch (e) { return `<div class="py-20 text-center">数据解析中或文件不存在 (data/products.json)</div>`; }
    },

    // 4. 服务商模块
    async providers() {
        try {
            const response = await fetch(`${API_URL}/service_providers.json`);
            const data = await response.json();
            return `<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${data.map(p => `<div class="metric-card">
                    <h4 class="font-bold text-lg">${p.provider_name}</h4>
                    <p class="text-blue-600 text-sm mt-1">${p.service_type}</p>
                    <div class="mt-3 text-xs text-gray-500">覆盖市场: ${p.markets || '东盟主要国家'}</div>
                </div>`).join('')}
            </div>`;
        } catch (e) { return `<div class="py-10 text-center">暂无服务商数据</div>`; }
    },

    // 5. 法律法规模块
    async legal() {
        try {
            const response = await fetch(`${API_URL}/legal_regulations.json`);
            const data = await response.json();
            return `<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${data.map(r => `<div class="metric-card">
                    <span class="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded">${r.impact_level || '普通'}</span>
                    <h4 class="font-bold mt-2">${r.title}</h4>
                    <p class="text-gray-500 text-xs mt-2 line-clamp-2">${r.description || '点击查看详情'}</p>
                </div>`).join('')}
            </div>`;
        } catch (e) { return `<div class="py-10 text-center">暂无法规数据</div>`; }
    },

    // 6. 经贸资讯
    async news() {
        try {
            const response = await fetch(`${API_URL}/trade_news.json`);
            const data = await response.json();
            return `<div class="space-y-4">
                ${data.map(n => `<div class="metric-card">
                    <span class="text-gray-400 text-xs">${n.publish_date}</span>
                    <h4 class="font-bold mt-1">${n.title}</h4>
                    <p class="text-gray-600 text-sm mt-2">${n.summary || ''}</p>
                </div>`).join('')}
            </div>`;
        } catch (e) { return `<div class="py-10 text-center">暂无资讯</div>`; }
    },

    // 7. AI 助手 (演示)
    aiAssistant() {
        return `<div class="max-w-xl mx-auto metric-card p-8">
            <h3 class="text-xl font-bold mb-4 flex items-center gap-2"><i class="fas fa-robot text-blue-600"></i> AI 市场准入智能诊断</h3>
            <p class="text-gray-500 text-sm mb-6">输入您的产品品类，AI 将结合东盟历史数据为您生成准入分析报告。</p>
            <input id="ai-category" type="text" placeholder="例如：智能手机、咖啡豆..." class="w-full border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none">
            <button onclick="runAIAnalysis()" class="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">生成 AI 分析报告</button>
            <div id="ai-result-box" class="hidden mt-6 p-5 bg-blue-50 rounded-xl border border-blue-100">
                <div id="ai-loading" class="text-center text-sm text-blue-600">AI 正在深度检索数据库...</div>
                <div id="ai-content" class="text-sm text-gray-700 leading-relaxed"></div>
            </div>
        </div>`;
    }
};

// --- 功能函数 ---
async function runAIAnalysis() {
    const cat = document.getElementById('ai-category').value;
    if(!cat) return Utils.showToast('请输入品类', 'warning');
    
    document.getElementById('ai-result-box').classList.remove('hidden');
    document.getElementById('ai-loading').classList.remove('hidden');
    const content = document.getElementById('ai-content');
    content.innerHTML = '';
    
    setTimeout(() => {
        document.getElementById('ai-loading').classList.add('hidden');
        content.innerHTML = `
            <h5 class="font-bold text-blue-900 mb-2">【${cat}】东盟市场分析初步结果：</h5>
            <ul class="space-y-2">
                <li><b>● 准入难度：</b> 中等。该品类在越南、印尼属于鼓励类，但需关注本地化认证。</li>
                <li><b>● 关税参考：</b> 0% - 15% (基于 RCEP 协定，从中国进口可申请关税优惠)。</li>
                <li><b>● 建议建议：</b> 该产品在印尼电商平台搜索量近期上涨 25%，建议优先布局雅加达仓储。</li>
            </ul>`;
    }, 2000);
}

async function showCountryDetail(id, name) {
    currentView = 'macroDetail';
    document.getElementById('back-btn').classList.remove('hidden');
    const container = document.getElementById('content-container');
    container.innerHTML = Utils.showLoading();
    container.innerHTML = await Renderers.macroDetail(id, name);
}

async function switchModule(mod, el) {
    if (el) {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('bg-gray-100', 'text-blue-600'));
        el.classList.add('bg-gray-100', 'text-blue-600');
    }
    const container = document.getElementById('content-container');
    container.innerHTML = Utils.showLoading();
    
    if (mod === 'ai-assistant') {
        container.innerHTML = Renderers.aiAssistant();
    } else if (Renderers[mod]) {
        container.innerHTML = await Renderers[mod]();
    }
}

function refreshCurrentView() { switchModule('macro'); }
function goBack() { document.getElementById('back-btn').classList.add('hidden'); switchModule('macro'); }

// --- 初始化 ---
window.onload = () => {
    startClock();
    switchModule('macro');
    Utils.showToast('数据同步已完成，欢迎使用 ASEAN MarketDB');
};

// 暴露全局函数给 HTML 调用
window.switchModule = switchModule;
window.showCountryDetail = showCountryDetail;
window.runAIAnalysis = runAIAnalysis;
window.goBack = goBack;
window.changeLanguage = changeLanguage;