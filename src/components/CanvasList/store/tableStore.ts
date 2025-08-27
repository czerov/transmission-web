import type { Torrent } from '@/api/rpc'
import { useSettingStore, useTorrentStore } from '@/store'
import { defineStore } from 'pinia'
import { fitText } from '../cells/utils'
import { calculateRowHeight, HEADER_HEIGHT, ICON_GAP, ICON_SIZE, ITEM_HEIGHT, PADDING_X } from './utils'

export const useTableStore = defineStore('CanvasTable', () => {
  const torrentStore = useTorrentStore()
  const settingStore = useSettingStore()

  const scrollTop = ref(0)
  const scrollLeft = ref(0)
  const bufferSize = 10
  const bufferColumnSize = 3
  const clientHeight = ref(0)
  const clientWidth = ref(0)

  const cacheRowHeights = new Map<number, { height: number; labels: string }>()

  // 计算累积高度
  const cumulativeHeights = computed(() => {
    const heights: number[] = []
    const mapRowHeights = new Map<number, number>()
    const mapColumnWidth = torrentStore.mapColumnWidth
    let total = 0
    for (const torrent of torrentStore.filterTorrents) {
      const cacheData = cacheRowHeights.get(torrent.id)
      if (cacheData && cacheData.labels === torrent.labels.toString()) {
        total += cacheData.height
        heights.push(total)
        mapRowHeights.set(torrent.id, cacheData.height)
        continue
      }
      const height = calculateRowHeight(torrent, mapColumnWidth['labels'], settingStore.themeVars)
      mapRowHeights.set(torrent.id, height)
      cacheRowHeights.set(torrent.id, { height, labels: torrent.labels.toString() })
      total += height
      heights.push(total)
    }
    return {
      heights,
      mapRowHeights
    }
  })

  // 根据 scrollTop 找到可视区域的起始行
  function findVisibleStart(scrollTop: number): number {
    const { heights } = cumulativeHeights.value
    if (heights.length === 0) {
      return 0
    }

    let left = 0
    let right = heights.length - 1

    while (left < right) {
      const mid = Math.floor((left + right) / 2)
      if (heights[mid] < scrollTop) {
        left = mid + 1
      } else {
        right = mid
      }
    }

    return left
  }

  // 根据 scrollTop 和 clientHeight 找到可视区域的结束行
  function findVisibleEnd(scrollTop: number, clientHeight: number): number {
    const { heights } = cumulativeHeights.value
    if (heights.length === 0) {
      return 0
    }

    const bottomY = scrollTop + clientHeight
    let left = 0
    let right = heights.length - 1

    while (left < right) {
      const mid = Math.floor((left + right + 1) / 2)
      if (heights[mid] <= bottomY) {
        left = mid
      } else {
        right = mid - 1
      }
    }

    return Math.min(left + 1, heights.length - 1)
  }

  // 获取行的 Y 位置
  function getRowY(index: number): number {
    if (index === 0) {
      return 0
    }
    const { heights } = cumulativeHeights.value
    return heights[index - 1] || 0
  }

  const scrollHeight = computed(() => {
    const heights = cumulativeHeights.value.heights
    const totalHeight = heights.length > 0 ? heights[heights.length - 1] : 0
    return Math.max(totalHeight + HEADER_HEIGHT, clientHeight.value)
  })

  // 开始渲染行，结束渲染行
  const renderStartIdx = ref(0)
  const renderEndIdx = ref(0)
  const visibleRowCount = ref(0)
  // 可视区域行开始
  const visibleStart = ref(0)
  // 可视区域行结束
  const visibleEnd = ref(0)
  // 开始渲染的y偏移
  const startY = ref(0)

  // 可视区域列开始
  const visibleStartCol = ref(0)

  // 开始渲染的x偏移
  const startX = computed(() => {
    let x = 0
    for (let i = 0; i < visibleStartCol.value; i++) {
      x += torrentStore.visibleColumns[i].width
    }
    return x
  })

  const visibleEndCol = ref(0)

  const renderHeight = computed(() => {
    return (visibleRowCount.value + bufferSize * 2) * ITEM_HEIGHT
  })

  // 监听滚动条位置和窗口高度
  // 监听滚动条位置和窗口高度
  watch(
    [scrollTop, clientHeight, cumulativeHeights],
    ([newTop, newHeight]) => {
      const newVisibleStart = findVisibleStart(newTop)
      const newVisibleEnd = findVisibleEnd(newTop, newHeight)

      visibleStart.value = newVisibleStart
      visibleEnd.value = newVisibleEnd
      visibleRowCount.value = newVisibleEnd - newVisibleStart + 1

      renderStartIdx.value = Math.max(0, newVisibleStart - bufferSize)
      renderEndIdx.value = Math.min(torrentStore.filterTorrents.length - 1, newVisibleEnd + bufferSize)

      // 计算 startY 偏移
      const firstVisibleRowY = getRowY(newVisibleStart)
      startY.value = firstVisibleRowY - newTop
    },
    { flush: 'post' }
  )

  // 监听左侧滚动条位置和列宽度
  // 不动态计算渲染列，全部渲染
  watch(
    [scrollLeft, clientWidth],
    ([newLeft, newWidth]) => {
      const totleWidth = torrentStore.tableMinWidth
      if (newWidth >= totleWidth) {
        visibleStartCol.value = 0
        visibleEndCol.value = torrentStore.visibleColumns.length - 1
      } else {
        // 根据左侧滚动的 left先计算出应该绘制那一列
        let hiddenWidth = 0
        let start = 0
        for (let i = 0; i < torrentStore.visibleColumns.length; i++) {
          start = i
          hiddenWidth += torrentStore.visibleColumns[i].width || 0
          if (newLeft <= hiddenWidth) {
            break
          }
        }
        visibleStartCol.value = Math.max(0, start - bufferColumnSize)
        // 第一个绘制的单元格绘制的部分
        const xx = hiddenWidth - newLeft
        let w = xx
        for (let i = start + 1; i < torrentStore.visibleColumns.length; i++) {
          w += torrentStore.visibleColumns[i].width || 0
          if (w >= newWidth) {
            visibleEndCol.value = Math.min(torrentStore.visibleColumns.length - 1, i + bufferColumnSize)
            break
          }
        }
      }
    },
    { flush: 'post' }
  )

  function setScroll(newTop: number, newLeft: number) {
    scrollTop.value = newTop
    scrollLeft.value = newLeft
  }
  function setClientHeight(newHeight: number) {
    clientHeight.value = newHeight
  }

  function setClientWidth(newWidth: number) {
    clientWidth.value = newWidth
  }

  const canvas = document.createElement('canvas')

  const ellipsisTxtMap = ref<
    Map<number, Record<string, { fitTxt: string | string[]; text: string; width: number; height: number }>>
  >(new Map())

  // 分离文本计算逻辑，减少不必要的重计算
  const textComputeTriggers = computed(() => ({
    renderStart: renderStartIdx.value,
    renderEnd: renderEndIdx.value,
    mapColumnWidth: torrentStore.mapColumnWidth,
    filterTorrents: torrentStore.filterTorrents,
    mapRowHeights: cumulativeHeights.value.mapRowHeights
  }))

  watch(
    textComputeTriggers,
    () => {
      const ctx = canvas.getContext('2d')!
      const theme = settingStore.themeVars
      ctx.reset()
      ctx.font = `${theme.fontSize} ${theme.fontFamily}`

      // TODO: 这个虽然每次都是用renderStartIdx到renderEndIdx计算一段，但是不停的 set，可能会导致数据变大很多，考虑只保存当前预渲染的所有行的数据
      const map = toRaw(unref(ellipsisTxtMap))
      const keys = ['name', 'labels', 'downloadDir', 'cachedMainTracker', 'cachedTrackerStatus']
      const mapRowHeights = cumulativeHeights.value.mapRowHeights
      for (let i = renderStartIdx.value; i <= renderEndIdx.value; i++) {
        const row = torrentStore.filterTorrents[i]
        if (!row) {
          break
        }
        keys.forEach((key) => {
          const data = row[key as keyof Torrent]?.toString()
          if (typeof data === 'string' && data.length > 0) {
            const columnWidth = torrentStore.mapColumnWidth[key]
            if (!columnWidth) {
              return
            }
            // 检查是否已有缓存
            const existingData = map.get(row.id)
            let maxWidth = columnWidth - PADDING_X * 2
            const maxHeight = mapRowHeights.get(row.id) || ITEM_HEIGHT
            if (key === 'name') {
              maxWidth -= ICON_SIZE + ICON_GAP
            }
            const cacheData = existingData?.[key]
            // 检查是否需要重新计算
            if (
              !cacheData ||
              cacheData.text !== data ||
              cacheData.width !== columnWidth ||
              cacheData.height !== maxHeight
            ) {
              const fitTxt = fitText(ctx, data, maxWidth, maxHeight, true)
              map.set(row.id, {
                ...existingData,
                [key]: {
                  fitTxt,
                  text: data,
                  width: columnWidth,
                  height: maxHeight
                }
              })
            }
          }
        })
      }
      ellipsisTxtMap.value = map
    },
    { flush: 'post' }
  )

  // 主题变化时，清空行高度缓存，清空文字溢出缓存
  watch(
    [() => settingStore.themeVars.fontSize, () => settingStore.themeVars.fontFamily],
    () => {
      ellipsisTxtMap.value = new Map()
      cacheRowHeights.clear()
    },
    {
      flush: 'post'
    }
  )

  return {
    startY,
    startX,
    scrollHeight,
    scrollTop,
    scrollLeft,
    bufferSize,
    renderStartIdx,
    renderEndIdx,
    visibleStart,
    visibleStartCol,
    visibleEndCol,
    visibleEnd,
    clientHeight,
    clientWidth,
    renderHeight,
    setScroll,
    setClientHeight,
    setClientWidth,
    ellipsisTxtMap,
    cumulativeHeights
  }
})
