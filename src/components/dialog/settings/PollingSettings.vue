<template>
  <div>
    <div class="text-lg font-medium mb-2">{{ $t('pollingSettings.title') }}</div>
    <n-form :label-placement="labelType" :label-width="labelType === 'top' ? undefined : 150" :model="form">
      <n-form-item :label="$t('pollingSettings.sessionUpdate')">
        <n-input-number v-model:value="form.sessionInterval" :min="1" :max="3600" :step="1" class="w-40" />
      </n-form-item>

      <n-form-item :label="$t('pollingSettings.torrentDetail')">
        <n-input-number v-model:value="form.torrentDetailInterval" :min="1" :max="3600" :step="1" class="w-40" />
      </n-form-item>

      <n-form-item :label="$t('pollingSettings.torrentList')">
        <n-input-number v-model:value="form.torrentInterval" :min="1" :max="3600" :step="1" class="w-40" />
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { useSettingStore } from '@/store'
import { useI18n } from 'vue-i18n'
import { useIsSmallScreen } from '@/composables/useIsSmallScreen'
const isMobile = useIsSmallScreen()
const labelType = computed(() => (isMobile ? 'top' : 'left'))
const { t: $t } = useI18n()
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
