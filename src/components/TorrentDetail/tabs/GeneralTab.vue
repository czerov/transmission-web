<template>
  <n-element class="py-3 space-y-3">
    <n-progress
      class="px-3"
      :percentage="Math.ceil(torrent.percentDone * 100)"
      type="line"
      size="large"
      :processing="torrent.percentDone !== 1"
      indicator-placement="inside"
    />
    <n-card title="传输信息">
      <div class="torrent-info text-sm">
        <div class="info-item">
          <span>状态</span>
          <span>{{ statusText }}</span>
        </div>
        <div class="info-item">
          <span>已下载</span>
          <span>{{ formatSize(torrent.downloadedEver) }}</span>
        </div>
        <div class="info-item">
          <span>下载速度</span>
          <span>{{ formatSpeed(torrent.rateDownload) }}</span>
        </div>
        <div class="info-item">
          <span>下载限速</span>
          <span>{{ torrent.downloadLimited ? `${formatSpeed((torrent.downloadLimit || 0) * 1024)}` : '-' }}</span>
        </div>
        <div class="info-item">
          <span>种子|活跃</span>
          <span>{{ getSeedsInfo() }}</span>
        </div>
        <div class="info-item">
          <span>Tracker</span>
          <span class="truncate" :title="getMainTracker()">{{ getMainTracker() }}</span>
        </div>

        <div class="info-item">
          <span>错误</span>
          <span :title="torrent.errorString">{{ torrent.errorString || '-' }}</span>
        </div>
        <div class="info-item">
          <span>已上传</span>
          <span>{{ formatSize(torrent.uploadedEver) }}</span>
        </div>
        <div class="info-item">
          <span>上传速度</span>
          <span>{{ formatSpeed(torrent.rateUpload) }}</span>
        </div>
        <div class="info-item">
          <span>上传限速</span>
          <span>{{ torrent.uploadLimited ? `${formatSpeed((torrent.uploadLimit || 0) * 1024)}` : '-' }}</span>
        </div>
        <div class="info-item">
          <span>下载|活跃</span>
          <span>{{ getPeersInfo() }}</span>
        </div>
        <div class="info-item">
          <span>下次汇报时间</span>
          <span>{{ getNextAnnounceTime() }}</span>
        </div>

        <div class="info-item">
          <span>剩余</span>
          <span>{{ timeToStr(torrent.eta || 0) }} ({{ formatSize(torrent.leftUntilDone) }})</span>
        </div>
        <div class="info-item">
          <span>丢弃</span>
          <span>{{ getWasted() }}</span>
        </div>
        <div class="info-item">
          <span>分享率</span>
          <span>{{ getShareRatio() }}</span>
        </div>
        <div class="info-item">
          <span>备用带宽</span>
          <span>{{ torrent.group || '-' }}</span>
        </div>
        <div class="info-item">
          <span>最大链接数</span>
          <span>{{ torrent.maxConnectedPeers }}</span>
        </div>
        <div class="info-item">
          <span>最后活动时间</span>
          <span>{{ formatDate(torrent.activityDate) }}</span>
        </div>
      </div>
    </n-card>

    <!-- 种子信息 -->
    <n-card title="种子信息">
      <div class="text-sm torrent-info">
        <div>
          <div class="info-item">
            <span>保存目录</span>
            <span class="truncate text-left" :title="torrent.downloadDir">{{ torrent.downloadDir }}</span>
          </div>
          <div class="info-item">
            <span>总大小</span>
            <span>{{ formatSize(torrent.totalSize) }} (已下载 {{ formatSize(torrent.downloadedEver) }})</span>
          </div>
          <div class="info-item">
            <span>Hash</span>
            <span :title="torrent.hashString">{{ torrent.hashString || '-' }}</span>
          </div>
          <div class="info-item">
            <span>添加时间</span>
            <span>{{ formatDate(torrent.addedDate) }}</span>
          </div>
          <div class="info-item">
            <span>磁力链接</span>
            <span :title="torrent.magnetLink">{{ torrent.magnetLink || '-' }}</span>
          </div>
        </div>
        <div>
          <div class="info-item">
            <span>创建日期</span>
            <span v-if="torrent.dateCreated">{{ formatDate(torrent.dateCreated) }}</span>
            <span v-else-if="torrent.creator">{{ ` by ${torrent.creator as string}` }}</span>
            <span v-else>-</span>
          </div>
          <div class="info-item">
            <span>块</span>
            <span>{{ getBlocksInfo() }}</span>
          </div>
          <div class="info-item">
            <span>注释</span>
            <span class="truncate" :title="torrent.comment">{{ torrent.comment || '-' }}</span>
          </div>
          <div class="info-item">
            <span>完成时间</span>
            <span>{{ formatDate(torrent.doneDate) }}</span>
          </div>
          <div class="info-item">
            <span>用户标签</span>
            <div class="flex gap-1 flex-1">
              <n-tag v-for="label in torrent.labels" :key="label" size="small" type="primary">
                {{ label }}
              </n-tag>
              <span v-if="!torrent.labels?.length">-</span>
            </div>
          </div>
        </div>
      </div>
    </n-card>
  </n-element>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Torrent } from '@/api/rpc'
