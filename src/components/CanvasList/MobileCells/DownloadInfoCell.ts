import type { MobileCellComponent, MobileCellHeightCalculator, MobileCellRenderer } from './types'
import { setTextStyle } from '../cells/utils'
import { formatSpeed, formatSize } from '@/utils'
import { MOBILE_LINE_MARGIN } from '../store/mobileUtils'
import { useSettingStore } from '@/store/setting'

// 高度计算函数（固定高度）
const calculateHeight: MobileCellHeightCalculator = () => {
  const settingStore = useSettingStore()
  return settingStore.lineHeightMini + MOBILE_LINE_MARGIN * 2
}

// 渲染函数
const render: MobileCellRenderer = ({ ctx, row, state, theme }) => {
  setTextStyle(ctx, theme, parseInt(theme.fontSizeMini), theme.textColor3)

  const downloadSpeed = formatSpeed(row.rateDownload || 0)
  const downloadedSize = formatSize(row.downloadedEver || 0)
  const selectedSize = formatSize(row.sizeWhenDone || 0)

  // 定义每个字段的宽度百分比
  const iconWidthPercent = 0.05
  const speedWidthPercent = 0.3
  const sizeWidthPercent = 0.3
  const selectedWidthPercent = 0.35

  const totalWidth = state.width

  // 计算每个字段的实际宽度和位置
  const iconWidth = totalWidth * iconWidthPercent
  const speedWidth = totalWidth * speedWidthPercent
  const sizeWidth = totalWidth * sizeWidthPercent
  const selectedWidth = totalWidth * selectedWidthPercent

  // 计算每个字段的右边界位置
  // const iconRightX = state.x + iconWidth
  const speedRightX = state.x + iconWidth + speedWidth
  const sizeRightX = state.x + iconWidth + speedWidth + sizeWidth
  const selectedRightX = state.x + totalWidth
  // 设置文本右对齐
  ctx.textAlign = 'start'
  // 第一部分：图标（居右显示）
  ctx.fillText('↓', state.x, state.y)
  // 设置文本右对齐
  ctx.textAlign = 'right'

  // 第二部分：速度（居右显示）
  ctx.fillText(downloadSpeed, speedRightX, state.y)

  // 第三部分：下载大小（居右显示）
  ctx.fillText(downloadedSize, sizeRightX, state.y)

  // 第四部分：选中大小（居右显示）
  ctx.fillText(`${selectedSize}`, selectedRightX, state.y)

  // 恢复默认的文本对齐方式
  ctx.textAlign = 'start'
}

// 第三行：下载信息（当前下载速度、当前下载大小、选中大小）
export const DownloadInfoCell: MobileCellComponent = {
  name: 'DownloadInfoCell',
  calculateHeight,
  render
}
