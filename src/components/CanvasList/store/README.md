# CanvasList Store 架构

## 概述

CanvasList 的状态管理已经重构为分离的架构，支持移动端卡片视图和桌面端表格视图。

## 文件结构

```
store/
├── README.md              # 本文档
├── useVirtualList.ts      # 虚拟列表通用 Hook
├── useCommonViewport.ts   # 通用视口管理 Hook
├── cardStore.ts           # 移动端卡片 Store
├── tableStore.ts          # 桌面端表格 Store
├── mobileUtils.ts         # 移动端工具函数
└── utils.ts               # 通用工具函数
```

## 架构设计

### 公共层

#### `useVirtualList.ts`
提供虚拟列表的基础功能：
- 滚动状态管理 (`scrollTop`, `scrollLeft`)
- 客户端尺寸管理 (`clientHeight`, `clientWidth`)
- 缓冲区设置 (`bufferSize`, `bufferColumnSize`)
- 可视区域计算函数 (`findVisibleStart`, `findVisibleEnd`)

#### `useCommonViewport.ts`
提供视口管理的通用逻辑：
- 可视区域状态 (`visibleStart`, `visibleEnd`, `renderStartIdx`, `renderEndIdx`)
- 行视口更新 (`updateRowViewport`)
- 列视口更新 (`updateColumnViewport` - 主要用于桌面端)

### 业务层

#### `cardStore.ts` - 移动端卡片 Store
专门处理移动端卡片视图：
- **缓存**: `cacheRowHeightsMobile` - 卡片高度缓存
- **高度计算**: 基于 `calculateMobileRowHeightInfo` 计算卡片高度
- **特有功能**: `getMobileRowCellHeights` - 获取卡片内 Cell 高度信息
- **滚动高度**: 不包含 Header 高度（移动端无表头）

#### `tableStore.ts` - 桌面端表格 Store
专门处理桌面端表格视图：
- **缓存**: `cacheRowHeights` - 表格行高度缓存
- **文本处理**: `ellipsisTxtMap` - 文本溢出缓存
- **高度计算**: 基于 `calculateRowHeight` 计算表格行高度
- **列管理**: 支持水平滚动和列可视区域计算
- **滚动高度**: 包含 Header 高度

## 使用方式

### 移动端组件
```typescript
// CanvasMobileList.vue & CanvasTableMobileBody.vue
import { useCardStore } from './store/cardStore'

const cardStore = useCardStore()
// 使用 cardStore.xxx
```

### 桌面端组件
```typescript
// CanvasList.vue & CanvasTableBody.vue
import { useTableStore } from './store/tableStore'

const tableStore = useTableStore()
// 使用 tableStore.xxx
```

## 迁移指南

### 从原 tableStore 迁移

#### 移动端组件
- 将 `useTableStore` 改为 `useCardStore`
- 所有 `tableStore` 引用改为 `cardStore`

#### 桌面端组件
- 保持使用 `useTableStore`（新的精简版本）
- API 保持不变，但内部实现已优化

## 优势

1. **职责分离**: 移动端和桌面端逻辑完全分离
2. **代码复用**: 公共逻辑通过 Hooks 复用
3. **易于维护**: 每个 Store 专注于特定平台
4. **性能优化**: 避免不必要的计算和缓存冲突
5. **类型安全**: 更好的 TypeScript 支持
