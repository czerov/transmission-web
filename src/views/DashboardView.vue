<template>
  <n-spin v-if="loading" :show="loading" size="large" class="min-h-screen min-w-screen" />
  <div v-else :class="$style['dashboard-grid']" :style="{ gridTemplateColumns: girdLayout }">
    <!-- Header -->
    <n-layout-header :class="$style.header" bordered>
      <n-button quaternary circle @click="onSidebarToggle">
        <n-icon size="20" :component="LayoutSidebarLeftOpen" />
      </n-button>
      <AppHeader />
    </n-layout-header>

    <!-- Sidebar (PC) 可拖拽宽度 -->
    <div v-if="!isMobile" :class="$style['sidebar-container']">
      <SidebarView :class="$style.sidebar" />
      <ResizeLine v-model:container-width="sidebarWidth" :min-container-width="120" :max-container-width="600" />
    </div>

    <!-- Main Content -->
    <main :class="$style.content">
      <!-- <TorrentList /> -->
      <CanvasList />
    </main>

    <!-- Footer -->
    <StatusBar :class="$style.footer" />

    <!-- 移动端 Sidebar 抽屉 -->
    <n-drawer
      v-model:show="drawerVisible"
      placement="left"
      width="85vw"
      to="body"
      v-if="isMobile"
      :mask-closable="true"
      :class="$style['drawer-sidebar']"
    >
      <n-drawer-content>
        <SidebarView :class="$style.sidebar" />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
<script setup lang="ts">
import LayoutSidebarLeftOpen from '@/assets/icons/layoutSidebarLeft.svg?component'
import { useIsSmallScreen } from '@/composables/useIsSmallScreen'
import { useStatsStore, useTorrentStore } from '@/store'
import { useSessionStore } from '@/store/session'
const torrentStore = useTorrentStore()
const statsStore = useStatsStore()
const sessionStore = useSessionStore()
const loading = ref(true)
const drawerVisible = ref(false)
const isMobile = useIsSmallScreen()
const siderBarVisible = useLocalStorage('siderBarVisible', true)
const sidebarWidth = useStorage('sidebarWidth', 224, undefined)
const girdLayout = computed(() => {
  if (isMobile.value || !siderBarVisible.value) {
    return '0px 1fr'
  }
  return `${sidebarWidth.value}px 1fr`
})

function onSidebarToggle() {
  if (isMobile.value) {
    drawerVisible.value = !drawerVisible.value
  } else {
    siderBarVisible.value = !siderBarVisible.value
  }
}

onMounted(async () => {
  loading.value = true
  // torrentStore.startPolling()
  // statsStore.startPolling()
  await sessionStore.fetchSession()
  await torrentStore.fetchTorrents()
  await statsStore.fetchStats()
  loading.value = false
})

onUnmounted(() => {
  torrentStore.stopPolling()
  statsStore.stopPolling()
})
</script>

<style lang="less" module>
@import '@/styles/mix.less';
.dashboard-grid {
  display: grid;
  grid-template-rows: 56px 1fr 32px;
  box-sizing: border-box;
  height: 100%;
  .header {
    grid-row: 1 / 2;
    grid-column: 1 / -1;
    height: 56px;
    z-index: 10;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    overflow: hidden;
  }
}

.sidebar-container {
  grid-row: 2 / 3;
  grid-column: 1 / 2;
  height: 100%;
  position: relative;
  z-index: 2;
  background-color: var(--card-color);
  color: var(--text-color-2);
  overflow: hidden;
  display: flex;
  flex-direction: row;
  .sidebar {
    width: 100%;
    height: 100%;
    overflow: auto;
    height: 100%;
    box-sizing: border-box;
    // 美化滚动条
    .scrollbar();
  }
}

.content {
  grid-row: 2 / 3;
  grid-column: 2 / 3;
  min-width: 0;
  min-height: 0;
  overflow: auto;
}
.footer {
  grid-row: 3 / 4;
  grid-column: 1 / -1;
  height: 32px;
  z-index: 10;
  display: flex;
  align-items: center;
}

.drawer-sidebar {
  height: 100vh;
  height: 100dvh;
  padding-top: var(--top-inset);
  padding-bottom: var(--bottom-inset);
  overflow: hidden;
}
</style>
