<template>
  <n-modal
    v-model:show="show"
    preset="dialog"
    title="删除种子确认"
    @close="onCancel"
    :close-on-esc="true"
    class="w-auto! max-w-[600px]"
  >
    <div class="mb-2">确认要删除已选择的种子吗？</div>
    <div class="mb-2">选中总数：{{ selectTorrents.length }}</div>
    <n-el class="max-h-[600px] scrollbar">
      <div v-for="t in selectTorrents" :key="t.id" class="truncate px-2 mb-1">{{ t.name }}</div>
    </n-el>
    <n-checkbox v-model:checked="deleteData">同时删除数据</n-checkbox>
    <br />
    <n-checkbox v-model:checked="onlyIfNoSeed">没有其他站点保种则删除数据</n-checkbox>
    <template #action>
      <n-button @click="onCancel" :loading="loading">取消</n-button>
      <n-button type="error" @click="onConfirm" :loading="loading">删除种子</n-button>
    </template>
  </n-modal>
</template>
<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { useTorrentStore } from '@/store'
import { rpc } from '@/api/rpc'
import { ensurePathDelimiter, fileSystemSafeName, sleep } from '@/utils'

const show = defineModel<boolean>('show', { required: true })
const message = useMessage()
const torrentStore = useTorrentStore()
const loading = ref(false)
const deleteData = ref(false)
const onlyIfNoSeed = ref(false)
// 本地快照
const localSelectedKeys = ref<number[]>([])
watch(
  () => show.value,
  (v) => {
    if (v) {
      deleteData.value = false
      onlyIfNoSeed.value = false
    }
    if (v) {
      // 弹窗打开时快照
      localSelectedKeys.value = [...torrentStore.selectedKeys]
    } else {
      // 弹窗关闭时清空
      localSelectedKeys.value = []
    }
  }
)
const selectTorrents = computed(() => torrentStore.torrents.filter((t) => localSelectedKeys.value.includes(t.id)))

async function onConfirm() {
  loading.value = true
  try {
    // await rpc.torrentRemove(props.keys, deleteData.value)
    let res = false
    if (onlyIfNoSeed.value) {
      const torrents = torrentStore.torrents
      const allPaths = new Map<string, number>()
      selectTorrents.value.forEach((t) => {
        const path = ensurePathDelimiter(t.downloadDir) + fileSystemSafeName(t.name)
        allPaths.set(path, 0)
      })
      torrents.forEach((t) => {
        const path = ensurePathDelimiter(t.downloadDir) + fileSystemSafeName(t.name)
        const count = allPaths.get(path) ?? -1
        if (count >= 0) {
          allPaths.set(path, count + 1)
        }
      })
      selectTorrents.value.forEach((t) => {
        const path = ensurePathDelimiter(t.downloadDir) + fileSystemSafeName(t.name)
        const count = allPaths.get(path) ?? -1
        if (count >= 0) {
          allPaths.set(path, count - 1)
        }
      })
      const notDeleteDataIds: number[] = []
      const deleteDataIds: number[] = []
      selectTorrents.value.forEach((t) => {
        const path = ensurePathDelimiter(t.downloadDir) + fileSystemSafeName(t.name)
        const count = allPaths.get(path) ?? -1
        if (count == 0) {
          deleteDataIds.push(t.id)
        } else {
          notDeleteDataIds.push(t.id)
        }
      })
      if (notDeleteDataIds.length > 0) {
        res = await rpc.torrentRemove(notDeleteDataIds, false)
      }
      if (deleteDataIds.length > 0) {
        res = await rpc.torrentRemove(deleteDataIds, true)
      }
    } else {
      res = await rpc.torrentRemove(localSelectedKeys.value, deleteData.value)
    }
    if (!res) {
      message.error('删除失败')
      return
    }
    torrentStore.clearSelectedKeys()
    show.value = false
    message.success('删除成功')
    await sleep(1000)
    await torrentStore.fetchTorrents()
  } catch (error) {
    console.error(error)
    message.error('删除失败')
  } finally {
    loading.value = false
  }
}

function onCancel() {
  show.value = false
}
</script>
<style scoped lang="less">
@import '@/styles/mix.less';
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.scrollbar {
  box-sizing: border-box;
  overflow-y: auto;
  max-height: 300px;
  .scrollbar();
}
</style>
