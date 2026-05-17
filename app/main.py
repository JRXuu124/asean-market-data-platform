from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import router as api_router
from .database import engine, Base

# 创建所有数据库表（仅在初次运行时建议使用，生产环境建议使用迁移工具）
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="东盟市场数据平台 API",
    description="提供东盟十国宏观经济、热销品类、法律合规及 AI 市场分析的数据接口",
    version="1.2.0"
)

# 核心配置：允许前端 HTML 页面进行跨域请求
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在开发环境下允许所有来源
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有 HTTP 方法 (GET, POST 等)
    allow_headers=["*"],
)

# 挂载 API 路由，版本设为 v1
app.include_router(api_router, prefix="/api/v1", tags=["Main API"])

# 根路由跳转或提示
@app.get("/")
async def root():
    return {
        "message": "Welcome to ASEAN Market Data Platform API",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    # 启动服务器，地址 0.0.0.0 支持局域网访问，端口 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)