<script setup lang="ts">
import type { Torrent } from '@/api/rpc'
import { timeToStr } from '@/utils'
interface Column {
  key: string
  title: string
  cellComponent: string
  [key: string]: any
}
const props = defineProps<{ value: number | string; row: Torrent; col: Column }>()
const timeStr = computed(() => {
  const val = Number(props.value)
  if (isNaN(val)) {
    return ''
  }
  return timeToStr(val)
})
</script>
<template>
  <div class="text-right">{{ timeStr }}</div>
</template>
