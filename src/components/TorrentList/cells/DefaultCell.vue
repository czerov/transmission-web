<script setup lang="ts">
import type { Torrent } from '@/api/rpc'
interface Column {
  key: string
  title: string
  cellComponent: string
  [key: string]: any
}
defineProps<{ value: any; row: Torrent; col: Column }>()
</script>
<template>
  <div class="default-cell-text">{{ value }}</div>
</template>

<style lang="less" scoped>
.default-cell-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
