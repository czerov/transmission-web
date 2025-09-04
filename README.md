# Transmission Web

<div align="center">
  <img src="public/transmission.svg" alt="Transmission Web" width="120" height="120">

  <h3>🚀 Modern Transmission BitTorrent Client Web Interface</h3>

  <p>High-performance BitTorrent management interface built with Vue 3 + TypeScript</p>

  <div style="margin: 20px 0;">
    <a href="README.zh-CN.md" style="text-decoration: none; padding: 8px 16px; background: #0366d6; color: white; border-radius: 6px; margin-right: 10px;">🇨🇳 中文</a>
    <span style="padding: 8px 16px; background: #28a745; color: white; border-radius: 6px;">🇺🇸 English</span>
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

## 📖 Project Description

Transmission Web is a modern Transmission BitTorrent client web interface, redesigned and developed using the latest frontend technology stack. It provides a clean and beautiful user interface, rich feature set, and excellent user experience.

### 🌟 Why Choose Transmission Web?

- **🎯 User Experience Focused** - BitTorrent management interface designed for modern web environments
- **🚀 Technologically Advanced** - Built with Vue 3 + TypeScript latest technology stack
- **📱 Cross-Platform Support** - Perfectly adapted for desktop, tablet, and mobile devices
- **⚡ High Performance** - Virtual scrolling technology to easily handle tens of thousands of torrents
- **🔧 Highly Customizable** - Support for theme switching, layout adjustments, column configuration, etc.
- **🌍 Internationalization** - Multi-language interface, user-friendly for global users

### ✨ Key Features

- 🎨 **Modern Interface** - Based on Naive UI design system with light/dark theme support
- 📱 **Responsive Design** - Perfectly adapted for desktop and mobile devices
- ⚡ **High Performance** - (Canvas) Virtual scrolling technology to easily handle large torrent lists
- 🔍 **Smart Filtering** - Multi-dimensional filtering by status, labels, sites, error states, etc.
- 📊 **Data Visualization** - Rich progress bars, statistical charts, and status indicators
- 🎯 **Convenient Operations** - Support for batch operations, drag-and-drop sorting, keyboard shortcuts, etc.
- 🌐 **Internationalization** - Multi-language support (Chinese, English)
- 🔧 **Customizable** - Flexible column configuration, layout adjustments, and other personalization options

### 🚀 Feature Highlights

#### Torrent Management
- ✅ Add torrent files or magnet links
- ✅ Pause/resume/delete torrents
- ✅ Modify torrent priority
- ✅ Change download path
- ✅ Edit torrent labels
- ✅ Modify Tracker information

#### Interface Features
- ✅ Draggable adjustable sidebar
- ✅ Customizable table column display
- ✅ Virtual scrolling for large data performance optimization
- ✅ Right-click context menu
- ✅ Mobile long-press operation support

#### Data Display
- ✅ Real-time download/upload speed
- ✅ Torrent completion progress
- ✅ Connected user count statistics
- ✅ Error status indicators
- ✅ Detailed torrent information

## 🌍 Internationalization Support

The project fully supports internationalization and currently supports the following languages:
- 🇨🇳 Simplified Chinese (zh-CN) - Available
- 🇺🇸 English (en-US) - Default language

### Language Switching
Users can easily switch interface languages through the settings page or language switcher, and the system will automatically remember user language preferences.

## 🛠️ Technology Stack

- **Framework**: Vue 3 (Composition API) - Latest version of progressive JavaScript framework
- **Language**: TypeScript 5.8+ - Complete type safety and development experience
- **Build Tool**: Vite 7.0+ - Lightning-fast frontend build tool
- **UI Component Library**: Naive UI 2.42+ - Complete Vue 3 component library
- **Styling Solution**: Tailwind CSS 4.0 + UnoCSS + Less - Modern CSS solution
- **State Management**: Pinia 3.0+ - Vue officially recommended state management library
- **Routing**: Vue Router 4.5+ - Vue.js official router manager
- **HTTP Client**: Axios - Promise-based HTTP client
- **Virtual Scrolling**: Vue Virtual Scroller - High-performance large data rendering solution
- **Utility Libraries**: VueUse, Day.js, Lodash - Practical utility function collections
- **Mobile Support**: AnyTouch - Professional touch event handling library
- **Internationalization**: Vue I18n - Vue.js internationalization plugin

