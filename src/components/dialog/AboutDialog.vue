<template>
  <n-modal :show="show" @update:show="onUpdateShow" preset="dialog">
    <template #header>
      <div class="font-bold text-lg">关于 Transmission Web</div>
    </template>
    <div>
      <div>Transmission Web 前端</div>
      <div>版本: {{ session?.['version'] ?? '--' }}</div>
      <div>服务器: {{ serverHost }}</div>
      <div class="mt-2">作者: jianxcao@126.com</div>
    </div>
    <template #action>
      <n-button type="primary" @click="onUpdateShow(false)">关闭</n-button>
    </template>
  </n-modal>
</template>
<script setup lang="ts">
import { useSessionStore } from '@/store'
import { useSettingStore } from '@/store'
const settingStore = useSettingStore()
const { show } = defineProps<{ show: boolean }>()
const emit = defineEmits(['update:show'])
function onUpdateShow(v: boolean) {
  emit('update:show', v)
}
const sessionStore = useSessionStore()
const session = computed(() => sessionStore.session)
const serverHost = settingStore.serverHost
</script>
