import type { MobileCellComponent, MobileCellHeightCalculator, MobileCellRenderer } from './types'
import { setTextStyle } from '../cells/utils'
import dayjs from 'dayjs'
import { useSettingStore } from '@/store/setting'
import { MOBILE_LINE_MARGIN } from '../store/mobileUtils'

// 格式化日期
function formatDate(timestamp?: number): string {
  if (!timestamp) {
    return ''
  }
  try {
    const d = dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')
    return d === 'Invalid Date' ? '' : d
  } catch {
    return ''
  }
}

// 高度计算函数（固定高度）
const calculateHeight: MobileCellHeightCalculator = () => {
  const settingStore = useSettingStore()
  return settingStore.lineHeight + MOBILE_LINE_MARGIN
}

// 渲染函数
const render: MobileCellRenderer = ({ ctx, row, state, theme }) => {
  setTextStyle(ctx, theme, parseInt(theme.fontSizeMedium), theme.textColor3)
  const addedDate = formatDate(row.addedDate) || '-'
  const activityDate = formatDate(row.activityDate) || '-'
  // 绘制左边的日期（添加日期）- 左对齐
  ctx.textAlign = 'left'
  ctx.fillText(addedDate, state.x, state.y)

  // 绘制右边的日期（活动日期）- 右对齐
  ctx.textAlign = 'right'
  ctx.fillText(activityDate, state.x + state.width, state.y)

  // 恢复默认的文本对齐方式
  ctx.textAlign = 'left'
}

// 第五行：日期信息（种子的创建日期和最后活动日期）
export const DateInfoCell: MobileCellComponent = {
  name: 'DateInfoCell',
  calculateHeight,
  render
}
