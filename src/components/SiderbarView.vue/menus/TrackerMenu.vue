<template>
  <n-menu :indent="8" :options="menuOpts" v-model:value="torrentStore.trackerFilter" :default-expand-all="true" />
</template>
<script setup lang="ts">
import StormTracker from '@/assets/icons/stormTracker.svg?component'
import { useTorrentStore } from '@/store'
import { renderIcon } from '@/utils'

const torrentStore = useTorrentStore()
const menuOpts = computed(() => {
  return [
    {
      label: '服务器分布',
      key: 'tracker',
      icon: renderIcon(StormTracker),
      children: torrentStore.trackerOptions.map((item) => ({
        ...item,
        icon: renderIcon(item.icon || StormTracker)
      }))
    }
  ]
})
</script>
