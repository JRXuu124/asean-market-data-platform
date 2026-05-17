"""
创建新表的数据文件并导入
"""
import os
import sys
import pandas as pd
import json
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

def clean_json_string(val):
    """清理JSON字符串"""
    if pd.isna(val) or val == "":
        return None
    if isinstance(val, str):
        try:
            data = eval(val)
            return json.dumps(data, ensure_ascii=False)
        except:
            return val
    return json.dumps(val, ensure_ascii=False) if val is not None else None

def import_new_tables():
    """导入新表数据"""
    engine = get_engine()
    
    # 法律法规数据
    legal_data = [
        {"regulation_id": 1, "country_id": 1, "title": "印度尼西亚电商法", "title_en": "Indonesia E-Commerce Law", 
         "category": "贸易法", "regulation_type": "法律", 
         "content": "规范电商平台运营、消费者保护、数据隐私等", 
         "content_en": "Regulates e-commerce platform operations, consumer protection, data privacy",
         "effective_date": "2023-01-01", "expiry_date": None, "source_url": "https://example.com/id-ecommerce-law",
         "keywords": json.dumps(["电商", "平台", "消费者保护"]), "related_hs_codes": json.dumps(["8517", "8528"]), "impact_level": "high"},
        {"regulation_id": 2, "country_id": 1, "title": "进口商品标签要求", "title_en": "Import Product Labeling Requirements",
         "category": "贸易法", "regulation_type": "法规",
         "content": "所有进口商品必须使用印尼语标签",
         "content_en": "All imported products must have Indonesian language labels",
         "effective_date": "2022-06-01", "expiry_date": None, "source_url": "https://example.com/id-labeling",
         "keywords": json.dumps(["标签", "进口", "印尼语"]), "related_hs_codes": json.dumps(["所有"]), "impact_level": "high"},
        {"regulation_id": 3, "country_id": 2, "title": "泰国电商税收法", "title_en": "Thailand E-Commerce Tax Law",
         "category": "税法", "regulation_type": "法律",
         "content": "对在线销售征收增值税和所得税",
         "content_en": "Imposes VAT and income tax on online sales",
         "effective_date": "2023-04-01", "expiry_date": None, "source_url": "https://example.com/th-tax",
         "keywords": json.dumps(["税收", "增值税", "电商"]), "related_hs_codes": json.dumps(["所有"]), "impact_level": "high"},
    ]
    
    # 经贸资讯数据
    news_data = [
        {"news_id": 1, "country_id": 1, "title": "印尼电商市场2024年增长预测", "title_en": "Indonesia E-commerce Market Growth Forecast 2024",
         "summary": "预计2024年印尼电商市场将增长25%",
         "content": "印尼电商市场持续快速增长，预计2024年将实现25%的增长，主要推动因素包括移动支付普及和物流基础设施改善。",
         "content_en": "Indonesia's e-commerce market continues rapid growth, expected to achieve 25% growth in 2024",
         "news_type": "市场趋势", "source": "印尼电商协会", "source_url": "https://example.com/id-growth",
         "publish_date": "2024-01-15", "tags": json.dumps(["电商", "增长", "预测"]), 
         "related_countries": json.dumps([1]), "related_categories": None, "view_count": 150, "is_featured": True},
        {"news_id": 2, "country_id": 2, "title": "泰国与RCEP成员国贸易额创新高", "title_en": "Thailand-RCEP Trade Volume Hits Record High",
         "summary": "2023年泰国与RCEP成员国贸易额增长18%",
         "content": "泰国与RCEP成员国贸易额在2023年创历史新高，同比增长18%",
         "content_en": "Thailand's trade volume with RCEP members hit a record high in 2023, up 18% year-on-year",
         "news_type": "政策动态", "source": "泰国商务部", "source_url": "https://example.com/th-rcep",
         "publish_date": "2024-01-10", "tags": json.dumps(["RCEP", "贸易", "政策"]),
         "related_countries": json.dumps([2, 1, 3, 4, 5]), "related_categories": None, "view_count": 230, "is_featured": True},
    ]
    
    # 文化常识数据
    cultural_data = [
        {"knowledge_id": 1, "country_id": 1, "title": "印尼商务礼仪", "title_en": "Indonesian Business Etiquette",
         "category": "商务礼仪",
         "content": "印尼商务文化注重关系建立和尊重。初次见面应握手并交换名片。",
         "content_en": "Indonesian business culture emphasizes relationship building and respect",
         "key_points": json.dumps(["关系建立", "尊重", "和谐"]),
         "dos": json.dumps(["握手问候", "交换名片", "保持耐心"]),
         "donts": json.dumps(["不要直接拒绝", "不要公开批评"]),
         "cultural_tips": "在印尼做生意，建立信任关系比快速成交更重要",
         "related_business_areas": json.dumps(["商务谈判"]), "importance_level": "high"},
        {"knowledge_id": 2, "country_id": 2, "title": "泰国商务沟通习惯", "title_en": "Thai Business Communication Habits",
         "category": "沟通习惯",
         "content": "泰国商务沟通注重礼貌和间接表达。泰国人很少直接说'不'",
         "content_en": "Thai business communication emphasizes politeness and indirect expression",
         "key_points": json.dumps(["礼貌", "间接表达", "微笑"]),
         "dos": json.dumps(["保持微笑", "使用礼貌用语"]),
         "donts": json.dumps(["不要直接说'不'", "不要公开批评"]),
         "cultural_tips": "在泰国，微笑和礼貌比直接表达更重要",
         "related_business_areas": json.dumps(["商务沟通"]), "importance_level": "high"},
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
    print("Importing new table data")
    print("=" * 60)
    import_new_tables()
    print("\n[OK] Data import completed!")
