<script setup lang="ts">
import type { Torrent } from '@/api/rpc'
import { getPriorityString, type PriorityNumberType } from '@/types/tr'
interface Column {
  key: string
  title: string
  cellComponent: string
  [key: string]: any
}
const props = defineProps<{ value: number; row: Torrent; col: Column }>()
const type = computed(() => {
  switch (props.value) {
    case -1:
      return 'warning'
    case 0:
      return 'success'
    case 1:
      return 'primary'
  }
  return 'default'
})
</script>
<template>
  <div>
    <n-tag :type="type" size="small" round :bordered="false">
      {{ getPriorityString(value as PriorityNumberType) }}
    </n-tag>
  </div>
</template>
