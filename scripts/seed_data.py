import os
import pandas as pd
import urllib.parse
import json
import ast
import re
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

def get_engine():
    raw_url = os.getenv("DATABASE_URL")
    if not raw_url:
        raise ValueError("请设置环境变量 DATABASE_URL")
    
    # 确保使用pymysql驱动（如果是MySQL）
    if raw_url.startswith("mysql://"):
        raw_url = raw_url.replace("mysql://", "mysql+pymysql://", 1)
    
    # 处理密码特殊字符
    if "@" in raw_url:
        prefix, rest = raw_url.split("://", 1)
        if ":" in rest.split("@")[0]:
            user_pass, host_db = rest.split("@", 1)
            user, password = user_pass.split(":", 1)
            safe_password = urllib.parse.quote_plus(password)
            raw_url = f"{prefix}://{user}:{safe_password}@{host_db}"
    
    return create_engine(
        raw_url,
        pool_pre_ping=True,
        pool_recycle=3600
    )

def clean_json_string(val):
    if pd.isna(val) or val == "": return None
    if isinstance(val, str):
        try:
            data = ast.literal_eval(val)
            return json.dumps(data)
        except:
            return val
    return val

def extract_numeric(val):
    if pd.isna(val) or val == "": return 0
    if isinstance(val, str):
        match = re.search(r"[-+]?\d*\.\d+|\d+", val)
        return float(match.group()) if match else 0
    return val

def run_seed():
    engine = get_engine()
    data_dir = os.getenv("DATA_PATH") or "./data"
    
    json_cols_map = {
        "consumer_profiles": ["preferred_categories", "top_payment_methods"],
        "tax_tariff_rules": ["other_taxes"],
        "service_providers": ["countries_covered", "contact_info"],
        "users": ["interested_countries", "interested_categories"],
        "aggregated_reports_cache": ["report_data", "parameters"],
        "product_daily_snapshots": ["tags"],
        "legal_regulations": ["keywords", "related_hs_codes"],
        "trade_news": ["tags", "related_countries", "related_categories"],
        "cultural_knowledge": ["key_points", "dos", "donts", "related_business_areas"]
    }

    # 精确定义所有表中的日期列名，避免误伤 'platform_id' 等
    DATE_COLUMN_KEYWORDS = [
        'report_date', 'joined_date', 'first_seen_date', 'last_updated', 
        'date', 'start_date', 'end_date', 'effective_date', 'expiry_date',
        'subscription_expiry_date', 'created_at', 'update_range_start', 
        'update_range_end', 'run_at', 'generated_at', 'valid_until',
        'publish_date'
    ]

    import_order = [
        ("countries.csv", "countries"),
        ("ecommerce_platforms.csv", "ecommerce_platforms"),
        ("product_categories.csv", "product_categories"),
        ("macro_economic_indicators.csv", "macro_economic_indicators"),
        ("consumer_profiles.csv", "consumer_profiles"),
        ("tax_tariff_rules.csv", "tax_tariff_rules"),
        ("service_providers.csv", "service_providers"),
        ("logistics_solutions.csv", "logistics_solutions"),
        ("shops.csv", "shops"),
        ("products.csv", "products"),
        ("product_daily_snapshots.csv", "product_daily_snapshots"),
        ("marketing_campaigns.csv", "marketing_campaigns"),
        ("users.csv", "users"),
        ("user_watchlists.csv", "user_watchlists"),
        ("user_generated_content.csv", "user_generated_content"),
        ("data_update_logs.csv", "data_update_logs"),
        ("aggregated_reports_cache.csv", "aggregated_reports_cache"),
        ("legal_regulations.csv", "legal_regulations"),
        ("trade_news.csv", "trade_news"),
        ("cultural_knowledge.csv", "cultural_knowledge")
    ]

    valid_country_ids = []
    existing_user_ids = []

    for file_name, table_name in import_order:
        path = os.path.join(data_dir, file_name)
        if not os.path.exists(path): continue
            
        print(f"[INFO] Processing: {table_name}...", end=" ")
        try:
            df = pd.read_csv(path)

            # 1. 记录有效的国家ID
            if table_name == "countries":
                valid_country_ids = df['country_id'].tolist()

            # 2. 【修正逻辑】精确匹配日期列，不再误伤包含 'at' 的 ID 列
            for col in df.columns:
                if col.lower() in DATE_COLUMN_KEYWORDS:
                    df[col] = pd.to_datetime(df[col], errors='coerce')

            # 3. 处理所有 JSON 列
            if table_name in json_cols_map:
                for col in json_cols_map[table_name]:
                    if col in df.columns:
                        df[col] = df[col].apply(clean_json_string)

            # 4. 修复物流表
            if table_name == "logistics_solutions":
                df["price_per_kg"] = df["price_per_kg"].apply(extract_numeric)
                if valid_country_ids:
                    df = df[df['origin_country_id'].isin(valid_country_ids)]
                    df = df[df['dest_country_id'].isin(valid_country_ids)]

            # 5. 修复用户重复
            if table_name == "users":
                df = df.drop_duplicates(subset=['email'])
                existing_user_ids = df['user_id'].tolist()

            # 6. 修复外键孤儿
            if table_name in ["user_watchlists", "user_generated_content"]:
                if existing_user_ids:
                    df = df[df['user_id'].isin(existing_user_ids)]

            # 执行入库 (先清空再插入)
            with engine.connect() as conn:
                # MySQL不支持CASCADE，需要先禁用外键检查
                try:
                    conn.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
                    conn.execute(text(f"TRUNCATE TABLE `{table_name}`"))
                    conn.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
                    conn.commit()
                except Exception as e:
                    # 如果表不存在或TRUNCATE失败，尝试DELETE
                    try:
                        conn.execute(text(f"DELETE FROM `{table_name}`"))
                        conn.commit()
                    except:
                        conn.rollback()
                        pass

            df.to_sql(
                table_name, 
                engine, 
                if_exists='append', 
                index=False, 
                chunksize=500,
                method='multi'
            )
            print(f"[OK] ({len(df)} rows)")
            
        except Exception as e:
            print(f"[ERROR] Failed: {e}")

if __name__ == "__main__":
    run_seed()