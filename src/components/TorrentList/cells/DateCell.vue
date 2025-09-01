<script setup lang="ts">
import type { Torrent } from '@/api/rpc'
import dayjs from 'dayjs'

interface Column {
  key: string
  title: string
  cellComponent: string
  [key: string]: any
}
const props = defineProps<{ value: number; row: Torrent; col: Column }>()
const date = computed(() => {
  const d = dayjs(props.value * 1000).format('YYYY-MM-DD HH:mm:ss')
  if (d === 'Invalid Date' || props.value === 0) {
    return ''
  }
  return d
})
</script>
<template>
  <div>{{ date }}</div>
</template>
