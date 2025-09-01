<template>
  <n-modal
    v-model:show="show"
    preset="dialog"
    title="修改种子tracker"
    :close-on-esc="true"
    class="w-auto! max-w-[600px]"
    @close="onCancel"
  >
    <div class="mb-2">选中总数：{{ localSelectedKeys.length }}</div>
    <div class="flex items-center justify-between">
      <div>Tracker 列表一行一个</div>
      <n-button type="primary" @click="onAddTracker">追加默认tracker</n-button>
    </div>
    <n-form label-placement="top">
      <n-form-item>
        <template #label> </template>
        <n-input
          v-model:value="tracker"
          placeholder="请输入tracker列表，一行一个"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 10 }"
        />
      </n-form-item>
    </n-form>
    <template #action>
      <n-button @click="onCancel" :loading="loading">取消</n-button>
      <n-button type="primary" @click="onConfirm" :loading="loading">确定</n-button>
    </template>
  </n-modal>
</template>
<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { useSettingStore, useTorrentStore, useSessionStore } from '@/store'
import { rpc } from '@/api/rpc'

const show = defineModel<boolean>('show', { required: true })
const message = useMessage()
const torrentStore = useTorrentStore()
const settingStore = useSettingStore()
const sessionStore = useSessionStore()
const loading = ref(false)
const localSelectedKeys = ref<number[]>([])
const tracker = ref<string>('')

const props = defineProps<{
  ids?: number[]
}>()

watch(
  () => show.value,
  (v) => {
    if (v) {
      // 默认目录为 sessionStore.session?.['download-dir'] 或第一个选中种子的 downloadDir
      localSelectedKeys.value = [...(props.ids?.length ? props.ids : torrentStore.selectedKeys)]
      const firstTorrent = torrentStore.torrents.find((t) => localSelectedKeys.value.includes(t.id))
      tracker.value = firstTorrent?.trackerList || firstTorrent?.trackerStats.map((t) => t.announce).join('\n') || ''
      console.debug(localSelectedKeys.value)
    } else {
      localSelectedKeys.value = []
    }
  }
)
async function onConfirm() {
  loading.value = true
  try {
    await rpc.torrentSet({ ids: localSelectedKeys.value, trackerList: tracker.value || '' })
    show.value = false
    message.success('tracker修改成功')
    await torrentStore.fetchTorrents()
  } catch {
    message.error('tracker修改失败')
  } finally {
    loading.value = false
  }
}
function onCancel() {
  show.value = false
}
function onAddTracker() {
  let defaultTrackers = settingStore.setting.defaultTrackers
  if (sessionStore.session?.['default-trackers']) {
    defaultTrackers = sessionStore.session?.['default-trackers'].split('\n')
  }
  const trackerList = tracker.value.split('\n')
  if (defaultTrackers) {
    tracker.value = [...new Set([...trackerList, ...defaultTrackers])].join('\n')
  }
}
</script>
<style scoped lang="less">
.mb-2 {
  margin-bottom: 0.5rem;
}
</style>
