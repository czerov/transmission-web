# GitHub Actions 自动化发布

本项目使用 GitHub Actions 实现自动化构建和发布流程。

## 🚀 工作流文件

### 1. `release-advanced.yml` - 高级发布工作流
- **触发条件**: 推送标签或手动触发
- **功能**:
  - 自动构建、打包、创建 Release
  - 自动生成变更日志
  - 构建产物上传
  - 更详细的错误处理
- **特点**: 功能完整，支持手动触发


## 📋 使用方法

### 方法一：使用本地脚本（推荐）

```bash
# 使用 GitHub Actions 发布
pnpm run release:github 1.0.0
```

这个脚本会：
1. 更新 package.json 版本号
2. 提交更改
3. 创建标签
4. 推送到 GitHub
5. 自动触发 GitHub Actions 构建和发布

### 方法二：手动操作

```bash
# 1. 更新版本号
npm version 1.0.0 --no-git-tag-version

# 2. 提交更改
git add .
git commit -m "chore: prepare release v1.0.0"

# 3. 创建标签
git tag -a "v1.0.0" -m "Release v1.0.0"

# 4. 推送
git push origin HEAD
git push origin v1.0.0
```

### 方法三：手动触发工作流

1. 访问 GitHub 仓库的 Actions 页面
2. 选择 "Advanced Release" 工作流
3. 点击 "Run workflow"
4. 输入版本号
5. 点击 "Run workflow"

## 🔧 配置说明

### 环境变量

工作流使用以下环境变量：

```yaml
env:
  NODE_VERSION: '18'    # Node.js 版本
  PNPM_VERSION: '8'     # pnpm 版本
```

### 缓存配置

工作流配置了以下缓存：

- **Node.js 缓存**: 加速依赖安装
- **pnpm 缓存**: 加速 pnpm 包管理

### 构建产物

工作流会生成以下产物：

- `transmission-web-v{version}.zip` - 发布包
- `build-artifacts-{run_number}` - 构建产物（保留30天）

### 环境变量

构建过程中会自动设置：

- `VITE_BASE_URL=/transmission/web` - 应用的基础路径

## 📊 工作流状态

### 成功状态
- ✅ 所有步骤执行成功
- 📦 发布包已创建
- 🏷️ GitHub Release 已创建
- 📋 变更日志已生成

### 失败状态
- ❌ 构建失败
- 🔍 检查 Actions 日志
- 🛠️ 修复问题后重新推送标签

## 🔍 监控和调试

### 查看工作流状态

1. **GitHub 网页**:
   - 访问仓库的 Actions 页面
   - 查看工作流运行历史
   - 点击具体运行查看详细日志

2. **命令行**:
   ```bash
   # 查看最近的标签
   git tag --sort=-version:refname | head -5

       # 查看工作流状态（需要 gh CLI）
    gh run list --workflow=release-advanced.yml
   ```

### 常见问题

1. **构建失败**
   - 检查 Node.js 版本兼容性
   - 验证依赖是否正确安装
   - 查看构建日志中的具体错误

2. **Release 创建失败**
   - 确保仓库有发布权限
   - 检查 GITHUB_TOKEN 权限
   - 验证标签格式是否正确

3. **缓存问题**
   - 清除 GitHub Actions 缓存
   - 重新推送触发构建

## 🎯 最佳实践

### 1. 版本管理
- 使用语义化版本号（如 `1.0.0`）
- 标签格式：`v{version}`
- 避免使用预发布版本号

### 2. 分支策略
- 在 `main` 或 `master` 分支上发布
- 使用功能分支进行开发
- 通过 PR 合并到主分支

### 3. 发布流程
- 先运行测试确保代码质量
- 更新版本号和变更日志
- 创建标签并推送
- 监控 GitHub Actions 执行状态

### 4. 回滚策略
- 如果发布失败，删除标签
- 修复问题后重新发布
- 使用 GitHub 的 Release 管理功能

## 🔗 相关链接

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [GitHub Releases API](https://docs.github.com/en/rest/releases)
- [语义化版本规范](https://semver.org/)
- [pnpm 文档](https://pnpm.io/)

## 📝 自定义配置

可以通过修改工作流文件来自定义：

- 构建环境（Node.js 版本、操作系统等）
- 缓存策略
- 构建产物
- 通知方式
- 错误处理

## 🆘 支持

如果遇到问题：

1. 查看 GitHub Actions 日志
2. 检查工作流配置
3. 验证环境设置
4. 提交 Issue 描述问题
