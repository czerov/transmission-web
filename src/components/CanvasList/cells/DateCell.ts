import type { Torrent } from '@/api/rpc'
import type { ColumnConfig } from '@/composables/useColumns'
import dayjs from 'dayjs'
import { drawText } from './utils'

export default function render(
  ctx: CanvasRenderingContext2D,
  row: Torrent,
  col: ColumnConfig,
  state: { x: number; y: number; rowHeight: number }
) {
  ctx.save()
  const value = Number(row[col.key as keyof Torrent])
  let d = dayjs(value * 1000).format('YYYY/MM/DD HH:mm:ss')
  if (d === 'Invalid Date' || value === 0) {
    d = ''
  }
  drawText(ctx, d, state.x + col.width / 2, state.y, col.width, state.rowHeight, 'center')
  ctx.restore()
}
