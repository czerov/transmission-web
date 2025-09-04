# Transmission Web

<div align="center">
  <img src="public/transmission.svg" alt="Transmission Web" width="120" height="120">

  <h3>🚀 现代化的 Transmission BitTorrent 客户端 Web 界面</h3>

  <p>基于 Vue 3 + TypeScript 构建的高性能 BitTorrent 管理界面</p>

  <div style="margin: 20px 0;">
    <span style="padding: 8px 16px; background: #28a745; color: white; border-radius: 6px; margin-right: 10px;">🇨🇳 中文</span>
    <a href="README.md" style="text-decoration: none; padding: 8px 16px; background: #0366d6; color: white; border-radius: 6px;">🇺🇸 English</a>
  </div>

  [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
  [![Vue 3](https://img.shields.io/badge/Vue-3.5+-brightgreen.svg)](https://vuejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)
  [![Naive UI](https://img.shields.io/badge/Naive_UI-2.42+-lightblue.svg)](https://www.naiveui.com/)
  [![Node.js](https://img.shields.io/badge/Node.js-20.0+-green.svg)](https://nodejs.org/)
  [![pnpm](https://img.shields.io/badge/pnpm-10.0+-orange.svg)](https://pnpm.io/)
  [![Vite](https://img.shields.io/badge/Vite-7.0+-purple.svg)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0+-38B2AC.svg)](https://tailwindcss.com/)
</div>

## 📖 项目简介

Transmission Web 是一个现代化的 Transmission BitTorrent 客户端 Web 界面，采用最新的前端技术栈重新设计开发。提供了简洁美观的用户界面、丰富的功能特性和优秀的用户体验。

### 🌟 为什么选择 Transmission Web？

- **🎯 专注用户体验** - 专为现代 Web 环境设计的 BitTorrent 管理界面
- **🚀 技术领先** - 基于 Vue 3 + TypeScript 最新技术栈构建
- **📱 全平台支持** - 完美适配桌面端、平板和移动设备
- **⚡ 性能优异** - 采用虚拟滚动技术，轻松处理数万种子
- **🔧 高度可定制** - 支持主题切换、布局调整、列配置等
- **🌍 国际化支持** - 多语言界面，全球用户友好

### ✨ 主要特性

- 🎨 **现代化界面** - 基于 Naive UI 设计系统，支持亮色/暗色主题
- 📱 **响应式设计** - 完美适配桌面端和移动端设备
- ⚡ **高性能** - (canvas)虚拟滚动技术，轻松处理大量种子列表
- 🔍 **智能过滤** - 支持状态、标签、站点、错误状态等多维度过滤
- 📊 **数据可视化** - 丰富的进度条、统计图表和状态指示器
- 🎯 **便捷操作** - 支持批量操作、拖拽排序、快捷键等
- 🌐 **国际化** - 多语言支持（中文、英文）
- 🔧 **可定制** - 灵活的列配置、布局调整等个性化设置

### 🚀 功能亮点

#### 种子管理
- ✅ 添加种子文件或磁力链接
- ✅ 暂停/继续/删除种子
- ✅ 修改种子优先级
- ✅ 更改下载路径
- ✅ 编辑种子标签
- ✅ 修改 Tracker 信息

#### 界面特性
- ✅ 可拖拽调整的侧边栏
- ✅ 自定义表格列显示
- ✅ 虚拟滚动优化大数据性能
- ✅ 右键上下文菜单
- ✅ 移动端长按操作支持

#### 数据展示
- ✅ 实时下载/上传速度
- ✅ 种子完成进度
- ✅ 连接用户数统计
- ✅ 错误状态提示
- ✅ 详细的种子信息

## 🌍 国际化支持

项目已完全支持国际化，目前支持以下语言：
- 🇨🇳 简体中文 (zh-CN) - 默认语言
- 🇺🇸 English (en-US) - 备用语言

### 语言切换
用户可以通过设置页面或语言切换器轻松切换界面语言，系统会自动记住用户的语言偏好。

## 🛠️ 技术栈

- **框架**: Vue 3 (Composition API) - 最新版本的渐进式 JavaScript 框架
- **语言**: TypeScript 5.8+ - 提供完整的类型安全和开发体验
- **构建工具**: Vite 7.0+ - 极速的前端构建工具
- **UI 组件库**: Naive UI 2.42+ - 完整的 Vue 3 组件库
- **样式方案**: Tailwind CSS 4.0 + UnoCSS + Less - 现代化的 CSS 解决方案
- **状态管理**: Pinia 3.0+ - Vue 官方推荐的状态管理库
- **路由**: Vue Router 4.5+ - Vue.js 官方路由管理器
- **HTTP 客户端**: Axios - 基于 Promise 的 HTTP 客户端
- **虚拟滚动**: Vue Virtual Scroller - 高性能大数据渲染解决方案
- **工具库**: VueUse, Day.js, Lodash - 实用的工具函数集合
- **移动端支持**: AnyTouch - 专业的触摸事件处理库
- **国际化**: Vue I18n - Vue.js 国际化插件

## 🐳 Docker 部署

项目提供了 Docker 支持，可以快速部署到任何支持 Docker 的环境。

### 构建镜像

```bash
docker build -t transmission-web .
```

### 运行容器

```bash
docker run -d -p 7632:7632 jianxcao/transmission-web
```

### 运行容器 docker-compose

```yaml
services:
  tr-web:
    image: jianxcao/transmission-web
    container_name: tr-web
    environment:
      - BACKEND_URL=http://192.168.50.23:9091
    ports:
      - "7632:7632"
    restart: unless-stopped
```

## 配置transmission docker 运行

- 下载 [release](https://github.com/jianxcao/transmission-web/releases) 页面下的压缩包 **transmission-web-*.zip**
- 解压内容到服务器的目录（tr 容器需可以访问该目录）
- 配置 env TRANSMISSION_WEB_HOME为解压的目录

## 界面预览

![面板](./docs/imgs/dashborad.png)
![移动端卡片](./docs/imgs/mobileCard.png)
![移动端面板](./docs/imgs/mobileDashborad.png)
![移动端菜单](./docs/imgs/mobileSiderbar.png)
![添加种子](./docs/imgs/add.png)

## 📦 安装与运行

### 环境要求

- Node.js >= 20.0.0 (推荐使用 LTS 版本)
- pnpm >= 10.0.0 (推荐包管理器)
- Git (用于克隆项目)

### 克隆项目

```bash
git clone https://github.com/jianxcao/transmission-web.git
cd transmission-web
```

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 开发环境运行

```bash
pnpm dev
```

访问 http://localhost:5173

### 生产环境构建

```bash
pnpm build
```

## 📁 项目结构

```
src/
├── api/              # API 接口
├── assets/           # 静态资源
├── components/       # 可复用组件
│   ├── AppHeader/    # 应用头部
│   ├── CanvasList/   # 画布列表 (主要列表组件)
│   ├── TorrentList/  # 种子列表
│   ├── SiderbarView/ # 侧边栏
│   └── dialog/       # 对话框组件
├── composables/      # 组合式函数
├── store/            # Pinia 状态管理
├── utils/            # 工具函数
├── views/            # 页面组件
└── types/            # TypeScript 类型定义
```

## 🤝 参与贡献

我们欢迎各种形式的贡献，包括但不限于：

- 🐛 Bug 报告 - 帮助我们发现问题并改进
- 💡 功能建议 - 分享你的想法和需求
- 📝 文档改进 - 完善项目文档和示例
- 🔧 代码贡献 - 提交 Pull Request 改进代码
- 🌍 国际化支持 - 添加更多语言支持
- 🎨 UI/UX 改进 - 优化用户界面和体验

### 开发规范

- 使用 Vue 3 Composition API 和 TypeScript
- 遵循 Vue.js 官方风格指南
- 使用 ESLint + Prettier 进行代码格式化
- 提交信息遵循 Conventional Commits 规范
- 确保代码通过所有测试和检查

### 快速开始

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 开源协议

本项目基于 [MIT](LICENSE) 协议开源，这意味着你可以自由使用、修改和分发这个项目。

## 🏆 项目亮点

- **🎯 专注用户体验** - 专为现代 Web 环境设计
- **🚀 技术领先** - 采用最新前端技术栈
- **📱 全平台支持** - 完美适配各种设备
- **⚡ 性能优异** - 虚拟滚动技术处理大数据
- **🔧 高度可定制** - 丰富的个性化选项
- **🌍 国际化支持** - 多语言界面支持

## 🙏 致谢

- [Transmission](https://transmissionbt.com/) - 优秀的 BitTorrent 客户端
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Naive UI](https://www.naiveui.com/) - 完整的 Vue 3 组件库
- [所有贡献者](https://github.com/jianxcao/transmission-web/contributors) - 感谢每一位贡献者

## 📞 联系方式

- 项目主页: https://github.com/jianxcao/transmission-web
- 问题反馈: https://github.com/jianxcao/transmission-web/issues
- 功能建议: https://github.com/jianxcao/transmission-web/discussions

---

<div align="center">
  如果这个项目对你有帮助，请给我们一个 ⭐ Star！
</div>
