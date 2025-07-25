<template>
  <div>
    <div class="text-lg font-medium mb-2">下载设置</div>
    <n-form label-placement="left" label-width="230" :model="form">
      <n-form-item label="默认保存目录">
        <n-input v-model:value="form['download-dir']" placeholder="/share/media2" class="w-80" />
      </n-form-item>

      <n-form-item label="在未完成的文件名后加上'.part'后缀">
        <n-checkbox v-model:checked="form['rename-partial-files']"> </n-checkbox>
      </n-form-item>

      <n-form-item label="启用临时目录">
        <n-checkbox v-model:checked="form['incomplete-dir-enabled']"> </n-checkbox>
      </n-form-item>

      <n-form-item label="临时目录" v-if="form['incomplete-dir-enabled']">
        <n-input v-model:value="form['incomplete-dir']" placeholder="/share/media2/incomplete" class="w-80" />
      </n-form-item>

      <div class="border-t pt-4 border-color-[var(--border-color)]">
        <div class="text-base font-medium mb-2">做种设置</div>
        <n-form-item>
          <template #label>
            <n-checkbox v-model:checked="form['seedRatioLimited']"> 默认分享率上限</n-checkbox>
          </template>
          <n-input-number v-model:value="form['seedRatioLimit']" :min="0" :step="0.1" :precision="2" class="w-32" />
        </n-form-item>
        <n-form-item>
          <template #label>
            <n-checkbox v-model:checked="form['idle-seeding-limit-enabled']"> 默认停止无流量种子持续时间</n-checkbox>
          </template>
          <n-input-number v-model:value="form['idle-seeding-limit']" :min="1" :step="1" class="w-32" />
          <span class="ml-2">分钟</span>
        </n-form-item>
      </div>
      <div class="border-t pt-4 border-color-[var(--border-color)]">
        <div class="text-base font-medium mb-2">缓存设置</div>
        <n-form-item label="磁盘缓存大小">
          <n-input-number v-model:value="form['cache-size-mb']" :min="1" :step="1" class="w-32" />
          <span class="ml-2">MB</span>
        </n-form-item>
      </div>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import type { SessionArguments } from '@/api/rpc'
const form = defineModel<SessionArguments>('form', { required: true })
</script>

<style scoped lang="less">
.space-y-6 > * + * {
  margin-top: 1.5rem;
}
</style>
