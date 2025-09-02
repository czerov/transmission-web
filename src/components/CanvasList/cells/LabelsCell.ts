import type { Torrent } from '@/api/rpc'
import type { ColumnConfig } from '@/composables/useColumns'
import { PADDING_X, TAG_HEIGHT, TAG_PADDING, TAG_MARGIN, TAG_LINE_HEIGHT } from '../store/utils'
import { drawText, roundRect } from './utils'
import { useSettingStore } from '@/store'
import { useTableStore } from '../store/tableStore'

// 绘制圆角矩形
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

export default function renderLabelsCell(
  ctx: CanvasRenderingContext2D,
  row: Torrent,
  col: ColumnConfig,
  state: { x: number; y: number; rowHeight: number }
) {
  ctx.save()

  if (!row.labels || row.labels.length === 0) {
    ctx.restore()
    return
  }
  const settingStore = useSettingStore()
  const tableStore = useTableStore()
  const singleLine = settingStore.setting.singleLine
  if (singleLine) {
    let value = row.labels.join(',')
    const ellipsisTxtMap = tableStore.ellipsisTxtMap
    const eVal = ellipsisTxtMap.get(row.id)?.[col.key]?.fitTxt
    if (eVal) {
      value = eVal as string
    }
    drawText(ctx, value, state.x + PADDING_X, state.y, col.width, state.rowHeight)
    ctx.restore()
    return
  }

  const cellX = state.x + PADDING_X
  const cellY = state.y + PADDING_X / 2
  const cellWidth = col.width - PADDING_X * 2

  let currentX = 0
  let currentY = 0

  // 设置字体
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  const themeVars = settingStore.themeVars
  for (const label of row.labels) {
    // 测量文本宽度
    const textWidth = ctx.measureText(label).width
    const tagWidth = textWidth + TAG_PADDING * 2

    // 检查是否需要换行
    if (currentX + tagWidth > cellWidth && currentX > 0) {
      currentX = 0
      currentY += TAG_LINE_HEIGHT
    }

    // 确保不超出行高度
    if (currentY + TAG_HEIGHT > state.rowHeight - PADDING_X) {
      break
    }

    const tagX = cellX + currentX
    const tagY = cellY + currentY

    // 绘制标签背景
    ctx.fillStyle = `color-mix(in srgb, ${themeVars.successColor} 15%, transparent)`
    roundRect(ctx, tagX, tagY, tagWidth, TAG_HEIGHT, TAG_HEIGHT / 2)
    ctx.fill()

    // 绘制标签边框
    ctx.strokeStyle = themeVars.successColor
    ctx.lineWidth = 1
    roundRect(ctx, tagX, tagY, tagWidth, TAG_HEIGHT, TAG_HEIGHT / 2)
    ctx.stroke()

    // 绘制标签文本
    ctx.fillStyle = themeVars.successColor
    ctx.fillText(label, tagX + TAG_PADDING, tagY + TAG_HEIGHT / 2)

    // 更新位置
    currentX += tagWidth + TAG_MARGIN
  }

  ctx.restore()
}
