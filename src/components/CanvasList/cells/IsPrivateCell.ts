import type { Torrent } from '@/api/rpc'
import type { ColumnConfig } from '@/composables/useColumns'
import { drawText } from './utils'

export default function render(
  ctx: CanvasRenderingContext2D,
  row: Torrent,
  col: ColumnConfig,
  state: { x: number; y: number; rowHeight: number }
) {
  ctx.save()
  const value = row[col.key as keyof Torrent]
  const text = value ? '是' : '否'
  drawText(ctx, text, state.x + col.width / 2, state.y, col.width, state.rowHeight, 'center')
  ctx.restore()
}
