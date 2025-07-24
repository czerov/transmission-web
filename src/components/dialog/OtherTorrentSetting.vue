<template>
  <n-modal
    v-model:show="show"
    preset="dialog"
    title="修改限速等限制属性"
    :close-on-esc="true"
    class="w-auto! max-w-[600px] min-w-[400px]"
    @close="onCancel"
  >
    <div class="mb-2">选中总数：{{ torrentStore.selectedKeys.length }}</div>
    <div class="flex items-center justify-between mb-2 gap-6">
      <n-checkbox v-model:checked="formData.honorsSessionLimits">使用全局上传限制</n-checkbox>
    </div>
    <div class="flex items-center justify-between mb-2 gap-6" v-if="sessionStore?.rpcVersion >= 18">
      <n-checkbox v-model:checked="formData.sequential_download">顺序下载</n-checkbox>
    </div>

    <div class="flex items-center justify-between mb-2 gap-6">
      <n-checkbox v-model:checked="formData.downloadLimited">启用最大下载速度限制</n-checkbox>
      <div class="flex items-center gap-1">
        <n-input-number
          v-model:value="formData.downloadLimit"
          :min="0"
          :disabled="!formData.downloadLimited"
          :step="1024"
        /><span>KB/s</span>
      </div>
    </div>

    <div class="flex items-center justify-between mb-2 gap-6">
      <n-checkbox v-model:checked="formData.uploadLimited">启用最大上传速度限制</n-checkbox>
      <div class="flex items-center gap-1">
        <n-input-number
          v-model:value="formData.uploadLimit"
          :min="0"
          :disabled="!formData.uploadLimited"
          :step="1024"
        /><span>KB/s</span>
      </div>
    </div>
    <div class="flex items-center justify-between mb-2 gap-6">
      <div>最大连接数</div>
      <n-input-number v-model:value="formData['peer-limit']" :min="0" class="mr-[32px]" />
    </div>
    <div class="flex items-center justify-between mb-2 gap-6">
      <div>分享达标自动停止做种</div>
      <div class="flex items-center gap-1">
        <n-select v-model:value="formData.seedRatioMode" :options="modeOptions" class="w-[90px]" />
        <n-input-number
          v-model:value="formData.seedRatioLimit"
          class="mr-[32px]"
          :disabled="formData.seedRatioMode !== 1"
        />
      </div>
    </div>
    <div class="flex items-center justify-between mb-2 gap-6">
      <div>超时无流量，自动停止做种</div>
      <div class="flex items-center gap-1">
        <n-select v-model:value="formData.seedIdleMode" :options="modeOptions" class="w-[90px]" />
        <n-input-number v-model:value="formData.seedIdleLimit" :disabled="formData.seedIdleMode !== 1" /><span
          >分钟</span
        >
      </div>
    </div>
    <template #action>
      <n-button @click="onCancel" :loading="loading">取消</n-button>
      <n-button type="primary" @click="onConfirm" :loading="loading">确定</n-button>
    </template>
  </n-modal>
</template>
<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { useTorrentStore, useSessionStore } from '@/store'
import { rpc } from '@/api/rpc'

const show = defineModel<boolean>('show', { required: true })
const message = useMessage()
const torrentStore = useTorrentStore()
const sessionStore = useSessionStore()
const loading = ref(false)

const formData = reactive({
  // 使用全局上传限制
  honorsSessionLimits: false,
  // 做种不活动时间限制 (分钟)
  seedIdleLimit: 30,
  // 使用哪种做种不活动模式。Use global (0), torrent (1), or unlimited (2) limit.
  seedIdleMode: 0,
  // 种子级别的分享率
  seedRatioLimit: 0,
  // 使用哪种分享率模式。Use global (0), torrent (1), or unlimited (2) limit.
  seedRatioMode: 0,
  // 按顺序下载
  sequential_download: false,
  // 启用最大下载速度限制
  downloadLimited: false,
  // 最大下载速度限制  (KBps)
  downloadLimit: 0,
  // 启用最大上传速度限制
  uploadLimited: false,
  // 最大上传速度限制  (KBps)
  uploadLimit: 0,
  // 最大连接数
  'peer-limit': 0
})

const modeOptions = [
  { label: '全局', value: 0 },
  { label: '种子', value: 1 },
  { label: '无限制', value: 2 }
]

watch(show, (v) => {
  if (v) {
    const firstTorrent = torrentStore.torrents.find((t) => torrentStore.selectedKeys.includes(t.id))
    formData.honorsSessionLimits = firstTorrent?.honorsSessionLimits || false
    formData.seedIdleLimit = firstTorrent?.seedIdleLimit || 30
    formData.seedIdleMode = firstTorrent?.seedIdleMode || 0
    formData.seedRatioLimit = firstTorrent?.seedRatioLimit || 2.0
    formData.seedRatioMode = firstTorrent?.seedRatioMode || 0
    formData.sequential_download = firstTorrent?.sequential_download || false
    formData.downloadLimited = firstTorrent?.downloadLimited || false
    formData.downloadLimit = firstTorrent?.downloadLimit || 0
    formData.uploadLimited = firstTorrent?.uploadLimited || false
    formData.uploadLimit = firstTorrent?.uploadLimit || 0
    formData['peer-limit'] = firstTorrent?.['peer-limit'] || 50
  }
})

async function onConfirm() {
  loading.value = true
  try {
    await rpc.torrentSet({ ids: torrentStore.selectedKeys, ...formData })
    show.value = false
    message.success('修改成功')
    await torrentStore.fetchTorrents()
  } catch {
    message.error('修改失败')
  } finally {
    loading.value = false
  }
}
function onCancel() {
  show.value = false
}
</script>
<style scoped lang="less">
.mb-2 {
  margin-bottom: 0.5rem;
}
</style>
