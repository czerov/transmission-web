<script setup lang="ts">
import type { Torrent } from '@/api/rpc'
import { formatSize } from '@/utils'
interface Column {
  key: string
  title: string
  cellComponent: string
  [key: string]: any
}
const props = defineProps<{ value: any; row: Torrent; col: Column }>()
const size = computed(() => {
  return props.value > 0 ? formatSize(Number(props.value)) + '/s' : ''
})
</script>
<template>
  <div class="text-right">{{ size }}</div>
</template>
