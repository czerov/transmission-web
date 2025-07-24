<template>
  <n-menu
    :indent="8"
    :options="dirMenuOptions"
    v-model:value="torrentStore.downloadDirFilter"
    :default-expand-all="true"
  />
</template>
<script setup lang="ts">
import { useTorrentStore } from '@/store'
import { renderIcon } from '@/utils'
import { FileTray, Folder } from '@vicons/ionicons5'
const torrentStore = useTorrentStore()
const dirMenuOptions = computed(() => {
  return [
    {
      label: '目录分布',
      key: 'error',
      icon: renderIcon(FileTray),
      children: torrentStore.downloadDirOptions.map((item) => ({
        ...item,
        icon: renderIcon(item.icon || Folder)
      }))
    }
  ]
})
</script>
