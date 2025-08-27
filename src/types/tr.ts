//状态
export const Status = {
  stopped: 0,
  queuedToVerify: 1,
  verifying: 2,
  queuedToDownload: 3,
  downloading: 4,
  queuedToSeed: 5,
  seeding: 6
} as const

export const StatusStrings = ['已暂停', '等待验证', '验证中', '等待下载', '下载中', '等待做种', '做种中'] as const

const PriorityNumbers = [-1, 0, 1] as const

export type PriorityNumberType = (typeof PriorityNumbers)[number]

export const BandwidthPriority = {
  low: -1,
  normal: 0,
  high: 1
} as const

export const PriorityStrings = new Map<PriorityNumberType, string>([
  [-1, '低'],
  [0, '正常'],
  [1, '高']
])
