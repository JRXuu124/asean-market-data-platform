"""
数据迁移脚本：将数据迁移到MySQL数据库
支持从CSV文件或现有数据库迁移
"""
import os
import sys
import pandas as pd
import urllib.parse
import json
import ast
import re
from sqlalchemy import create_engine, text, inspect
from dotenv import load_dotenv

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

def get_mysql_engine():
    """获取MySQL数据库引擎"""
    raw_url = os.getenv("DATABASE_URL")
    if not raw_url:
        raise ValueError("请设置环境变量 DATABASE_URL，格式: mysql+pymysql://user:password@host:port/database")
    
    # 确保使用pymysql驱动
    if raw_url.startswith("mysql://"):
        raw_url = raw_url.replace("mysql://", "mysql+pymysql://", 1)
    elif not raw_url.startswith("mysql+pymysql://"):
        # 如果不是mysql开头，尝试添加
        if "@" in raw_url:
            prefix, rest = raw_url.split("://", 1)
            raw_url = f"mysql+pymysql://{rest}"
    
    # 处理密码特殊字符
    if "@" in raw_url:
        prefix, rest = raw_url.split("://", 1)
        if ":" in rest.split("@")[0]:
            user_pass, host_db = rest.split("@", 1)
            user, password = user_pass.split(":", 1)
            safe_password = urllib.parse.quote_plus(password)
            raw_url = f"{prefix}://{user}:{safe_password}@{host_db}"
    
    engine = create_engine(
        raw_url,
        pool_pre_ping=True,
        pool_recycle=3600,
        echo=False
    )
    return engine

def clean_json_string(val):
    """清理JSON字符串"""
    if pd.isna(val) or val == "":
        return None
    if isinstance(val, str):
        try:
            # 尝试解析为Python对象
            data = ast.literal_eval(val)
            return json.dumps(data, ensure_ascii=False)
        except:
            # 如果已经是JSON字符串，直接返回
            try:
                json.loads(val)
                return val
            except:
                return val
    return json.dumps(val, ensure_ascii=False) if val is not None else None

def extract_numeric(val):
    """提取数字"""
    if pd.isna(val) or val == "":
        return 0
    if isinstance(val, str):
        match = re.search(r"[-+]?\d*\.\d+|\d+", val)
        return float(match.group()) if match else 0
    return float(val) if val is not None else 0

def create_tables(engine):
    """创建数据库表"""
    print("[INFO] Creating database tables...")
    from app.database import Base
    from app import models  # 导入所有模型以注册表
    
    try:
        Base.metadata.create_all(bind=engine)
        print("[OK] Database tables created successfully")
    except Exception as e:
        print(f"[ERROR] Failed to create tables: {e}")
        raise

def migrate_from_csv(engine, data_dir="./data"):
    """从CSV文件迁移数据到MySQL"""
    print("\n[INFO] Starting CSV data migration...")
    
    json_cols_map = {
        "consumer_profiles": ["preferred_categories", "top_payment_methods"],
        "tax_tariff_rules": ["other_taxes"],
        "service_providers": ["countries_covered", "contact_info"],
        "users": ["interested_countries", "interested_categories"],
        "aggregated_reports_cache": ["report_data", "parameters"],
        "product_daily_snapshots": ["tags"]
    }

    DATE_COLUMN_KEYWORDS = [
        'report_date', 'joined_date', 'first_seen_date', 'last_updated', 
        'date', 'start_date', 'end_date', 'effective_date', 'expiry_date',
        'subscription_expiry_date', 'created_at', 'update_range_start', 
        'update_range_end', 'run_at', 'generated_at', 'valid_until'
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
        ("aggregated_reports_cache.csv", "aggregated_reports_cache")
    ]

    valid_country_ids = []
    existing_user_ids = []

    for file_name, table_name in import_order:
        path = os.path.join(data_dir, file_name)
        if not os.path.exists(path):
            print(f"[WARN] File not found: {file_name}, skipping...")
            continue
            
        print(f"[INFO] Processing: {table_name}...", end=" ")
        try:
            df = pd.read_csv(path)

            # 记录有效的国家ID
            if table_name == "countries":
                valid_country_ids = df['country_id'].tolist()

            # 处理日期列
            for col in df.columns:
                if col.lower() in DATE_COLUMN_KEYWORDS:
                    df[col] = pd.to_datetime(df[col], errors='coerce')

            # 处理JSON列
            if table_name in json_cols_map:
                for col in json_cols_map[table_name]:
                    if col in df.columns:
                        df[col] = df[col].apply(clean_json_string)

            # 修复物流表
            if table_name == "logistics_solutions":
                if "price_per_kg" in df.columns:
                    df["price_per_kg"] = df["price_per_kg"].apply(extract_numeric)
                if valid_country_ids:
                    if "origin_country_id" in df.columns:
                        df = df[df['origin_country_id'].isin(valid_country_ids)]
                    if "dest_country_id" in df.columns:
                        df = df[df['dest_country_id'].isin(valid_country_ids)]

            # 修复用户重复
            if table_name == "users":
                df = df.drop_duplicates(subset=['email'], keep='first')
                existing_user_ids = df['user_id'].tolist()

            # 修复外键孤儿
            if table_name in ["user_watchlists", "user_generated_content"]:
                if existing_user_ids and "user_id" in df.columns:
                    df = df[df['user_id'].isin(existing_user_ids)]

            # 清空表（MySQL使用TRUNCATE）
            with engine.connect() as conn:
                try:
                    conn.execute(text(f"SET FOREIGN_KEY_CHECKS = 0"))
                    conn.execute(text(f"TRUNCATE TABLE `{table_name}`"))
                    conn.execute(text(f"SET FOREIGN_KEY_CHECKS = 1"))
                    conn.commit()
                except Exception as e:
                    # 如果表不存在或为空，继续
                    conn.rollback()
                    pass

            # 导入数据
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
            import traceback
            traceback.print_exc()

def verify_migration(engine):
    """验证迁移结果"""
    print("\n[INFO] Verifying migration results...")
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    print(f"[OK] Found {len(tables)} tables:")
    for table in tables:
        with engine.connect() as conn:
            result = conn.execute(text(f"SELECT COUNT(*) as cnt FROM `{table}`"))
            count = result.fetchone()[0]
            print(f"   - {table}: {count} records")

def main():
    """主函数"""
    print("=" * 60)
    print("MySQL Data Migration Tool")
    print("=" * 60)
    
    try:
        # 获取MySQL引擎
        engine = get_mysql_engine()
        print("[OK] MySQL connection successful")
        
        # 创建表
        create_tables(engine)
        
        # 从CSV迁移数据
        data_dir = os.getenv("DATA_PATH", "./data")
        migrate_from_csv(engine, data_dir)
        
        # 验证迁移
        verify_migration(engine)
        
        print("\n" + "=" * 60)
        print("[OK] Data migration completed!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n[ERROR] Migration failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()

