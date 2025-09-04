<template>
  <div>
    <div class="text-lg font-medium mb-2">{{ $t('queueSettings.title') }}</div>

    <n-form :label-placement="labelType" :label-width="labelType === 'top' ? undefined : 270" :model="form">
      <n-form-item label-align="left">
        <template #label>
          <n-checkbox v-model:checked="form['download-queue-enabled']">{{
            $t('queueSettings.enableDownloadQueue')
          }}</n-checkbox>
        </template>
        <n-input-number
          v-model:value="form['download-queue-size']"
          :min="1"
          :step="10"
          :disabled="!form['download-queue-enabled']"
          class="w-32"
        />
      </n-form-item>

      <n-form-item label-align="left">
        <template #label>
          <n-checkbox v-model:checked="form['seed-queue-enabled']">{{
            $t('queueSettings.enableSeedQueue')
          }}</n-checkbox>
        </template>
        <n-input-number
          v-model:value="form['seed-queue-size']"
          :min="1"
          :step="10"
          :disabled="!form['seed-queue-enabled']"
          class="w-32"
        />
      </n-form-item>

      <n-form-item label-align="left">
        <template #label>
          <n-checkbox v-model:checked="form['queue-stalled-enabled']">{{
            $t('queueSettings.queueStalledEnabled')
          }}</n-checkbox>
        </template>
        <div class="flex items-center gap-2">
          <n-input-number
            v-model:value="form['queue-stalled-minutes']"
            :min="1"
            :step="10"
            :disabled="!form['queue-stalled-enabled']"
            class="w-32"
          />
          <span>{{ $t('common.minutes') }}</span>
        </div>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useIsSmallScreen } from '@/composables/useIsSmallScreen'
const isMobile = useIsSmallScreen()
const labelType = computed(() => (isMobile ? 'top' : 'left'))
const { t: $t } = useI18n()
const form = defineModel<any>('form', { required: true })

// 设置默认值
onMounted(() => {
  if (form.value['download-queue-enabled'] === undefined) {
    form.value['download-queue-enabled'] = true
  }
  if (!form.value['download-queue-size']) {
    form.value['download-queue-size'] = 3
  }
  if (form.value['seed-queue-enabled'] === undefined) {
    form.value['seed-queue-enabled'] = false
  }
  if (!form.value['seed-queue-size']) {
    form.value['seed-queue-size'] = 10
  }
  if (form.value['queue-stalled-enabled'] === undefined) {
    form.value['queue-stalled-enabled'] = false
  }
  if (!form.value['queue-stalled-minutes']) {
    form.value['queue-stalled-minutes'] = 30
  }
})
</script>

<style scoped lang="less"></style>
