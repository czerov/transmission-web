<script setup lang="ts">
import type { Torrent } from '@/api/rpc'
import { StatusStrings, Status } from '@/types/tr'

interface Column {
  key: string
  title: string
  cellComponent: string
  [key: string]: any
}
const props = defineProps<{ value: any; row: Torrent; col: Column }>()
const statusStr = computed(() => {
  if (props.row.status === Status.downloading && props.row.pieceCount === 0) {
    return '获取元数据'
  }
  // sequentialDownload这个字段在 get_torrents 中没有找到，逻辑先保留，可能只有顺序下载的时候才会返回
  if (props.row.status === Status.downloading && props.row.sequentialDownload === true) {
    return '顺序下载'
  }
  return StatusStrings[props.row.status]
})
</script>
<template>
  <div>{{ statusStr }}</div>
</template>
