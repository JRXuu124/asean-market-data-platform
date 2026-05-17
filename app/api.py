import os
import httpx
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .database import get_db
from . import models, schemas

router = APIRouter()

# ================= 1. 基础配置与分类导航 =================

@router.get("/countries", response_model=List[schemas.CountryOut])
def read_countries(db: Session = Depends(get_db)):
    """获取东盟各国基础信息"""
    return db.query(models.Country).all()

@router.get("/categories", response_model=List[schemas.CategoryOut])
def read_categories(db: Session = Depends(get_db)):
    """获取商品品类导航"""
    return db.query(models.ProductCategory).all()

# ================= 2. 宏观经济模块 =================

@router.get("/macro/{country_id}", response_model=List[schemas.MacroOut])
def read_macro(country_id: int, db: Session = Depends(get_db)):
    """获取指定国家的宏观经济指标"""
    return db.query(models.MacroEconomicIndicator).filter(
        models.MacroEconomicIndicator.country_id == country_id
    ).order_by(models.MacroEconomicIndicator.year.desc()).all()

# ================= 3. 商品热销品类模块 (已关联动态价格) =================

@router.get("/products")
def read_products(
    country_id: Optional[int] = None, 
    category_id: Optional[int] = None, 
    limit: int = 60,         
    offset: int = 0,         
    db: Session = Depends(get_db)
):
    """获取热销商品，自动过滤脏数据并关联最新快照价格"""
    query = db.query(models.Product)
    
    # 1. 数据清洗过滤器 (保持不变)
    query = query.filter(
        models.Product.product_title != None,
        models.Product.product_title != "",
        models.Product.product_title != "nan",
        ~models.Product.product_title.contains("API_ERROR"),
        models.Product.main_image_url != None,
        models.Product.main_image_url != "nan",
        models.Product.main_image_url != ""
    )

    # 2. 应用筛选条件
    if country_id:
        query = query.filter(models.Product.country_id == country_id)
    if category_id:
        query = query.filter(models.Product.category_id == category_id)
    
    # 3. 计算总数
    total = query.count()
    
    # 4. 分页查询商品基础信息
    items = query.order_by(models.Product.product_id.asc())\
                 .offset(offset)\
                 .limit(limit)\
                 .all()
    
    # --- 核心修改：关联价格逻辑 ---
    for item in items:
        # 在快照表中查找该商品对应的最新一条记录
        latest_snapshot = db.query(models.ProductDailySnapshot)\
            .filter(models.ProductDailySnapshot.product_id == item.product_id)\
            .order_by(models.ProductDailySnapshot.date.desc())\
            .first()
        
        # 如果找到了快照，就取 current_price；否则默认为 0.0
        # 我们直接在 item 对象上动态添加一个 price 属性
        item.price = latest_snapshot.current_price if latest_snapshot else 0.0
    # ---------------------------
    
    return {
        "total": total,
        "items": items
    }

# ================= 4. 物流、税务与服务商 =================

@router.get("/logistics")
def get_logistics(dest_country_id: int, db: Session = Depends(get_db)):
    """获取指定国家的物流解决方案"""
    return db.query(models.LogisticsSolution).filter(
        models.LogisticsSolution.dest_country_id == dest_country_id
    ).all()

@router.get("/taxes/{country_id}")
def get_taxes(country_id: int, hs_code: Optional[str] = None, db: Session = Depends(get_db)):
    """查询指定国家的关税规则"""
    query = db.query(models.TaxTariffRule).filter(models.TaxTariffRule.country_id == country_id)
    if hs_code:
        query = query.filter(models.TaxTariffRule.hs_code.like(f"{hs_code}%"))
    return query.all()

@router.get("/service-providers")
def get_providers(service_type: Optional[str] = None, db: Session = Depends(get_db)):
    """查询东盟跨境服务商（物流、报关、支付等）"""
    query = db.query(models.ServiceProvider)
    if service_type:
        query = query.filter(models.ServiceProvider.service_type == service_type)
    return query.all()

# ================= 5. AI 智能诊断模块 (DeepSeek 集成) =================

@router.post("/ai/analyze-market")
async def analyze_market(country_id: int, category_name: str, lang: str = "zh", db: Session = Depends(get_db)):
    """调用 AI 对特定品类进入特定国家进行风险与机会分析"""
    country = db.query(models.Country).filter(models.Country.country_id == country_id).first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
        
    # 语言映射
    lang_map = {"zh": "Chinese", "en": "English", "ms": "Malay", "id": "Indonesian", "th": "Thai", "vi": "Vietnamese"}
    target_lang = lang_map.get(lang, "Chinese")

    prompt = f"""
    作为东盟专家，请分析【{category_name}】进入【{country.country_name_cn}】市场的机会。
    请从市场需求、关税壁垒、准入合规三个维度给出建议。使用 {target_lang} 回答。
    """

    api_key = os.getenv("DEEPSEEK_API_KEY")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                json={
                    "model": "deepseek-chat",
                    "messages": [{"role": "system", "content": "You are a professional ASEAN trade analyst."},
                                 {"role": "user", "content": prompt}],
                    "stream": False
                },
                timeout=60.0
            )
            return {"analysis": response.json()['choices'][0]['message']['content']}
        except Exception as e:
            return {"analysis": f"AI 服务暂时不可用: {str(e)}"}

# ================= 6. 法律、资讯与文化模块 =================

@router.get("/legal-regulations", response_model=List[schemas.LegalRegulationOut])
def get_regulations(country_id: Optional[int] = None, category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.LegalRegulation)
    if country_id:
        query = query.filter(models.LegalRegulation.country_id == country_id)
    if category:
        query = query.filter(models.LegalRegulation.category == category)
    return query.all()

@router.get("/trade-news", response_model=List[schemas.TradeNewsOut])
def get_news(country_id: Optional[int] = None, limit: int = 20, db: Session = Depends(get_db)):
    query = db.query(models.TradeNews)
    if country_id:
        query = query.filter(models.TradeNews.country_id == country_id)
    return query.order_by(models.TradeNews.publish_date.desc()).limit(limit).all()

@router.get("/cultural-knowledge", response_model=List[schemas.CulturalKnowledgeOut])
def get_culture(country_id: int, db: Session = Depends(get_db)):
    return db.query(models.CulturalKnowledge).filter(models.CulturalKnowledge.country_id == country_id).all()

# ================= 7. 系统状态 =================

@router.get("/health")
def health_check():
    return {"status": "online", "platform": "ASEAN-Market-Intelligence", "version": "1.2"}