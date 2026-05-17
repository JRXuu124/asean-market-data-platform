from sqlalchemy import Column, Integer, String, Boolean, Float, Text, Date, DateTime, ForeignKey, Numeric, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base

# ================= 1. 基础配置表 =================

class Country(Base):
    __tablename__ = "countries"
    country_id = Column(Integer, primary_key=True, index=True)
    country_code_iso2 = Column(String(2), unique=True, nullable=False)
    country_code_iso3 = Column(String(3), unique=True)
    country_name_cn = Column(String(100), nullable=False)
    country_name_local = Column(String(100))
    region = Column(String(50))
    currency_code = Column(String(3))
    timezone = Column(String(50))
    flag_icon_url = Column(Text)
    is_active = Column(Boolean, default=True)

    # 关联关系
    platforms = relationship("EcommercePlatform", back_populates="country")
    macro_indicators = relationship("MacroEconomicIndicator", back_populates="country")
    products = relationship("Product", back_populates="country")

class EcommercePlatform(Base):
    __tablename__ = "ecommerce_platforms"
    platform_id = Column(Integer, primary_key=True, index=True)
    platform_name = Column(String(100), nullable=False)
    platform_logo_url = Column(Text)
    website_url = Column(Text)
    country_id = Column(Integer, ForeignKey("countries.country_id"))
    description = Column(Text)

    # 关联关系
    country = relationship("Country", back_populates="platforms")
    shops = relationship("Shop", back_populates="platform")

class ProductCategory(Base):
    __tablename__ = "product_categories"
    category_id = Column(Integer, primary_key=True, index=True)
    category_name_en = Column(String(100))
    category_name_cn = Column(String(100))
    parent_category_id = Column(Integer, ForeignKey("product_categories.category_id"), nullable=True)
    level = Column(Integer)
    keywords = Column(Text)
    # 新增字段：用于前端导航图标 (如 bi-cpu, bi-basket)
    icon_code = Column(String(50), default="bi-tag") 

    # 关联关系
    products = relationship("Product", back_populates="category")

# ================= 2. 市场宏观表 =================

class MacroEconomicIndicator(Base):
    __tablename__ = "macro_economic_indicators"
    indicator_id = Column(Integer, primary_key=True, index=True)
    country_id = Column(Integer, ForeignKey("countries.country_id"))
    year = Column(Integer)
    quarter = Column(String(10))
    indicator_type = Column(String(50)) # gdp, population等
    indicator_value = Column(Numeric(precision=20, scale=2))
    unit = Column(String(20))
    data_source = Column(Text)
    last_updated = Column(DateTime, server_default=func.now())

    # 关联关系
    country = relationship("Country", back_populates="macro_indicators")

class ConsumerProfile(Base):
    __tablename__ = "consumer_profiles"
    profile_id = Column(Integer, primary_key=True, index=True)
    country_id = Column(Integer, ForeignKey("countries.country_id"))
    segment_name = Column(String(100))
    age_range = Column(String(50))
    income_level = Column(String(50))
    city_tier = Column(String(50))
    preferred_categories = Column(JSON) # 偏好品类ID数组
    average_order_value = Column(String(100))
    top_payment_methods = Column(JSON) # 支付方式数组
    sample_size = Column(Integer)
    report_date = Column(Date)

# ================= 3. 商品竞争表 =================

class Shop(Base):
    __tablename__ = "shops"
    shop_id = Column(Integer, primary_key=True, index=True)
    external_shop_id = Column(String(100))
    platform_id = Column(Integer, ForeignKey("ecommerce_platforms.platform_id"))
    country_id = Column(Integer, ForeignKey("countries.country_id"))
    shop_name = Column(String(255))
    shop_rating = Column(Float)
    follower_count = Column(Integer)
    response_rate = Column(String(20))
    joined_date = Column(Date)
    is_official_mall = Column(Boolean, default=False)
    location_city = Column(String(100))

    # 关联关系
    platform = relationship("EcommercePlatform", back_populates="shops")
    products = relationship("Product", back_populates="shop")

