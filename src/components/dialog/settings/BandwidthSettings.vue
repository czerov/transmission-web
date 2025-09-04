<template>
  <div>
    <div class="text-lg font-medium mb-2">{{ $t('bandwidthSettings.title') }}</div>
    <n-form :label-placement="labelType" :label-width="labelType === 'top' ? undefined : 180" :model="form">
      <div class="flex flex-row gap-4 flex-wrap">
        <div class="min-w-[360px]">
          <div class="text-base font-medium mb-2">{{ $t('bandwidthSettings.normal') }}</div>
          <n-form-item>
            <template #label>
              <n-checkbox v-model:checked="form['speed-limit-down-enabled']">{{
                $t('bandwidthSettings.maxDownloadSpeed')
              }}</n-checkbox>
            </template>
            <n-input-number
              v-model:value="form['speed-limit-down']"
              :min="0"
              :step="1024"
              :disabled="!form['speed-limit-down-enabled']"
              class="w-32"
            />
          </n-form-item>

          <n-form-item>
            <template #label>
              <n-checkbox v-model:checked="form['speed-limit-up-enabled']">{{
                $t('bandwidthSettings.maxUploadSpeed')
              }}</n-checkbox>
            </template>
            <n-input-number
              v-model:value="form['speed-limit-up']"
              :min="0"
              :step="1024"
              :disabled="!form['speed-limit-up-enabled']"
              class="w-32"
            />
          </n-form-item>
        </div>

        <div class="min-w-[360px]">
          <div class="text-base font-medium mb-2">{{ $t('bandwidthSettings.backup') }}</div>
          <n-form-item :label="$t('bandwidthSettings.maxDownloadSpeed')">
            <n-input-number v-model:value="form['alt-speed-down']" :min="0" :step="1024" class="w-32" />
          </n-form-item>

          <n-form-item :label="$t('bandwidthSettings.maxUploadSpeed')">
            <n-input-number v-model:value="form['alt-speed-up']" :min="0" :step="1024" class="w-32" />
          </n-form-item>
        </div>
      </div>

      <n-form-item :label="$t('bandwidthSettings.enableBackupBandwidth')" label-placement="left">
        <n-checkbox v-model:checked="form['alt-speed-enabled']"> </n-checkbox>
      </n-form-item>

      <div class="flex flex-row gap-2 flex-wrap">
        <n-form-item :label="$t('bandwidthSettings.autoEnableBackup')" label-width="240" label-placement="left">
          <n-checkbox v-model:checked="form['alt-speed-time-enabled']"> </n-checkbox>
        </n-form-item>
        <div class="flex flex-row gap-2">
          <n-form-item
            :label="$t('bandwidthSettings.from')"
            label-width="50"
            v-if="form['alt-speed-time-enabled']"
            label-placement="left"
          >
            <n-time-picker v-model:value="altSpeedTimeBegin" format="HH:mm" class="w-32" />
          </n-form-item>
          <n-form-item
            :label="$t('bandwidthSettings.to')"
            label-width="30"
            v-if="form['alt-speed-time-enabled']"
            label-placement="left"
          >
            <n-time-picker v-model:value="altSpeedTimeEnd" format="HH:mm" class="w-32" />
          </n-form-item>
        </div>
      </div>
      <div v-if="form['alt-speed-time-enabled']" class="flex content-between items-center gap-4 flex-wrap pl-[20px]">
        <n-checkbox
          v-for="(day, index) in DaysOfTheWeek"
          :key="day"
          :checked="getChecked(index)"
          @update:checked="setChecked(index, $event)"
          >{{ day }}</n-checkbox
        >
      </div>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import type { SessionArguments } from '@/api/rpc'
import { useIsSmallScreen } from '@/composables/useIsSmallScreen'
import { useSessionStore } from '@/store'
import { useI18n } from 'vue-i18n'
const isMobile = useIsSmallScreen()
const labelType = computed(() => (isMobile ? 'top' : 'left'))
const { t: $t } = useI18n()
const DaysOfTheWeek = computed(() => [
  $t('bandwidthSettings.sunday'),
  $t('bandwidthSettings.monday'),
  $t('bandwidthSettings.tuesday'),
  $t('bandwidthSettings.wednesday'),
  $t('bandwidthSettings.thursday'),
  $t('bandwidthSettings.friday'),
  $t('bandwidthSettings.saturday')
])
const form = defineModel<SessionArguments>('form', { required: true })
const sessionStore = useSessionStore()
const session = computed(() => sessionStore.session)
const getChecked = (day: number) => {
  const val = form.value?.['alt-speed-time-day'] || 0
  return (val & (1 << day)) > 0
}

const setChecked = (day: number, checked: boolean) => {
  if (!form.value || form.value['alt-speed-time-day'] === undefined) {
    return
  }
  if (checked) {
    form.value['alt-speed-time-day'] |= 1 << day
  } else {
    form.value['alt-speed-time-day'] &= ~(1 << day)
  }
}

// 时间转换
const altSpeedTimeBegin = computed({
  get() {
    // 将分钟数转换为时间戳
    const minutes = form.value['alt-speed-time-begin'] || 1080 // 18:00
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    const now = new Date()
    now.setHours(hours, mins, 0, 0)
    return now.getTime()
  },
  set(value: number | null) {
    if (value) {
      const date = new Date(value)
      form.value['alt-speed-time-begin'] = date.getHours() * 60 + date.getMinutes()
    }
  }
})

const altSpeedTimeEnd = computed({
  get() {
    // 将分钟数转换为时间戳
    const minutes = form.value['alt-speed-time-end'] || 1439 // 23:59
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    const now = new Date()
    now.setHours(hours, mins, 0, 0)
    return now.getTime()
  },
  set(value: number | null) {
    if (value) {
      const date = new Date(value)
      form.value['alt-speed-time-end'] = date.getHours() * 60 + date.getMinutes()
    }
  }
})
function initForm() {
  if (session.value) {
    form.value['speed-limit-down'] = session.value?.['speed-limit-down'] ?? 100000
    form.value['speed-limit-up'] = session.value?.['speed-limit-up'] ?? 2048
    form.value['speed-limit-down-enabled'] = session.value?.['speed-limit-down-enabled'] ?? false
    form.value['speed-limit-up-enabled'] = session.value?.['speed-limit-up-enabled'] ?? false
    form.value['alt-speed-enabled'] = session.value?.['alt-speed-enabled'] ?? false
    form.value['alt-speed-time-enabled'] = session.value?.['alt-speed-time-enabled'] ?? false
    form.value['alt-speed-time-begin'] = session.value?.['alt-speed-time-begin'] ?? 1080
    form.value['alt-speed-time-end'] = session.value?.['alt-speed-time-end'] ?? 1439
    form.value['alt-speed-time-day'] = session.value?.['alt-speed-time-day'] ?? 0
    form.value['alt-speed-down'] = session.value?.['alt-speed-down'] ?? 30000
    form.value['alt-speed-up'] = session.value?.['alt-speed-up'] ?? 1024
  }
}
// 设置默认值
onMounted(() => {
  initForm()
})

watch(session, () => {
  if (session.value) {
    initForm()
  }
})
</script>

<style scoped lang="less"></style>
