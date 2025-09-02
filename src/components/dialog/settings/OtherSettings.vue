<template>
  <div>
    <div class="text-lg font-medium mb-2">其他设置</div>

    <n-form label-placement="left" label-width="200" :model="form">
      <n-form-item label="单行显示">
        <n-switch v-model:value="form['single-line']" />
      </n-form-item>
      <n-form-item>
        <template #label>
          <n-checkbox v-model:checked="form['script-torrent-done-enabled']"> 启用种子完成脚本 </n-checkbox>
        </template>
        <n-input v-model:value="form['script-torrent-done-filename']" placeholder="是否启用种子完成脚本" class="w-80" />
      </n-form-item>
      <n-form-item label="默认tracker列表">
        <n-input
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 10 }"
          v-model:value="form['default-trackers']"
          placeholder="默认tracker列表"
          class="w-80"
        />
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
const form = defineModel<any>('form', { required: true })
</script>
