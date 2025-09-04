import type { Torrent } from '@/api/rpc'
import type { ColumnConfig } from '@/composables/useColumns'
import i18n from '@/i18n'
import { getStatusString, Status } from '@/types/tr'
import { drawText, getTextWidth } from './utils'
import { fitText } from './utils'
import { useSettingStore } from '@/store'
const getEllipsisTxt = (function () {
  const cache = new Map<string, string>()
  return function (txt: string, maxWidth: number, maxHeight: number) {
    const ctx = document.createElement('canvas').getContext('2d')!
    const settingStore = useSettingStore()
    const theme = settingStore.themeVars
    ctx.font = `${theme.fontSize} ${theme.fontFamily}`
    if (cache.has(txt)) {
      return cache.get(txt) as string
    }
    const text = fitText(ctx, txt, maxWidth, maxHeight, false) as string
    cache.set(txt, text)
    return text
  }
})()

export default function render(
  ctx: CanvasRenderingContext2D,
  row: Torrent,
  col: ColumnConfig,
  state: { x: number; y: number; rowHeight: number }
) {
  ctx.save()
  const t = i18n.global.t
  let statusStr = ''
  if (row.status === Status.downloading && row.pieceCount === 0) {
    statusStr = t('status.getMeta')
  }
  // sequentialDownload这个字段在 get_torrents 中没有找到，逻辑先保留，可能只有顺序下载的时候才会返回
  if (row.status === Status.downloading && row.sequentialDownload === true) {
    statusStr = t('status.sequential')
  }
  statusStr = getStatusString(row.status)
  const fitTxt = getEllipsisTxt(statusStr, col.width, state.rowHeight)
  drawText(ctx, fitTxt, state.x + col.width / 2, state.y, col.width, state.rowHeight, 'center')
  ctx.restore()
}
