import type { MobileCellComponent, MobileCellHeightCalculator, MobileCellRenderer } from './types'
import { setTextStyle } from '../cells/utils'
import { formatSpeed, formatSize } from '@/utils'
import { MOBILE_LINE_MARGIN } from '../store/mobileUtils'
import { useSettingStore } from '@/store/setting'
import type { Torrent } from '@/api/rpc'

// 获取分享率
function getShareRatio(row: Torrent): string {
  const value = row.uploadRatio
  let val: string | number = Number(value)
  if (isNaN(val) || val < 0) {
    val = ''
  } else {
    val = val.toFixed(2).toString()
  }
  return val
}

// 高度计算函数（固定高度）
const calculateHeight: MobileCellHeightCalculator = () => {
  const settingStore = useSettingStore()
  return settingStore.lineHeightMini + MOBILE_LINE_MARGIN * 2
}

// 渲染函数
const render: MobileCellRenderer = ({ ctx, row, state, theme }) => {
  setTextStyle(ctx, theme, parseInt(theme.fontSizeMini), theme.textColor3)

  const uploadSpeed = formatSpeed(row.rateUpload || 0)
  const uploadedSize = formatSize(row.uploadedEver || 0)
  const shareRatio = getShareRatio(row)

  // 定义每个字段的宽度百分比
  const iconWidthPercent = 0.05
  const speedWidthPercent = 0.3
  const sizeWidthPercent = 0.3
  // const shareRatioWidthPercent = 0.35

  const totalWidth = state.width

  // 计算每个字段的实际宽度和位置
  const iconWidth = totalWidth * iconWidthPercent
  const speedWidth = totalWidth * speedWidthPercent
  const sizeWidth = totalWidth * sizeWidthPercent
  // const shareRatioWidth = totalWidth * shareRatioWidthPercent

  // 计算每个字段的右边界位置
  const speedRightX = state.x + iconWidth + speedWidth
  const sizeRightX = state.x + iconWidth + speedWidth + sizeWidth
  const shareRatioRightX = state.x + totalWidth

  // 设置文本左对齐绘制图标
  ctx.textAlign = 'start'
  // 第一部分：图标（左对齐显示）
  ctx.fillText('↑', state.x, state.y)

  // 设置文本右对齐
  ctx.textAlign = 'right'

  // 第二部分：速度（居右显示）
  ctx.fillText(uploadSpeed, speedRightX, state.y)

  // 第三部分：上传大小（居右显示）
  ctx.fillText(uploadedSize, sizeRightX, state.y)

  // 第四部分：分享率（居右显示）
  ctx.fillText(shareRatio, shareRatioRightX, state.y)

  // 恢复默认的文本对齐方式
  ctx.textAlign = 'start'
}

// 第二行：上传信息（当前上传速度、当前上传大小、分享率）
export const UploadInfoCell: MobileCellComponent = {
  name: 'UploadInfoCell',
  calculateHeight,
  render
}
