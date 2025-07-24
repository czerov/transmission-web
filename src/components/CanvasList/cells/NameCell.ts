import type { Torrent } from '@/api/rpc'
import type { ColumnConfig } from '@/composables/useColumns'
import type { CustomThemeCommonVars, ThemeCommonVars } from 'naive-ui'
import { drawIcon, drawText, fitText, getIconImg } from './utils'
import { useTableStore } from '../store/tableStore'
import { ICON_GAP, ICON_SIZE, PADDING_X } from '../store/utils'
// 图标路径常量
import dismissIconUrl from '@/assets/icons/dismissSquare.svg?raw'
import checkIconUrl from '@/assets/icons/checkSquareFilled.svg?raw'
import magnetIconUrl from '@/assets/icons/magnet1.svg?raw'
import clockIconUrl from '@/assets/icons/clock.svg?raw'
import caretDownCircleIconUrl from '@/assets/icons/CaretDownCircle.svg?raw'
import caretUpCircleIconUrl from '@/assets/icons/CaretUpCircle.svg?raw'

import pauseIconUrl from '@/assets/icons/pause.svg?raw'
import { useSettingStore } from '@/store'

function getIcon(name: string, color: string): HTMLImageElement | undefined {
  const ICONS: Record<string, string> = {
    dismiss: dismissIconUrl,
    check: checkIconUrl,
    magnet: magnetIconUrl,
    clock: clockIconUrl,
    caretDownCircle: caretDownCircleIconUrl,
    caretUpCircle: caretUpCircleIconUrl,
    pause: pauseIconUrl
  }
  const raw = ICONS[name]
  if (!raw) {
    return undefined
  }
  return getIconImg(raw, name, color)
}

function getStatusIcon(row: Torrent, theme: ThemeCommonVars & CustomThemeCommonVars) {
  // 错误优先
  if (row.error || row.cachedError) {
    return getIcon('dismiss', theme.errorColor)
  }
  // 磁力链接下载中
  if (row.status === 4 /* downloading */ && row.pieceCount === 0) {
    return getIcon('magnet', '#748ffc')
  }
  // 已完成
  if (row.status === 0 /* stopped */ && row.sizeWhenDone > 0 && row.leftUntilDone == 0) {
    return getIcon('check', '#888')
  }
  // 其它状态
  switch (row.status) {
    case 0: // stopped
      return getIcon('pause', '#888')
    case 4: // downloading
      return getIcon('CaretDownCircle', '#748ffc')
    case 6: // seeding
      return getIcon('caretUpCircle', '#10b981')
    case 2: // verifying
    case 1: // queuedToVerify
    case 3: // queuedToDownload
    case 5: // queuedToSeed
      return getIcon('clock', '#3bc9db')
    default:
      return undefined
  }
}

export default function render(
  ctx: CanvasRenderingContext2D,
  row: Torrent,
  col: ColumnConfig,
  state: { x: number; y: number; rowHeight: number }
) {
  const tableStore = useTableStore()
  const ellipsisTxtMap = tableStore.ellipsisTxtMap
  const settingStore = useSettingStore()
  const icon = getStatusIcon(row, settingStore.themeVars)
  const maxTextWidth = col.width - PADDING_X * 2 - (icon ? ICON_SIZE + ICON_GAP : 0)
  const value = ellipsisTxtMap.get(row.id)?.[col.key]?.fitTxt || String(row.name) || ''
  // 竖直居中
  const centerY = state.y + state.rowHeight / 2
  let textX = state.x + PADDING_X
  ctx.save()
  // 绘制图标
  if (icon) {
    drawIcon(ctx, icon, textX, centerY - ICON_SIZE / 2, ICON_SIZE)
    textX += ICON_SIZE + ICON_GAP
  }
  drawText(ctx, value, textX, state.y, maxTextWidth, state.rowHeight, 'start')
  ctx.restore()
}
