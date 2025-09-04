import i18n from '@/i18n'
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

export const getStatusString = (status: number) => {
  const t = i18n.global.t
  const StatusStrings = [
    t('status.stopped'),
    t('status.queuedToVerify'),
    t('status.verifying'),
    t('status.queuedToDownload'),
    t('status.downloading'),
    t('status.queuedToSeed'),
    t('status.seeding')
  ]
  return StatusStrings[status]
}

const PriorityNumbers = [-1, 0, 1] as const

export type PriorityNumberType = (typeof PriorityNumbers)[number]

export const BandwidthPriority = {
  low: -1,
  normal: 0,
  high: 1
} as const

export const getPriorityString = (priority: PriorityNumberType) => {
  const t = i18n.global.t
  const PriorityStrings = new Map<PriorityNumberType, string>([
    [-1, t('priority.low')],
    [0, t('priority.normal')],
    [1, t('priority.high')]
  ])
  return PriorityStrings.get(priority)
}
