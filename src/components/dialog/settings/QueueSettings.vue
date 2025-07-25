<template>
  <div>
    <div class="text-lg font-medium mb-2">队列设置</div>

    <n-form label-placement="left" label-width="270" :model="form">
      <n-form-item label-align="left">
        <template #label>
          <n-checkbox v-model:checked="form['download-queue-enabled']"> 启用下载队列，最大同时下载数 </n-checkbox>
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
          <n-checkbox v-model:checked="form['seed-queue-enabled']"> 启用上传队列，最大同时上传数 </n-checkbox>
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
          <n-checkbox v-model:checked="form['queue-stalled-enabled']"> 种子超过该时间无流量，移出队列 </n-checkbox>
        </template>
        <div class="flex items-center gap-2">
          <n-input-number
            v-model:value="form['queue-stalled-minutes']"
            :min="1"
            :step="10"
            :disabled="!form['queue-stalled-enabled']"
            class="w-32"
          />
          <span>分钟</span>
        </div>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
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
