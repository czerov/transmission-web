<script setup lang="ts">
import type { Torrent } from '@/api/rpc'
import { useI18n } from 'vue-i18n'
interface Column {
  key: string
  title: string
  cellComponent: string
  [key: string]: any
}
const { t } = useI18n()
const props = defineProps<{ value: any; row: Torrent; col: Column }>()
const text = computed(() => (props.value ? t('common.yes') : t('common.no')))
</script>
<template>
  <div class="text-center">{{ text }}</div>
</template>
