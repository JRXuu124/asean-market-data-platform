# start_local.ps1 - ASEAN Market Data Platform 本地启动脚本
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  ASEAN Market Data Platform - Local Setup        " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Python 版本
Write-Host "Checking Python version..." -ForegroundColor Yellow
$pythonVersion = python --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.8+ from https://www.python.org/downloads/" -ForegroundColor Red
    exit 1
}
Write-Host "Python version: $pythonVersion" -ForegroundColor Green

# 创建或激活虚拟环境
if (Test-Path "venv") {
    Write-Host "Virtual environment found. Activating..." -ForegroundColor Yellow
    & "venv\Scripts\Activate.ps1"
} else {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    & "venv\Scripts\Activate.ps1"
    Write-Host "Virtual environment created and activated" -ForegroundColor Green
}

# 安装依赖
Write-Host "`nInstalling/updating dependencies..." -ForegroundColor Yellow
pip install --upgrade pip
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: Some dependencies may not have installed correctly" -ForegroundColor Yellow
}

# 复制和配置环境文件
if (-Not (Test-Path ".env")) {
    Write-Host "`nCreating .env configuration file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    
    # 配置 SQLite 数据库
    $envContent = Get-Content .env
    $envContent = $envContent -replace 'DATABASE_URL=.*', 'DATABASE_URL=sqlite:///./asean_market.db'
    $envContent = $envContent -replace 'REDIS_URL=.*', 'REDIS_URL=redis://localhost:6379/0'
    $envContent = $envContent -replace 'ELASTICSEARCH_URL=.*', '# ELASTICSEARCH_URL=http://localhost:9200  # Optional for local demo'
    $envContent | Set-Content .env
    
    Write-Host "Created .env file with SQLite configuration" -ForegroundColor Green
    Write-Host "Note: For production, edit .env to use PostgreSQL" -ForegroundColor Yellow
}

# 检查并创建数据库
Write-Host "`nSetting up database..." -ForegroundColor Yellow
if (Test-Path "asean_market.db") {
    Write-Host "Database already exists. Skipping initialization." -ForegroundColor Yellow
} else {
    Write-Host "Initializing database..." -ForegroundColor Yellow
    try {
        python scripts/init_db.py
        Write-Host "Database initialized successfully" -ForegroundColor Green
    } catch {
        Write-Host "Warning: Database initialization may have issues. Continuing..." -ForegroundColor Yellow
    }
}

# 显示启动信息
Write-Host "`n" + "="*50 -ForegroundColor Cyan
Write-Host "  READY TO START                          " -ForegroundColor Green
Write-Host "="*50 -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting ASEAN Market Data Platform API..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Access URLs:" -ForegroundColor White
Write-Host "  • API Server:    http://localhost:8000" -ForegroundColor Green
Write-Host "  • API Docs:      http://localhost:8000/docs" -ForegroundColor Green
Write-Host "  • OpenAPI JSON:  http://localhost:8000/openapi.json" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend Demo: Open frontend/index.html in your browser" -ForegroundColor Yellow
Write-Host ""
Write-Host "To test the API immediately:" -ForegroundColor White
Write-Host "  1. Open browser to http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "  2. Try the endpoints under /countries or /products" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "`n" + "="*50 -ForegroundColor Cyan

# 启动 FastAPI 服务器
try {
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
} catch {
    Write-Host "`nServer stopped." -ForegroundColor Yellow
}