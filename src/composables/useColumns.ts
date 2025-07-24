import { computed } from 'vue'
import { useStorage } from '@vueuse/core'

export interface ColumnConfig {
  key: string
  width: number
  visible: boolean
}

export const allColumns = [
  { key: 'name', title: '名称', fixed: true, minWidth: 350 },
  { key: 'totalSize', title: '总大小', minWidth: 90 },
  { key: 'sizeWhenDone', title: '选定大小', minWidth: 90 },
  { key: 'leftUntilDone', title: '剩余', minWidth: 90 },
  { key: 'haveValid', title: '有效', minWidth: 90 },
  { key: 'downloadedEver', title: '已下载', minWidth: 100 },
  { key: 'uploadedEver', title: '已上传', minWidth: 100 },
  { key: 'uploadedDownloaded', title: '已上传/已下载', minWidth: 130 },
  { key: 'percentDone', title: '进度', minWidth: 120 },
  { key: 'rateDownload', title: '下载速度', minWidth: 100 },
  { key: 'rateUpload', title: '上传速度', minWidth: 100 },
  { key: 'status', title: '状态', minWidth: 80 },
  { key: 'addedDate', title: '添加时间', minWidth: 190 },
  { key: 'peersSendingToUs', title: '种子|活跃', minWidth: 95 },
  { key: 'peersGettingFromUs', title: '下载|活跃', minWidth: 80 },
  { key: 'eta', title: '剩余时间', minWidth: 85 },
  { key: 'uploadRatio', title: '分享率', minWidth: 80 },
  // 格式化后的 tracker
  { key: 'cachedMainTracker', title: '服务器', minWidth: 150 },
  // 格式化后的 tracker 状态
  { key: 'cachedTrackerStatus', title: '服务器状态', minWidth: 100 },
  { key: 'doneDate', title: '完成时间', minWidth: 190 },
  { key: 'activityDate', title: '最后活动时间', minWidth: 190 },
  { key: 'downloadDir', title: '保存目录', minWidth: 180 },
  { key: 'bandwidthPriority', title: '优先级', minWidth: 80 },
  { key: 'id', title: 'ID', minWidth: 80 },
  { key: 'queuePosition', title: '队列位置', minWidth: 80 },
  { key: 'isPrivate', title: '私有', minWidth: 60 },
  { key: 'labels', title: '用户标签', minWidth: 100 },
  { key: 'secondsSeeding', title: '做种时长', minWidth: 90 },
  { key: 'group', title: '备用带宽', minWidth: 95 },
  { key: 'file-count', title: '文件数目', minWidth: 90 },
  { key: 'pieceCount', title: '块数目', minWidth: 90 },
  { key: 'metadataPercentComplete', title: '元数据', minWidth: 150 }
]

export const defaultVisibleColumns = [
  'name',
  'totalSize',
  'haveValid',
  'downloadedEver',
  'uploadedEver',
  'percentDone',
  'rateDownload',
  'rateUpload',
  'status',
  'addedDate',
  'peersSendingToUs',
  'peersGettingFromUs',
  'uploadRatio',
  'bandwidthPriority',
  'labels',
  'secondsSeeding'
]

export function useColumns(storageKey = 'torrent-columns') {
  // 初始化 visibleColumns
  const columns = useStorage<ColumnConfig[]>(
    storageKey,
    allColumns.map((col) => {
      const isDefaultVisible = defaultVisibleColumns.includes(col.key)
      return {
        key: col.key,
        width: col.minWidth,
        visible: col.key === 'name' ? true : isDefaultVisible
      }
    })
  )

  // name 列默认显示
  function setVisibleColumns(cols: ColumnConfig[]) {
    columns.value = cols.map((col) => (col.key === 'name' ? { ...col, visible: true } : col))
  }

  function updateColumnWidth(key: string, width: number) {
    columns.value = columns.value.map((col) => (col.key === key ? { ...col, width } : col))
  }

  function toggleColumnVisible(key: string) {
    if (key === 'name') {
      return
    }
    columns.value = columns.value.map((col) => (col.key === key ? { ...col, visible: !col.visible } : col))
  }

  function moveColumn(from: number, to: number) {
    const arr = [...columns.value]
    const [moved] = arr.splice(from, 1)
    arr.splice(to, 0, moved)
    columns.value = arr
  }

  const visibleColumns = computed(() => columns.value.filter((col) => col.visible))
  const tableMinWidth = computed(() => visibleColumns.value.reduce((sum, col) => sum + (col.width || 150), 0))
  const mapColumnWidth = computed(() => {
    return visibleColumns.value.reduce(
      (acc, col) => {
        acc[col.key] = col.width
        return acc
      },
      {} as Record<string, number>
    )
  })
  return {
    columns,
    setVisibleColumns,
    updateColumnWidth,
    toggleColumnVisible,
    moveColumn,
    visibleColumns,
    tableMinWidth,
    mapColumnWidth
  }
}
