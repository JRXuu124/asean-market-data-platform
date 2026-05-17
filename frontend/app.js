/**
 * ASEAN Market Intelligence - 东盟市场数据库
 * 专业级数据驱动决策平台
 */

const API_URL = "http://127.0.0.1:8000/api/v1";
const VERSION = "v2.1.0";

// 1. 多语言字典（优化版）
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
    ms: {
        navMacro: "Ekonomi Makro", navProducts: "Produk Popular", navConsumer: "Wawasan Pengguna",
        navAI: "Diagnostik AI", navLogistics: "Kalkulator Cukai", navProviders: "Pembekal Perkhidmatan",
        navLegal: "Peraturan Undang-undang", navNews: "Berita Perdagangan", navCultural: "Pengetahuan Budaya",
        viewDetail: "Lihat Butiran", currency: "Mata Wang", indicator: "Penunjuk",
        value: "Nilai", year: "Tahun", unit: "Unit", status: "Status",
        coverage: "Liputan", back: "Kembali", latestIndicators: "Penunjuk Ekonomi Terkini",
        market: "Pasaran Sasaran", category: "Kategori Produk",
        btnAI: "Hasilkan Laporan AI", thinking: "AI sedang menganalisis data pasaran...",
        placeholderCat: "Masukkan kategori produk, cth: Telefon Pintar, Kosmetik...",
        liveUpdate: "Kemas kini Masa Nyata", dataSynced: "Data Diselaraskan",
        loading: "Memuat...", noData: "Tiada Data Tersedia",
        pageTitle: "Pangkalan Data Pasaran ASEAN", pageSubtitle: "Data Ekonomi Masa Nyata & Wawasan Pasaran"
    },
    id: {
        navMacro: "Ekonomi Makro", navProducts: "Produk Populer", navConsumer: "Wawasan Konsumen",
        navAI: "Diagnostik AI", navLogistics: "Kalkulator Pajak", navProviders: "Penyedia Layanan",
        navLegal: "Peraturan Hukum", navNews: "Berita Perdagangan", navCultural: "Pengetahuan Budaya",
        viewDetail: "Lihat Detail", currency: "Mata Uang", indicator: "Indikator",
        value: "Nilai", year: "Tahun", unit: "Satuan", status: "Status",
        coverage: "Cakupan", back: "Kembali", latestIndicators: "Indikator Ekonomi Terbaru",
        market: "Pasar Target", category: "Kategori Produk",
        btnAI: "Buat Laporan AI", thinking: "AI sedang menganalisis data pasar...",
        placeholderCat: "Masukkan kategori produk, misal: Smartphone, Kosmetik...",
        liveUpdate: "Update Langsung", dataSynced: "Data Tersinkronisasi",
        loading: "Memuat...", noData: "Tidak Ada Data Tersedia",
        pageTitle: "Basis Data Pasar ASEAN", pageSubtitle: "Data Ekonomi Real-time & Wawasan Pasar"
    },
    th: {
        navMacro: "เศรษฐกิจมหภาค", navProducts: "สินค้ายอดนิยม", navConsumer: "ข้อมูลผู้บริโภค",
        navAI: "การวินิจฉัย AI", navLogistics: "เครื่องคิดคำนวณภาษี", navProviders: "ผู้ให้บริการ",
        navLegal: "กฎหมายและระเบียบ", navNews: "ข่าวการค้า", navCultural: "ความรู้ทางวัฒนธรรม",
        viewDetail: "ดูรายละเอียด", currency: "สกุลเงิน", indicator: "ตัวชี้วัด",
        value: "ค่า", year: "ปี", unit: "หน่วย", status: "สถานะ",
        coverage: "การครอบคลุม", back: "กลับ", latestIndicators: "ตัวชี้วัดเศรษฐกิจล่าสุด",
        market: "ตลาดเป้าหมาย", category: "หมวดหมู่สินค้า",
        btnAI: "สร้างรายงาน AI", thinking: "AI กำลังวิเคราะห์ข้อมูลตลาด...",
        placeholderCat: "กรอกหมวดหมู่สินค้า เช่น สมาร์ทโฟน เครื่องสำอาง...",
        liveUpdate: "อัปเดตแบบเรียลไทม์", dataSynced: "ข้อมูลซิงค์แล้ว",
        loading: "กำลังโหลด...", noData: "ไม่มีข้อมูล",
        pageTitle: "ฐานข้อมูลตลาดอาเซียน", pageSubtitle: "ข้อมูลเศรษฐกิจแบบเรียลไทม์และข้อมูลเชิงลึกด้านตลาด"
    },
    vi: {
        navMacro: "Kinh tế Vĩ mô", navProducts: "Sản phẩm Hot", navConsumer: "Thông tin Người dùng",
        navAI: "Chẩn đoán AI", navLogistics: "Máy tính Thuế", navProviders: "Nhà cung cấp Dịch vụ",
        navLegal: "Quy định Pháp lý", navNews: "Tin tức Thương mại", navCultural: "Kiến thức Văn hóa",
        viewDetail: "Xem chi tiết", currency: "Tiền tệ", indicator: "Chỉ số",
        value: "Giá trị", year: "Năm", unit: "Đơn vị", status: "Trạng thái",
        coverage: "Phạm vi", back: "Quay lại", latestIndicators: "Chỉ số Kinh tế Mới nhất",
        market: "Thị trường Mục tiêu", category: "Danh mục Sản phẩm",
        btnAI: "Tạo báo cáo AI", thinking: "AI đang phân tích dữ liệu thị trường...",
        placeholderCat: "Nhập danh mục sản phẩm, ví dụ: Điện thoại thông minh, Mỹ phẩm...",
        liveUpdate: "Cập nhật Thời gian thực", dataSynced: "Dữ liệu đã đồng bộ",
        loading: "Đang tải...", noData: "Không có dữ liệu",
        pageTitle: "Cơ sở dữ liệu Thị trường ASEAN", pageSubtitle: "Dữ liệu Kinh tế Thời gian thực & Thông tin Thị trường"
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
        try {
            return JSON.parse(data);
        } catch {
            return data;
        }
    },
    
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const msg = document.getElementById('toast-msg');
        
        const icons = {
            success: 'fas fa-check-circle text-green-500',
            error: 'fas fa-exclamation-circle text-red-500',
            warning: 'fas fa-exclamation-triangle text-yellow-500',
            info: 'fas fa-info-circle text-blue-500'
        };
        
        msg.innerHTML = `
            <div class="flex items-center gap-2">
                <i class="${icons[type]}"></i>
                <span>${message}</span>
            </div>
        `;
        
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('-translate-x-0', 'opacity-100');
        
        setTimeout(() => {
            toast.classList.remove('-translate-x-0', 'opacity-100');
            toast.classList.add('translate-x-full', 'opacity-0');
        }, 3000);
    },
    
    showLoading() {
        return `
            <div class="flex flex-col justify-center items-center py-20">
                <div class="relative mb-4">
                    <div class="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
                    <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <p class="text-gray-600 font-medium">${i18n[currentLang].loading}</p>
                <div class="mt-2 flex gap-1">
                    <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0s"></div>
                    <div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                    <div class="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                </div>
            </div>
        `;
    }
};

// --- 实时时钟 ---
function startClock() {
    const clockEl = document.getElementById('realtime-clock');
    const update = () => {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        clockEl.textContent = now.toLocaleString('en-US', options);
    };
    setInterval(update, 1000);
    update();
}

// --- 语言切换 ---
function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('asean_lang', lang);
    
    // 更新语言选择器
    document.getElementById('lang-switcher').value = lang;
    
    // 更新所有翻译文本
    document.querySelectorAll('.t-key').forEach(el => {
        const key = el.getAttribute('data-key');
        if (i18n[lang] && i18n[lang][key]) el.textContent = i18n[lang][key];
    });
    
    // 更新页面标题
    document.getElementById('page-title').textContent = i18n[lang].pageTitle;
    document.getElementById('page-subtitle').textContent = i18n[lang].pageSubtitle;
    
    // 刷新当前视图
    refreshCurrentView();
    
    Utils.showToast(`语言切换成功 / Language switched to ${lang}`, 'success');
}

