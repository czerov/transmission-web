<template>
  <div>
    <div class="text-lg font-medium mb-2">{{ $t('networkSettings.title') }}</div>

    <n-form :label-placement="labelType" :label-width="labelType === 'top' ? undefined : 200" :model="form">
      <n-form-item :label="$t('networkSettings.connectionPort')">
        <div class="flex items-center gap-4">
          <n-input-number
            :disabled="form['peer-port-random-on-start']"
            v-model:value="form['peer-port']"
            :min="1024"
            :max="65535"
            :step="1"
            class="w-32"
          />
          <n-button type="primary" @click="testPort">{{ $t('networkSettings.testPort') }}</n-button>
        </div>
      </n-form-item>

      <n-form-item :label="$t('networkSettings.randomPortOnStart')" label-placement="left">
        <n-checkbox v-model:checked="form['peer-port-random-on-start']"> </n-checkbox>
      </n-form-item>

      <n-form-item :label="$t('networkSettings.enablePortForwarding')" label-placement="left">
        <n-checkbox v-model:checked="form['port-forwarding-enabled']"> </n-checkbox>
      </n-form-item>

      <n-form-item :label="$t('networkSettings.encryption')">
        <n-select v-model:value="form.encryption" :options="encryptionOptions" class="w-48" />
      </n-form-item>

      <n-form-item :label="$t('networkSettings.globalMaxConnections')">
        <n-input-number v-model:value="form['peer-limit-global']" :min="1" :max="10000" :step="1" class="w-32" />
      </n-form-item>

      <n-form-item :label="$t('networkSettings.singleTorrentMaxConnections')">
        <n-input-number v-model:value="form['peer-limit-per-torrent']" :min="1" :max="1000" :step="1" class="w-32" />
      </n-form-item>

      <n-form-item :label="$t('networkSettings.enableUserExchange')" label-placement="left">
        <n-checkbox v-model:checked="form['pex-enabled']"> </n-checkbox>
      </n-form-item>

      <n-form-item :label="$t('networkSettings.enableDHT')" label-placement="left">
        <n-checkbox v-model:checked="form['dht-enabled']"> </n-checkbox>
      </n-form-item>

      <n-form-item :label="$t('networkSettings.enableLPD')" label-placement="left">
        <n-checkbox v-model:checked="form['lpd-enabled']"> </n-checkbox>
      </n-form-item>

      <n-form-item :label="$t('networkSettings.enableBandwidthManagement')" label-placement="left">
        <n-checkbox v-model:checked="form['utp-enabled']"> </n-checkbox>
      </n-form-item>

      <n-form-item>
        <template #label>
          <n-checkbox v-model:checked="form['blocklist-enabled']">{{
            $t('networkSettings.enableBlocklist')
          }}</n-checkbox>
        </template>
        <n-input
          v-model:value="form['blocklist-url']"
          :placeholder="$t('networkSettings.blocklistUrlPlaceholder')"
          class="w-80"
        />
      </n-form-item>

      <n-form-item>
        <template #label>{{ $t('networkSettings.availableRules', { count: form['blocklist-size'] }) }}</template>
        <n-button type="primary" @click="updateBlocklist">{{ $t('networkSettings.updateBlocklist') }}</n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { rpc } from '@/api/rpc'
import { useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useIsSmallScreen } from '@/composables/useIsSmallScreen'
const isMobile = useIsSmallScreen()
const labelType = computed(() => (isMobile.value ? 'top' : 'left'))
const { t: $t } = useI18n()
const form = defineModel<any>('form', { required: true })
const message = useMessage()

const encryptionOptions = computed(() => [
  { label: $t('networkSettings.allowEncryption'), value: 'tolerated' },
  { label: $t('networkSettings.preferEncryption'), value: 'preferred' },
  { label: $t('networkSettings.requireEncryption'), value: 'required' }
])

async function testPort() {
  message.info($t('networkSettings.testingPort'))
  const res = await rpc.portTest()
  if (res?.arguments?.['port-is-open'] as boolean) {
    message.success($t('networkSettings.portTestSuccess'))
  } else {
    message.error($t('networkSettings.portTestFailed'))
  }
}

async function updateBlocklist() {
  message.info($t('networkSettings.updatingBlocklist'))
  const res = await rpc.blocklistUpdate()
  if ((res?.arguments?.['blocklist-size'] as number) >= 0) {
    form.value['blocklist-size'] = res.arguments['blocklist-size']
    message.success($t('networkSettings.updateBlocklistSuccess'))
  } else {
    message.error($t('networkSettings.updateBlocklistFailed'))
  }
}
</script>

<style scoped lang="less"></style>
