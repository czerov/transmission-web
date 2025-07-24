<script setup lang="ts">
import type { Torrent } from '@/api/rpc'
interface Column {
  key: string
  title: string
  cellComponent: string
  [key: string]: any
}
const props = defineProps<{ value?: string | number; row: Torrent; col: Column }>()
const row = props.row
const data = computed(() => {
  return row.uploadedEver === 0
    ? '-'
    : row.downloadedEver === 0
      ? '∞'
      : (row.uploadedEver / row.downloadedEver).toFixed(2)
})
</script>
<template>
  <div class="text-right">{{ data }}</div>
</template>
