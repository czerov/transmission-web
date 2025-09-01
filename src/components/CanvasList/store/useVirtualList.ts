/**
 * 虚拟列表通用 Hook
 * 提供滚动管理和可视区域计算的基础功能
 */
export function useVirtualList() {
  // 基础状态
  const scrollTop = ref(0)
  const scrollLeft = ref(0)
  const clientHeight = ref(0)
  const clientWidth = ref(0)
  const bufferSize = 10
  const bufferColumnSize = 3

  // 滚动管理
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

  // 根据 scrollTop 找到可视区域的起始行
  function findVisibleStart(scrollTop: number, heights: number[]): number {
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
  function findVisibleEnd(scrollTop: number, clientHeight: number, heights: number[]): number {
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
  function getRowY(index: number, heights: number[]): number {
    if (index === 0) {
      return 0
    }
    return heights[index - 1] || 0
  }

  return {
    // 基础状态
    scrollTop: readonly(scrollTop),
    scrollLeft: readonly(scrollLeft),
    clientHeight: readonly(clientHeight),
    clientWidth: readonly(clientWidth),
    bufferSize,
    bufferColumnSize,

    // 滚动管理
    setScroll,
    setClientHeight,
    setClientWidth,

    // 可视区域计算，找到屏幕上可以看见的行的 index
    findVisibleStart,
    findVisibleEnd,
    getRowY
  }
}
