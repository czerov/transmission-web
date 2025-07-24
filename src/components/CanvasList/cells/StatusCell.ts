import type { Torrent } from '@/api/rpc'
import type { ColumnConfig } from '@/composables/useColumns'
import { Status, StatusStrings } from '@/types/tr'
import { drawText } from './utils'

export default function render(
  ctx: CanvasRenderingContext2D,
  row: Torrent,
  col: ColumnConfig,
  state: { x: number; y: number; rowHeight: number }
) {
  ctx.save()

  const value = String(row[col.key as keyof Torrent]) || ''
  let statusStr = ''
  if (row.status === Status.downloading && row.pieceCount === 0) {
    statusStr = '获取元数据'
  }
  // sequentialDownload这个字段在 get_torrents 中没有找到，逻辑先保留，可能只有顺序下载的时候才会返回
  if (row.status === Status.downloading && row.sequentialDownload === true) {
    statusStr = '顺序下载'
  }
  statusStr = StatusStrings[row.status]
  drawText(ctx, statusStr, state.x + col.width / 2, state.y, col.width, state.rowHeight, 'center')
  ctx.restore()
}
