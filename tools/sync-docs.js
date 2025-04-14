/**
 * 文档同步工具 - 将 GitBook 文档同步到 Mintlify 格式
 */
const fs = require('fs');
const path = require('path');

// 定义路径
const gitbookDir = path.join(__dirname, '../packages/gitbook');
const mintlifyDir = path.join(__dirname, '../packages/mintlify');

// 日志函数
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// 同步函数
async function syncDocumentation() {
  log('开始同步 GitBook 文档到 Mintlify...');

  try {
    // 这里添加实际的同步逻辑
    // 示例：
    // 1. 读取 GitBook 文档结构
    // 2. 转换文档格式
    // 3. 更新 Mintlify 文档

    // 读取 GitBook 文档结构示例
    log('读取 GitBook 文档结构...');
    const languageDirs = ['en', 'zh_CN', 'jp'].filter(dir => 
      fs.existsSync(path.join(gitbookDir, dir)) && 
      fs.statSync(path.join(gitbookDir, dir)).isDirectory()
    );
    
    log(`找到语言目录: ${languageDirs.join(', ')}`);
    
    // 这里你可以添加实际的文档转换和同步逻辑
    // 例如遍历文件，转换格式，复制到 Mintlify 目录等
    
    log('文档同步完成！');
  } catch (error) {
    log(`同步过程中出错: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// 执行同步
syncDocumentation();
