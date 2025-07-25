<template>
  <div class="settings-page">
    <!-- 顶部导航 -->
    <header class="settings-header">
      <n-button quaternary circle @click="onBack" class="flex items-center justify-center">
        <n-icon size="20" :component="ArrowBackIcon" />
      </n-button>
      <h1 class="text-lg font-medium">参数设置</h1>
    </header>

    <!-- 内容区域 -->
    <SettingsContent
      :is-dialog="false"
      @save-success="onSaveSuccess"
      class="settingsContentClass"
      :tab-wrapper-class="$style['settings-tab-wrapper']"
    />
  </div>
</template>

<script setup lang="ts">
import { ArrowBack as ArrowBackIcon } from '@vicons/ionicons5'
import SettingsContent from '@/components/dialog/settings/SettingsContent.vue'

const router = useRouter()

// 返回上一页
function onBack() {
  router.back()
}

// 保存成功
function onSaveSuccess() {
  router.back()
}
</script>

<style scoped lang="less">
.settings-page {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.settings-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: color-mix(in srgb, var(--base-color) 25%, transparent);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--n-border-color);
  h1 {
    flex: 1;
    text-align: left;
  }
}
.settingsContentClass {
  flex: 1;
}
</style>

<style lang="less" module>
.settings-tab-wrapper {
  :global {
    .n-tabs-nav {
      background-color: color-mix(in srgb, var(--base-color) 25%, transparent);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      position: sticky;
      top: 54px;
      z-index: 10;
    }
    .n-tab-pane {
      padding-inline: 16px !important;
    }
  }
}
</style>
