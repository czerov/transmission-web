import type { Torrent } from '@/api/rpc'
import type { ColumnConfig } from '@/composables/useColumns'
import { PADDING_X } from '../store/utils'
import { roundRect } from './utils'
import { useSettingStore } from '@/store'
import { getPriorityString, type PriorityNumberType } from '@/types/tr'

export default function renderBandwidthPriorityCell(
  ctx: CanvasRenderingContext2D,
  row: Torrent,
  col: ColumnConfig,
  state: { x: number; y: number; rowHeight: number }
) {
  ctx.save()
  const settingStore = useSettingStore()
  const value = row.bandwidthPriority
  const tagSize = 50
  const { x, y, rowHeight } = state
  const width = col.width - PADDING_X * 2
  const height = Math.min(22, rowHeight - 4)
  const radius = height / 2
  const xx = x + PADDING_X + (width - tagSize) / 2
  const yy = y + (rowHeight - height) / 2
  const theme = settingStore.themeVars

  let color = theme.successColor
  if (value === 0) {
    color = theme.successColor
  } else if (value === -1) {
    color = theme.warningColor
  } else {
    color = theme.errorColor
  }
  ctx.beginPath()
  roundRect(ctx, xx, yy, tagSize, height, radius)
  ctx.fillStyle = `color-mix(in srgb, ${color} 20%, transparent)`
  ctx.fill()

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = color
  ctx.font = `12px ${theme.fontFamily}`
  ctx.fillText(getPriorityString(value as PriorityNumberType) || '', x + PADDING_X + width / 2, y + rowHeight / 2)
  ctx.restore()
}
