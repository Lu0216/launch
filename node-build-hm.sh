#!/bin/bash
# echo "开始安装环境"
# npm install
# echo "开始执行打包"

# count=`pwd | grep BETA | wc -l`
# if [ $count -gt 0 ]; then
# echo "测试环境 npm run build:testhm"
# npm run build:testhm
# else
# echo "正式环境 npm run buildhm"
# npm run buildhm
# fi

export NODE_HOME=/data/node-v14
export PATH=$NODE_HOME/bin:$PATH

echo "开始安装环境"
/usr/local/bin/npm6 install
echo "开始执行打包"

count=`pwd | grep BETA | wc -l`
if [ $count -gt 0 ]; then
echo "测试环境 npm run build:testhm"
/usr/local/bin/npm6 run build:testhm
else
echo "正式环境 npm run buildhm"
/usr/local/bin/npm6 run buildhm
fi

