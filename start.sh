#!/bin/bash
# 트리니티 음악학원 로컬 실행 스크립트
DIR="$(cd "$(dirname "$0")" && pwd)"
PORT=3000

echo "=========================================================="
echo " 트리니티 음악학원 (Trinity Music Academy) 시스템 실행기"
echo "=========================================================="
echo " 디렉토리: $DIR"
echo " 주소: http://localhost:$PORT"
echo " 브라우저를 열어 앱에 접속합니다."
echo "=========================================================="

# Try opening default browser
if which open >/dev/null 2>&1; then
  open "http://localhost:$PORT" || open "$DIR/index.html"
fi

# Run Trinity Python Backend & DB server
python3 "$DIR/server.py" $PORT
