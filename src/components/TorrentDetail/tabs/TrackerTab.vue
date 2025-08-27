<template>
  <div style="min-width: 740px" class="tracker-tab">
    <n-button @click="handleChangeTracker" size="small" class="mb-2">修改 Tracker</n-button>
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
import { timeToStr } from '@/utils'
import type { DataTableColumns } from 'naive-ui'

defineProps<{ torrent: Torrent }>()
const showChangeTrackerDialog = ref(false)

function handleChangeTracker() {
  showChangeTrackerDialog.value = true
}

// 格式化状态
function formatStatus(tracker: TrackerStat): string {
  if (tracker.announceState === 3) {
    return '工作(上传中)'
  }
  if (tracker.hasAnnounced as boolean) {
    if (tracker.lastAnnounceSucceeded as boolean) {
      return '工作'
    }
    if (tracker.lastAnnounceResult === 'Success') {
      return '工作'
    }
    return tracker.lastAnnounceResult
  }
  return '未知'
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
    title: 'URL',
    key: 'announce',
    width: 300,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '状态',
    key: 'status',
    width: 80,
    render: (row) => formatStatus(row)
  },
  {
    title: '下次汇报',
    key: 'nextAnnounceTime',
    width: 120,
    render: (row) => formatNextAnnounce(row)
  },
  {
    title: '做种数',
    key: 'seederCount',
    width: 80,
    align: 'right',
    render: (row) => row.seederCount?.toString() || '0'
  },
  {
    title: '用户数',
    key: 'leecherCount',
    width: 80,
    align: 'right',
    render: (row) => row.leecherCount?.toString() || '0'
  },
  {
    title: '下载数',
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
