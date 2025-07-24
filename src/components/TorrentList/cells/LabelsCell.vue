<script setup lang="ts">
import type { Torrent } from '@/api/rpc'
interface Column {
  key: string
  title: string
  cellComponent: string
  [key: string]: any
}
defineProps<{ value: string[]; row: Torrent; col: Column }>()
</script>
<template>
  <div class="labels-container">
    <n-tag v-for="tag in value" type="info" :key="tag" size="small">{{ tag }}</n-tag>
  </div>
</template>

<style lang="less" scoped>
.labels-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
