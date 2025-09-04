<template>
  <div>
    <div class="text-lg font-medium mb-2">{{ $t('otherSettings.title') }}</div>

    <n-form :label-placement="labelType" :label-width="labelType === 'top' ? undefined : 220" :model="form">
      <n-form-item :label="$t('otherSettings.singleLine')">
        <n-switch v-model:value="form['single-line']" />
      </n-form-item>
      <n-form-item>
        <template #label>
          <n-checkbox v-model:checked="form['script-torrent-done-enabled']">{{
            $t('otherSettings.enableScript')
          }}</n-checkbox>
        </template>
        <n-input
          v-model:value="form['script-torrent-done-filename']"
          :placeholder="$t('otherSettings.scriptPlaceholder')"
          class="w-80"
        />
      </n-form-item>
      <n-form-item :label="$t('otherSettings.defaultTrackers')">
        <n-input
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 10 }"
          v-model:value="form['default-trackers']"
          :placeholder="$t('otherSettings.defaultTrackersPlaceholder')"
          class="w-80"
        />
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
</script>
