<script setup lang="ts">
import type { Torrent } from '@/api/rpc'
import { getStatusString, Status } from '@/types/tr'
import { useI18n } from 'vue-i18n'

interface Column {
  key: string
  title: string
  cellComponent: string
  [key: string]: any
}
const props = defineProps<{ value: any; row: Torrent; col: Column }>()
const { t } = useI18n()

const statusStr = computed(() => {
  if (props.row.status === Status.downloading && props.row.pieceCount === 0) {
    return t('status.getMeta')
  }
  // sequentialDownload这个字段在 get_torrents 中没有找到，逻辑先保留，可能只有顺序下载的时候才会返回
  if (props.row.status === Status.downloading && props.row.sequentialDownload === true) {
    return t('status.sequential')
  }

  return getStatusString(props.row.status)
})
</script>
<template>
  <div>{{ statusStr }}</div>
</template>
