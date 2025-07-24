import type { Torrent } from '@/api/rpc'
import { rpc } from '@/api/rpc'
import { useColumns } from '@/composables/useColumns'
import { useSelection } from '@/composables/useSelection'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import {
  detailFilterOptions,
  isFilterTorrents,
  mapToOptions,
  processTorrent,
  sortTorrents,
  type IMenuItem
} from './torrentUtils'

export const useTorrentStore = defineStore('torrent', () => {
  const torrents = ref<Torrent[]>([])
  // 排序相关
  const sortKey = ref<string>('id') // 默认按添加时间排序
  const sortOrder = ref<'asc' | 'desc'>('desc') // 默认降序
  function setSort(key: string) {
    if (sortKey.value === key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      sortOrder.value = 'desc' // 新字段默认降序
    }
  }

  // 搜索关键字
  const search = ref('')

  // 过滤条件（单选）
  const statusFilter = ref<string>('all')
  const labelsFilter = ref<string>('all')
  const trackerFilter = ref<string>('all')
  const errorStringFilter = ref<string>('all')
  const downloadDirFilter = ref<string>('all')

  // 列显示相关逻辑抽离
  const {
    columns,
    setVisibleColumns,
    updateColumnWidth,
    toggleColumnVisible,
    moveColumn,
    visibleColumns,
    tableMinWidth,
    mapColumnWidth
  } = useColumns()

  // 真正的一次循环计算所有数据
  const computedData = computed(() => {
    // 初始化统计集合
    const labelsSet = new Map<string, IMenuItem>()
    labelsSet.set('noLabels', { count: 0, label: '无标签' })
    const trackerSet = new Map<string, IMenuItem>()
    const errorStringSet = new Map<string, IMenuItem>()
    const downloadDirSet = new Map<string, IMenuItem>()
    const statusSet = new Map<string, IMenuItem>()

    // 存储过滤后的结果
    const filtered: Torrent[] = []
    //  生成索引映射
    const mapFilterTorrentsIndex: Record<number, number> = {}

    // 一次循环完成所有计算：统计 + 过滤
    let filteredIndex = 0
    torrents.value.forEach((t) => {
      // 将选项全部放到 map 中
      detailFilterOptions(t, labelsSet, trackerSet, errorStringSet, downloadDirSet, statusSet)

      // 如果通过所有过滤条件，加入结果数组
      if (
        isFilterTorrents(t, search, statusFilter, labelsFilter, trackerFilter, errorStringFilter, downloadDirFilter)
      ) {
        filtered.push(t)
        mapFilterTorrentsIndex[t.id] = filteredIndex++
      }
    })

    // === 3. 排序（只对过滤后的数据进行排序） ===
    if (sortKey.value) {
      sortTorrents(filtered, sortKey, sortOrder)
    }
    // 检测所有的 filter 的值是否在 map 里面，如果不在重置成全部
    if (!statusSet.get(statusFilter.value)) {
      statusFilter.value = 'all'
    }
    if (!labelsSet.get(labelsFilter.value)) {
      labelsFilter.value = 'all'
    }
    if (!trackerSet.get(trackerFilter.value)) {
      trackerFilter.value = 'all'
    }
    if (!errorStringSet.get(errorStringFilter.value)) {
      errorStringFilter.value = 'all'
    }
    if (!downloadDirSet.get(downloadDirFilter.value)) {
      downloadDirFilter.value = 'all'
    }

    const options = {
      labelsOptions: mapToOptions(labelsSet, torrents.value.length),
      trackerOptions: mapToOptions(trackerSet, torrents.value.length),
      errorStringOptions: mapToOptions(errorStringSet, torrents.value.length),
      downloadDirOptions: mapToOptions(downloadDirSet, torrents.value.length),
      statusOptions: mapToOptions(statusSet, torrents.value.length)
    }
    return {
      options,
      filterTorrents: filtered,
      mapFilterTorrentsIndex
    }
  })

  // 从合并的 computed 中提取各个部分
  const options = computed(() => computedData.value.options)
  const filterTorrents = computed(() => computedData.value.filterTorrents)
  const mapFilterTorrentsIndex = computed(() => computedData.value.mapFilterTorrentsIndex)

  // selection 相关逻辑拆分
  const {
    mapSelectedKeys,
    selectedKeys,
    setSelectedKeys,
    toggleSelectedKey,
    clearSelectedKeys,
    selectRange,
    lastSelectedIndex,
    setLastSelectedIndex
  } = useSelection(() => filterTorrents.value)

  async function fetchTorrents() {
    const fields = [
      'activityDate',
      'addedDate',
      'bandwidthPriority',
      'doneDate',
      'downloadDir',
      'downloadedEver',
      'error',
      'errorString',
      'eta',
      'file-count',
      'group',
      'haveValid',
      'id',
      'isPrivate',
      'labels',
      'leftUntilDone',
      'magnetLink',
      'metadataPercentComplete',
      'name',
      'peersGettingFromUs',
      'peersSendingToUs',
      'percentDone',
      'pieceCount',
      'queuePosition',
      'rateDownload',
      'rateUpload',
      'secondsSeeding',
      'sizeWhenDone',
      'status',
      'totalSize',
      'trackerStats',
      'uploadRatio',
      'uploadedEver',
      'trackerList',
      'seedIdleLimit',
      'seedIdleMode',
      'seedRatioLimit',
      'seedRatioMode',
      'sequential_download',
      'honorsSessionLimits',
      'downloadLimited',
      'uploadLimited',
      'downloadLimit',
      'uploadLimit',
      'peer-limit'
    ]
    const res = await rpc.torrentGet(fields)
    torrents.value = (res?.arguments?.torrents || []).map(processTorrent)
  }

  const { pause: stopPolling, resume: startPolling } = useIntervalFn(fetchTorrents, 5000, { immediate: false })

  watch([search, statusFilter, labelsFilter, trackerFilter, errorStringFilter, downloadDirFilter], () => {
    clearSelectedKeys()
  })
  ;(window as any).torrents = torrents
  return {
    torrents,
    filterTorrents,
    mapFilterTorrentsIndex,
    statusFilter,
    labelsFilter,
    trackerFilter,
    errorStringFilter,
    downloadDirFilter,
    search,
    labelsOptions: computed(() => options.value.labelsOptions),
    trackerOptions: computed(() => options.value.trackerOptions),
    errorStringOptions: computed(() => options.value.errorStringOptions),
    downloadDirOptions: computed(() => options.value.downloadDirOptions),
    statusOptions: computed(() => options.value.statusOptions),
    fetchTorrents,
    mapSelectedKeys,
    selectedKeys,
    setSelectedKeys,
    toggleSelectedKey,
    clearSelectedKeys,
    selectRange,
    lastSelectedIndex,
    setLastSelectedIndex,
    startPolling,
    stopPolling,
    columns,
    setVisibleColumns,
    updateColumnWidth,
    toggleColumnVisible,
    moveColumn,
    visibleColumns,
    tableMinWidth,
    sortKey,
    sortOrder,
    setSort,
    mapColumnWidth
  }
})
