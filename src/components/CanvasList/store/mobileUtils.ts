import type { Torrent } from '@/api/rpc'
import type { CustomThemeCommonVars, ThemeCommonVars } from 'naive-ui'
import { DEFAULT_MOBILE_CELLS } from '../MobileCells'
import type { MobileRowHeightInfo } from '../MobileCells'

// 移动端卡片常量
export const MOBILE_CARD_MIN_HEIGHT = 120 // 最小卡片高度
export const MOBILE_CARD_MARGIN = 4
export const MOBILE_CARD_PADDING = 4
export const MOBILE_PROGRESS_HEIGHT = 14 // 进度条高度
export const MOBILE_LINE_MARGIN = 4 // 行间距

// 移动端动态计算卡片高度和每个Cell的高度
export const calculateMobileRowHeightInfo = (
  row: Torrent,
  columnWidth: number,
  theme: ThemeCommonVars & CustomThemeCommonVars
): MobileRowHeightInfo => {
  let totalHeight = 0
  const cellHeights: number[] = []
  // 遍历所有 Cell 组件计算高度
  for (const cellComponent of DEFAULT_MOBILE_CELLS) {
    // 计算出的 height 包括 padding 和 margin
    const cellHeight = cellComponent.calculateHeight({ row, width: columnWidth, theme })
    cellHeights.push(cellHeight)
    totalHeight += cellHeight
  }
  const finalHeight = Math.max(MOBILE_CARD_MIN_HEIGHT, totalHeight) + MOBILE_CARD_MARGIN * 2
  return {
    totalHeight: finalHeight,
    cellHeights
  }
}
