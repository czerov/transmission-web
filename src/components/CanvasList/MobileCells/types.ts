import type { Torrent } from '@/api/rpc'
import type { ThemeCommonVars, CustomThemeCommonVars } from 'naive-ui'

export interface MobileCellRenderState {
  x: number
  y: number
  width: number
  height: number // 添加预计算的高度
}

export interface MobileCellProps {
  ctx: CanvasRenderingContext2D
  row: Torrent
  state: MobileCellRenderState
  theme: ThemeCommonVars & CustomThemeCommonVars
}

// 用于高度计算的函数类型
export type MobileCellHeightCalculator = (props: {
  row: Torrent
  width: number
  theme: ThemeCommonVars & CustomThemeCommonVars
}) => number

// 用于渲染的函数类型
export type MobileCellRenderer = (props: MobileCellProps) => void // 不再返回高度，高度已经预计算

// Cell组件定义，包含高度计算和渲染函数
export interface MobileCellComponent {
  name: string
  calculateHeight: MobileCellHeightCalculator
  render: MobileCellRenderer
}

// 移动端行的高度信息
export interface MobileRowHeightInfo {
  totalHeight: number
  cellHeights: number[] // 每个 Cell 的高度
}
