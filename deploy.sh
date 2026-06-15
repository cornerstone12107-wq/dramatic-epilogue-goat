#!/bin/bash
if [ -z "$1" ]; then
  echo "사용법: ./deploy.sh <깃허브_계정명>"
  exit 1
fi

USER_NAME=$1
REPO_NAME="dramatic-epilogue-goat"

# 기존 원격지 제거 후 재등록
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/${USER_NAME}/${REPO_NAME}.git"
git branch -M main

echo "=================================================="
echo " 깃허브(${USER_NAME}/${REPO_NAME}) 원격 저장소로 코드를 전송합니다."
echo " 깃허브 로그인 창이 뜨거나 자격 증명(Token 등)을 요구하면 입력해주세요."
echo "=================================================="

git push -u origin main