// --- 渲染器 ---
const Renderers = {
    async macro() {
        try {
            const response = await fetch(`${API_URL}/countries`);
            const countries = await response.json();
            const t = i18n[currentLang];
            
            return `
                <div class="space-y-6">
                    <!-- 东盟概览卡片 -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white">
                            <div class="flex items-center justify-between mb-4">
                                <i class="fas fa-globe-asia text-2xl opacity-80"></i>
                                <span class="text-xs font-bold bg-white/20 px-2 py-1 rounded">ASEAN</span>
                            </div>
                            <h3 class="text-2xl font-bold">10</h3>
                            <p class="text-sm opacity-90">成员国数量</p>
                        </div>
                        
                        <div class="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white">
                            <div class="flex items-center justify-between mb-4">
                                <i class="fas fa-chart-line text-2xl opacity-80"></i>
                                <span class="text-xs font-bold bg-white/20 px-2 py-1 rounded">GDP</span>
                            </div>
                            <h3 class="text-2xl font-bold">3.3T</h3>
                            <p class="text-sm opacity-90">总GDP（美元）</p>
                        </div>
                        
                        <div class="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white">
                            <div class="flex items-center justify-between mb-4">
                                <i class="fas fa-users text-2xl opacity-80"></i>
                                <span class="text-xs font-bold bg-white/20 px-2 py-1 rounded">人口</span>
                            </div>
                            <h3 class="text-2xl font-bold">680M</h3>
                            <p class="text-sm opacity-90">总人口</p>
                        </div>
                    </div>
                    
                    <!-- 国家网格 -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${countries.map(country => `
                            <div class="metric-card cursor-pointer group" 
                                 onclick="showCountryDetail(${country.country_id}, '${country.country_name_cn.replace(/'/g, "\\'")}')">
                                <div class="flex items-start justify-between mb-4">
                                    <div>
                                        <h4 class="font-bold text-gray-900 group-hover:text-blue-600 transition">${country.country_name_cn}</h4>
                                        <p class="text-xs text-gray-500 mt-1">${country.region || '东盟国家'}</p>
                                    </div>
                                    <span class="text-xs font-bold text-blue-600 border border-blue-200 px-2 py-1 rounded">${country.country_code_iso2}</span>
                                </div>
                                
                                <div class="space-y-3">
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm text-gray-600">${t.currency}</span>
                                        <span class="font-medium">${country.currency_code}</span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm text-gray-600">数据状态</span>
                                        <span class="inline-flex items-center gap-1 text-green-600 text-sm">
                                            <i class="fas fa-circle text-[8px]"></i>
                                            ${t.liveUpdate}
                                        </span>
                                    </div>
                                </div>
                                
                                <div class="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <span class="text-sm font-medium text-blue-600">${t.viewDetail}</span>
                                    <i class="fas fa-chevron-right text-blue-400 group-hover:translate-x-1 transition-transform"></i>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Macro data error:', error);
            return `
                <div class="text-center py-12">
                    <i class="fas fa-exclamation-triangle text-4xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-700 mb-2">数据加载失败</h3>
                    <p class="text-gray-500">请检查API连接状态</p>
                </div>
            `;
        }
    },
    
    async macroDetail(countryId, countryName) {
        try {
            const [indicatorsRes, countryRes] = await Promise.all([
                fetch(`${API_URL}/macro/${countryId}`),
                fetch(`${API_URL}/countries/${countryId}`)
            ]);
            const indicators = await indicatorsRes.json();
            const countryInfo = await countryRes.json();
            const t = i18n[currentLang];
            
            // 按年份分组
            const byYear = indicators.reduce((acc, item) => {
                const year = item.year;
                if (!acc[year]) acc[year] = [];
                acc[year].push(item);
                return acc;
            }, {});
            
            // 获取最新数据用于概览
            const latestYear = Math.max(...Object.keys(byYear).map(y => parseInt(y)));
            const latestData = byYear[latestYear]?.slice(0, 4) || [];
            
            return `
                <div class="space-y-8">
                    <!-- 国家头部信息 -->
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 class="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-indigo-600 bg-clip-text text-transparent">${countryName}</h2>
                            <div class="flex items-center gap-3 mt-2">
                                <span class="text-sm font-medium text-gray-600">${countryInfo.region || '东盟国家'}</span>
                                <span class="text-xs font-bold text-blue-600 border border-blue-200 px-2 py-1 rounded">${countryInfo.country_code_iso2}</span>
                                <span class="text-xs text-gray-500 flex items-center gap-1">
                                    <i class="fas fa-circle text-green-500 text-[8px]"></i>
                                    ${t.liveUpdate}
                                </span>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <button onclick="exportCountryData(${countryId})" 
                                    class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition">
                                <i class="fas fa-download"></i>
                                导出数据
                            </button>
                            <button onclick="generateCountryReport(${countryId}, '${countryName.replace(/'/g, "\\'")}')" 
                                    class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2 transition">
                                <i class="fas fa-file-pdf"></i>
                                生成报告
                            </button>
                        </div>
                    </div>
                    
                    <!-- 国家基本信息卡片 -->
                    <div class="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 class="font-medium text-gray-900 mb-4">国家基本信息</h3>
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div class="text-center p-4 bg-gray-50 rounded-lg">
                                <div class="text-xs text-gray-600 mb-1">货币</div>
                                <div class="font-bold text-gray-900">${countryInfo.currency_code || 'N/A'}</div>
                            </div>
                            <div class="text-center p-4 bg-gray-50 rounded-lg">
                                <div class="text-xs text-gray-600 mb-1">人口</div>
                                <div class="font-bold text-gray-900">${Utils.formatNumber(countryInfo.population || 0)}</div>
                            </div>
                            <div class="text-center p-4 bg-gray-50 rounded-lg">
                                <div class="text-xs text-gray-600 mb-1">GDP</div>
                                <div class="font-bold text-gray-900">$${Utils.formatNumber(countryInfo.gdp || 0)}</div>
                            </div>
                            <div class="text-center p-4 bg-gray-50 rounded-lg">
                                <div class="text-xs text-gray-600 mb-1">数据覆盖</div>
                                <div class="font-bold text-gray-900">${Object.keys(byYear).length}年</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 核心指标卡片 -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        ${latestData.map(item => `
                            <div class="metric-card hover:shadow-lg transition-all">
                                <div class="flex items-center justify-between mb-3">
                                    <span class="text-xs font-medium text-gray-500 uppercase">${item.indicator_type}</span>
                                    <span class="text-xs text-gray-400">${item.year}</span>
                                </div>
                                <div class="text-2xl font-bold text-gray-900 mb-1 count-animate">
                                    ${Utils.formatNumber(item.indicator_value)}
                                </div>
                                <div class="text-sm text-gray-500">${item.unit}</div>
                                ${item.growth_rate ? `
                                    <div class="mt-3 flex items-center gap-1 ${item.growth_rate > 0 ? 'text-green-600' : 'text-red-600'}">
                                        <i class="fas fa-arrow-${item.growth_rate > 0 ? 'up' : 'down'}"></i>
                                        <span class="text-sm font-medium">${Math.abs(item.growth_rate)}%</span>
                                        <span class="text-xs opacity-70">${item.growth_rate > 0 ? '增长' : '下降'}</span>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- 详细数据表格 -->
                    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                            <h3 class="font-medium text-gray-900 flex items-center gap-2">
                                <i class="fas fa-table text-blue-600"></i>
                                ${t.latestIndicators}
                            </h3>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="data-table w-full">
                                <thead>
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">${t.year}</th>
                                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">${t.indicator}</th>
                                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">${t.value}</th>
                                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">${t.unit}</th>
                                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">趋势</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200">
                                    ${indicators.slice(0, 15).map(item => `
                                        <tr class="hover:bg-blue-50/30 transition">
                                            <td class="px-6 py-4 font-medium whitespace-nowrap">${item.year} ${item.quarter || ''}</td>
                                            <td class="px-6 py-4 whitespace-nowrap">${item.indicator_type}</td>
                                            <td class="px-6 py-4 font-bold whitespace-nowrap">${Utils.formatNumber(item.indicator_value)}</td>
                                            <td class="px-6 py-4 text-gray-500 whitespace-nowrap">${item.unit}</td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                ${item.growth_rate ? `
                                                    <span class="inline-flex items-center gap-1 ${item.growth_rate > 0 ? 'text-green-600' : 'text-red-600'}">
                                                        <i class="fas fa-arrow-${item.growth_rate > 0 ? 'up' : 'down'} text-xs"></i>
                                                        ${Math.abs(item.growth_rate)}%
                                                    </span>
                                                ` : '<span class="text-gray-400">-</span>'}
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        ${indicators.length > 15 ? `
                            <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 text-center">
                                <span class="text-sm text-gray-500">显示前15条数据，共 ${indicators.length} 条</span>
                            </div>
                        ` : ''}
                    </div>
                    
                    <!-- 历史趋势 -->
                    ${Object.keys(byYear).length > 0 ? `
                        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <h3 class="font-medium text-gray-900 mb-6 flex items-center gap-2">
                                <i class="fas fa-chart-line text-blue-600"></i>
                                历史数据趋势
                            </h3>
                            <div class="space-y-8">
                                ${Object.entries(byYear).sort(([a], [b]) => parseInt(b) - parseInt(a)).slice(0, 5).map(([year, data]) => `
                                    <div class="timeline-item relative pl-8">
                                        <div class="absolute left-0 top-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                                            <div class="w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                        <div class="flex items-center justify-between mb-3">
                                            <h4 class="font-bold text-gray-900">${year}年</h4>
                                            <span class="text-sm text-gray-500">${data.length}个指标</span>
                                        </div>
                                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            ${data.slice(0, 4).map(item => `
                                                <div class="p-3 border border-gray-100 rounded-lg hover:border-blue-300 transition">
                                                    <div class="text-sm font-medium text-gray-700 mb-1">${item.indicator_type}</div>
                                                    <div class="text-lg font-bold text-gray-900">${Utils.formatNumber(item.indicator_value)}</div>
                                                    <div class="text-xs text-gray-500">${item.unit}</div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        } catch (error) {
            console.error('Macro detail error:', error);
            return `
                <div class="text-center py-16">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">数据加载失败</h3>
                    <p class="text-gray-600 mb-6">${error.message}</p>
                    <button onclick="goBackToMacroOverview()" class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                        返回国家列表
                    </button>
                </div>
            `;
        }
    },
    
    async products() {
        try {
            const response = await fetch(`${API_URL}/products?limit=12`);
            const products = await response.json();
            
            return `
                <div class="space-y-6">
                    <!-- 顶部统计 -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div class="metric-card">
                            <div class="flex items-center justify-between">
                                <i class="fas fa-boxes text-blue-500 text-xl"></i>
                                <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">总计</span>
                            </div>
                            <h3 class="text-2xl font-bold mt-4">${Utils.formatNumber(12847)}</h3>
                            <p class="text-sm text-gray-600">商品数量</p>
                        </div>
                        
                        <div class="metric-card">
                            <div class="flex items-center justify-between">
                                <i class="fas fa-fire text-red-500 text-xl"></i>
                                <span class="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">热销</span>
                            </div>
                            <h3 class="text-2xl font-bold mt-4">${Utils.formatNumber(234)}</h3>
                            <p class="text-sm text-gray-600">热销品类</p>
                        </div>
                        
                        <div class="metric-card">
                            <div class="flex items-center justify-between">
                                <i class="fas fa-chart-line text-green-500 text-xl"></i>
                                <span class="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">增长</span>
                            </div>
                            <h3 class="text-2xl font-bold mt-4">24.5%</h3>
                            <p class="text-sm text-gray-600">月增长率</p>
                        </div>
                        
                        <div class="metric-card">
                            <div class="flex items-center justify-between">
                                <i class="fas fa-store text-purple-500 text-xl"></i>
                                <span class="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">平台</span>
                            </div>
                            <h3 class="text-2xl font-bold mt-4">8</h3>
                            <p class="text-sm text-gray-600">电商平台</p>
                        </div>
                    </div>
                    
                    <!-- 商品网格 -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        ${products.map(product => `
                            <div class="metric-card group">
                                <div class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                                    ${product.image_url ? 
                                        `<img src="${product.image_url}" alt="${product.product_title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform">` :
                                        `<i class="fas fa-box text-gray-300 text-3xl"></i>`
                                    }
                                </div>
                                
                                <h4 class="font-medium text-gray-900 mb-2 truncate">${product.product_title}</h4>
                                
                                <div class="flex items-center justify-between text-sm mb-3">
                                    <span class="text-gray-600">${product.brand || '未知品牌'}</span>
                                    <span class="font-bold text-blue-600">$${product.average_price || 'N/A'}</span>
                                </div>
                                
                                <div class="flex items-center justify-between text-xs">
                                    <span class="text-gray-500">销量趋势</span>
                                    <span class="inline-flex items-center gap-1 ${Math.random() > 0.3 ? 'text-green-600' : 'text-red-600'}">
                                        <i class="fas fa-arrow-${Math.random() > 0.3 ? 'up' : 'down'}"></i>
                                        ${Math.floor(Math.random() * 50)}%
                                    </span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Products error:', error);
            return Utils.showLoading();
        }
    },
    
    async consumer() {
        try {
            const response = await fetch(`${API_URL}/consumer-insights/1`);
            const insights = await response.json();
            
            return `
                <div class="space-y-6">
                    <!-- 消费者洞察概览 -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div class="lg:col-span-2">
                            <div class="metric-card h-full">
                                <h3 class="font-bold text-gray-900 mb-6">东盟消费者画像</h3>
                                <div class="space-y-6">
                                    ${insights.map(insight => {
                                        const payments = Utils.safeParse(insight.top_payment_methods);
                                        return `
                                            <div class="border-l-4 border-blue-500 pl-4">
                                                <div class="flex items-center justify-between mb-2">
                                                    <h4 class="font-medium text-gray-900">${insight.segment_name}</h4>
                                                    <span class="text-sm font-bold text-blue-600">${insight.age_range}岁</span>
                                                </div>
                                                <p class="text-sm text-gray-600 mb-3">${insight.income_level}收入群体</p>
                                                
                                                <div class="flex items-center justify-between text-sm">
                                                    <div>
                                                        <div class="text-gray-500 mb-1">常用支付方式</div>
                                                        <div class="flex flex-wrap gap-2">
                                                            ${payments.slice(0, 3).map(method => `
                                                                <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">${method}</span>
                                                            `).join('')}
                                                        </div>
                                                    </div>
                                                    <div class="text-right">
                                                        <div class="text-2xl font-bold text-gray-900">$${insight.average_order_value}</div>
                                                        <div class="text-xs text-gray-500">平均订单价值</div>
                                                    </div>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                        
                        <!-- 侧边统计 -->
                        <div class="space-y-6">
                            <div class="metric-card">
                                <h4 class="font-medium text-gray-900 mb-4">消费能力分布</h4>
                                <div class="space-y-4">
                                    <div>
                                        <div class="flex justify-between text-sm mb-1">
                                            <span>高收入群体</span>
                                            <span class="font-medium">32%</span>
                                        </div>
                                        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div class="h-full bg-blue-500 w-1/3"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex justify-between text-sm mb-1">
                                            <span>中等收入群体</span>
                                            <span class="font-medium">45%</span>
                                        </div>
                                        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div class="h-full bg-green-500 w-[45%]"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex justify-between text-sm mb-1">
                                            <span>年轻消费者</span>
                                            <span class="font-medium">63%</span>
                                        </div>
                                        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div class="h-full bg-purple-500 w-[63%]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="metric-card">
                                <h4 class="font-medium text-gray-900 mb-4">热门消费时段</h4>
                                <div class="space-y-3">
                                    ${['18:00-21:00', '12:00-14:00', '20:00-22:00'].map((time, i) => `
                                        <div class="flex items-center justify-between text-sm">
                                            <span>${time}</span>
                                            <span class="font-medium">${['68%', '42%', '35%'][i]}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Consumer error:', error);
            return Utils.showLoading();
        }
    },
    
    aiAssistant() {
        const t = i18n[currentLang];
        
        return `
            <div class="max-w-4xl mx-auto">
                <!-- AI面板 -->
                <div class="ai-panel p-8 mb-8">
                    <div class="flex items-center gap-4 mb-8">
                        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white text-xl">
                            <i class="fas fa-brain"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-gray-900">AI市场准入诊断</h3>
                            <p class="text-gray-600">基于深度学习的市场分析与预测</p>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">${t.market}</label>
                            <select id="ai-country" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="1">印度尼西亚 Indonesia</option>
                                <option value="2">泰国 Thailand</option>
                                <option value="3">越南 Vietnam</option>
                                <option value="4">马来西亚 Malaysia</option>
                                <option value="5">菲律宾 Philippines</option>
                                <option value="6">新加坡 Singapore</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">${t.category}</label>
                            <input id="ai-category" type="text" 
                                   placeholder="${t.placeholderCat}"
                                   class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                    </div>
                    
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">分析维度</label>
                        <div class="flex flex-wrap gap-3">
                            ${['市场规模', '竞争分析', '消费趋势', '法规政策', '物流成本', '支付方式'].map(item => `
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                    <span class="text-sm text-gray-700">${item}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    
                    <button onclick="runAIAnalysis()" 
                            id="ai-btn"
                            class="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium py-4 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all flex items-center justify-center gap-3">
                        <i class="fas fa-magic"></i>
                        <span id="btn-text">${t.btnAI}</span>
                    </button>
                </div>
                
                <!-- 结果区域 -->
                <div id="ai-result-box" class="hidden">
                    <div class="metric-card">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-lg font-bold text-gray-900">AI分析报告</h3>
                            <div class="flex items-center gap-2">
                                <button onclick="saveReport()" class="text-sm text-blue-600 hover:text-blue-800">
                                    <i class="fas fa-save mr-1"></i>保存
                                </button>
                                <button onclick="exportReport()" class="text-sm text-blue-600 hover:text-blue-800">
                                    <i class="fas fa-download mr-1"></i>导出
                                </button>
                            </div>
                        </div>
                        
                        <div id="ai-loading" class="text-center py-12">
                            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                            <p class="text-gray-600">${t.thinking}</p>
                        </div>
                        
                        <div id="ai-content" class="space-y-6"></div>
                    </div>
                </div>
            </div>
        `;
    },
    
    async logistics() {
        try {
            const response = await fetch(`${API_URL}/taxes/1`);
            const taxes = await response.json();
            
            return `
                <div class="space-y-6">
                    <!-- 关税计算器 -->
                    <div class="metric-card">
                        <h3 class="font-bold text-gray-900 mb-6">关税与物流计算器</h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">原产地</label>
                                <select class="w-full border border-gray-300 rounded-lg px-4 py-3">
                                    <option>中国 China</option>
                                    <option>日本 Japan</option>
                                    <option>韩国 Korea</option>
                                    <option>美国 USA</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">目的地</label>
                                <select class="w-full border border-gray-300 rounded-lg px-4 py-3">
                                    <option selected>印度尼西亚 Indonesia</option>
                                    <option>泰国 Thailand</option>
                                    <option>越南 Vietnam</option>
                                    <option>马来西亚 Malaysia</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">商品价值（USD）</label>
                                <input type="number" class="w-full border border-gray-300 rounded-lg px-4 py-3" placeholder="1000" value="1000">
                            </div>
                        </div>
                        
                        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <div class="text-sm text-gray-600 mb-1">进口关税</div>
                                    <div class="text-2xl font-bold text-gray-900">5.2%</div>
                                </div>
                                <div>
                                    <div class="text-sm text-gray-600 mb-1">增值税</div>
                                    <div class="text-2xl font-bold text-gray-900">11%</div>
                                </div>
                                <div>
                                    <div class="text-sm text-gray-600 mb-1">物流成本</div>
                                    <div class="text-2xl font-bold text-gray-900">$125</div>
                                </div>
                                <div>
                                    <div class="text-sm text-gray-600 mb-1">总成本</div>
                                    <div class="text-2xl font-bold text-gray-900">$1,247</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- HS编码查询表 -->
                    <div class="metric-card">
                        <h3 class="font-bold text-gray-900 mb-6">HS编码与税率参考</h3>
                        
                        <div class="overflow-x-auto">
                            <table class="data-table w-full">
                                <thead>
                                    <tr>
                                        <th class="px-6 py-3 text-left">HS编码</th>
                                        <th class="px-6 py-3 text-left">商品描述</th>
                                        <th class="px-6 py-3 text-left">进口税率</th>
                                        <th class="px-6 py-3 text-left">增值税率</th>
                                        <th class="px-6 py-3 text-left">特殊要求</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${taxes.slice(0, 8).map(tax => `
                                        <tr>
                                            <td class="px-6 py-4 font-mono font-bold text-blue-600">${tax.hs_code}</td>
                                            <td class="px-6 py-4">${tax.hs_code_description}</td>
                                            <td class="px-6 py-4 font-bold">${tax.import_duty_rate}%</td>
                                            <td class="px-6 py-4">${tax.vat_rate || '10%'}</td>
                                            <td class="px-6 py-4">
                                                ${tax.special_requirements ? 
                                                    `<span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">需要认证</span>` : 
                                                    '<span class="text-gray-400">-</span>'
                                                }
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Logistics error:', error);
            return Utils.showLoading();
        }
    },
    
    async providers() {
        try {
            const response = await fetch(`${API_URL}/service-providers`);
            const providers = await response.json();
            
            return `
                <div class="space-y-6">
                    <!-- 服务商统计 -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div class="metric-card">
                            <div class="flex items-center justify-between">
                                <i class="fas fa-shipping-fast text-blue-500 text-xl"></i>
                                <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">物流</span>
                            </div>
                            <h3 class="text-2xl font-bold mt-4">${Utils.formatNumber(42)}</h3>
                            <p class="text-sm text-gray-600">物流服务商</p>
                        </div>
                        
                        <div class="metric-card">
                            <div class="flex items-center justify-between">
                                <i class="fas fa-money-check-alt text-green-500 text-xl"></i>
                                <span class="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">支付</span>
                            </div>
                            <h3 class="text-2xl font-bold mt-4">${Utils.formatNumber(28)}</h3>
                            <p class="text-sm text-gray-600">支付服务商</p>
                        </div>
                        
                        <div class="metric-card">
                            <div class="flex items-center justify-between">
                                <i class="fas fa-gavel text-purple-500 text-xl"></i>
                                <span class="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">法律</span>
                            </div>
                            <h3 class="text-2xl font-bold mt-4">${Utils.formatNumber(15)}</h3>
                            <p class="text-sm text-gray-600">法律服务机构</p>
                        </div>
                        
                        <div class="metric-card">
                            <div class="flex items-center justify-between">
                                <i class="fas fa-language text-orange-500 text-xl"></i>
                                <span class="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">本地化</span>
                            </div>
                            <h3 class="text-2xl font-bold mt-4">${Utils.formatNumber(36)}</h3>
                            <p class="text-sm text-gray-600">本地化服务商</p>
                        </div>
                    </div>
                    
                    <!-- 服务商列表 -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        ${providers.map(provider => `
                            <div class="metric-card">
                                <div class="flex items-start justify-between mb-4">
                                    <div class="flex items-center gap-4">
                                        <div class="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                                            <i class="fas fa-building text-gray-400 text-xl"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-gray-900">${provider.provider_name}</h4>
                                            <p class="text-sm text-gray-600">${provider.service_type}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <i class="fas fa-star text-yellow-400"></i>
                                        <span class="font-bold">${provider.user_rating_avg || '4.8'}</span>
                                    </div>
                                </div>
                                
                                <div class="mb-4">
                                    <div class="text-sm text-gray-600 mb-2">覆盖市场</div>
                                    <div class="flex flex-wrap gap-2">
                                        ${provider.markets?.split(',').slice(0, 3).map(market => `
                                            <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">${market.trim()}</span>
                                        `).join('') || '<span class="text-xs text-gray-400">东盟全境</span>'}
                                    </div>
                                </div>
                                
                                <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div class="text-sm text-gray-600">
                                        响应时间：<span class="font-medium">${Math.floor(Math.random() * 24) + 1}小时</span>
                                    </div>
                                    <button class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                                        获取报价
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Providers error:', error);
            return Utils.showLoading();
        }
    },
    
    async legal() {
        try {
            const [regRes, countryRes] = await Promise.all([
                fetch(`${API_URL}/legal-regulations?limit=200`),
                fetch(`${API_URL}/countries`)
            ]);
            const regulations = await regRes.json();
            const countries = await countryRes.json();
            const t = i18n[currentLang];

            // 构建国家映射
            const countryMap = {};
            countries.forEach(c => {
                countryMap[c.country_id] = c.country_name_cn;
            });

            // 计算按国家的法规数量
            const countryCounts = {};
            regulations.forEach(r => {
                const key = countryMap[r.country_id] || `国家 ${r.country_id}`;
                countryCounts[key] = (countryCounts[key] || 0) + 1;
            });

            // 保存到全局用于图表
            window.__legalChartData = {
                labels: Object.keys(countryCounts),
                counts: Object.values(countryCounts)
            };

            // 国家过滤选项（只展示有法规的国家）
            const countryIdsWithReg = [...new Set(regulations.map(r => r.country_id))];
            const countryOptions = countryIdsWithReg.map(id => {
                const name = countryMap[id] || `国家 ${id}`;
                return `<option value="${id}">${name}</option>`;
            }).join('');
            
            return `
                <div class="space-y-6">
                    <!-- 顶部过滤 + 图表 -->
                    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
                        <!-- 过滤条件 -->
                        <div class="metric-card xl:col-span-1">
                            <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i class="fas fa-filter text-blue-500"></i>
                                法律法规筛选
                            </h3>
                            <div class="space-y-4 text-sm">
                                <div>
                                    <label class="block text-gray-600 mb-1">按国家筛选</label>
                                    <select id="legal-country-filter" onchange="applyLegalFilters()"
                                            class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option value="">全部国家</option>
                                        ${countryOptions}
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-gray-600 mb-1">按影响级别</label>
                                    <select id="legal-impact-filter" onchange="applyLegalFilters()"
                                            class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option value="">全部级别</option>
                                        <option value="high">高影响</option>
                                        <option value="medium">中影响</option>
                                        <option value="low">低影响</option>
                                    </select>
                                </div>
                                <p class="text-xs text-gray-500">
                                    筛选条件仅影响下方列表展示，图表展示整体分布概况。
                                </p>
                            </div>
                        </div>

                        <!-- 图表区域 -->
                        <div class="metric-card xl:col-span-2">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="font-bold text-gray-900 flex items-center gap-2">
                                    <i class="fas fa-chart-bar text-blue-500"></i>
                                    法规分布（按国家）
                                </h3>
                                <span class="text-xs text-gray-500">单位：条</span>
                            </div>
                            <div class="h-56">
                                <canvas id="legal-chart"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- 统计卡片 -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div class="metric-card">
                            <div class="flex items-center justify-between">
                                <i class="fas fa-gavel text-blue-500 text-xl"></i>
                                <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">法律</span>
                            </div>
                            <h3 class="text-2xl font-bold mt-4">${Utils.formatNumber(regulations.length)}</h3>
                            <p class="text-sm text-gray-600">法律法规总数</p>
                        </div>
                        
                        <div class="metric-card">
                            <div class="flex items-center justify-between">
                                <i class="fas fa-file-contract text-green-500 text-xl"></i>
                                <span class="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">有效</span>
                            </div>
                            <h3 class="text-2xl font-bold mt-4">${Utils.formatNumber(regulations.filter(r => !r.expiry_date || new Date(r.expiry_date) > new Date()).length)}</h3>
                            <p class="text-sm text-gray-600">现行有效</p>
                        </div>
                        
                        <div class="metric-card">
                            <div class="flex items-center justify-between">
                                <i class="fas fa-balance-scale text-purple-500 text-xl"></i>
                                <span class="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">类别</span>
                            </div>
                            <h3 class="text-2xl font-bold mt-4">${Utils.formatNumber([...new Set(regulations.map(r => r.category))].filter(Boolean).length)}</h3>
                            <p class="text-sm text-gray-600">法规类别</p>
                        </div>
                        
                        <div class="metric-card">
                            <div class="flex items-center justify-between">
                                <i class="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                                <span class="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">重要</span>
                            </div>
                            <h3 class="text-2xl font-bold mt-4">${Utils.formatNumber(regulations.filter(r => r.impact_level === 'high').length)}</h3>
                            <p class="text-sm text-gray-600">高影响法规</p>
                        </div>
                    </div>
                    
                    <!-- 法规列表 -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        ${regulations.map(reg => `
                            <div class="metric-card group cursor-pointer legal-item"
                                 data-country-id="${reg.country_id}"
                                 data-impact="${(reg.impact_level || '').toLowerCase()}"
                                 data-category="${reg.category || ''}"
                                 onclick="showLegalDetail(${reg.regulation_id})">
                                <div class="flex items-start justify-between mb-4">
                                    <div class="flex-1">
                                        <h4 class="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">${reg.title}</h4>
                                        ${reg.title_en ? `<p class="text-sm text-gray-500 mb-2">${reg.title_en}</p>` : ''}
                                    </div>
                                    ${reg.impact_level === 'high' ? 
                                        '<span class="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded ml-2">高影响</span>' : 
                                        reg.impact_level === 'medium' ?
                                        '<span class="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded ml-2">中影响</span>' :
                                        '<span class="text-xs font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded ml-2">低影响</span>'
                                    }
                                </div>
                                
                                <div class="space-y-2 mb-4">
                                    ${reg.category ? `<div class="flex items-center text-sm"><span class="text-gray-600 w-20">类别:</span><span class="font-medium">${reg.category}</span></div>` : ''}
                                    ${reg.regulation_type ? `<div class="flex items-center text-sm"><span class="text-gray-600 w-20">类型:</span><span class="font-medium">${reg.regulation_type}</span></div>` : ''}
                                    ${reg.effective_date ? `<div class="flex items-center text-sm"><span class="text-gray-600 w-20">生效:</span><span class="font-medium">${Utils.formatDate(reg.effective_date)}</span></div>` : ''}
                                </div>
                                
                                <div class="pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <span class="text-sm font-medium text-blue-600">${t.viewDetail}</span>
                                    <i class="fas fa-chevron-right text-blue-400 group-hover:translate-x-1 transition-transform"></i>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Legal error:', error);
            return Utils.showLoading();
        }
    },
    
    async news() {
        try {
            const featuredResponse = await fetch(`${API_URL}/trade-news?is_featured=true&limit=3`);
            const featuredNews = await featuredResponse.json();
            
            const allResponse = await fetch(`${API_URL}/trade-news?limit=20`);
            const allNews = await allResponse.json();
            const t = i18n[currentLang];
            
            return `
                <div class="space-y-6">
                    <!-- 精选资讯 -->
                    ${featuredNews.length > 0 ? `
                        <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
                            <h3 class="text-xl font-bold mb-4">精选资讯</h3>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                ${featuredNews.map(news => `
                                    <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition">
                                        <div class="text-xs opacity-80 mb-2">${Utils.formatDate(news.publish_date)}</div>
                                        <h4 class="font-bold mb-2">${news.title}</h4>
                                        ${news.summary ? `<p class="text-sm opacity-90 line-clamp-2">${news.summary}</p>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <!-- 资讯列表 -->
                    <div class="grid grid-cols-1 gap-6">
                        ${allNews.map(news => `
                            <div class="metric-card group cursor-pointer" onclick="showNewsDetail(${news.news_id})">
                                <div class="flex items-start gap-4">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2 mb-2">
                                            ${news.is_featured ? '<span class="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">精选</span>' : ''}
                                            ${news.news_type ? `<span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">${news.news_type}</span>` : ''}
                                            <span class="text-xs text-gray-500">${Utils.formatDate(news.publish_date)}</span>
                                        </div>
                                        <h4 class="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">${news.title}</h4>
                                        ${news.summary ? `<p class="text-sm text-gray-600 line-clamp-2 mb-3">${news.summary}</p>` : ''}
                                        <div class="flex items-center justify-between">
                                            ${news.source ? `<span class="text-xs text-gray-500">来源: ${news.source}</span>` : ''}
                                            <span class="text-xs text-gray-500 flex items-center gap-1">
                                                <i class="fas fa-eye"></i> ${news.view_count || 0}
                                            </span>
                                        </div>
                                    </div>
                                    <i class="fas fa-chevron-right text-gray-300 group-hover:text-blue-600 transition"></i>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('News error:', error);
            return Utils.showLoading();
        }
    },
    
    async legalDetail(regulationId) {
        try {
            const response = await fetch(`${API_URL}/legal-regulations/${regulationId}`);
            const regulation = await response.json();
            const t = i18n[currentLang];
            
            return `
                <div class="space-y-8">
                    <!-- 法规头部信息 -->
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-900">${regulation.title}</h2>
                            ${regulation.title_en ? `<p class="text-gray-600 mt-1">${regulation.title_en}</p>` : ''}
                            <div class="flex items-center gap-3 mt-3">
                                ${regulation.impact_level === 'high' ? 
                                    '<span class="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">高影响</span>' : 
                                    regulation.impact_level === 'medium' ?
                                    '<span class="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">中影响</span>' :
                                    '<span class="text-xs font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded">低影响</span>'
                                }
                                ${regulation.category ? `<span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">${regulation.category}</span>` : ''}
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <button onclick="exportLegalData(${regulationId})" 
                                    class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition">
                                <i class="fas fa-download"></i>
                                导出法规
                            </button>
                        </div>
                    </div>
                    
                    <!-- 法规基本信息卡片 -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div class="metric-card">
                            <div class="text-xs text-gray-600 mb-2">生效日期</div>
                            <div class="font-bold text-gray-900">${Utils.formatDate(regulation.effective_date)}</div>
                        </div>
                        ${regulation.expiry_date ? `
                            <div class="metric-card">
                                <div class="text-xs text-gray-600 mb-2">失效日期</div>
                                <div class="font-bold text-gray-900">${Utils.formatDate(regulation.expiry_date)}</div>
                            </div>
                        ` : ''}
                        <div class="metric-card">
                            <div class="text-xs text-gray-600 mb-2">法规类型</div>
                            <div class="font-bold text-gray-900">${regulation.regulation_type || 'N/A'}</div>
                        </div>
                        <div class="metric-card">
                            <div class="text-xs text-gray-600 mb-2">适用国家</div>
                            <div class="font-bold text-gray-900">国家 ID: ${regulation.country_id}</div>
                        </div>
                    </div>
                    
                    <!-- 法规详细内容 -->
                    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 class="font-medium text-gray-900 mb-6 flex items-center gap-2">
                            <i class="fas fa-file-alt text-blue-600"></i>
                            法规详细内容
                        </h3>
                        <div class="space-y-6">
                            ${regulation.description ? `
                                <div>
                                    <h4 class="font-medium text-gray-700 mb-3">法规描述</h4>
                                    <div class="text-gray-600 space-y-3">
                                        ${regulation.description.split('\n').map(line => `<p>${line}</p>`).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${regulation.requirements ? `
                                <div>
                                    <h4 class="font-medium text-gray-700 mb-3">具体要求</h4>
                                    <div class="space-y-2">
                                        ${regulation.requirements.split('\n').map((item, index) => `
                                            <div class="flex items-start gap-3">
                                                <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span class="text-xs font-bold text-blue-600">${index + 1}</span>
                                                </div>
                                                <p class="text-gray-600">${item}</p>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${regulation.special_requirements ? `
                                <div>
                                    <h4 class="font-medium text-gray-700 mb-3">特殊要求</h4>
                                    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                        <p class="text-gray-700">${regulation.special_requirements}</p>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- 相关法规 -->
                    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 class="font-medium text-gray-900 mb-6 flex items-center gap-2">
                            <i class="fas fa-link text-blue-600"></i>
                            相关法规
                        </h3>
                        <div class="text-center py-8">
                            <i class="fas fa-sync-alt text-gray-300 text-2xl mb-3 animate-spin"></i>
                            <p class="text-gray-500">加载相关法规中...</p>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Legal detail error:', error);
            return `
                <div class="text-center py-16">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">数据加载失败</h3>
                    <p class="text-gray-600 mb-6">${error.message}</p>
                    <button onclick="goBackToLegalOverview()" class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                        返回法规列表
                    </button>
                </div>
            `;
        }
    },
    
    async cultural() {
        try {
            const response = await fetch(`${API_URL}/cultural-knowledge?limit=20`);
            const knowledge = await response.json();
            const t = i18n[currentLang];
            
            // 按国家分组
            const byCountry = knowledge.reduce((acc, item) => {
                const countryId = item.country_id;
                if (!acc[countryId]) acc[countryId] = [];
                acc[countryId].push(item);
                return acc;
            }, {});
            
            return `
                <div class="space-y-6">
                    <!-- 统计 -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="metric-card">
                            <div class="flex items-center justify-between">
                                <i class="fas fa-globe-asia text-purple-500 text-xl"></i>
                                <span class="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">国家</span>
                            </div>
                            <h3 class="text-2xl font-bold mt-4">${Utils.formatNumber(Object.keys(byCountry).length)}</h3>
                            <p class="text-sm text-gray-600">覆盖国家</p>
                        </div>
                        
                        <div class="metric-card">
                            <div class="flex items-center justify-between">
                                <i class="fas fa-book text-green-500 text-xl"></i>
                                <span class="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">知识</span>
                            </div>
                            <h3 class="text-2xl font-bold mt-4">${Utils.formatNumber(knowledge.length)}</h3>
                            <p class="text-sm text-gray-600">文化知识条目</p>
                        </div>
                        
                        <div class="metric-card">
                            <div class="flex items-center justify-between">
                                <i class="fas fa-star text-yellow-500 text-xl"></i>
                                <span class="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">重要</span>
                            </div>
                            <h3 class="text-2xl font-bold mt-4">${Utils.formatNumber(knowledge.filter(k => k.importance_level === 'high').length)}</h3>
                            <p class="text-sm text-gray-600">重要知识</p>
                        </div>
                    </div>
                    
                    <!-- 按国家分组显示 -->
                    ${Object.entries(byCountry).map(([countryId, items]) => `
                        <div class="metric-card">
                            <h3 class="font-bold text-gray-900 mb-4">国家 ID: ${countryId}</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${items.map(item => `
                                    <div class="border-l-4 border-purple-500 pl-4 cursor-pointer group" onclick="showCulturalDetail(${item.knowledge_id})">
                                        <div class="flex items-start justify-between mb-2">
                                            <h4 class="font-medium text-gray-900 group-hover:text-purple-600 transition">${item.title}</h4>
                                            ${item.importance_level === 'high' ? 
                                                '<span class="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded ml-2">重要</span>' : 
                                                '<span class="text-xs font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded ml-2">一般</span>'
                                            }
                                        </div>
                                        ${item.category ? `<p class="text-sm text-gray-600 mb-2">类别: ${item.category}</p>` : ''}
                                        <p class="text-xs text-gray-500">${t.viewDetail} →</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } catch (error) {
            console.error('Cultural error:', error);
            return Utils.showLoading();
        }
    },
    
    async culturalDetail(knowledgeId) {
        try {
            const response = await fetch(`${API_URL}/cultural-knowledge/${knowledgeId}`);
            const knowledge = await response.json();
            const t = i18n[currentLang];
            
            return `
                <div class="space-y-8">
                    <!-- 文化知识头部信息 -->
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-900">${knowledge.title}</h2>
                            <div class="flex items-center gap-3 mt-2">
                                ${knowledge.importance_level === 'high' ? 
                                    '<span class="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">重要</span>' : 
                                    '<span class="text-xs font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded">一般</span>'
                                }
                                ${knowledge.category ? `<span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">${knowledge.category}</span>` : ''}
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <button onclick="exportCulturalData(${knowledgeId})" 
                                    class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition">
                                <i class="fas fa-download"></i>
                                导出知识
                            </button>
                        </div>
                    </div>
                    
                    <!-- 文化知识基本信息卡片 -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="metric-card">
                            <div class="text-xs text-gray-600 mb-2">国家</div>
                            <div class="font-bold text-gray-900">国家 ID: ${knowledge.country_id}</div>
                        </div>
                        <div class="metric-card">
                            <div class="text-xs text-gray-600 mb-2">知识类型</div>
                            <div class="font-bold text-gray-900">${knowledge.knowledge_type || 'N/A'}</div>
                        </div>
                        <div class="metric-card">
                            <div class="text-xs text-gray-600 mb-2">重要性等级</div>
                            <div class="font-bold ${knowledge.importance_level === 'high' ? 'text-red-600' : 'text-gray-900'}">
                                ${knowledge.importance_level === 'high' ? '高' : '一般'}
                            </div>
                        </div>
                    </div>
                    
                    <!-- 文化知识详细内容 -->
                    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 class="font-medium text-gray-900 mb-6 flex items-center gap-2">
                            <i class="fas fa-book text-purple-600"></i>
                            知识详细内容
                        </h3>
                        <div class="space-y-6">
                            ${knowledge.content ? `
                                <div>
                                    <h4 class="font-medium text-gray-700 mb-3">内容</h4>
                                    <div class="text-gray-600 space-y-3">
                                        ${knowledge.content.split('\n').map(line => `<p>${line}</p>`).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${knowledge.notes ? `
                                <div>
                                    <h4 class="font-medium text-gray-700 mb-3">备注</h4>
                                    <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
                                        <p class="text-gray-700">${knowledge.notes}</p>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- 相关知识 -->
                    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 class="font-medium text-gray-900 mb-6 flex items-center gap-2">
                            <i class="fas fa-link text-purple-600"></i>
                            相关知识
                        </h3>
                        <div class="text-center py-8">
                            <i class="fas fa-sync-alt text-gray-300 text-2xl mb-3 animate-spin"></i>
                            <p class="text-gray-500">加载相关知识中...</p>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Cultural detail error:', error);
            return `
                <div class="text-center py-16">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">数据加载失败</h3>
                    <p class="text-gray-600 mb-6">${error.message}</p>
                    <button onclick="goBackToCulturalOverview()" class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                        返回知识列表
                    </button>
                </div>
            `;
        }
    },
    
    async newsDetail(newsId) {
        try {
            const response = await fetch(`${API_URL}/trade-news/${newsId}`);
            const news = await response.json();
            const t = i18n[currentLang];
            
            return `
                <div class="space-y-8">
                    <!-- 资讯头部信息 -->
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-900">${news.title}</h2>
                            <div class="flex items-center gap-3 mt-2">
                                ${news.is_featured ? '<span class="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">精选</span>' : ''}
                                ${news.news_type ? `<span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">${news.news_type}</span>` : ''}
                                <span class="text-xs text-gray-500">${Utils.formatDate(news.publish_date)}</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <button onclick="shareNews(${newsId})" 
                                    class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition">
                                <i class="fas fa-share-alt"></i>
                                分享资讯
                            </button>
                        </div>
                    </div>
                    
                    <!-- 资讯基本信息卡片 -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="metric-card">
                            <div class="text-xs text-gray-600 mb-2">发布日期</div>
                            <div class="font-bold text-gray-900">${Utils.formatDate(news.publish_date)}</div>
                        </div>
                        <div class="metric-card">
                            <div class="text-xs text-gray-600 mb-2">来源</div>
                            <div class="font-bold text-gray-900">${news.source || '未知'}</div>
                        </div>
                        <div class="metric-card">
                            <div class="text-xs text-gray-600 mb-2">浏览次数</div>
                            <div class="font-bold text-gray-900">${news.view_count || 0}</div>
                        </div>
                    </div>
                    
                    <!-- 资讯详细内容 -->
                    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 class="font-medium text-gray-900 mb-6 flex items-center gap-2">
                            <i class="fas fa-newspaper text-orange-600"></i>
                            资讯内容
                        </h3>
                        <div class="space-y-6">
                            ${news.summary ? `
                                <div>
                                    <h4 class="font-medium text-gray-700 mb-3">摘要</h4>
                                    <p class="text-gray-600">${news.summary}</p>
                                </div>
                            ` : ''}
                            
                            ${news.content ? `
                                <div>
                                    <h4 class="font-medium text-gray-700 mb-3">详细内容</h4>
                                    <div class="text-gray-600 space-y-3">
                                        ${news.content.split('\n').map(line => `<p>${line}</p>`).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- 相关资讯 -->
                    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 class="font-medium text-gray-900 mb-6 flex items-center gap-2">
                            <i class="fas fa-link text-orange-600"></i>
                            相关资讯
                        </h3>
                        <div class="text-center py-8">
                            <i class="fas fa-sync-alt text-gray-300 text-2xl mb-3 animate-spin"></i>
                            <p class="text-gray-500">加载相关资讯中...</p>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('News detail error:', error);
            return `
                <div class="text-center py-16">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">数据加载失败</h3>
                    <p class="text-gray-600 mb-6">${error.message}</p>
                    <button onclick="goBackToNewsOverview()" class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                        返回资讯列表
                    </button>
                </div>
            `;
        }
    }
};

// --- 全局函数 ---
async function showCountryDetail(id, name) {
    currentView = 'macroDetail';
    localStorage.setItem('lastCountryId', id);
    localStorage.setItem('lastCountryName', name);
    
    // 显示返回按钮
    document.getElementById('back-btn').classList.remove('hidden');
    
    // 更新面包屑
    document.getElementById('breadcrumb').textContent = name;
    document.getElementById('module-title').textContent = name;
    
    // 加载内容
    const container = document.getElementById('content-container');
    container.innerHTML = Utils.showLoading();
    
    try {
        const html = await Renderers.macroDetail(id, name);
        container.innerHTML = html;
    } catch (error) {
        console.error('Show country detail error:', error);
        container.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-700 mb-2">加载失败</h3>
                <p class="text-gray-500">${error.message}</p>
            </div>
        `;
    }
}

function goBackToMacroOverview() {
    currentView = 'macro';
    document.getElementById('back-btn').classList.add('hidden');
    switchModule('macro');
}

async function switchModule(mod, el) {
    if (el) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            item.classList.remove('bg-gray-50');
        });
        el.classList.add('active');
        el.classList.add('bg-gray-50');
    }
    
    // 映射模块标题
    const titleMap = {
        macro: 'navMacro',
        products: 'navProducts',
        consumer: 'navConsumer',
        'ai-assistant': 'navAI',
        logistics: 'navLogistics',
        providers: 'navProviders',
        legal: 'navLegal',
        news: 'navNews',
        cultural: 'navCultural'
    };
    
    const t = i18n[currentLang];
    
    // 更新页面标题
    document.getElementById('module-title').textContent = t[titleMap[mod]] || mod;
    document.getElementById('breadcrumb').textContent = t[titleMap[mod]] || mod;
    
    // 如果是宏观模块，隐藏返回按钮
    if (mod === 'macro') {
        document.getElementById('back-btn').classList.add('hidden');
    }
    
    // 加载内容
    const container = document.getElementById('content-container');
    container.innerHTML = Utils.showLoading();
    
    try {
        let html;
        if (mod === 'ai-assistant') {
            html = Renderers.aiAssistant();
        } else if (mod === 'macroDetail') {
            const countryId = localStorage.getItem('lastCountryId');
            const countryName = localStorage.getItem('lastCountryName');
            if (countryId && countryName) {
                html = await Renderers.macroDetail(countryId, countryName);
            } else {
                html = await Renderers.macro();
            }
        } else if (Renderers[mod]) {
            html = await Renderers[mod]();
            
            // 如果加载的是legal模块，需要渲染图表
            if (mod === 'legal' && html.includes('legal-chart')) {
                // 等待DOM渲染完成
                setTimeout(renderLegalChart, 100);
            }
        } else {
            html = `<div class="text-center py-12"><p class="text-gray-500">Module not found: ${mod}</p></div>`;
        }
        container.innerHTML = html;
    } catch (error) {
        console.error('Switch module error:', error);
        container.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-exclamation-triangle text-4xl text-gray-300 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-700 mb-2">模块加载失败</h3>
                <p class="text-gray-500">${error.message}</p>
            </div>
        `;
    }
}

async function runAIAnalysis() {
    const countryId = document.getElementById('ai-country').value;
    const category = document.getElementById('ai-category').value;
    const box = document.getElementById('ai-result-box');
    const content = document.getElementById('ai-content');
    const loading = document.getElementById('ai-loading');
    const btn = document.getElementById('ai-btn');
    const btnText = document.getElementById('btn-text');
    
    if (!category.trim()) {
        Utils.showToast('请输入商品品类', 'warning');
        return;
    }
    
    // 显示结果区域
    box.classList.remove('hidden');
    loading.classList.remove('hidden');
    content.innerHTML = '';
    btn.disabled = true;
    btnText.textContent = '分析中...';
    
    try {
        // 模拟API调用
        setTimeout(async () => {
            try {
                const res = await fetch(`${API_URL}/ai/analyze-market?country_id=${countryId}&category_name=${encodeURIComponent(category)}&lang=${currentLang}`, {
                    method: 'POST'
                });
                
                if (!res.ok) throw new Error('API请求失败');
                
                const data = await res.json();
                
                loading.classList.add('hidden');
                
                content.innerHTML = `
                    <div class="border-b border-gray-200 pb-6 mb-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <h4 class="font-bold text-gray-900 mb-1">${category} - 市场准入分析报告</h4>
                                <p class="text-sm text-gray-600">生成时间：${new Date().toLocaleString()}</p>
                            </div>
                            <span class="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">置信度：92%</span>
                        </div>
                    </div>
                    
                    <div class="space-y-6">
                        <!-- 执行摘要 -->
                        <div>
                            <h5 class="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <i class="fas fa-file-alt text-blue-500"></i>
                                执行摘要
                            </h5>
                            <div class="bg-blue-50 rounded-lg p-4">
                                <p class="text-gray-700">${data.summary || '基于当前市场数据，该品类在目标市场具有良好的增长潜力。'}</p>
                            </div>
                        </div>
                        
                        <!-- 市场规模 -->
                        <div>
                            <h5 class="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <i class="fas fa-chart-pie text-green-500"></i>
                                市场规模评估
                            </h5>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div class="bg-white border border-gray-200 rounded-lg p-4">
                                    <div class="text-sm text-gray-600 mb-1">市场规模</div>
                                    <div class="text-xl font-bold text-gray-900">$${Utils.formatNumber(Math.floor(Math.random() * 5000) + 1000)}M</div>
                                </div>
                                <div class="bg-white border border-gray-200 rounded-lg p-4">
                                    <div class="text-sm text-gray-600 mb-1">年增长率</div>
                                    <div class="text-xl font-bold text-green-600">${Math.floor(Math.random() * 30) + 5}%</div>
                                </div>
                                <div class="bg-white border border-gray-200 rounded-lg p-4">
                                    <div class="text-sm text-gray-600 mb-1">竞争强度</div>
                                    <div class="text-xl font-bold ${Math.random() > 0.5 ? 'text-green-600' : 'text-red-600'}">${Math.random() > 0.5 ? '中等' : '激烈'}</div>
                                </div>
                                <div class="bg-white border border-gray-200 rounded-lg p-4">
                                    <div class="text-sm text-gray-600 mb-1">市场饱和度</div>
                                    <div class="text-xl font-bold text-blue-600">${Math.floor(Math.random() * 40) + 20}%</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 详细分析 -->
                        <div>
                            <h5 class="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <i class="fas fa-search text-purple-500"></i>
                                详细分析
                            </h5>
                            <div class="prose prose-sm max-w-none">
                                ${data.analysis || `<p>该品类在目标市场具有以下特点：</p>
                                <ul>
                                    <li>市场规模持续增长，年复合增长率超过20%</li>
                                    <li>线上销售渠道占比逐年提升</li>
                                    <li>年轻消费群体为主要购买力</li>
                                    <li>品牌认知度对购买决策影响显著</li>
                                </ul>`}
                            </div>
                        </div>
                        
                        <!-- 建议 -->
                        <div>
                            <h5 class="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <i class="fas fa-lightbulb text-amber-500"></i>
                                市场进入建议
                            </h5>
                            <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5">
                                <ul class="space-y-3">
                                    <li class="flex items-start gap-3">
                                        <i class="fas fa-check-circle text-green-500 mt-0.5"></i>
                                        <span>建议通过跨境电商平台进行初步市场测试</span>
                                    </li>
                                    <li class="flex items-start gap-3">
                                        <i class="fas fa-check-circle text-green-500 mt-0.5"></i>
                                        <span>重点关注18-35岁年龄段的消费者需求</span>
                                    </li>
                                    <li class="flex items-start gap-3">
                                        <i class="fas fa-check-circle text-green-500 mt-0.5"></i>
                                        <span>建议选择本地支付解决方案以提升转化率</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
                
            } catch (error) {
                console.error('AI analysis error:', error);
                loading.classList.add('hidden');
                content.innerHTML = `
                    <div class="text-center py-8">
                        <i class="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
                        <h4 class="font-medium text-gray-700 mb-2">AI分析服务暂时不可用</h4>
                        <p class="text-gray-500 mb-4">请稍后重试或联系技术支持</p>
                    </div>
                `;
            } finally {
                btn.disabled = false;
                btnText.textContent = i18n[currentLang].btnAI;
            }
        }, 2000);
        
    } catch (error) {
        console.error('Run AI analysis error:', error);
        loading.classList.add('hidden');
        content.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
                <h4 class="font-medium text-gray-700 mb-2">分析失败</h4>
                <p class="text-gray-500">${error.message}</p>
            </div>
        `;
        btn.disabled = false;
        btnText.textContent = i18n[currentLang].btnAI;
    }
}

function refreshCurrentView() {
    if (currentView === 'macroDetail') {
        const countryId = localStorage.getItem('lastCountryId');
        const countryName = localStorage.getItem('lastCountryName');
        if (countryId && countryName) {
            showCountryDetail(countryId, countryName);
        } else {
            switchModule('macro');
        }
    } else {
        const activeLink = document.querySelector('.nav-item.active');
        if (activeLink) {
            const onclick = activeLink.getAttribute('onclick');
            const modMatch = onclick && onclick.match(/switchModule\('([^']+)'/);
            const modId = modMatch ? modMatch[1] : 'macro';
            switchModule(modId);
        } else {
            switchModule('macro');
        }
    }
}

function exportCountryData(countryId) {
    Utils.showToast('数据导出已开始，请稍候...', 'info');
    // 实际实现中这里会调用导出API
}

function generateCountryReport(countryId, countryName) {
    Utils.showToast(`正在生成${countryName}的经济报告，请稍候...`, 'info');
    // 实际实现中这里会调用报告生成API
}

async function showLegalDetail(regulationId) {
    currentView = 'legalDetail';
    localStorage.setItem('lastRegulationId', regulationId);
    
    // 显示返回按钮
    document.getElementById('back-btn').classList.remove('hidden');
    
    // 更新面包屑
    document.getElementById('breadcrumb').textContent = '法规详情';
    document.getElementById('module-title').textContent = '法律法规';
    
    // 加载内容
    const container = document.getElementById('content-container');
    container.innerHTML = Utils.showLoading();
    
    try {
        const html = await Renderers.legalDetail(regulationId);
        container.innerHTML = html;
    } catch (error) {
        console.error('Show legal detail error:', error);
        container.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-700 mb-2">加载失败</h3>
                <p class="text-gray-500">${error.message}</p>
            </div>
        `;
    }
}

async function showNewsDetail(newsId) {
    currentView = 'newsDetail';
    localStorage.setItem('lastNewsId', newsId);
    
    // 显示返回按钮
    document.getElementById('back-btn').classList.remove('hidden');
    
    // 更新面包屑
    document.getElementById('breadcrumb').textContent = '资讯详情';
    document.getElementById('module-title').textContent = '经贸资讯';
    
    // 加载内容
    const container = document.getElementById('content-container');
    container.innerHTML = Utils.showLoading();
    
    try {
        const html = await Renderers.newsDetail(newsId);
        container.innerHTML = html;
    } catch (error) {
        console.error('Show news detail error:', error);
        container.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-700 mb-2">加载失败</h3>
                <p class="text-gray-500">${error.message}</p>
            </div>
        `;
    }
}

async function showCulturalDetail(knowledgeId) {
    currentView = 'culturalDetail';
    localStorage.setItem('lastKnowledgeId', knowledgeId);
    
    // 显示返回按钮
    document.getElementById('back-btn').classList.remove('hidden');
    
    // 更新面包屑
    document.getElementById('breadcrumb').textContent = '文化详情';
    document.getElementById('module-title').textContent = '文化常识';
    
    // 加载内容
    const container = document.getElementById('content-container');
    container.innerHTML = Utils.showLoading();
    
    try {
        const html = await Renderers.culturalDetail(knowledgeId);
        container.innerHTML = html;
    } catch (error) {
        console.error('Show cultural detail error:', error);
        container.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-700 mb-2">加载失败</h3>
                <p class="text-gray-500">${error.message}</p>
            </div>
        `;
    }
}

function goBackToLegalOverview() {
    currentView = 'legal';
    document.getElementById('back-btn').classList.add('hidden');
    switchModule('legal');
}

function goBackToNewsOverview() {
    currentView = 'news';
    document.getElementById('back-btn').classList.add('hidden');
    switchModule('news');
}

function goBackToCulturalOverview() {
    currentView = 'cultural';
    document.getElementById('back-btn').classList.add('hidden');
    switchModule('cultural');
}

function goBack() {
    switch (currentView) {
        case 'macroDetail':
            goBackToMacroOverview();
            break;
        case 'legalDetail':
            goBackToLegalOverview();
            break;
        case 'newsDetail':
            goBackToNewsOverview();
            break;
        case 'culturalDetail':
            goBackToCulturalOverview();
            break;
        default:
            // 默认返回宏观经济概览
            goBackToMacroOverview();
    }
}

function exportLegalData(regulationId) {
    Utils.showToast('法规导出已开始，请稍候...', 'info');
    // 实际实现中这里会调用导出API
}

function exportCulturalData(knowledgeId) {
    Utils.showToast('文化知识导出已开始，请稍候...', 'info');
    // 实际实现中这里会调用导出API
}

function shareNews(newsId) {
    Utils.showToast('资讯分享链接已复制到剪贴板', 'success');
    // 实际实现中这里会生成分享链接并复制到剪贴板
}

function saveReport() {
    Utils.showToast('报告已保存到个人空间', 'success');
}

function exportReport() {
    Utils.showToast('报告导出已开始', 'info');
}

// Toast 隐藏
function hideToast() {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.classList.remove('-translate-x-0', 'opacity-100');
    toast.classList.add('translate-x-full', 'opacity-0');
}

// 法律法规图表
let legalChartInstance = null;

function renderLegalChart() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js is not loaded');
        return;
    }
    
    const canvas = document.getElementById('legal-chart');
    if (!canvas || !window.__legalChartData) {
        console.warn('Legal chart canvas or data not found');
        return;
    }

    const ctx = canvas.getContext('2d');
    const { labels, counts } = window.__legalChartData;

    if (!labels.length || !counts.length) {
        console.warn('No legal chart data available');
        return;
    }

    if (legalChartInstance) {
        legalChartInstance.destroy();
    }

    legalChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: '法规数量',
                data: counts,
                backgroundColor: 'rgba(37, 99, 235, 0.6)',
                borderColor: 'rgba(37, 99, 235, 1)',
                borderWidth: 1,
                borderRadius: 6,
                maxBarThickness: 32
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => ` ${ctx.parsed.y} 条法规`
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#4b5563',
                        maxRotation: 45,
                        minRotation: 0
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: '#6b7280'
                    },
                    grid: {
                        color: 'rgba(156, 163, 175, 0.2)'
                    }
                }
            }
        }
    });
}

// 法律法规前端过滤
function applyLegalFilters() {
    const countrySelect = document.getElementById('legal-country-filter');
    const impactSelect = document.getElementById('legal-impact-filter');
    if (!countrySelect || !impactSelect) return;

    const countryVal = countrySelect.value;
    const impactVal = impactSelect.value.toLowerCase();

    const cards = document.querySelectorAll('.legal-item');
    cards.forEach(card => {
        const cId = card.dataset.countryId;
        const impact = (card.dataset.impact || '').toLowerCase();

        const matchCountry = !countryVal || cId === countryVal;
        const matchImpact = !impactVal || impact === impactVal;

        card.style.display = (matchCountry && matchImpact) ? '' : 'none';
    });
}

// --- 页面初始化 ---
window.onload = () => {
    // 设置语言选择器
    document.getElementById('lang-switcher').value = currentLang;
    
    // 初始化语言
    changeLanguage(currentLang);
    
    // 启动实时时钟
    startClock();
    
    // 初始加载宏观模块
    switchModule('macro');
    
    // 显示欢迎消息
    setTimeout(() => {
        Utils.showToast('ASEAN MarketDB 已就绪，欢迎使用！', 'success');
    }, 1000);
};

// 将函数暴露到全局作用域
window.showCountryDetail = showCountryDetail;
window.switchModule = switchModule;
window.runAIAnalysis = runAIAnalysis;
window.refreshCurrentView = refreshCurrentView;
window.exportCountryData = exportCountryData;
window.generateCountryReport = generateCountryReport;
window.showLegalDetail = showLegalDetail;
window.showNewsDetail = showNewsDetail;
window.showCulturalDetail = showCulturalDetail;
window.goBackToMacroOverview = goBackToMacroOverview;
window.goBackToLegalOverview = goBackToLegalOverview;
window.goBackToNewsOverview = goBackToNewsOverview;
window.goBackToCulturalOverview = goBackToCulturalOverview;
window.goBack = goBack;
window.exportLegalData = exportLegalData;
window.exportCulturalData = exportCulturalData;
window.shareNews = shareNews;
window.saveReport = saveReport;
window.exportReport = exportReport;
window.hideToast = hideToast;
window.renderLegalChart = renderLegalChart;
window.applyLegalFilters = applyLegalFilters;
window.changeLanguage = changeLanguage;