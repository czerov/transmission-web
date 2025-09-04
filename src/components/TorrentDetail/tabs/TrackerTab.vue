<template>
  <div style="min-width: 740px" class="tracker-tab">
    <n-button @click="handleChangeTracker" size="small" class="mb-2">{{
      t('torrentDetail.tracker.modifyTracker')
    }}</n-button>
    <n-data-table
      :columns="columns"
      :data="torrent.trackerStats || []"
      :row-key="(row: any) => row.id"
      size="small"
      :pagination="false"
      :bordered="false"
    />
  </div>
  <ChangeTracker v-model:show="showChangeTrackerDialog" :ids="[torrent.id]" />
</template>

<script setup lang="ts">
import type { Torrent, TrackerStat } from '@/api/rpc'
import { getTrackerAnnounceState } from '@/store/torrentUtils'
import { timeToStr } from '@/utils'
import type { DataTableColumns } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{ torrent: Torrent }>()
const showChangeTrackerDialog = ref(false)

function handleChangeTracker() {
  showChangeTrackerDialog.value = true
}

// 格式化下次汇报时间
function formatNextAnnounce(row: TrackerStat): string {
  if (!row.nextAnnounceTime || row.announceState !== 1) {
    return '-'
  }
  const timestamp = row.nextAnnounceTime

  const now = Math.floor(Date.now() / 1000)
  const remaining = timestamp - now

  if (remaining <= 0) {
    return '0s'
  }

  return timeToStr(remaining)
}

// 表格列配置
const columns: DataTableColumns<TrackerStat> = [
  {
    title: t('torrentDetail.tracker.url'),
    key: 'announce',
    width: 300,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: t('torrentDetail.tracker.status'),
    key: 'status',
    width: 80,
    render: (row) => getTrackerAnnounceState(row)
  },
  {
    title: t('torrentDetail.tracker.nextAnnounce'),
    key: 'nextAnnounceTime',
    width: 120,
    render: (row) => formatNextAnnounce(row)
  },
  {
    title: t('torrentDetail.tracker.seederCount'),
    key: 'seederCount',
    width: 80,
    align: 'right',
    render: (row) => row.seederCount?.toString() || '0'
  },
  {
    title: t('torrentDetail.tracker.leecherCount'),
    key: 'leecherCount',
    width: 80,
    align: 'right',
    render: (row) => row.leecherCount?.toString() || '0'
  },
  {
    title: t('torrentDetail.tracker.downloadCount'),
    key: 'downloadCount',
    width: 80,
    align: 'right',
    render: (row) => row.downloadCount?.toString() || '0'
  }
]
</script>

<style scoped lang="less">
.tracker-tab {
  :deep(.n-data-table) {
    // 不要表格内的scroll
    .n-scrollbar {
      overflow: visible;
      .n-scrollbar-container {
        width: auto;
        height: auto;
        overflow: visible;
      }
    }
    .n-data-table-thead {
      position: sticky;
      top: calc(var(--spacing) * -3);
      background-color: var(--card-color);
      z-index: 1;
    }
  }
}
</style>
