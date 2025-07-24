<template>
  <n-modal
    v-model:show="show"
    preset="dialog"
    title="更改标签"
    :close-on-esc="true"
    class="w-auto! max-w-[600px]"
    @close="onCancel"
  >
    <div class="mb-2">选中总数：{{ localSelectedKeys.length }}</div>
    <n-form label-placement="left" label-width="120">
      <n-form-item label="标签">
        <n-select
          v-model:value="labels"
          :options="labelsOptions"
          placeholder="请选择或输入标签"
          multiple
          clearable
          filterable
          tag
          style="width: 300px"
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
import { useTorrentStore } from '@/store'
import { rpc } from '@/api/rpc'

const show = defineModel<boolean>('show', { required: true })
const message = useMessage()
const torrentStore = useTorrentStore()
const loading = ref(false)
const labels = ref<string[]>([])
const localSelectedKeys = ref<number[]>([])

const labelsOptions = computed(() =>
  torrentStore.labelsOptions
    .filter((item: any) => item.key !== 'all' && item.key !== 'noLabels')
    .map((item: any) => ({
      label: item.label.replace(/（.*?）/, ''),
      value: item.key
    }))
)
watch(
  () => show.value,
  (v) => {
    if (v) {
      // 默认目录为 sessionStore.session?.['download-dir'] 或第一个选中种子的 downloadDir
      const firstTorrent = torrentStore.torrents.find((t) => torrentStore.selectedKeys.includes(t.id))
      labels.value = firstTorrent?.labels || []
      localSelectedKeys.value = [...torrentStore.selectedKeys]
    } else {
      localSelectedKeys.value = []
    }
  }
)
async function onConfirm() {
  loading.value = true
  try {
    await rpc.torrentSet({
      ids: localSelectedKeys.value,
      labels: labels.value || []
    })
    show.value = false
    message.success('标签更改成功')
    await torrentStore.fetchTorrents()
  } catch {
    message.error('标签更改失败')
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
