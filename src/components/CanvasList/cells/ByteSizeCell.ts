import type { Torrent } from '@/api/rpc'
import type { ColumnConfig } from '@/composables/useColumns'
import { formatSize } from '@/utils/index'
import { PADDING_X } from '../store/utils'
import { drawText } from './utils'

export default function render(
  ctx: CanvasRenderingContext2D,
  row: Torrent,
  col: ColumnConfig,
  state: { x: number; y: number; rowHeight: number }
) {
  ctx.save()
  const value = String(row[col.key as keyof Torrent]) || ''
  const size = formatSize(Number(value)) || ''
  drawText(ctx, size, state.x + col.width - PADDING_X, state.y, col.width, state.rowHeight, 'end')
  ctx.restore()
}
