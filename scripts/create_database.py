"""
创建MySQL数据库脚本
如果数据库不存在，会自动创建
"""
import os
import sys
from dotenv import load_dotenv
import pymysql

load_dotenv()

def create_database():
    """创建数据库（如果不存在）"""
    # 从环境变量获取数据库URL
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("ERROR: DATABASE_URL is not set.")
        print("Please ensure .env exists and contains DATABASE_URL.")
        return False
    
    # 解析数据库URL
    # 格式: mysql+pymysql://user:password@host:port/database
    try:
        # 移除 mysql+pymysql:// 前缀
        if db_url.startswith("mysql+pymysql://"):
            db_url = db_url.replace("mysql+pymysql://", "", 1)
        elif db_url.startswith("mysql://"):
            db_url = db_url.replace("mysql://", "", 1)
        
        # 分离用户信息和数据库名
        if "@" in db_url:
            user_pass_host, database = db_url.rsplit("/", 1)
            user_pass, host_port = user_pass_host.split("@", 1)
            user, password = user_pass.split(":", 1)
            
            # 处理主机和端口
            if ":" in host_port:
                host, port = host_port.split(":", 1)
                port = int(port)
            else:
                host = host_port
                port = 3306
            
            # URL解码密码（如果有特殊字符）
            import urllib.parse
            password = urllib.parse.unquote_plus(password)
            
            print("=" * 60)
            print("Database connection info")
            print("=" * 60)
            print(f"Host: {host}")
            print(f"Port: {port}")
            print(f"User: {user}")
            print(f"Database: {database}")
            print()
            
            # 连接到MySQL服务器（不指定数据库）
            print("Connecting to MySQL server...")
            connection = pymysql.connect(
                host=host,
                port=port,
                user=user,
                password=password,
                charset='utf8mb4'
            )
            
            try:
                with connection.cursor() as cursor:
                    # 检查数据库是否存在
                    cursor.execute("SHOW DATABASES LIKE %s", (database,))
                    exists = cursor.fetchone()
                    
                    if exists:
                        print(f"OK: Database '{database}' already exists.")
                        return True
                    else:
                        # 创建数据库
                        print(f"Creating database '{database}'...")
                        cursor.execute(
                            f"CREATE DATABASE `{database}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
                        )
                        connection.commit()
                        print(f"OK: Database '{database}' created.")
                        return True
                        
            finally:
                connection.close()
                
        else:
            print("ERROR: Invalid DATABASE_URL format.")
            return False
            
    except pymysql.Error as e:
        print(f"ERROR: MySQL error: {e}")
        print("\nPossible causes:")
        print("  1) MySQL service is not running")
        print("  2) Wrong username/password")
        print("  3) Wrong host/port")
        print("  4) The user lacks CREATE DATABASE privilege")
        return False
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = create_database()
    if success:
        print("\n" + "=" * 60)
        print("OK: Database is ready.")
        print("=" * 60)
        print("\nNext:")
        print("  Run: python scripts/migrate_to_mysql.py")
    else:
        print("\n" + "=" * 60)
        print("ERROR: Failed to create database.")
        print("=" * 60)
    sys.exit(0 if success else 1)
