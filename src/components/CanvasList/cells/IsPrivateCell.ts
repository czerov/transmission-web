import type { Torrent } from '@/api/rpc'
import type { ColumnConfig } from '@/composables/useColumns'
import { drawText } from './utils'
import i18n from '@/i18n'

export default function render(
  ctx: CanvasRenderingContext2D,
  row: Torrent,
  col: ColumnConfig,
  state: { x: number; y: number; rowHeight: number }
) {
  ctx.save()
  const t = i18n.global.t
  const value = row[col.key as keyof Torrent]
  const text = value ? t('common.yes') : t('common.no')
  drawText(ctx, text, state.x + col.width / 2, state.y, col.width, state.rowHeight, 'center')
  ctx.restore()
}
