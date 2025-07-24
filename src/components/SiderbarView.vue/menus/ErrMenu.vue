<template>
  <n-menu
    :indent="8"
    :options="errorMenuOptions"
    v-model:value="torrentStore.errorStringFilter"
    :default-expand-all="true"
  />
</template>
<script setup lang="ts">
import DismissSquareIcon from '@/assets/icons/dismissSquare.svg?component'
import { useTorrentStore } from '@/store'
import { renderIcon } from '@/utils'
const torrentStore = useTorrentStore()
const errorMenuOptions = computed(() => {
  return [
    {
      label: '错误分布',
      key: 'error',
      icon: renderIcon(DismissSquareIcon, 'var(--error-color)'),
      children: torrentStore.errorStringOptions.map((item) => ({
        ...item,
        icon: renderIcon(item.icon || DismissSquareIcon, item.color)
      }))
    }
  ]
})
</script>
