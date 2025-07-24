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
  <div class="text-right">{{ value >= 0 ? value : '' }}</div>
</template>
