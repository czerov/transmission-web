<template>
  <footer :class="[$style.footer, props.class]">
    <div class="flex items-start gap-1 overflow-hidden flex-1 flex-wrap h-full py-[5px]">
      <n-tag v-for="(item, i) in allTags" :key="i" :type="item.type" size="small">{{ item.text }}</n-tag>
    </div>
    <div class="flex items-center gap-1 flex-shrink-0 h-full" style="width: 64px">
      <n-button
        quaternary
        circle
        size="small"
        @click="onToggleTheme"
        title="切换主题"
        class="flex items-center justify-center"
      >
        <template #icon>
          <n-icon :component="isDark ? MoonIcon : SunIcon" />
        </template>
      </n-button>
      <n-button
        quaternary
        circle
        size="small"
        @click="onShowAbout"
        title="关于"
        class="flex items-center justify-center"
      >
        <template #icon>
          <n-icon :component="InfoIcon" />
        </template>
      </n-button>
    </div>
  </footer>
  <AboutDialog v-model:show="showAbout" :version="session?.['version']" :server="serverHost" author="..." />
</template>
<script setup lang="ts">
import { useSessionStore, useSettingStore, useTorrentStore } from '@/store'
import { formatSize, formatSpeed } from '@/utils'
import { InformationCircle as InfoIcon, Moon as MoonIcon, Sunny as SunIcon } from '@vicons/ionicons5'

const props = defineProps<{
  class?: string
}>()

const sessionStore = useSessionStore()
const torrentStore = useTorrentStore()
const settingStore = useSettingStore()

const session = computed(() => sessionStore.session)
const torrents = computed(() => torrentStore.torrents)
const totalSize = computed(() => torrents.value.reduce((sum, t) => sum + (t.sizeWhenDone || 0), 0))

const computedFields = computed(() => {
  return torrents.value.reduce(
    (prev, t) => {
      prev.totalSize += t.sizeWhenDone || 0
      prev.downRate += t.rateDownload || 0
      prev.upRate += t.rateUpload || 0
      return prev
    },
    {
      totalSize: 0,
      downRate: 0,
      upRate: 0
    }
  )
})
const selectedKeys = computed(() => torrentStore.selectedKeys || [])
const selectedSize = computed(() => {
  if (!selectedKeys.value.length) {
    return 0
  }
  return torrents.value
    .filter((t) => selectedKeys.value.includes(t.id))
    .reduce((sum, t) => sum + (t.sizeWhenDone || 0), 0)
})

const limit = computed(() => {
  const downRateLimit =
    session.value !== undefined && session.value !== null
      ? session.value['alt-speed-enabled'] === true
        ? (session.value['alt-speed-down'] as number)
        : session.value['speed-limit-down-enabled'] === true
          ? (session.value['speed-limit-down'] as number)
          : -1
      : -1
  const upRateLimit =
    session.value !== undefined && session.value !== null
      ? session.value['alt-speed-enabled'] === true
        ? (session.value['alt-speed-up'] as number)
        : session.value['speed-limit-up-enabled'] === true
          ? (session.value['speed-limit-up'] as number)
          : -1
      : -1

  return {
    downRateLimit,
    upRateLimit
  }
})

const serverHost = computed(() => settingStore.serverHost)

// 主题切换（naive-ui）
const isDark = computed(() => settingStore.setting.theme === 'dark')
function onToggleTheme() {
  settingStore.setTheme(isDark.value ? 'light' : 'dark')
}

// 关于弹窗（naive-ui n-dialog）
const showAbout = ref(false)
function onShowAbout() {
  showAbout.value = true
}

// tag 数据
const allTags = computed(() => [
  { text: `TR版本: ${session.value?.['version'] ?? '--'}`, type: 'info' as const },
  { text: `服务器: ${serverHost.value}`, type: 'info' as const },
  {
    text: `↑ 上传: ${formatSpeed(computedFields.value.upRate)} (${formatSpeed(limit.value.upRateLimit * 1024)})`,
    type: 'success' as const
  },
  {
    text: `↓ 下载: ${formatSpeed(computedFields.value.downRate)} (${formatSpeed(limit.value.downRateLimit * 1024)})`,
    type: 'info' as const
  },
  { text: `文件总大小: ${formatSize(totalSize.value)}`, type: 'info' as const },
  ...(selectedSize.value > 0 ? [{ text: `选中大小: ${formatSize(selectedSize.value)}`, type: 'info' as const }] : [])
])
</script>

<style module lang="less">
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  height: 100%;
  padding: 0 8px;
  border-top: 1px solid var(--border-color);
  gap: 16px;
}
</style>
