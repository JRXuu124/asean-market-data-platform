"""
测试MySQL连接脚本
用于验证数据库配置是否正确
"""
import os
import sys
from dotenv import load_dotenv

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

def test_connection():
    """测试MySQL连接"""
    print("=" * 60)
    print("Testing MySQL Connection")
    print("=" * 60)
    
    try:
        from app.database import engine
        
        # 测试连接
        from sqlalchemy import text, inspect
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1 as test"))
            row = result.fetchone()
            if row and row[0] == 1:
                print("[OK] MySQL connection successful!")
                
                # 检查表是否存在
                inspector = inspect(engine)
                tables = inspector.get_table_names()
                
                print(f"\n[INFO] Found {len(tables)} tables:")
                for table in sorted(tables):
                    result = conn.execute(text(f"SELECT COUNT(*) as cnt FROM `{table}`"))
                    count = result.fetchone()[0]
                    print(f"   - {table}: {count} records")
                
                return True
            else:
                print("[ERROR] Connection test failed")
                return False
                
    except Exception as e:
        print(f"[ERROR] Connection failed: {e}")
        print("\nTips:")
        print("   1. Check DATABASE_URL in .env file")
        print("   2. Make sure MySQL service is running")
        print("   3. Make sure database is created")
        print("   4. Verify username and password are correct")
        return False

if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)

