import {
  Pause as PauseIcon,
  CaretDownCircle,
  CaretUpCircle,
  Magnet,
  CheckmarkSharp,
  SyncOutline,
  CaretForwardCircle,
  // Shuffle,
  SnowOutline,
  SwapVertical
} from '@vicons/ionicons5'
import ClockIcon from '@/assets/icons/clock.svg?component'
import { Status } from '@/types/tr'
import type { Torrent } from '@/api/rpc'
import DismissSquareIcon from '@/assets/icons/dismissSquare.svg?component'

export const statusIconMap: Record<number, { icon: any; color: string }> = {
  [Status.stopped]: {
    icon: PauseIcon,
    color: '#888'
  },
  [Status.downloading]: {
    icon: CaretDownCircle,
    color: '#748ffc'
  },
  [Status.seeding]: {
    icon: CaretUpCircle,
    color: '#10b981'
  },
  [Status.verifying]: {
    icon: ClockIcon,
    color: '#3bc9db'
  },
  [Status.queuedToDownload]: {
    icon: ClockIcon,
    color: '#3bc9db'
  },
  [Status.queuedToSeed]: {
    icon: ClockIcon,
    color: '#3bc9db'
  },
  [Status.queuedToVerify]: {
    icon: ClockIcon,
    color: '#3bc9db'
  }
}

export const statusFilters = [
  {
    name: '下载中',
    filter: (t: Torrent) => t.status === Status.downloading,
    icon: CaretDownCircle,
    color: '#748ffc'
  },
  {
    name: '已暂停',
    filter: (t: Torrent) => t.status === Status.stopped,
    icon: PauseIcon,
    color: '#888'
  },
  {
    name: '已完成',
    filter: (t: Torrent) => {
      return t.status === Status.seeding || (t.sizeWhenDone > 0 && Math.max(t.sizeWhenDone - t.haveValid, 0) === 0)
    },
    icon: CheckmarkSharp,
    color: '#10b981'
  },
  {
    name: '正在校验',
    filter: (t: Torrent) =>
      ([Status.verifying, Status.queuedToVerify, Status.queuedToDownload] as Number[]).includes(t.status),
    icon: SyncOutline,
    color: '#3bc9db'
  },
  {
    name: '活动中',
    filter: (t: Torrent) => {
      return t.rateDownload > 0 || t.rateUpload > 0
    },
    icon: SwapVertical,
    color: '#10b981'
  },
  {
    name: '未活动',
    filter: (t: Torrent) => {
      return t.rateDownload === 0 && t.rateUpload === 0 && t.status !== Status.stopped
    },
    icon: SnowOutline,
    color: '#A3A3A3'
  },
  {
    name: '工作中',
    filter: (t: Torrent) => t.status !== Status.stopped,
    icon: CaretForwardCircle,
    color: '#10b981'
  },
  {
    name: '错误',
    filter: (t: Torrent) => t.error !== 0 || t.cachedError !== '',
    icon: DismissSquareIcon,
    color: 'var(--error-color)'
  },
  {
    name: '磁力链接',
    filter: (t: Torrent) => t.status === Status.downloading && t.pieceCount === 0,
    icon: Magnet,
    color: '#ff8c00'
  }
]

// 状态过滤器映射（常量，不会变化）
export const statusFilterFunMap = new Map(statusFilters.map((filter) => [filter.name, filter.filter]))
