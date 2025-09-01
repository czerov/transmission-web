// 移动端 Cell 组件索引
// 导入所有组件
import { NameCell } from './NameCell'
import { UploadInfoCell } from './UploadInfoCell'
import { DownloadInfoCell } from './DownloadInfoCell'
import { ProgressStatusCell } from './ProgressStatusCell'
import { DateInfoCell } from './DateInfoCell'
import type { MobileCellComponent } from './types'

// 重新导出组件
export { NameCell, UploadInfoCell, DownloadInfoCell, ProgressStatusCell, DateInfoCell }

// 导出类型
export type {
  MobileCellComponent,
  MobileCellRenderer,
  MobileCellHeightCalculator,
  MobileCellProps,
  MobileCellRenderState,
  MobileRowHeightInfo
} from './types'

// 定义默认的 Cell 渲染顺序
export const DEFAULT_MOBILE_CELLS: MobileCellComponent[] = [
  NameCell,
  UploadInfoCell,
  DownloadInfoCell,
  ProgressStatusCell,
  DateInfoCell
]
