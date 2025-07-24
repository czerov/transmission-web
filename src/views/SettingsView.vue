<template>
  <n-modal :show="show" @update:show="onUpdateShow" title="全局设置">
    <n-form label-placement="left" label-width="120" :model="form">
      <n-form-item label="下载目录">
        <n-input v-model:value="form['download-dir']" />
      </n-form-item>
      <n-form-item label="最大下载速度 (KB/s)">
        <n-input-number v-model:value="form['speed-limit-down']" :min="0" />
        <n-switch v-model:value="form['speed-limit-down-enabled']">启用</n-switch>
      </n-form-item>
      <n-form-item label="最大上传速度 (KB/s)">
        <n-input-number v-model:value="form['speed-limit-up']" :min="0" />
        <n-switch v-model:value="form['speed-limit-up-enabled']">启用</n-switch>
      </n-form-item>
      <n-form-item label="端口">
        <n-input-number v-model:value="form['peer-port']" :min="0" />
      </n-form-item>
      <n-form-item label="Blocklist URL">
        <n-input v-model:value="form['blocklist-url']" />
      </n-form-item>
      <n-form-item label="用户名">
        <n-input v-model:value="form['rpc-username']" />
      </n-form-item>
      <n-form-item label="密码">
        <n-input v-model:value="form['rpc-password']" type="password" />
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onSave" :loading="loading">保存</n-button>
      </n-form-item>
      <n-alert v-if="error" type="error">{{ error }}</n-alert>
    </n-form>
    <div class="mt-6">
      <div class="text-[15px] font-bold mb-2">全局标签管理</div>
      <draggable v-model="tagList" item-key="name" :animation="150">
        <template #item="{ element: tag }">
          <n-space align="center">
            <n-tag :color="tag.color" size="small">{{ tag.name }}</n-tag>
            <n-input v-model:value="tag.name" size="small" class="w-[100px]" @blur="onRenameTag(tag)" />
            <n-color-picker v-model:value="tag.color" size="small" @update:value="onUpdateTagColor(tag)" />
            <n-button size="small" type="error" @click="onRemoveTag(tag)">删除</n-button>
          </n-space>
        </template>
      </draggable>
      <n-space align="center">
        <n-input v-model:value="newTagName" size="small" placeholder="新标签名" class="w-[100px]" />
        <n-color-picker v-model:value="newTagColor" size="small" />
        <n-button size="small" type="primary" @click="onAddTag">添加标签</n-button>
      </n-space>
    </div>
  </n-modal>
</template>
<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, onMounted } from 'vue'
import { rpc } from '@/api/rpc'
import { useMessage } from 'naive-ui'
import draggable from 'vuedraggable'
const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['update:show'])
const show = ref(props.show)
watch(
  () => props.show,
  (v) => (show.value = v)
)
const onUpdateShow = (v: boolean) => emit('update:show', v)
const form = ref<any>({})
const loading = ref(false)
const error = ref('')
const message = useMessage()
const tagList = ref<{ name: string; color: string }[]>([])
const newTagName = ref('')
const newTagColor = ref('#18a058')
const tagOrderKey = 'trweb_tag_order'

async function fetchSettings() {
  try {
    const res = await rpc.sessionGet()
    form.value = { ...res?.arguments }
  } catch (e: any) {
    error.value = e.message || '获取设置失败'
  }
}
watch(show, (v) => {
  if (v) {
    fetchSettings()
  }
})

async function onSave() {
  loading.value = true
  error.value = ''
  try {
    await rpc.sessionSet(form.value)
    emit('update:show', false)
  } catch (e: any) {
    error.value = e.message || '保存失败'
  } finally {
    loading.value = false
  }
}

async function fetchTags() {
  const res = await rpc.tagGet()
  tagList.value = (res?.arguments?.tags || []).map((t: any) =>
    typeof t === 'string' ? { name: t, color: '#18a058' } : t
  )
}
onMounted(() => {
  fetchTags().then(loadTagOrder)
})
watch(show, (v) => {
  if (v) {
    fetchTags()
  }
})

async function onAddTag() {
  if (!newTagName.value.trim()) {
    return
  }
  try {
    await rpc.tagSet({ tags: [{ name: newTagName.value.trim(), color: newTagColor.value }] })
    message.success('添加成功')
    newTagName.value = ''
    newTagColor.value = '#18a058'
    fetchTags()
  } catch {
    message.error('添加失败')
  }
}
async function onRemoveTag(tag: { name: string }) {
  try {
    await rpc.tagRemove([tag.name as any])
    message.success('删除成功')
    fetchTags()
  } catch {
    message.error('删除失败')
  }
}
async function onRenameTag(tag: { name: string; color: string }) {
  try {
    await rpc.tagSet({ tags: [{ name: tag.name, color: tag.color }] })
    message.success('修改成功')
    fetchTags()
  } catch {
    message.error('修改失败')
  }
}
async function onUpdateTagColor(tag: { name: string; color: string }) {
  try {
    await rpc.tagSet({ tags: [{ name: tag.name, color: tag.color }] })
    message.success('颜色已更新')
    fetchTags()
  } catch {
    message.error('颜色更新失败')
  }
}
function saveTagOrder() {
  localStorage.setItem(tagOrderKey, JSON.stringify(tagList.value.map((t) => t.name)))
}
function loadTagOrder() {
  const order = localStorage.getItem(tagOrderKey)
  if (order) {
    const arr = JSON.parse(order)
    tagList.value.sort((a, b) => arr.indexOf(a.name) - arr.indexOf(b.name))
  }
}
watch(tagList, saveTagOrder, { deep: true })
</script>