## 🐳 Docker Deployment

The project provides Docker support and can be quickly deployed to any Docker-compatible environment.

### Build Image

```bash
docker build -t transmission-web .
```

### Run Container

```bash
docker run -d -p 7632:7632 jianxcao/transmission-web
```

### Run Container with Docker Compose

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

## Configure Transmission Docker

- Download the **transmission-web-*.zip** package from the [release](https://github.com/jianxcao/transmission-web/releases) page
- Extract the contents to a server directory (tr container needs access to this directory)
- Configure env TRANSMISSION_WEB_HOME to the extracted directory

## Interface Preview

![Dashboard](./docs/imgs/dashborad.png)
![Mobile Card](./docs/imgs/mobileCard.png)
![Mobile Dashboard](./docs/imgs/mobileDashborad.png)
![Mobile Sidebar](./docs/imgs/mobileSiderbar.png)
![Add Torrent](./docs/imgs/add.png)

## 📦 Installation and Running

### Requirements

- Node.js >= 20.0.0 (LTS version recommended)
- pnpm >= 10.0.0 (recommended package manager)
- Git (for cloning the project)

### Clone Project

```bash
git clone https://github.com/jianxcao/transmission-web.git
cd transmission-web
```

### Install Dependencies

```bash
# Use pnpm (recommended)
pnpm install

# Or use npm
npm install

# Or use yarn
yarn install
```

### Development Environment

```bash
pnpm dev
```

Visit: http://localhost:5173

### Production Build

```bash
pnpm build
```

## 📁 Project Structure

```
src/
├── api/              # API interfaces
├── assets/           # Static assets
├── components/       # Reusable components
│   ├── AppHeader/    # App header
│   ├── CanvasList/   # Canvas list (main list component)
│   ├── TorrentList/  # Torrent list
│   ├── SiderbarView/ # Sidebar
│   └── dialog/       # Dialog components
├── composables/      # Composables
├── store/            # Pinia state management
├── utils/            # Utility functions
├── views/            # Page components
└── types/            # TypeScript type definitions
```

## 🤝 Contributing

We welcome contributions in various forms, including but not limited to:

- 🐛 Bug Reports - Help us find and fix issues
- 💡 Feature Suggestions - Share your ideas and needs
- 📝 Documentation Improvements - Improve project documentation and examples
- 🔧 Code Contributions - Submit Pull Requests to improve code
- 🌍 Internationalization Support - Add support for more languages
- 🎨 UI/UX Improvements - Optimize user interface and experience

### Development Standards

- Use Vue 3 Composition API and TypeScript
- Follow Vue.js official style guide
- Use ESLint + Prettier for code formatting
- Commit messages follow Conventional Commits specification
- Ensure code passes all tests and checks

### Quick Start

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source under the [MIT](LICENSE) license, which means you can freely use, modify, and distribute this project.

## 🏆 Project Highlights

- **🎯 User Experience Focused** - Designed for modern web environments
- **🚀 Technologically Advanced** - Adopts latest frontend technology stack
- **📱 Cross-Platform Support** - Perfectly adapted for various devices
- **⚡ High Performance** - Virtual scrolling technology for big data processing
- **🔧 Highly Customizable** - Rich personalization options
- **🌍 Internationalization Support** - Multi-language interface support

## 🙏 Acknowledgments

- [Transmission](https://transmissionbt.com/) - Excellent BitTorrent client
- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Naive UI](https://www.naiveui.com/) - Complete Vue 3 component library
- [All Contributors](https://github.com/jianxcao/transmission-web/contributors) - Thanks to every contributor

## 📞 Contact

- Project Homepage: https://github.com/jianxcao/transmission-web
- Issue Reports: https://github.com/jianxcao/transmission-web/issues
- Feature Suggestions: https://github.com/jianxcao/transmission-web/discussions

---

<div align="center">
  If this project helps you, please give us a ⭐ Star!
</div>
