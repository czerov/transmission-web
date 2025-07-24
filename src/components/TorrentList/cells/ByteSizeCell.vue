<script setup lang="ts">
import type { Torrent } from '@/api/rpc'
import { formatSize } from '@/utils'
interface Column {
  key: string
  title: string
  cellComponent: string
  [key: string]: any
}
const props = defineProps<{ value: string | number; row: Torrent; col: Column }>()
const size = computed(() => {
  return formatSize(Number(props.value))
})
</script>
<template>
  <div class="text-right">{{ size }}</div>
</template>
