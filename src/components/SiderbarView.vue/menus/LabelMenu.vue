<template>
  <n-menu
    :indent="8"
    :options="labelMenuOptions"
    v-model:value="torrentStore.labelsFilter"
    :default-expand-all="true"
  />
</template>
<script setup lang="ts">
import { useTorrentStore } from '@/store'
import { renderIcon } from '@/utils'
import { Pricetag, Pricetags } from '@vicons/ionicons5'

const torrentStore = useTorrentStore()
const labelMenuOptions = computed(() => {
  return [
    {
      label: '用户标签',
      key: 'labels',
      icon: renderIcon(Pricetags),
      children: torrentStore.labelsOptions.map((item) => ({
        ...item,
        icon: renderIcon(item.icon || Pricetag)
      }))
    }
  ]
})
</script>
