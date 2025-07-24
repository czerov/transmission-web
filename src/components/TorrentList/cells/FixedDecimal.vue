<script setup lang="ts">
import type { Torrent } from '@/api/rpc'
interface Column {
  key: string
  title: string
  cellComponent: string
  [key: string]: any
}
const props = defineProps<{ value: string | number; row: Torrent; col: Column }>()
const data = computed(() => {
  const val = Number(props.value)
  if (isNaN(val) || val < 0) {
    return ''
  }
  return val.toFixed(2)
})
</script>
<template>
  <div class="text-right">{{ data }}</div>
</template>
