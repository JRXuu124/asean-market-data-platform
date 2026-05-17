import pandas as pd
import os
import re
from datetime import datetime
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app import models

# --- 汇率配置 ---
VND_TO_CNY_RATE = 3500.0  # 1人民币 ≈ 3500 越南盾

# --- 路径配置 ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "热销品类数据")
SUNING_CSV = os.path.join(DATA_DIR, "suning_product.csv")
SHOPEE_CSV = os.path.join(DATA_DIR, "shopee_product.csv")

def clean_price(price_raw, convert_from_vnd=False):
    """
    清洗价格字符串并根据需要进行汇率转换
    """
    if pd.isna(price_raw): return 0.0
    
    # 将输入转为字符串并移除常见干扰符
    s = str(price_raw).replace('₫', '').replace('¥', '').replace(',', '')
    
    # 越南盾处理特殊性：如果是 "150.000" 这种格式，需要去掉点
    if convert_from_vnd:
        # 提取所有数字并拼接（防止 150.000 被识别成 150）
        nums = re.findall(r"\d+", s)
        if not nums: return 0.0
        val = float("".join(nums))
        return round(val / VND_TO_CNY_RATE, 2)
    else:
        # 人民币处理：正常提取数字和小数点
        nums = re.findall(r"[\d\.]+", s)
        if not nums: return 0.0
        try:
            return float(nums[0])
        except:
            return 0.0

def init_db_and_import():
    print(f"🚀 开始初始化数据库并导入数据... 目录: {BASE_DIR}")
    
    # 1. 强制创建表结构
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 2. 初始化 8 大标准分类
    categories_data = [
        {"id": 1, "name": "家居手工艺", "icon": "bi-basket"},
        {"id": 2, "name": "名贵药材", "icon": "bi-capsule"},
        {"id": 3, "name": "智能硬件", "icon": "bi-cpu"},
        {"id": 4, "name": "名茶茗饮", "icon": "bi-cup-hot"},
        {"id": 5, "name": "食品生鲜", "icon": "bi-apple"},
        {"id": 6, "name": "个护家清", "icon": "bi-magic"},
        {"id": 7, "name": "宠物用品", "icon": "bi-dog"},
        {"id": 8, "name": "其他", "icon": "bi-tag"}
    ]

    print("正在检查并同步分类索引...")
    for item in categories_data:
        cat = db.query(models.ProductCategory).filter_by(category_id=item['id']).first()
        if not cat:
            cat = models.ProductCategory(
                category_id=item['id'],
                category_name_cn=item['name'],
                icon_code=item['icon'],
                level=1
            )
            db.add(cat)
    db.commit()

    # 3. Shopee 越南语类目映射逻辑
    def get_shopee_cat_id(raw_cat):
        c = str(raw_cat).lower()
        if 'thú cưng' in c or 'pet' in c: return 7
        if 'trà' in c or 'tea' in c: return 4
        if 'thực phẩm' in c or 'uống' in c: return 5
        if 'chăm sóc' in c: return 6
        if 'thiết bị' in c or 'điện tử' in c: return 3
        if 'thủ công' in c: return 1
        if 'sâm' in c or 'thảo mộc' in c: return 2
        return 8

    # 4. 导入 Shopee 数据 (带汇率转换)
    if os.path.exists(SHOPEE_CSV):
        print(f"📊 发现 Shopee 数据: {SHOPEE_CSV}，开始 [越南盾 -> 人民币] 转换导入...")
        df_sh = pd.read_csv(SHOPEE_CSV)
        today = datetime.now().date()
        
        for i, row in df_sh.iterrows():
            try:
                title = str(row.get('name', ''))
                if "API_ERROR" in title or title == "nan" or title == "":
                    continue

                cat_id = get_shopee_cat_id(row.get('category', '其他'))
                
                new_prod = models.Product(
                    product_title=title,
                    brand=str(row.get('brand', '未知')),
                    url=str(row.get('product_link', '')),
                    main_image_url=str(row.get('main_image', '')),
                    category_id=cat_id,
                    platform_id=2, 
                    country_id=2   
                )
                db.add(new_prod)
                db.flush() 

                # 提取价格并转换 (越南盾 -> 人民币)
                price_val = clean_price(row.get('price', row.get('sale_price', 0)), convert_from_vnd=True)
                
                snapshot = models.ProductDailySnapshot(
                    product_id=new_prod.product_id,
                    current_price=price_val,
                    date=today
                )
                db.add(snapshot)

                if i % 1000 == 0:
                    db.commit()
                    print(f"已同步 {i} 条 Shopee 数据...")
            except Exception as e:
                db.rollback()
                print(f"Shopee导入行 {i} 出错: {e}")
        db.commit()
        print("✅ Shopee 数据转换并导入完毕。")

    # 5. 导入苏宁数据 (不带转换，直接导入)
    if os.path.exists(SUNING_CSV):
        print(f"📊 发现苏宁数据: {SUNING_CSV}，开始导入 [原生人民币价格]...")
        df_sn = pd.read_csv(SUNING_CSV)
        
        sn_kw_map = {
            "藤编": 1, "沉香": 2, "灵芝": 2, "VR/AR/MR产品": 3, 
            "汽车传感器": 3, "茉莉花茶": 4, "六堡茶": 4, 
            "红糖": 5, "沃柑": 5, "两面针": 6, "牙刷": 6
        }

        for i, row in df_sn.iterrows():
            try:
                title = str(row.get('product_name', ''))
                if "API_ERROR" in title or title == "nan" or title == "":
                    continue

                kw = str(row.get('keyword', '其他'))
                cat_id = sn_kw_map.get(kw, 8)
                
                new_prod = models.Product(
                    product_title=title,
                    url=str(row['product_url']),
                    main_image_url=str(row['main_img']),
                    category_id=cat_id,
                    platform_id=1, 
                    country_id=1   
                )
                db.add(new_prod)
                db.flush()

                # 提取价格 (苏宁已经是人民币)
                price_val = clean_price(row.get('sale_price', 0), convert_from_vnd=False)
                
                # 处理爬取日期
                crawl_time_raw = str(row.get('crawl_time', ''))
                date_str = re.sub(r'[^0-9-]', '', crawl_time_raw[:10])
                try:
                    target_date = datetime.strptime(date_str, '%Y-%m-%d').date() if len(date_str) >= 10 else datetime.now().date()
                except:
                    target_date = datetime.now().date()

                snapshot = models.ProductDailySnapshot(
                    product_id=new_prod.product_id,
                    current_price=price_val,
                    date=target_date
                )
                db.add(snapshot)
                
                if i % 1000 == 0:
                    db.commit()
            except Exception as e:
                db.rollback()
                print(f"苏宁导入行 {i} 出错: {e}")
        db.commit()
        print("✅ 苏宁数据导入完毕。")

    print("\n🎉 所有数据同步完成！")
    print(f"最终统计：数据库中共有 {db.query(models.Product).count()} 个商品。")
    db.close()

if __name__ == "__main__":
    init_db_and_import()