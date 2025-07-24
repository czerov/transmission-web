<script setup lang="ts">
import type { Torrent } from '@/api/rpc'
interface Column {
  key: string
  title: string
  cellComponent: string
  [key: string]: any
}
const props = defineProps<{ value: any; row: Torrent; col: Column }>()
const getting = computed(() => {
  return props.row.peersGettingFromUs
})
const totalPeers = computed(() => {
  return props.row.cachedPeersTotal
})
</script>
<template>
  <div class="text-right">{{ totalPeers < 0 ? `${getting}` : `${totalPeers} (${getting})` }}</div>
</template>
