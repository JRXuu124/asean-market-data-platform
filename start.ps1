# 自动设置不走代理，防止 pip 和 数据库连接失败
$env:no_proxy="*"
$env:HTTP_PROXY=""
$env:HTTPS_PROXY=""

Write-Host "🚀 正在启动东盟市场平台..." -ForegroundColor Cyan

# 安装依赖
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

# 询问是否灌库
$choice = Read-Host "是否需要重新同步CSV数据到云端? (y/n)"
if ($choice -eq 'y') {
    python scripts/seed_data.py
}

# 启动后端
uvicorn app.main:app --reload