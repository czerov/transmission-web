<template>
  <div class="torrent-detail" :style="rootStyle">
    <div class="overlay flex items-center justify-center" v-if="props.loading">
      <n-spin :show="true" />
    </div>
    <div class="flex items-center justify-between px-3 py-2 border-b border-[var(--n-header-border-bottom)]">
      <div class="text-sm">
        <template v-if="selectedCount === 1 && torrent">
          {{ torrent.name }}
        </template>
        <template v-else-if="selectedCount > 1"> 已选择 {{ selectedCount }} 项 </template>
        <template v-else> 未选择任何任务 </template>
      </div>
      <div class="flex items-center gap-2 pr-1">
        <IconButton v-if="closable" :icon="CloseIcon" @click="onClose" />
      </div>
    </div>
    <n-tabs v-model:value="currentTab" type="line" :animated="true" class="detail-tabs">
      <n-tab-pane name="general" tab="常规" class="tab-pane">
        <GeneralTab v-if="torrent" :torrent="torrent" />
      </n-tab-pane>
      <n-tab-pane name="peers" tab="用户" class="tab-pane">
        <PeersTab v-if="torrent" :torrent="torrent" />
      </n-tab-pane>
      <n-tab-pane name="tracker" tab="Tracker" class="tab-pane">
        <TrackerTab v-if="torrent" :torrent="torrent" />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import type { Torrent } from '@/api/rpc'
import { useTorrentStore } from '@/store'
import { CloseCircleOutline as CloseIcon } from '@vicons/ionicons5'

interface Props {
  // 用于 PC 场景的固定高度（px），移动端抽屉中可忽略
  height?: number
  // 是否显示右上角关闭按钮（移动端抽屉中使用）
  closable?: boolean
  // 是否显示加载中
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: undefined,
  closable: false,
  loading: true
})

const emit = defineEmits<{
  close: []
}>()

const torrentStore = useTorrentStore()
const selectedCount = computed(() => torrentStore.selectedKeys.length)
const torrent = computed<Torrent | undefined>(() => {
  if (torrentStore.selectedKeys.length === 0) {
    return undefined
  }
  const id = torrentStore.selectedKeys[0]
  return torrentStore.filterTorrents.find((t) => t.id === id)
})

const currentTab = ref<'general' | 'peers' | 'tracker'>('general')

const rootStyle = computed(() => {
  return props.height ? { height: `${props.height}px` } : {}
})

function onClose() {
  emit('close')
}
</script>

<style lang="less" scoped>
@import '@/styles/mix.less';
.torrent-detail {
  box-sizing: border-box;
  background-color: var(--card-color);
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
  height: 100%;
  .detail-tabs {
    flex: 1;
    overflow: hidden;
    box-sizing: border-box;
  }
  :deep(.n-tabs-nav) {
    padding-inline: 12px;
  }
  :deep(.tab-pane) {
    .scrollbar();
    overflow: auto;
    width: 100%;
    box-sizing: border-box;
    height: 100%;
  }
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px);
  z-index: 22;
}
</style>
