import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# --- 数据库连接配置 ---
# 使用 SQLite 数据库，数据将保存在项目根目录下的 test.db 文件中
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

# 创建引擎
# connect_args={"check_same_thread": False} 是 SQLite 必须的配置，用于支持 FastAPI 的多线程访问
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}
)

# 创建会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建基类
Base = declarative_base()

# 获取数据库连接的工具函数 (用于 FastAPI 依赖注入)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()