class Product(Base):
    __tablename__ = "products"
    product_id = Column(Integer, primary_key=True, index=True)
    external_product_id = Column(String(100))
    platform_id = Column(Integer, ForeignKey("ecommerce_platforms.platform_id"))
    country_id = Column(Integer, ForeignKey("countries.country_id"))
    shop_id = Column(Integer, ForeignKey("shops.shop_id"))
    category_id = Column(Integer, ForeignKey("product_categories.category_id"))
    product_title = Column(Text)
    product_title_translated = Column(Text)
    brand = Column(String(100))
    description = Column(Text)
    main_image_url = Column(Text)
    url = Column(Text)
    is_ad = Column(Boolean, default=False)
    first_seen_date = Column(Date)
    last_updated = Column(DateTime, onupdate=func.now())

    # 关联关系
    country = relationship("Country", back_populates="products")
    category = relationship("ProductCategory", back_populates="products")
    shop = relationship("Shop", back_populates="products")
    snapshots = relationship("ProductDailySnapshot", back_populates="product")

class ProductDailySnapshot(Base):
    __tablename__ = "product_daily_snapshots"
    snapshot_id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.product_id"))
    date = Column(Date, index=True)
    current_price = Column(Numeric(15, 2))
    original_price = Column(Numeric(15, 2))
    discount_rate = Column(Float)
    monthly_sales_estimated = Column(Integer)
    cumulative_reviews = Column(Integer)
    average_rating = Column(Float)
    in_stock = Column(Boolean, default=True)
    tags = Column(JSON) # 促销标签数组

    # 关联关系
    product = relationship("Product", back_populates="snapshots")

# ================= 4. 营销与物流合规表 =================

class LogisticsSolution(Base):
    __tablename__ = "logistics_solutions"
    solution_id = Column(Integer, primary_key=True, index=True)
    solution_name = Column(String(255))
    service_type = Column(String(100))
    origin_country_id = Column(Integer, ForeignKey("countries.country_id"))
    dest_country_id = Column(Integer, ForeignKey("countries.country_id"))
    estimated_days_min = Column(Integer)
    estimated_days_max = Column(Integer)
    price_per_kg = Column(Numeric(10, 2))
    tracking_available = Column(Boolean, default=True)
    service_provider = Column(String(100))

class TaxTariffRule(Base):
    __tablename__ = "tax_tariff_rules"
    rule_id = Column(Integer, primary_key=True, index=True)
    country_id = Column(Integer, ForeignKey("countries.country_id"))
    hs_code = Column(String(20))
    hs_code_description = Column(Text)
    import_duty_rate = Column(Float)
    vat_rate = Column(Float)
    other_taxes = Column(JSON)
    threshold_amount = Column(Numeric(15, 2))
    data_source = Column(Text)
    effective_date = Column(Date)
    expiry_date = Column(Date)

class ServiceProvider(Base):
    __tablename__ = "service_providers"
    provider_id = Column(Integer, primary_key=True, index=True)
    provider_name = Column(String(255))
    service_type = Column(String(100))
    countries_covered = Column(JSON)
    contact_info = Column(JSON)
    user_rating_avg = Column(Float)
    review_count = Column(Integer)
    is_verified = Column(Boolean, default=False)

# ================= 5. 系统、法律、资讯与文化 =================

class LegalRegulation(Base):
    __tablename__ = "legal_regulations"
    regulation_id = Column(Integer, primary_key=True, index=True)
    country_id = Column(Integer, ForeignKey("countries.country_id"))
    title = Column(String(500), nullable=False)
    title_en = Column(String(500))
    category = Column(String(100)) 
    regulation_type = Column(String(50)) 
    content = Column(Text)
    content_en = Column(Text)
    effective_date = Column(Date)
    expiry_date = Column(Date)
    source_url = Column(Text)
    impact_level = Column(String(20)) 
    last_updated = Column(DateTime, server_default=func.now(), onupdate=func.now())
    created_at = Column(DateTime, server_default=func.now())

class TradeNews(Base):
    __tablename__ = "trade_news"
    news_id = Column(Integer, primary_key=True, index=True)
    country_id = Column(Integer, ForeignKey("countries.country_id"), nullable=True)
    title = Column(String(500), nullable=False)
    title_en = Column(String(500))
    summary = Column(Text)
    content = Column(Text)
    news_type = Column(String(50))
    source = Column(String(255))
    source_url = Column(Text)
    publish_date = Column(Date, index=True)
    view_count = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

class CulturalKnowledge(Base):
    __tablename__ = "cultural_knowledge"
    knowledge_id = Column(Integer, primary_key=True, index=True)
    country_id = Column(Integer, ForeignKey("countries.country_id"), nullable=False)
    title = Column(String(500), nullable=False)
    title_en = Column(String(500))
    category = Column(String(100)) 
    content = Column(Text)
    importance_level = Column(String(20)) 
    last_updated = Column(DateTime, server_default=func.now(), onupdate=func.now())
    created_at = Column(DateTime, server_default=func.now())