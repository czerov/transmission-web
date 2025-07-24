import type { Torrent } from '@/api/rpc'
import type { CustomThemeCommonVars, ThemeCommonVars } from 'naive-ui'

export const ITEM_HEIGHT = 32
export const HEADER_HEIGHT = 32
export const PADDING_X = 12
export const ICON_SIZE = 18
export const ICON_GAP = 4

// Tag 相关常量
export const TAG_HEIGHT = 20
export const TAG_PADDING = 6
export const TAG_MARGIN = 4
export const TAG_LINE_HEIGHT = TAG_HEIGHT + TAG_MARGIN

const canvas = document.createElement('canvas')
const cacheTagWidthMap = new Map<string, number>()

// 带缓存的计算标签宽度
export const calculateTagWidth = (tag: string, theme: ThemeCommonVars & CustomThemeCommonVars) => {
  const cacheData = cacheTagWidthMap.get(tag)
  if (cacheData) {
    return cacheData
  }
  const ctx = canvas.getContext('2d')!
  ctx.reset()
  ctx.font = `${theme.fontSize} ${theme.fontFamily}`
  const tagWidth = ctx.measureText(tag).width + TAG_PADDING * 2 + TAG_MARGIN
  cacheTagWidthMap.set(tag, tagWidth)
  return tagWidth
}

// 根据 labels 计算行高
export const calculateRowHeight = (
  row: Torrent,
  columnWidth: number,
  theme: ThemeCommonVars & CustomThemeCommonVars
) => {
  const labels = row.labels || []
  if (!labels || labels.length === 0) {
    return ITEM_HEIGHT
  }
  let currentLineWidth = 0
  let lines = 1
  const labelsWidth = columnWidth - PADDING_X * 2
  for (const label of row.labels) {
    const tagWidth = calculateTagWidth(label, theme)

    if (currentLineWidth + tagWidth > labelsWidth) {
      // 需要换行
      lines++
      currentLineWidth = tagWidth
    } else {
      currentLineWidth += tagWidth
    }
  }

  const labelsHeight = lines * TAG_LINE_HEIGHT + PADDING_X
  return Math.max(ITEM_HEIGHT, labelsHeight)
}
