<template>
  <div>
    <div class="text-lg font-medium mb-2">网络设置</div>

    <n-form label-placement="left" label-width="200" :model="form">
      <n-form-item label="连接端口号">
        <div class="flex items-center gap-4">
          <n-input-number
            :disabled="form['peer-port-random-on-start']"
            v-model:value="form['peer-port']"
            :min="1024"
            :max="65535"
            :step="1"
            class="w-32"
          />
          <n-button type="primary" @click="testPort">测试端口</n-button>
        </div>
      </n-form-item>

      <n-form-item label="启动时随机选择端口">
        <n-checkbox v-model:checked="form['peer-port-random-on-start']"> </n-checkbox>
      </n-form-item>

      <n-form-item label="启用端口转发 (UPnP)">
        <n-checkbox v-model:checked="form['port-forwarding-enabled']"> </n-checkbox>
      </n-form-item>

      <n-form-item label="加密">
        <n-select v-model:value="form.encryption" :options="encryptionOptions" class="w-48" />
      </n-form-item>

      <n-form-item label="全局最大链接数">
        <n-input-number v-model:value="form['peer-limit-global']" :min="1" :max="10000" :step="1" class="w-32" />
      </n-form-item>

      <n-form-item label="单种最大链接数">
        <n-input-number v-model:value="form['peer-limit-per-torrent']" :min="1" :max="1000" :step="1" class="w-32" />
      </n-form-item>

      <n-form-item label="启用用户交换">
        <n-checkbox v-model:checked="form['pex-enabled']"> </n-checkbox>
      </n-form-item>

      <n-form-item label="启用分布式哈希表 (DHT)">
        <n-checkbox v-model:checked="form['dht-enabled']"> </n-checkbox>
      </n-form-item>

      <n-form-item label="启用本地用户发现 (LPD)">
        <n-checkbox v-model:checked="form['lpd-enabled']"> </n-checkbox>
      </n-form-item>

      <n-form-item label="启用带宽管理 (μTP)">
        <n-checkbox v-model:checked="form['utp-enabled']"> </n-checkbox>
      </n-form-item>

      <n-form-item>
        <template #label>
          <n-checkbox v-model:checked="form['blocklist-enabled']"> 启用黑名单列表 </n-checkbox>
        </template>
        <n-input v-model:value="form['blocklist-url']" placeholder="http://www.example.com/blocklist" class="w-80" />
      </n-form-item>

      <n-form-item>
        <template #label> 可用规则数量 {{ form['blocklist-size'] }} 条 </template>
        <n-button type="primary" @click="updateBlocklist">更新黑名单</n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { rpc } from '@/api/rpc'
import { useMessage } from 'naive-ui'
const form = defineModel<any>('form', { required: true })
const message = useMessage()

const encryptionOptions = [
  { label: '允许加密', value: 'tolerated' },
  { label: '优先加密', value: 'preferred' },
  { label: '必须加密', value: 'required' }
]

async function testPort() {
  message.info('正在测试端口...')
  const res = await rpc.portTest()
  if (res?.arguments?.['port-is-open'] as boolean) {
    message.success('端口测试成功')
  } else {
    message.error('端口测试失败')
  }
}

async function updateBlocklist() {
  message.info('正在更新黑名单...')
  const res = await rpc.blocklistUpdate()
  if ((res?.arguments?.['blocklist-size'] as number) >= 0) {
    form.value['blocklist-size'] = res.arguments['blocklist-size']
    message.success('更新黑名单成功')
  } else {
    message.error('更新黑名单失败')
  }
}
</script>

<style scoped lang="less"></style>
