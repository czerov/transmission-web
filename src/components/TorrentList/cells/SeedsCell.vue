<script setup lang="ts">
import type { Torrent } from '@/api/rpc'
interface Column {
  key: string
  title: string
  cellComponent: string
  [key: string]: any
}
const props = defineProps<{ value: any; row: Torrent; col: Column }>()
const sending = computed(() => {
  return props.row.peersSendingToUs
})
const totalSeeds = computed(() => {
  return props.row.cachedSeedsTotal
})
</script>
<template>
  <div class="text-right">{{ totalSeeds < 0 ? `${sending}` : `${totalSeeds} (${sending})` }}</div>
</template>
