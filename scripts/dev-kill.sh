#!/bin/bash
# 杀掉 make dev 残留的僵尸进程，释放端口给下次 make dev 让路。
# 按端口 + 进程名两种策略查找，避免漏杀。

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
DIM='\033[2m'
NC='\033[0m'

# 从根目录 .env 读取端口配置（如存在），否则用默认值
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
if [[ -f "$ROOT_DIR/.env" ]]; then
  # shellcheck disable=SC1091
  set -a; source "$ROOT_DIR/.env"; set +a
fi

SERVER_PORT="${SERVER_PORT:-4000}"
WEB_PORT="${WEB_PORT:-5173}"
WEB_PORT_NEXT=$((WEB_PORT + 1))

PORTS=("$SERVER_PORT" "$WEB_PORT" "$WEB_PORT_NEXT")

PROCESS_PATTERNS=(
  "turbo.*dev"
  "tsx watch"
  "vite"
)

killed=0
declare -A seen_pids

kill_pid() {
  local pid=$1
  local desc=$2

  # 跳过已处理 / init / 自身
  [[ -n "${seen_pids[$pid]:-}" ]] && return
  [[ "$pid" -le 1 ]] && return
  [[ "$pid" == "$$" ]] && return

  seen_pids[$pid]=1

  if kill -0 "$pid" 2>/dev/null; then
    kill "$pid" 2>/dev/null && {
      printf "  ${RED}✗${NC} killed PID %-7s %s\n" "$pid" "$desc"
      ((killed++))
    }
  fi
}

echo -e "${YELLOW}🔍 查找 dev 残留进程...${NC}"

# ── 策略 1: 按端口查找 ──────────────────────────────────
for port in "${PORTS[@]}"; do
  while IFS= read -r line; do
    pid=$(echo "$line" | awk '{print $2}')
    name=$(echo "$line" | awk '{print $1}')
    [[ -z "$pid" ]] && continue
    kill_pid "$pid" "port $port ($name)"
  done < <(lsof -ti ":$port" -sTCP:LISTEN 2>/dev/null | while read p; do
    ps -p "$p" -o comm=,pid= 2>/dev/null
  done)
done

# ── 策略 2: 按进程名查找 ────────────────────────────────
for pattern in "${PROCESS_PATTERNS[@]}"; do
  while IFS= read -r line; do
    pid=$(echo "$line" | awk '{print $1}')
    cmd=$(echo "$line" | cut -d' ' -f2-)
    [[ -z "$pid" ]] && continue
    kill_pid "$pid" "$cmd"
  done < <(ps aux | grep -E "$pattern" | grep -v grep | awk '{print $2, $11, $12, $13, $14}')
done

if [[ $killed -eq 0 ]]; then
  echo -e "${GREEN}✓ 没有残留进程${NC}"
else
  echo -e "${GREEN}✓ 已清理 $killed 个进程${NC}"
  # 等待端口释放
  sleep 1
  echo -e "${DIM}  端口状态:${NC}"
  for port in "${PORTS[@]}"; do
    if lsof -ti ":$port" -sTCP:LISTEN >/dev/null 2>&1; then
      echo -e "  ${RED}●${NC} :$port 仍被占用"
    else
      echo -e "  ${GREEN}●${NC} :$port 已释放"
    fi
  done
fi

# ── 停止 Docker 容器 ────────────────────────────────────
echo -e "${YELLOW}🐳 停止 Docker 容器...${NC}"
docker compose -f "$ROOT_DIR/docker/docker-compose.dev.yml" --env-file "$ROOT_DIR/.env" down 2>/dev/null && {
  echo -e "${GREEN}✓ Docker 容器已停止${NC}"
} || {
  echo -e "${GREEN}✓ 没有正在运行的容器${NC}"
}
