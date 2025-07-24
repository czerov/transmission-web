<script setup lang="ts">
import type { Torrent } from '@/api/rpc'
import CheckSquareFilledIcon from '@/assets/icons/checkSquareFilled.svg?component'
import DismissSquareIcon from '@/assets/icons/dismissSquare.svg?component'
import { Status } from '@/types/tr'
import { Magnet as MagnetIcon } from '@vicons/ionicons5'
import { NIcon, useThemeVars } from 'naive-ui'
import { statusIconMap } from '@/const/status'

interface Column {
  key: string
  title: string
  cellComponent: string
  [key: string]: any
}

// 封装 useStatusIcon composable
function useStatusIcon(row: Torrent, theme: ReturnType<typeof useThemeVars>) {
  // 特殊情况优先判断
  if (row.error || row.cachedError) {
    return {
      icon: DismissSquareIcon,
      color: theme.value.errorColor
    }
  }
  if (row.status === Status.downloading && row.pieceCount === 0) {
    return {
      icon: MagnetIcon,
      color: '#748ffc'
    }
  }
  if (row.status === Status.stopped && row.sizeWhenDone > 0 && row.leftUntilDone == 0) {
    return {
      icon: CheckSquareFilledIcon,
      color: '#888'
    }
  }
  const entry = statusIconMap[row.status]
  if (entry) {
    return entry
  }
  // 没有匹配时返回 undefined
  return undefined
}

const props = defineProps<{ value: string; row: Torrent; col: Column }>()
const theme = useThemeVars()
// 使用 composable
const statusIcon = computed(() => useStatusIcon(props.row, theme))
</script>
<template>
  <div class="inline-flex items-center gap-1 overflow-hidden w-full py-2">
    <NIcon v-if="statusIcon" size="18" :color="statusIcon.color">
      <component :is="statusIcon.icon" />
    </NIcon>
    <span class="name-cell-text">{{ value }}</span>
  </div>
</template>

<style lang="less" scoped>
.name-cell-text {
  width: 100%;
  padding: 0 4px;
  box-sizing: border-box;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
  line-height: 2;
}
</style>
