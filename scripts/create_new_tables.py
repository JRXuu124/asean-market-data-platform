"""
创建新表：法律法规、经贸资讯、文化常识
"""
import os
import sys
from dotenv import load_dotenv

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

def create_new_tables():
    """创建新表"""
    print("=" * 60)
    print("Creating new tables: Legal Regulations, Trade News, Cultural Knowledge")
    print("=" * 60)
    
    try:
        from app.database import engine, Base
        from app import models  # 导入所有模型
        
        # 创建新表
        Base.metadata.create_all(bind=engine)
        print("[OK] New tables created successfully")
        
        # 验证表是否创建
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        new_tables = ['legal_regulations', 'trade_news', 'cultural_knowledge']
        created_tables = [t for t in new_tables if t in tables]
        
        print(f"\n[INFO] Created tables: {', '.join(created_tables)}")
        
        return True
    except Exception as e:
        print(f"[ERROR] Failed to create tables: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = create_new_tables()
    if success:
        print("\n" + "=" * 60)
        print("[OK] All new tables are ready!")
        print("=" * 60)
    sys.exit(0 if success else 1)
