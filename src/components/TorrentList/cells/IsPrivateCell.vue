<script setup lang="ts">
import type { Torrent } from '@/api/rpc'
interface Column {
  key: string
  title: string
  cellComponent: string
  [key: string]: any
}
const props = defineProps<{ value: any; row: Torrent; col: Column }>()
const text = computed(() => (props.value ? '是' : '否'))
</script>
<template>
  <div class="text-center">{{ text }}</div>
</template>
