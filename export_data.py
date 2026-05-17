import sqlite3
import json
import os

# 确保创建 data 文件夹在 frontend 目录下
output_dir = 'frontend/data'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

def table_to_json(table_name, json_name):
    conn = sqlite3.connect('test.db') # 你的数据库文件
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    try:
        cursor.execute(f"SELECT * FROM {table_name}")
        rows = [dict(row) for row in cursor.fetchall()]
        with open(f'{output_dir}/{json_name}.json', 'w', encoding='utf-8') as f:
            json.dump(rows, f, ensure_ascii=False, indent=4)
        print(f"成功导出: {json_name}.json")
    except Exception as e:
        print(f"导出 {table_name} 失败: {e}")
    finally:
        conn.close()

# 按照你 app.js 里的需求导出对应的表
table_to_json('countries', 'countries')
table_to_json('macro_indicators', 'macro') # 导出所有指标
table_to_json('products', 'products')
table_to_json('consumer_insights', 'consumer_insights')
table_to_json('taxes', 'taxes')
table_to_json('service_providers', 'service_providers')
table_to_json('legal_regulations', 'legal_regulations')
table_to_json('trade_news', 'trade_news')