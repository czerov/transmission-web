import type { Torrent } from '@/api/rpc'
import type { ColumnConfig } from '@/composables/useColumns'
import { useTableStore } from '../store/tableStore'
import { PADDING_X } from '../store/utils'
import { drawText } from './utils'

export default function renderDefaultCell(
  ctx: CanvasRenderingContext2D,
  row: Torrent,
  col: ColumnConfig,
  state: { x: number; y: number; rowHeight: number }
) {
  ctx.save()
  let value: string | string[] = String(row[col.key as keyof Torrent]) || ''
  const tableStore = useTableStore()
  const ellipsisTxtMap = tableStore.ellipsisTxtMap
  const eVal = ellipsisTxtMap.get(row.id)?.[col.key]?.fitTxt
  if (eVal) {
    value = eVal
  }
  drawText(ctx, value, state.x + PADDING_X, state.y, col.width, state.rowHeight)
  ctx.restore()
}
