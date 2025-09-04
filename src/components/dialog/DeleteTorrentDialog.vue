<template>
  <n-modal
    v-model:show="show"
    preset="dialog"
    :title="$t('deleteDialog.title')"
    @close="onCancel"
    :close-on-esc="true"
    style="padding: 12px; width: 90vw; max-width: 600px"
  >
    <div class="mb-2">{{ $t('deleteDialog.confirmText') }}</div>
    <div class="mb-2">{{ $t('deleteDialog.selectedCount', { count: selectTorrents.length }) }}</div>
    <n-el class="max-h-[600px] scrollbar">
      <div v-for="t in selectTorrents" :key="t.id" class="px-2 mb-1">{{ t.name }}</div>
    </n-el>
    <n-checkbox v-model:checked="deleteData">{{ $t('deleteDialog.deleteData') }}</n-checkbox>
    <br />
    <n-checkbox v-model:checked="onlyIfNoSeed">{{ $t('deleteDialog.deleteIfNoSeed') }}</n-checkbox>
    <template #action>
      <n-button @click="onCancel" :loading="loading">{{ $t('common.cancel') }}</n-button>
      <n-button type="error" @click="onConfirm" :loading="loading">{{ $t('deleteDialog.delete') }}</n-button>
    </template>
  </n-modal>
</template>
<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { useTorrentStore } from '@/store'
import { rpc } from '@/api/rpc'
import { ensurePathDelimiter, fileSystemSafeName, sleep } from '@/utils'
import { useI18n } from 'vue-i18n'
const show = defineModel<boolean>('show', { required: true })
const message = useMessage()
const torrentStore = useTorrentStore()
const { t: $t } = useI18n()
const loading = ref(false)
const deleteData = ref(false)
const onlyIfNoSeed = ref(false)
const props = defineProps<{
  ids?: number[]
}>()
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
      localSelectedKeys.value = props.ids?.length ? props.ids : torrentStore.selectedKeys
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
      message.error($t('deleteDialog.deleteFailed'))
      return
    }
    if (!props.ids?.length) {
      torrentStore.clearSelectedKeys()
    }
    show.value = false
    message.success($t('deleteDialog.deleteSuccess'))
    await sleep(1000)
    await torrentStore.fetchTorrents()
  } catch (error) {
    console.error(error)
    message.error($t('deleteDialog.deleteFailed'))
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
