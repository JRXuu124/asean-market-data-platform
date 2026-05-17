"""
导入所有新表的完整数据
"""
import os
import sys
import pandas as pd
import json
from datetime import datetime, date
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

def get_engine():
    raw_url = os.getenv("DATABASE_URL")
    if not raw_url:
        raise ValueError("请设置环境变量 DATABASE_URL")
    
    if raw_url.startswith("mysql://"):
        raw_url = raw_url.replace("mysql://", "mysql+pymysql://", 1)
    
    if "@" in raw_url:
        import urllib.parse
        prefix, rest = raw_url.split("://", 1)
        if ":" in rest.split("@")[0]:
            user_pass, host_db = rest.split("@", 1)
            user, password = user_pass.split(":", 1)
            safe_password = urllib.parse.quote_plus(password)
            raw_url = f"{prefix}://{user}:{safe_password}@{host_db}"
    
    return create_engine(raw_url, pool_pre_ping=True, pool_recycle=3600)

def import_all_data():
    """导入所有新表数据"""
    engine = get_engine()
    
    # 法律法规数据（16条）
    legal_data = [
        {"regulation_id": 1, "country_id": 1, "title": "印度尼西亚电商法", "title_en": "Indonesia E-Commerce Law", 
         "category": "贸易法", "regulation_type": "法律", 
         "content": "规范电商平台运营、消费者保护、数据隐私等", 
         "content_en": "Regulates e-commerce platform operations, consumer protection, data privacy",
         "effective_date": date(2023, 1, 1), "expiry_date": None, "source_url": "https://example.com/id-ecommerce-law",
         "keywords": json.dumps(["电商", "平台", "消费者保护"], ensure_ascii=False), 
         "related_hs_codes": json.dumps(["8517", "8528"], ensure_ascii=False), "impact_level": "high"},
        {"regulation_id": 2, "country_id": 1, "title": "进口商品标签要求", "title_en": "Import Product Labeling Requirements",
         "category": "贸易法", "regulation_type": "法规",
         "content": "所有进口商品必须使用印尼语标签",
         "content_en": "All imported products must have Indonesian language labels",
         "effective_date": date(2022, 6, 1), "expiry_date": None, "source_url": "https://example.com/id-labeling",
         "keywords": json.dumps(["标签", "进口", "印尼语"], ensure_ascii=False), 
         "related_hs_codes": json.dumps(["所有"], ensure_ascii=False), "impact_level": "high"},
        {"regulation_id": 3, "country_id": 2, "title": "泰国电商税收法", "title_en": "Thailand E-Commerce Tax Law",
         "category": "税法", "regulation_type": "法律",
         "content": "对在线销售征收增值税和所得税",
         "content_en": "Imposes VAT and income tax on online sales",
         "effective_date": date(2023, 4, 1), "expiry_date": None, "source_url": "https://example.com/th-tax",
         "keywords": json.dumps(["税收", "增值税", "电商"], ensure_ascii=False), 
         "related_hs_codes": json.dumps(["所有"], ensure_ascii=False), "impact_level": "high"},
        {"regulation_id": 4, "country_id": 2, "title": "食品进口许可证规定", "title_en": "Food Import License Regulations",
         "category": "贸易法", "regulation_type": "法规",
         "content": "食品进口需要获得FDA许可证",
         "content_en": "Food imports require FDA license",
         "effective_date": date(2022, 1, 1), "expiry_date": None, "source_url": "https://example.com/th-food",
         "keywords": json.dumps(["食品", "进口", "许可证"], ensure_ascii=False), 
         "related_hs_codes": json.dumps(["16", "17", "18", "19", "20", "21", "22"], ensure_ascii=False), "impact_level": "high"},
        {"regulation_id": 5, "country_id": 3, "title": "越南跨境电商新规", "title_en": "Vietnam Cross-border E-commerce Regulations",
         "category": "贸易法", "regulation_type": "法规",
         "content": "规范跨境电商平台运营和税收",
         "content_en": "Regulates cross-border e-commerce platforms and taxation",
         "effective_date": date(2023, 7, 1), "expiry_date": None, "source_url": "https://example.com/vn-ecommerce",
         "keywords": json.dumps(["跨境电商", "平台", "税收"], ensure_ascii=False), 
         "related_hs_codes": json.dumps(["所有"], ensure_ascii=False), "impact_level": "high"},
        {"regulation_id": 6, "country_id": 3, "title": "个人物品进口免税额度", "title_en": "Personal Goods Import Duty-Free Allowance",
         "category": "税法", "regulation_type": "政策",
         "content": "个人物品价值低于100万越南盾免税",
         "content_en": "Personal goods under 1 million VND are duty-free",
         "effective_date": date(2023, 1, 1), "expiry_date": None, "source_url": "https://example.com/vn-duty",
         "keywords": json.dumps(["个人物品", "免税", "进口"], ensure_ascii=False), 
         "related_hs_codes": json.dumps(["所有"], ensure_ascii=False), "impact_level": "medium"},
        {"regulation_id": 7, "country_id": 4, "title": "马来西亚数字服务税", "title_en": "Malaysia Digital Services Tax",
         "category": "税法", "regulation_type": "法律",
         "content": "对数字服务征收6%服务税",
         "content_en": "6% service tax on digital services",
         "effective_date": date(2020, 1, 1), "expiry_date": None, "source_url": "https://example.com/my-digital-tax",
         "keywords": json.dumps(["数字服务", "服务税", "6%"], ensure_ascii=False), 
         "related_hs_codes": json.dumps(["所有"], ensure_ascii=False), "impact_level": "high"},
        {"regulation_id": 8, "country_id": 4, "title": "清真认证要求", "title_en": "Halal Certification Requirements",
         "category": "贸易法", "regulation_type": "标准",
         "content": "食品和化妆品需要清真认证",
         "content_en": "Food and cosmetics require halal certification",
         "effective_date": date(2020, 1, 1), "expiry_date": None, "source_url": "https://example.com/my-halal",
         "keywords": json.dumps(["清真", "认证", "食品", "化妆品"], ensure_ascii=False), 
         "related_hs_codes": json.dumps(["16", "17", "33"], ensure_ascii=False), "impact_level": "high"},
        {"regulation_id": 9, "country_id": 5, "title": "菲律宾电商平台注册法", "title_en": "Philippines E-commerce Platform Registration Law",
         "category": "贸易法", "regulation_type": "法律",
         "content": "电商平台必须在SEC注册",
         "content_en": "E-commerce platforms must register with SEC",
         "effective_date": date(2022, 1, 1), "expiry_date": None, "source_url": "https://example.com/ph-registration",
         "keywords": json.dumps(["注册", "平台", "SEC"], ensure_ascii=False), 
         "related_hs_codes": json.dumps(["所有"], ensure_ascii=False), "impact_level": "medium"},
        {"regulation_id": 10, "country_id": 5, "title": "进口商品原产地证明", "title_en": "Import Product Certificate of Origin",
         "category": "贸易法", "regulation_type": "法规",
         "content": "特定商品需要原产地证明",
         "content_en": "Certain products require certificate of origin",
         "effective_date": date(2021, 1, 1), "expiry_date": None, "source_url": "https://example.com/ph-origin",
         "keywords": json.dumps(["原产地", "证明", "进口"], ensure_ascii=False), 
         "related_hs_codes": json.dumps(["所有"], ensure_ascii=False), "impact_level": "medium"},
        {"regulation_id": 11, "country_id": 6, "title": "新加坡个人数据保护法", "title_en": "Singapore Personal Data Protection Act",
         "category": "数据法", "regulation_type": "法律",
         "content": "严格规范个人数据收集和使用",
         "content_en": "Strictly regulates personal data collection and use",
         "effective_date": date(2014, 7, 2), "expiry_date": None, "source_url": "https://example.com/sg-pdpa",
         "keywords": json.dumps(["数据保护", "隐私", "个人数据"], ensure_ascii=False), 
         "related_hs_codes": json.dumps(["所有"], ensure_ascii=False), "impact_level": "high"},
        {"regulation_id": 12, "country_id": 6, "title": "商品和服务税", "title_en": "Goods and Services Tax",
         "category": "税法", "regulation_type": "法律",
         "content": "对商品和服务征收9%GST",
         "content_en": "9% GST on goods and services",
         "effective_date": date(2024, 1, 1), "expiry_date": None, "source_url": "https://example.com/sg-gst",
         "keywords": json.dumps(["GST", "增值税", "9%"], ensure_ascii=False), 
         "related_hs_codes": json.dumps(["所有"], ensure_ascii=False), "impact_level": "high"},
        {"regulation_id": 13, "country_id": 7, "title": "柬埔寨电商法", "title_en": "Cambodia E-Commerce Law",
         "category": "贸易法", "regulation_type": "法律",
         "content": "规范电商交易和电子签名",
         "content_en": "Regulates e-commerce transactions and electronic signatures",
         "effective_date": date(2019, 11, 1), "expiry_date": None, "source_url": "https://example.com/kh-ecommerce",
         "keywords": json.dumps(["电商", "电子签名", "交易"], ensure_ascii=False), 
         "related_hs_codes": json.dumps(["所有"], ensure_ascii=False), "impact_level": "medium"},
        {"regulation_id": 14, "country_id": 8, "title": "老挝进口许可证制度", "title_en": "Laos Import License System",
         "category": "贸易法", "regulation_type": "法规",
         "content": "特定商品需要进口许可证",
         "content_en": "Certain products require import license",
         "effective_date": date(2020, 1, 1), "expiry_date": None, "source_url": "https://example.com/la-license",
         "keywords": json.dumps(["进口许可证", "特定商品"], ensure_ascii=False), 
         "related_hs_codes": json.dumps(["所有"], ensure_ascii=False), "impact_level": "medium"},
        {"regulation_id": 15, "country_id": 9, "title": "缅甸外商投资法", "title_en": "Myanmar Foreign Investment Law",
         "category": "投资法", "regulation_type": "法律",
         "content": "规范外商投资和股权比例",
         "content_en": "Regulates foreign investment and equity ratios",
         "effective_date": date(2016, 10, 18), "expiry_date": None, "source_url": "https://example.com/mm-investment",
         "keywords": json.dumps(["外商投资", "股权", "投资法"], ensure_ascii=False), 
         "related_hs_codes": json.dumps(["所有"], ensure_ascii=False), "impact_level": "high"},
        {"regulation_id": 16, "country_id": 11, "title": "文莱清真认证法", "title_en": "Brunei Halal Certification Law",
         "category": "贸易法", "regulation_type": "法律",
         "content": "强制要求食品和药品清真认证",
         "content_en": "Mandatory halal certification for food and medicine",
         "effective_date": date(2017, 1, 1), "expiry_date": None, "source_url": "https://example.com/bn-halal",
         "keywords": json.dumps(["清真", "认证", "食品", "药品"], ensure_ascii=False), 
         "related_hs_codes": json.dumps(["16", "30"], ensure_ascii=False), "impact_level": "high"},
    ]
    
    # 经贸资讯数据（15条）
    news_data = [
        {"news_id": 1, "country_id": 1, "title": "印尼电商市场2024年增长预测", "title_en": "Indonesia E-commerce Market Growth Forecast 2024",
         "summary": "预计2024年印尼电商市场将增长25%",
         "content": "印尼电商市场持续快速增长，预计2024年将实现25%的增长，主要推动因素包括移动支付普及和物流基础设施改善。",
         "content_en": "Indonesia's e-commerce market continues rapid growth, expected to achieve 25% growth in 2024",
         "news_type": "市场趋势", "source": "印尼电商协会", "source_url": "https://example.com/id-growth",
         "publish_date": date(2024, 1, 15), "tags": json.dumps(["电商", "增长", "预测"], ensure_ascii=False), 
         "related_countries": json.dumps([1], ensure_ascii=False), "related_categories": None, "view_count": 150, "is_featured": True},
        {"news_id": 2, "country_id": 2, "title": "泰国与RCEP成员国贸易额创新高", "title_en": "Thailand-RCEP Trade Volume Hits Record High",
         "summary": "2023年泰国与RCEP成员国贸易额增长18%",
         "content": "泰国与RCEP成员国贸易额在2023年创历史新高，同比增长18%，主要受益于关税减免和贸易便利化措施。",
         "content_en": "Thailand's trade volume with RCEP members hit a record high in 2023, up 18% year-on-year",
         "news_type": "政策动态", "source": "泰国商务部", "source_url": "https://example.com/th-rcep",
         "publish_date": date(2024, 1, 10), "tags": json.dumps(["RCEP", "贸易", "政策"], ensure_ascii=False),
         "related_countries": json.dumps([2, 1, 3, 4, 5], ensure_ascii=False), "related_categories": None, "view_count": 230, "is_featured": True},
        {"news_id": 3, "country_id": 3, "title": "越南成为东南亚第二大电商市场", "title_en": "Vietnam Becomes Second Largest E-commerce Market in SEA",
         "summary": "越南电商市场规模超过马来西亚",
         "content": "越南电商市场快速发展，已超越马来西亚成为东南亚第二大电商市场，仅次于印尼。",
         "content_en": "Vietnam's e-commerce market has rapidly developed, surpassing Malaysia to become the second largest in Southeast Asia",
         "news_type": "市场趋势", "source": "越南工贸部", "source_url": "https://example.com/vn-market",
         "publish_date": date(2024, 1, 8), "tags": json.dumps(["电商", "市场", "排名"], ensure_ascii=False),
         "related_countries": json.dumps([3], ensure_ascii=False), "related_categories": None, "view_count": 180, "is_featured": False},
        {"news_id": 4, "country_id": 4, "title": "马来西亚推出数字贸易平台", "title_en": "Malaysia Launches Digital Trade Platform",
         "summary": "政府推出统一数字贸易平台",
         "content": "马来西亚政府推出统一数字贸易平台，旨在简化跨境贸易流程，提高贸易效率。",
         "content_en": "Malaysia government launched a unified digital trade platform to simplify cross-border trade processes",
         "news_type": "政策动态", "source": "马来西亚国际贸易部", "source_url": "https://example.com/my-platform",
         "publish_date": date(2024, 1, 12), "tags": json.dumps(["数字贸易", "平台", "政策"], ensure_ascii=False),
         "related_countries": json.dumps([4], ensure_ascii=False), "related_categories": None, "view_count": 95, "is_featured": False},
        {"news_id": 5, "country_id": 5, "title": "菲律宾电商渗透率持续提升", "title_en": "Philippines E-commerce Penetration Continues to Rise",
         "summary": "电商用户占比达到45%",
         "content": "菲律宾电商渗透率持续提升，电商用户占比已达到45%，预计未来三年将超过60%。",
         "content_en": "Philippines e-commerce penetration continues to rise, with e-commerce users accounting for 45% of the population",
         "news_type": "市场趋势", "source": "菲律宾统计局", "source_url": "https://example.com/ph-penetration",
         "publish_date": date(2024, 1, 5), "tags": json.dumps(["电商", "渗透率", "用户"], ensure_ascii=False),
         "related_countries": json.dumps([5], ensure_ascii=False), "related_categories": None, "view_count": 120, "is_featured": False},
        {"news_id": 6, "country_id": 6, "title": "新加坡成为东盟数字中心", "title_en": "Singapore Becomes ASEAN Digital Hub",
         "summary": "新加坡数字经济发展迅速",
         "content": "新加坡凭借完善的数字基础设施和政策支持，已成为东盟数字经济发展中心。",
         "content_en": "Singapore has become the digital economy development center of ASEAN with its perfect digital infrastructure",
         "news_type": "行业报告", "source": "新加坡经济发展局", "source_url": "https://example.com/sg-digital",
         "publish_date": date(2024, 1, 20), "tags": json.dumps(["数字经济", "中心", "基础设施"], ensure_ascii=False),
         "related_countries": json.dumps([6], ensure_ascii=False), "related_categories": None, "view_count": 200, "is_featured": True},
    ]
    
    # 文化常识数据（16条）
    cultural_data = [
        {"knowledge_id": 1, "country_id": 1, "title": "印尼商务礼仪", "title_en": "Indonesian Business Etiquette",
         "category": "商务礼仪",
         "content": "印尼商务文化注重关系建立和尊重。初次见面应握手并交换名片。会议通常比较轻松，决策过程可能较慢。印尼人重视和谐，避免直接冲突。",
         "content_en": "Indonesian business culture emphasizes relationship building and respect",
         "key_points": json.dumps(["关系建立", "尊重", "和谐"], ensure_ascii=False),
         "dos": json.dumps(["握手问候", "交换名片", "保持耐心", "尊重长辈"], ensure_ascii=False),
         "donts": json.dumps(["不要直接拒绝", "不要公开批评", "不要用左手递物"], ensure_ascii=False),
         "cultural_tips": "在印尼做生意，建立信任关系比快速成交更重要。建议多次会面建立关系后再谈具体业务。",
         "related_business_areas": json.dumps(["商务谈判"], ensure_ascii=False), "importance_level": "high"},
        {"knowledge_id": 2, "country_id": 1, "title": "印尼节日文化", "title_en": "Indonesian Festival Culture",
         "category": "节日文化",
         "content": "印尼有多种宗教节日，包括伊斯兰教、基督教、印度教和佛教节日。斋月期间商业活动会放缓。开斋节是重要节日，应避免在此期间安排重要商务活动。",
         "content_en": "Indonesia has various religious festivals including Islamic, Christian, Hindu and Buddhist festivals",
         "key_points": json.dumps(["多宗教", "斋月", "开斋节"], ensure_ascii=False),
         "dos": json.dumps(["尊重宗教节日", "斋月期间避免白天进食", "节日期间送祝福"], ensure_ascii=False),
         "donts": json.dumps(["不要在斋月期间白天进食", "不要忽视宗教节日"], ensure_ascii=False),
         "cultural_tips": "了解并尊重印尼的宗教节日，可以更好地安排商务活动时间。",
         "related_business_areas": json.dumps(["商务活动安排"], ensure_ascii=False), "importance_level": "high"},
        {"knowledge_id": 3, "country_id": 2, "title": "泰国商务沟通习惯", "title_en": "Thai Business Communication Habits",
         "category": "沟通习惯",
         "content": "泰国商务沟通注重礼貌和间接表达。泰国人很少直接说'不'，而是用委婉的方式表达。微笑是重要的沟通工具。避免公开批评或冲突。",
         "content_en": "Thai business communication emphasizes politeness and indirect expression",
         "key_points": json.dumps(["礼貌", "间接表达", "微笑"], ensure_ascii=False),
         "dos": json.dumps(["保持微笑", "使用礼貌用语", "间接表达意见"], ensure_ascii=False),
         "donts": json.dumps(["不要直接说'不'", "不要公开批评", "不要失去耐心"], ensure_ascii=False),
         "cultural_tips": "在泰国，微笑和礼貌比直接表达更重要。学会读懂泰国人的委婉表达。",
         "related_business_areas": json.dumps(["商务沟通"], ensure_ascii=False), "importance_level": "high"},
        {"knowledge_id": 4, "country_id": 2, "title": "泰国消费习惯", "title_en": "Thai Consumption Habits",
         "category": "消费习惯",
         "content": "泰国消费者重视品牌和质量，但也关注价格。社交媒体影响购买决策。在线支付和货到付款都很流行。喜欢促销和折扣活动。",
         "content_en": "Thai consumers value brands and quality, but also pay attention to price",
         "key_points": json.dumps(["品牌", "价格", "社交媒体"], ensure_ascii=False),
         "dos": json.dumps(["提供品牌产品", "合理定价", "社交媒体营销", "提供促销活动"], ensure_ascii=False),
         "donts": json.dumps(["不要忽视价格", "不要忽略社交媒体"], ensure_ascii=False),
         "cultural_tips": "泰国消费者喜欢在社交媒体上分享购物体验，重视口碑营销。",
         "related_business_areas": json.dumps(["电商运营"], ensure_ascii=False), "importance_level": "high"},
        {"knowledge_id": 5, "country_id": 3, "title": "越南商务谈判风格", "title_en": "Vietnamese Business Negotiation Style",
         "category": "商务礼仪",
         "content": "越南商务谈判通常需要多次会议。决策过程较慢，需要耐心。重视关系和信任。价格谈判是重要环节。建议准备详细资料和耐心等待。",
         "content_en": "Vietnamese business negotiations usually require multiple meetings",
         "key_points": json.dumps(["多次会议", "耐心", "关系"], ensure_ascii=False),
         "dos": json.dumps(["准备详细资料", "保持耐心", "建立关系", "准备价格谈判"], ensure_ascii=False),
         "donts": json.dumps(["不要急于求成", "不要忽视关系建立"], ensure_ascii=False),
         "cultural_tips": "越南商务谈判需要时间和耐心，建立信任关系是关键。",
         "related_business_areas": json.dumps(["商务谈判"], ensure_ascii=False), "importance_level": "high"},
        {"knowledge_id": 6, "country_id": 3, "title": "越南节日和消费时段", "title_en": "Vietnamese Festivals and Consumption Periods",
         "category": "消费习惯",
         "content": "越南重要节日包括春节、中秋节等。节日期间消费需求旺盛。消费者喜欢在节日前购物。在线购物在年轻人群中很流行。",
         "content_en": "Important Vietnamese festivals include Tet (Lunar New Year), Mid-Autumn Festival, etc.",
         "key_points": json.dumps(["春节", "中秋节", "节日消费"], ensure_ascii=False),
         "dos": json.dumps(["节日前促销", "节日主题营销", "针对年轻消费者"], ensure_ascii=False),
         "donts": json.dumps(["不要忽视节日", "不要错过节日消费期"], ensure_ascii=False),
         "cultural_tips": "越南消费者在节日期间消费意愿强烈，是重要的销售机会。",
         "related_business_areas": json.dumps(["电商运营"], ensure_ascii=False), "importance_level": "medium"},
        {"knowledge_id": 7, "country_id": 4, "title": "马来西亚商务文化", "title_en": "Malaysian Business Culture",
         "category": "商务礼仪",
         "content": "马来西亚商务文化融合了马来、华人和印度文化。商务会议通常比较正式。重视等级和尊重。建议穿着正式，准时到达。",
         "content_en": "Malaysian business culture combines Malay, Chinese and Indian cultures",
         "key_points": json.dumps(["多元文化", "正式", "等级"], ensure_ascii=False),
         "dos": json.dumps(["正式着装", "准时到达", "尊重等级", "交换名片"], ensure_ascii=False),
         "donts": json.dumps(["不要迟到", "不要穿着随意", "不要忽视等级"], ensure_ascii=False),
         "cultural_tips": "马来西亚商务文化多元，需要了解不同文化背景的商务习惯。",
         "related_business_areas": json.dumps(["商务礼仪"], ensure_ascii=False), "importance_level": "high"},
        {"knowledge_id": 8, "country_id": 4, "title": "马来西亚支付习惯", "title_en": "Malaysian Payment Habits",
         "category": "消费习惯",
         "content": "马来西亚消费者喜欢使用多种支付方式，包括信用卡、电子钱包和货到付款。移动支付普及率高。重视支付安全性。",
         "content_en": "Malaysian consumers like to use various payment methods including credit cards, e-wallets and cash on delivery",
         "key_points": json.dumps(["多种支付方式", "电子钱包", "安全性"], ensure_ascii=False),
         "dos": json.dumps(["提供多种支付方式", "支持电子钱包", "确保支付安全"], ensure_ascii=False),
         "donts": json.dumps(["不要只提供单一支付方式", "不要忽视支付安全"], ensure_ascii=False),
         "cultural_tips": "提供多种支付方式可以提高转化率，特别是电子钱包。",
         "related_business_areas": json.dumps(["电商运营"], ensure_ascii=False), "importance_level": "high"},
        {"knowledge_id": 9, "country_id": 5, "title": "菲律宾商务沟通", "title_en": "Philippine Business Communication",
         "category": "沟通习惯",
         "content": "菲律宾商务沟通比较直接和友好。英语是主要商务语言。会议通常比较轻松。重视人际关系和信任。",
         "content_en": "Philippine business communication is relatively direct and friendly",
         "key_points": json.dumps(["直接", "友好", "英语"], ensure_ascii=False),
         "dos": json.dumps(["使用英语沟通", "保持友好", "建立关系"], ensure_ascii=False),
         "donts": json.dumps(["不要过于正式", "不要忽视关系"], ensure_ascii=False),
         "cultural_tips": "菲律宾商务沟通相对直接，英语沟通能力很重要。",
         "related_business_areas": json.dumps(["商务沟通"], ensure_ascii=False), "importance_level": "medium"},
        {"knowledge_id": 10, "country_id": 5, "title": "菲律宾社交媒体使用", "title_en": "Philippine Social Media Usage",
         "category": "消费习惯",
         "content": "菲律宾是社交媒体使用率最高的国家之一。Facebook和Instagram很流行。社交媒体影响购买决策。喜欢分享和评论。",
         "content_en": "Philippines is one of the countries with the highest social media usage",
         "key_points": json.dumps(["社交媒体", "Facebook", "分享"], ensure_ascii=False),
         "dos": json.dumps(["社交媒体营销", "鼓励分享", "回复评论"], ensure_ascii=False),
         "donts": json.dumps(["不要忽视社交媒体", "不要忽略用户评论"], ensure_ascii=False),
         "cultural_tips": "菲律宾消费者高度依赖社交媒体，社交媒体营销非常重要。",
         "related_business_areas": json.dumps(["电商运营"], ensure_ascii=False), "importance_level": "high"},
        {"knowledge_id": 11, "country_id": 6, "title": "新加坡商务效率", "title_en": "Singapore Business Efficiency",
         "category": "商务礼仪",
         "content": "新加坡商务文化注重效率和专业性。会议通常准时开始和结束。决策过程较快。重视数据和事实。建议准备充分，准时到达。",
         "content_en": "Singapore business culture emphasizes efficiency and professionalism",
         "key_points": json.dumps(["效率", "专业", "数据"], ensure_ascii=False),
         "dos": json.dumps(["准时到达", "准备充分", "提供数据支持", "保持专业"], ensure_ascii=False),
         "donts": json.dumps(["不要迟到", "不要准备不足", "不要忽视数据"], ensure_ascii=False),
         "cultural_tips": "新加坡商务文化高效专业，需要充分准备和准时。",
         "related_business_areas": json.dumps(["商务礼仪"], ensure_ascii=False), "importance_level": "high"},
        {"knowledge_id": 12, "country_id": 6, "title": "新加坡消费偏好", "title_en": "Singapore Consumption Preferences",
         "category": "消费习惯",
         "content": "新加坡消费者重视品质和品牌。价格敏感度相对较低。在线购物普及率高。重视客户服务和售后。喜欢国际品牌。",
         "content_en": "Singapore consumers value quality and brands",
         "key_points": json.dumps(["品质", "品牌", "服务"], ensure_ascii=False),
         "dos": json.dumps(["提供高品质产品", "重视品牌", "优质客户服务"], ensure_ascii=False),
         "donts": json.dumps(["不要忽视品质", "不要忽略服务"], ensure_ascii=False),
         "cultural_tips": "新加坡消费者愿意为品质和服务付费，重视品牌价值。",
         "related_business_areas": json.dumps(["电商运营"], ensure_ascii=False), "importance_level": "high"},
        {"knowledge_id": 13, "country_id": 7, "title": "柬埔寨商务文化", "title_en": "Cambodian Business Culture",
         "category": "商务礼仪",
         "content": "柬埔寨商务文化重视关系和尊重。商务会议通常比较正式。决策过程需要时间。建议穿着正式，尊重当地文化。",
         "content_en": "Cambodian business culture values relationships and respect",
         "key_points": json.dumps(["关系", "尊重", "正式"], ensure_ascii=False),
         "dos": json.dumps(["正式着装", "尊重文化", "建立关系", "保持耐心"], ensure_ascii=False),
         "donts": json.dumps(["不要忽视文化", "不要急于求成"], ensure_ascii=False),
         "cultural_tips": "柬埔寨商务文化重视关系和尊重，需要耐心建立信任。",
         "related_business_areas": json.dumps(["商务礼仪"], ensure_ascii=False), "importance_level": "medium"},
        {"knowledge_id": 14, "country_id": 8, "title": "老挝商务习惯", "title_en": "Lao Business Habits",
         "category": "商务礼仪",
         "content": "老挝商务文化比较传统和正式。重视等级和尊重。商务会议需要提前安排。建议穿着正式，准时到达。",
         "content_en": "Lao business culture is relatively traditional and formal",
         "key_points": json.dumps(["传统", "正式", "等级"], ensure_ascii=False),
         "dos": json.dumps(["正式着装", "提前安排", "尊重等级"], ensure_ascii=False),
         "donts": json.dumps(["不要随意", "不要临时安排"], ensure_ascii=False),
         "cultural_tips": "老挝商务文化传统正式，需要提前安排和正式着装。",
         "related_business_areas": json.dumps(["商务礼仪"], ensure_ascii=False), "importance_level": "medium"},
        {"knowledge_id": 15, "country_id": 9, "title": "缅甸商务沟通", "title_en": "Myanmar Business Communication",
         "category": "沟通习惯",
         "content": "缅甸商务沟通比较正式和礼貌。重视关系和信任。决策过程较慢。建议保持耐心，建立长期关系。",
         "content_en": "Myanmar business communication is relatively formal and polite",
         "key_points": json.dumps(["正式", "礼貌", "关系"], ensure_ascii=False),
         "dos": json.dumps(["保持礼貌", "建立关系", "保持耐心"], ensure_ascii=False),
         "donts": json.dumps(["不要急于求成", "不要忽视关系"], ensure_ascii=False),
         "cultural_tips": "缅甸商务沟通需要时间和耐心，建立长期关系很重要。",
         "related_business_areas": json.dumps(["商务沟通"], ensure_ascii=False), "importance_level": "medium"},
        {"knowledge_id": 16, "country_id": 11, "title": "文莱商务文化", "title_en": "Brunei Business Culture",
         "category": "商务礼仪",
         "content": "文莱商务文化重视伊斯兰教价值观。商务会议需要尊重宗教习俗。建议了解伊斯兰教文化，避免在斋月期间安排重要活动。",
         "content_en": "Brunei business culture values Islamic values",
         "key_points": json.dumps(["伊斯兰教", "宗教", "斋月"], ensure_ascii=False),
         "dos": json.dumps(["尊重宗教", "了解文化", "避免斋月活动"], ensure_ascii=False),
         "donts": json.dumps(["不要忽视宗教", "不要在斋月安排活动"], ensure_ascii=False),
         "cultural_tips": "文莱商务文化深受伊斯兰教影响，需要尊重宗教习俗。",
         "related_business_areas": json.dumps(["商务礼仪"], ensure_ascii=False), "importance_level": "high"},
    ]
    
    # 导入数据
    tables_data = {
        "legal_regulations": legal_data,
        "trade_news": news_data,
        "cultural_knowledge": cultural_data
    }
    
    for table_name, data in tables_data.items():
        if not data:
            continue
            
        print(f"[INFO] Importing {table_name}...", end=" ")
        try:
            df = pd.DataFrame(data)
            
            # 处理日期列
            for col in df.columns:
                if 'date' in col.lower() or col in ['effective_date', 'expiry_date', 'publish_date']:
                    if df[col].dtype == 'object':
                        df[col] = pd.to_datetime(df[col], errors='coerce')
            
            # 清空表
            with engine.connect() as conn:
                try:
                    conn.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
                    conn.execute(text(f"TRUNCATE TABLE `{table_name}`"))
                    conn.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
                    conn.commit()
                except:
                    conn.rollback()
            
            # 导入数据
            df.to_sql(table_name, engine, if_exists='append', index=False, chunksize=500, method='multi')
            print(f"[OK] ({len(df)} rows)")
            
        except Exception as e:
            print(f"[ERROR] Failed: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    print("=" * 60)
    print("Importing all new table data")
    print("=" * 60)
    import_all_data()
    print("\n[OK] All data import completed!")
