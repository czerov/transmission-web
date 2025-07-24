<template>
  <n-modal
    v-model:show="show"
    preset="dialog"
    title="更改下载目录"
    :close-on-esc="true"
    class="w-auto! max-w-[600px]"
    @close="onCancel"
  >
    <div class="mb-2">选中总数：{{ localSelectedKeys.length }}</div>
    <n-form label-placement="left" label-width="120">
      <n-form-item label="新目录">
        <n-auto-complete
          v-model:value="dir"
          :options="downloadDirOptions"
          placeholder="请输入新目录"
          clearable
          :get-show="() => true"
        />
      </n-form-item>
      <n-form-item>
        <n-checkbox v-model:checked="moveData"> 同时移动数据（如不勾选，则从新目录下查找文件） </n-checkbox>
      </n-form-item>
    </n-form>
    <template #action>
      <n-button @click="onCancel" :loading="loading">取消</n-button>
      <n-button type="primary" @click="onConfirm" :loading="loading" :disabled="!dir.trim()">确定</n-button>
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
const moveData = ref(true)
const dir = ref('')
const localSelectedKeys = ref<number[]>([])

const downloadDirOptions = computed(() =>
  torrentStore.downloadDirOptions
    .filter((item: any) => item.key !== 'all')
    .map((item: any) => ({
      label: item.label.replace(/（.*?）/, ''),
      value: item.key
    }))
)
watch(
  () => show.value,
  (v) => {
    if (v) {
      moveData.value = true
      // 默认目录为 sessionStore.session?.['download-dir'] 或第一个选中种子的 downloadDir
      const firstTorrent = torrentStore.torrents.find((t) => torrentStore.selectedKeys.includes(t.id))
      dir.value = firstTorrent?.downloadDir || sessionStore.session?.['download-dir'] || ''
      localSelectedKeys.value = [...torrentStore.selectedKeys]
    } else {
      localSelectedKeys.value = []
    }
  }
)
async function onConfirm() {
  if (!dir.value.trim()) {
    message.error('请输入新目录')
    return
  }
  loading.value = true
  try {
    await rpc.torrentSetLocation(localSelectedKeys.value, dir.value.trim(), moveData.value)
    show.value = false
    message.success('目录更改成功')
    await torrentStore.fetchTorrents()
  } catch {
    message.error('目录更改失败')
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
