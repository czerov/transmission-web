<template>
  <div class="py-3 space-y-3 peers-tab" style="min-width: 1024px">
    <n-card size="small" :bordered="false" title="连接概览" style="width: 400px">
      <div class="grid grid-cols-2 gap-y-2 gap-x-6 text-sm">
        <div>正在向我们上传</div>
        <div>{{ torrent.peersSendingToUs }}</div>
        <div>正在从我们下载</div>
        <div>{{ torrent.peersGettingFromUs }}</div>
      </div>
    </n-card>

    <n-card size="small" :bordered="false" title="Peer 列表">
      <div class="text-xs mb-2">
        来源统计：Tracker {{ torrent.peersFrom?.fromTracker ?? 0 }}，DHT {{ torrent.peersFrom?.fromDht ?? 0 }}，PEX
        {{ torrent.peersFrom?.fromPex ?? 0 }}，缓存 {{ torrent.peersFrom?.fromCache ?? 0 }}
      </div>
      <n-data-table
        :columns="columns"
        :data="peerData"
        :pagination="pagination"
        size="small"
        :bordered="false"
        :paginate-single-page="false"
      />
    </n-card>
  </div>
</template>

<script setup lang="ts">
import type { Torrent, Peer } from '@/api/rpc'
import type { DataTableColumns } from 'naive-ui'
import { formatSpeed } from '@/utils'
import { h, computed } from 'vue'
import { NProgress } from 'naive-ui'

const props = defineProps<{ torrent: Torrent }>()

// 计算 peer 数据
const peerData = computed(() => {
  return (props.torrent.peers || []).map((peer: Peer) => ({
    ...peer,
    key: `${peer.address}:${peer.port || 0}`
  }))
})

// 分页配置
const pagination = {
  pageSize: 100,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100]
}

// 表格列配置
const columns: DataTableColumns<Peer & { key: string }> = [
  {
    title: 'IP',
    key: 'address',
    width: 305
  },
  {
    title: '端口',
    key: 'port',
    width: 70,
    render: (row) => row.port || '-'
  },
  {
    title: '客户端',
    key: 'clientName',
    width: 140,
    render: (row) => row.clientName || '-'
  },
  {
    title: '进度',
    key: 'progress',
    width: 100,
    render: (row) => {
      const percentage = row.progress ? Number((row.progress * 100).toFixed(2)) : 0
      return h(NProgress, {
        type: 'line',
        size: 'small',
        percentage: percentage,
        'indicator-placement': 'inside',
        processing: !(row.progress === 1),
        'show-indicator': false
      })
    }
  },
  {
    title: '上传速度',
    key: 'rateToPeer',
    width: 120,
    align: 'right',
    render: (row) => formatSpeed(row.rateToPeer || 0)
  },
  {
    title: '下载速度',
    key: 'rateToClient',
    width: 120,
    align: 'right',
    render: (row) => formatSpeed(row.rateToClient || 0)
  },
  {
    title: '加密',
    key: 'encryption',
    width: 60,
    render: (row) => getEncryptionStatus(row.flagStr)
  },
  {
    title: '状态',
    key: 'status',
    width: 60,
    render: (row) => getPeerStatus(row)
  }
]

// 获取加密状态
const getEncryptionStatus = (flagStr?: string) => {
  if (!flagStr) {
    return '否'
  }
  // 检查是否包含加密标志 'E' (Encrypted)
  // E: 表示连接已加密
  return flagStr.includes('E') ? '是' : '否'
}

// Flag meanings: https://github.com/transmission/transmission/blob/main/docs/Peer-Status-Text.md

const statusFlagStrings = {
  O: 'O',
  D: 'D',
  d: 'd',
  U: 'U',
  u: 'u',
  K: 'K',
  '?': '?'
} as const

// 获取 Peer 状态
const getPeerStatus = (peer: Peer) => {
  const flags = peer.flagStr as string
  const status = [...flags.matchAll(/[ODdUuK?]/g)].map((s) => statusFlagStrings[s[0] as keyof typeof statusFlagStrings])

  return status.join('') || '-'
}
</script>

<style scoped lang="less">
.peers-tab {
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