import { formatSpeed, formatSize, timeToStr } from '@/utils'
import { StatusStrings } from '@/types/tr'
import dayjs from 'dayjs'

const props = defineProps<{ torrent: Torrent }>()

const statusText = computed(() => StatusStrings[props.torrent.status] || '-')

function formatDate(ts?: number) {
  if (!ts) {
    return '-'
  }
  try {
    return dayjs(ts * 1000).format('YYYY/MM/DD HH:mm:ss')
  } catch {
    return '-'
  }
}

function getSeedsInfo() {
  const totalSeeds = props.torrent.cachedSeedsTotal
  const sending = props.torrent.peersGettingFromUs || 0
  return totalSeeds < 0 ? `${sending}` : `${totalSeeds} (${sending})`
}

function getPeersInfo() {
  const totalPeers = props.torrent.cachedPeersTotal
  const getting = props.torrent.peersGettingFromUs || 0
  return totalPeers < 0 ? `${getting}` : `${totalPeers} (${getting})`
}

function getMainTracker() {
  return props.torrent.trackerStats?.[0]?.host || props.torrent.cachedMainTracker || '-'
}

// TrackerStats' announceState
// TrackerInactive = 0
// TrackerWaiting = 1
// TrackerQueued = 2
// TrackerActive = 3
function getNextAnnounceTime() {
  const trackerStat = props.torrent.trackerStats[0]
  if (!trackerStat) {
    return '-'
  }
  const state = trackerStat.announceState
  if (state === 2 || state === 3) {
    return '-'
  }
  const nextTime = trackerStat.nextAnnounceTime
  if (!nextTime) {
    return '-'
  }
  return formatDate(nextTime)
}

function getShareRatio() {
  const ratio = props.torrent.uploadRatio || 0
  const seedingTime = timeToStr(props.torrent.secondsSeeding || 0)
  return `${ratio.toFixed(2)}` + (seedingTime ? ` (${seedingTime})` : '')
}

function getBlocksInfo() {
  if (props.torrent.totalSize <= 0) {
    return '?'
  }
  const pieceSize = formatSize(props.torrent.pieceSize)
  let have = 0
  if (props.torrent.totalSize === props.torrent.haveValid) {
    have = props.torrent.pieceCount
  } else {
    have = props.torrent.haveValid / (props.torrent.pieceSize! > 0 ? props.torrent.pieceSize! : 1)
  }

  return `${props.torrent.pieceCount as number} x ${pieceSize} (已完成 ${Math.round(have)})`
}

function getWasted() {
  const hashfails = props.torrent.pieceSize! > 0 ? props.torrent.corruptEver! / props.torrent.pieceSize! || 0 : 0
  return `${formatSize(props.torrent.corruptEver!)} (${hashfails} 异常)`
}
</script>

<style scoped lang="less">
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--border-color);
  min-height: 28px;
  & > span:first-child {
    text-align: left;
    width: 100px;
    &:after {
      content: ':';
      margin-right: 2px;
    }
  }
  & > span:last-child {
    text-align: left;
    flex: 1;
  }
}
.grid-rows-6 {
  grid-template-rows: repeat(6, minmax(28px, auto));
}
.torrent-info {
  display: grid;
  grid-gap: 12px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  @media (min-width: 1025px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
