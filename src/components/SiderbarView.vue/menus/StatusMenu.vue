<template>
  <n-menu
    :indent="8"
    :options="statusMenuOptions"
    v-model:value="torrentStore.statusFilter"
    :default-expand-all="true"
  />
</template>
<script setup lang="ts">
import MagnetIcon from '@/assets/icons/magnet.svg?component'
import { useTorrentStore } from '@/store'
import { renderIcon } from '@/utils'
import { ShuffleOutline } from '@vicons/ionicons5'

const torrentStore = useTorrentStore()
const statusMenuOptions = computed(() => {
  return [
    {
      label: '种子状态',
      key: 'status',
      icon: renderIcon(MagnetIcon),
      children: torrentStore.statusOptions.map((item) => ({
        ...item,
        icon: renderIcon(item.icon || ShuffleOutline, item.color)
      }))
    }
  ]
})
</script>
