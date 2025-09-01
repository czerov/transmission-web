import type { MobileCellComponent, MobileCellHeightCalculator, MobileCellRenderer } from './types'
import { fitText, drawMultilineText, setTextStyle } from '../cells/utils'
import { MOBILE_CARD_MARGIN, MOBILE_CARD_PADDING, MOBILE_LINE_MARGIN } from '../store/mobileUtils'
import { useSettingStore } from '@/store/setting'

// 菜单按钮相关常量
export const MENU_BUTTON_SIZE = 24 // 菜单按钮的大小
export const MENU_BUTTON_MARGIN = 4 // 菜单按钮与文本的间距

// 高度计算函数
const calculateHeight: MobileCellHeightCalculator = ({ row, width, theme }) => {
  // 创建临时画布计算文本高度
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  ctx.font = `${parseInt(theme.fontSize) + 1}px ${theme.fontFamily}`
  // 计算可用文本宽度（减去菜单按钮占用的空间）
  const textWidth = width - MOBILE_CARD_MARGIN * 2 - MOBILE_CARD_PADDING * 2 - MENU_BUTTON_SIZE - MENU_BUTTON_MARGIN
  // 使用 fitText 的多行模式计算高度
  const settingStore = useSettingStore()
  const lineHeight = settingStore.lineHeight
  const lines = fitText(ctx, row.name, textWidth, lineHeight * 5, true) as string[]
  return lines.length * lineHeight + MOBILE_LINE_MARGIN
}

// 渲染函数
const render: MobileCellRenderer = ({ ctx, row, state, theme }) => {
  // 计算可用文本宽度（减去菜单按钮占用的空间）
  const textWidth = state.width - MENU_BUTTON_SIZE - MENU_BUTTON_MARGIN
  // 渲染文本
  setTextStyle(ctx, theme, parseInt(theme.fontSize) + 1)
  const lines = fitText(ctx, row.name, textWidth, state.height, true) as string[]
  if (typeof lines === 'string') {
    drawMultilineText(ctx, [lines], state.x, state.y, textWidth, state.height, 'start', 'top')
  } else {
    drawMultilineText(ctx, lines, state.x, state.y, textWidth, state.height, 'start', 'top')
  }

  // 渲染菜单按钮
  drawMenuButton(ctx, state.x + textWidth + MENU_BUTTON_MARGIN, state.y, MENU_BUTTON_SIZE, theme)
}

// 绘制菜单按钮（三个点的图标）
function drawMenuButton(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, theme: any) {
  const centerX = x + size / 2
  const centerY = y + size / 2
  const dotRadius = 2
  const dotSpacing = 6

  // 设置按钮样式
  ctx.fillStyle = theme.textColorTertiary

  // 绘制三个点（垂直排列）
  for (let i = 0; i < 3; i++) {
    const dotY = centerY - dotSpacing + i * dotSpacing
    ctx.beginPath()
    ctx.arc(centerX, dotY, dotRadius, 0, Math.PI * 2)
    ctx.fill()
  }
}

// 检测点击位置是否在菜单按钮区域内
export function isClickInMenuButton(clickX: number, clickY: number, clientWidth: number): boolean {
  return (
    // *2扩大点击范围
    clickX >= clientWidth - MENU_BUTTON_SIZE * 2 - MENU_BUTTON_MARGIN * 2 &&
    clickX <= clientWidth &&
    clickY >= 0 &&
    clickY <= MENU_BUTTON_SIZE * 2
  )
}

// 第一行：种子名称（超长则换行）
export const NameCell: MobileCellComponent = {
  name: 'NameCell',
  calculateHeight,
  render
}
