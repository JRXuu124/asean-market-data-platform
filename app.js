/**
 * ASEAN Market Intelligence - 东盟市场数据库 
 * 专业级数据驱动决策平台
 */

// 修改点 1: 指向本地存放 JSON 数据的文件夹
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
    },
    // ... 其他语言保持不变 ...
    ms: i18n ? i18n.ms : {}, id: i18n ? i18n.id : {}, th: i18n ? i18n.th : {}, vi: i18n ? i18n.vi : {}
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
    formatCurrency(value, currencyCode) {
        return new Intl.NumberFormat(currentLang === 'zh' ? 'zh-CN' : 'en-US', {
            style: 'currency',
            currency: currencyCode || 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(value);
    },
    formatDate(date) {
        return new Date(date).toLocaleDateString(currentLang, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },
    safeParse(data) {
        if (!data) return [];
        try { return typeof data === 'string' ? JSON.parse(data) : data; } catch { return data; }
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
    if(document.getElementById('page-title')) document.getElementById('page-title').textContent = i18n[lang].pageTitle;
    if(document.getElementById('page-subtitle')) document.getElementById('page-subtitle').textContent = i18n[lang].pageSubtitle;
    refreshCurrentView();
}

// --- 渲染器 (核心修改点：改为读取静态 .json 文件并本地筛选) ---
const Renderers = {
    async macro() {
        try {
            const response = await fetch(`${API_URL}/countries.json`);
            const countries = await response.json();
            const t = i18n[currentLang];
            
            return `
                <div class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white">
                            <div class="flex items-center justify-between mb-4"><i class="fas fa-globe-asia text-2xl opacity-80"></i></div>
                            <h3 class="text-2xl font-bold">10</h3><p class="text-sm opacity-90">成员国数量</p>
                        </div>
                        <div class="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white">
                            <div class="flex items-center justify-between mb-4"><i class="fas fa-chart-line text-2xl opacity-80"></i></div>
                            <h3 class="text-2xl font-bold">3.3T</h3><p class="text-sm opacity-90">总GDP (美元)</p>
                        </div>
                        <div class="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white">
                            <div class="flex items-center justify-between mb-4"><i class="fas fa-users text-2xl opacity-80"></i></div>
                            <h3 class="text-2xl font-bold">680M</h3><p class="text-sm opacity-90">总人口</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${countries.map(country => `
                            <div class="metric-card cursor-pointer group" onclick="showCountryDetail(${country.country_id}, '${country.country_name_cn}')">
                                <div class="flex items-start justify-between mb-4">
                                    <div><h4 class="font-bold text-gray-900 group-hover:text-blue-600">${country.country_name_cn}</h4><p class="text-xs text-gray-500 mt-1">${country.region || '东盟国家'}</p></div>
                                    <span class="text-xs font-bold text-blue-600 border border-blue-200 px-2 py-1 rounded">${country.country_code_iso2}</span>
                                </div>
                                <div class="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <span class="text-sm font-medium text-blue-600">${t.viewDetail}</span><i class="fas fa-chevron-right text-blue-400 group-hover:translate-x-1 transition-transform"></i>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
        } catch (error) { return `<div class="text-center py-12">数据加载失败，请确保 /frontend/data 文件夹下有对应的 .json 文件</div>`; }
    },
    
    async macroDetail(countryId, countryName) {
        try {
            // 静态版：一次性读取全部指标，在前端过滤
            const [indicatorsRes, countryRes] = await Promise.all([
                fetch(`${API_URL}/macro.json`),
                fetch(`${API_URL}/countries.json`)
            ]);
            let allIndicators = await indicatorsRes.json();
            const countries = await countryRes.json();
            
            // 关键：本地过滤数据
            const indicators = allIndicators.filter(item => item.country_id == countryId);
            const countryInfo = countries.find(c => c.country_id == countryId) || {};
            const t = i18n[currentLang];
            
            const byYear = indicators.reduce((acc, item) => {
                const year = item.year;
                if (!acc[year]) acc[year] = [];
                acc[year].push(item);
                return acc;
            }, {});
            
            const years = Object.keys(byYear).map(y => parseInt(y));
            const latestYear = years.length > 0 ? Math.max(...years) : 'N/A';
            const latestData = byYear[latestYear]?.slice(0, 4) || [];
            
            return `
                <div class="space-y-8">
                    <h2 class="text-3xl font-bold text-blue-600">${countryName}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div class="metric-card"><div>货币</div><div class="font-bold">${countryInfo.currency_code}</div></div>
                        <div class="metric-card"><div>人口</div><div class="font-bold">${Utils.formatNumber(countryInfo.population)}</div></div>
                        <div class="metric-card"><div>GDP</div><div class="font-bold">$${Utils.formatNumber(countryInfo.gdp)}</div></div>
                        <div class="metric-card"><div>年份覆盖</div><div class="font-bold">${years.length}年</div></div>
                    </div>
                    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div class="px-6 py-4 border-b bg-gray-50"><h3 class="font-medium">${t.latestIndicators} (${latestYear})</h3></div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left">
                                <thead class="bg-gray-50 text-xs uppercase text-gray-500">
                                    <tr><th class="px-6 py-3">指标名称</th><th class="px-6 py-3">数值</th><th class="px-6 py-3">单位</th></tr>
                                </thead>
                                <tbody class="divide-y">
                                    ${indicators.slice(0, 15).map(item => `
                                        <tr><td class="px-6 py-4">${item.indicator_type}</td><td class="px-6 py-4 font-bold">${Utils.formatNumber(item.indicator_value)}</td><td class="px-6 py-4 text-gray-500">${item.unit}</td></tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>`;
        } catch (e) { return `<div class="py-20 text-center text-red-500">无法加载详情数据，请检查 macro.json</div>`; }
    },

    async products() {
        try {
            const response = await fetch(`${API_URL}/products.json`);
            const products = await response.json();
            return `<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                ${products.map(p => `<div class="metric-card">
                    <div class="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                        ${p.image_url ? `<img src="${p.image_url}" class="w-full h-full object-cover rounded-lg">` : `<i class="fas fa-box text-3xl text-gray-300"></i>`}
                    </div>
                    <h4 class="font-bold truncate">${p.product_title}</h4>
                    <div class="flex justify-between mt-2 text-blue-600 font-bold"><span>$${p.average_price}</span></div>
                </div>`).join('')}
            </div>`;
        } catch (e) { return `<div class="py-10 text-center">无法加载产品数据</div>`; }
    },

    async providers() {
        try {
            const response = await fetch(`${API_URL}/service_providers.json`);
            const providers = await response.json();
            return `<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${providers.map(p => `<div class="metric-card">
                    <h4 class="font-bold text-lg">${p.provider_name}</h4>
                    <p class="text-blue-600 text-sm mb-3">${p.service_type}</p>
                    <p class="text-gray-600 text-xs">覆盖市场: ${p.markets || '东盟全境'}</p>
                </div>`).join('')}
            </div>`;
        } catch (e) { return `<div class="py-10 text-center">无法加载服务商数据</div>`; }
    },

    async legal() {
        try {
            const response = await fetch(`${API_URL}/legal_regulations.json`);
            const regs = await response.json();
            return `<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${regs.map(r => `<div class="metric-card cursor-pointer" onclick="showLegalDetail(${r.regulation_id})">
                    <h4 class="font-bold">${r.title}</h4>
                    <div class="mt-2"><span class="text-xs px-2 py-1 bg-red-50 text-red-600 rounded">${r.impact_level}</span></div>
                </div>`).join('')}
            </div>`;
        } catch (e) { return `<div class="py-10 text-center">无法加载法律法规数据</div>`; }
    },

    async news() {
        try {
            const response = await fetch(`${API_URL}/trade_news.json`);
            const news = await response.json();
            return `<div class="space-y-4">
                ${news.map(n => `<div class="metric-card">
                    <p class="text-xs text-gray-400 mb-1">${n.publish_date}</p>
                    <h4 class="font-bold">${n.title}</h4>
                    <p class="text-sm text-gray-600 mt-2 line-clamp-2">${n.summary || ''}</p>
                </div>`).join('')}
            </div>`;
        } catch (e) { return `<div class="py-10 text-center">无法加载经贸资讯</div>`; }
    },

    aiAssistant() {
        return `<div class="max-w-2xl mx-auto metric-card p-10">
            <h3 class="text-xl font-bold mb-4">AI 市场准入智能诊断 (演示版)</h3>
            <input id="ai-category" type="text" placeholder="输入品类，如：智能手机" class="w-full border p-3 rounded-lg mb-4">
            <button onclick="runAIAnalysis()" class="w-full bg-blue-600 text-white p-3 rounded-lg">开始智能诊断</button>
            <div id="ai-result-box" class="hidden mt-6 p-4 bg-blue-50 rounded-lg">
                <div id="ai-loading" class="text-center py-4">AI 正在调取历史数据分析中...</div>
                <div id="ai-content" class="prose text-gray-700"></div>
            </div>
        </div>`;
    }
};

// --- 功能函数 ---
async function runAIAnalysis() {
    const category = document.getElementById('ai-category').value;
    if(!category) return Utils.showToast('请输入品类', 'warning');
    
    document.getElementById('ai-result-box').classList.remove('hidden');
    document.getElementById('ai-loading').classList.remove('hidden');
    document.getElementById('ai-content').innerHTML = '';
    
    // 静态演示：延迟2秒显示预设报告
    setTimeout(() => {
        document.getElementById('ai-loading').classList.add('hidden');
        document.getElementById('ai-content').innerHTML = `
            <h4 class="font-bold text-blue-800">关于 "${category}" 的东盟准入报告：</h4>
            <ul class="list-disc pl-5 mt-2 space-y-2">
                <li><b>市场需求：</b>该品类在印尼、越南处于高速增长期。</li>
                <li><b>关税壁垒：</b>平均进口税率约为 5%-12%，需关注 RCEP 优惠。</li>
                <li><b>准入建议：</b>建议先通过本地电商平台 (Shopee/Lazada) 进行小规模测试。</li>
            </ul>
        `;
    }, 2000);
}

async function showCountryDetail(id, name) {
    currentView = 'macroDetail';
    localStorage.setItem('lastCountryId', id);
    localStorage.setItem('lastCountryName', name);
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

function refreshCurrentView() {
    switchModule('macro');
}

function goBack() {
    document.getElementById('back-btn').classList.add('hidden');
    switchModule('macro');
}

// --- 初始化 ---
window.onload = () => {
    startClock();
    switchModule('macro');
    Utils.showToast('东盟数据平台 (静态演示版) 已就绪');
};

// 暴露全局函数
window.switchModule = switchModule;
window.showCountryDetail = showCountryDetail;
window.runAIAnalysis = runAIAnalysis;
window.goBack = goBack;
window.changeLanguage = changeLanguage;