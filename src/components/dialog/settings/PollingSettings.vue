<template>
  <div>
    <div class="text-lg font-medium mb-2">更新间隔设置 (秒)</div>
    <n-form label-placement="left" label-width="150" :model="form">
      <n-form-item label="会话更新">
        <n-input-number v-model:value="form.sessionInterval" :min="1" :max="3600" :step="1" class="w-40" />
      </n-form-item>

      <n-form-item label="种子详情">
        <n-input-number v-model:value="form.torrentDetailInterval" :min="1" :max="3600" :step="1" class="w-40" />
      </n-form-item>

      <n-form-item label="种子列表">
        <n-input-number v-model:value="form.torrentInterval" :min="1" :max="3600" :step="1" class="w-40" />
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { useSettingStore } from '@/store'

const form = defineModel<{
  sessionInterval: number
  torrentDetailInterval: number
  torrentInterval: number
}>('form', { required: true })
const settingStore = useSettingStore()
const polling = computed(() => settingStore.setting.polling)
const initForm = () => {
  form.value.sessionInterval = polling.value.sessionInterval
  form.value.torrentDetailInterval = polling.value.torrentDetailInterval
  form.value.torrentInterval = polling.value.torrentInterval
}
onMounted(() => {
  initForm()
})
</script>

<style scoped lang="less">
.space-y-6 > * + * {
  margin-top: 1.5rem;
}
</style>
