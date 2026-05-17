from typing import Optional, List
from pydantic import BaseModel
from datetime import date, datetime

# --- 商品分类输出模型 ---
class CategoryOut(BaseModel):
    category_id: int
    category_name_cn: Optional[str]
    category_name_en: Optional[str]
    level: Optional[int]
    parent_category_id: Optional[int]
    keywords: Optional[str]

    class Config:
        from_attributes = True

# --- 国家输出模型 ---
class CountryOut(BaseModel):
    country_id: int
    country_name_cn: str
    country_code_iso2: str
    class Config: from_attributes = True

# --- 商品输出模型 ---
class ProductOut(BaseModel):
    product_id: int
    product_title: str
    brand: Optional[str]
    url: Optional[str]
    main_image_url: Optional[str]
    category_id: Optional[int]
    country_id: Optional[int]
    class Config: from_attributes = True

# --- 宏观经济模型 ---
class MacroOut(BaseModel):
    indicator_id: int
    indicator_type: str
    indicator_value: float
    unit: str
    year: int
    class Config: from_attributes = True

# --- 法律法规模型 ---
class LegalRegulationOut(BaseModel):
    regulation_id: int
    country_id: int
    title: str
    title_en: Optional[str]
    category: Optional[str]
    regulation_type: Optional[str]
    impact_level: Optional[str]
    effective_date: Optional[date]
    class Config: from_attributes = True

# --- 经贸资讯模型 ---
class TradeNewsOut(BaseModel):
    news_id: int
    country_id: Optional[int]
    title: str
    title_en: Optional[str]
    summary: Optional[str]
    news_type: Optional[str]
    publish_date: Optional[date]
    is_featured: bool
    view_count: int
    class Config: from_attributes = True

# --- 文化常识模型 ---
class CulturalKnowledgeOut(BaseModel):
    knowledge_id: int
    country_id: int
    title: str
    title_en: Optional[str]
    category: Optional[str]
    importance_level: Optional[str]
    class Config: from_attributes = True