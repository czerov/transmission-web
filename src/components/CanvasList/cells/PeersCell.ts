import type { Torrent } from '@/api/rpc'
import type { ColumnConfig } from '@/composables/useColumns'
import { PADDING_X } from '../store/utils'
import { drawText } from './utils'

export default function render(
  ctx: CanvasRenderingContext2D,
  row: Torrent,
  col: ColumnConfig,
  state: { x: number; y: number; rowHeight: number }
) {
  ctx.save()
  const getting = row.peersGettingFromUs
  const totalPeers = row.cachedPeersTotal
  const text = totalPeers < 0 ? `${getting}` : `${totalPeers} (${getting})`
  drawText(ctx, text, state.x + col.width - PADDING_X, state.y, col.width, state.rowHeight, 'end')
  ctx.restore()
}
