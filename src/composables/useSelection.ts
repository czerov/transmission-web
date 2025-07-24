import { ref } from 'vue'

// 通用 选中逻辑，负责选中行
export function useSelection<T extends { id: number }>(items: () => T[]) {
  const selectedKeys = ref<number[]>([])
  const lastSelectedIndex = ref<number | null>(null)
  const mapSelectedKeys = computed(() =>
    selectedKeys.value.reduce(
      (acc, id) => {
        acc[id] = true
        return acc
      },
      {} as Record<number, boolean>
    )
  )
  // 设置选中
  function setSelectedKeys(keys: number[]) {
    selectedKeys.value = [...keys]
  }
  // 切换选中
  function toggleSelectedKey(key: number) {
    if (selectedKeys.value.includes(key)) {
      selectedKeys.value = selectedKeys.value.filter((k) => k !== key)
    } else {
      selectedKeys.value = [...selectedKeys.value, key]
    }
  }
  // 清空选中
  function clearSelectedKeys() {
    selectedKeys.value = []
    lastSelectedIndex.value = null
  }
  // 选中范围
  function selectRange(currentIndex: number) {
    if (lastSelectedIndex.value === null) {
      selectedKeys.value = [items()[currentIndex]?.id]
      lastSelectedIndex.value = currentIndex
      return
    }
    const start = Math.min(lastSelectedIndex.value, currentIndex)
    const end = Math.max(lastSelectedIndex.value, currentIndex)
    const rangeIds = items()
      .slice(start, end + 1)
      .map((t) => t.id)
    selectedKeys.value = rangeIds
  }

  function setLastSelectedIndex(idx: number) {
    lastSelectedIndex.value = idx
  }

  return {
    mapSelectedKeys,
    selectedKeys,
    setSelectedKeys,
    toggleSelectedKey,
    clearSelectedKeys,
    selectRange,
    lastSelectedIndex,
    setLastSelectedIndex
  }
}
