<template>
  <n-dropdown trigger="click" :options="mobileActionOptions" @select="onSelect" :animated="false">
    <n-button quaternary circle>
      <n-icon :component="MenuSharp" size="24" />
    </n-button>
  </n-dropdown>
</template>
<script setup lang="ts">
import DismissSquareIcon from '@/assets/icons/dismissSquare.svg?component'
import { useTorrentStore } from '@/store'
import { renderIcon } from '@/utils'
import {
  AddCircle,
  ArrowDownCircleSharp,
  ArrowUpCircleSharp,
  CaretForwardCircle,
  FolderOpenSharp,
  MenuSharp,
  PauseCircle,
  Pricetags,
  StarSharp,
  Magnet
} from '@vicons/ionicons5'
import { useThemeVars } from 'naive-ui'
import { priorityOptions } from './priority'

const theme = useThemeVars()
const emit = defineEmits(['action'])
const torrentStore = useTorrentStore()

const isOk = computed(() => torrentStore.selectedKeys.length > 0)

const mobileActionOptions = computed(() => [
  {
    label: '磁力链接',
    key: 'addMagnet',
    icon: renderIcon(Magnet, theme.value.primaryColor)
  },
  {
    label: '添加种子',
    key: 'addTorrent',
    icon: renderIcon(AddCircle, theme.value.primaryColor)
  },
  {
    label: '开始任务',
    key: 'start',
    disabled: !isOk.value,
    icon: renderIcon(CaretForwardCircle, theme.value.primaryColor)
  },
  { label: '停止', key: 'pause', disabled: !isOk.value, icon: renderIcon(PauseCircle, theme.value.primaryColor) },
  {
    label: '删除任务',
    key: 'remove',
    disabled: !isOk.value,
    icon: renderIcon(DismissSquareIcon, theme.value.errorColor)
  },
  {
    type: 'divider',
    key: 'd1'
  },
  {
    label: '上移任务',
    key: 'moveUp',
    disabled: !isOk.value,
    icon: renderIcon(ArrowUpCircleSharp, theme.value.infoColor)
  },
  {
    label: '下移任务',
    key: 'moveDown',
    disabled: !isOk.value,
    icon: renderIcon(ArrowDownCircleSharp, theme.value.infoColor)
  },
  {
    type: 'divider',
    key: 'd2'
  },
  {
    label: '任务目录',
    key: 'changeDir',
    disabled: !isOk.value,
    icon: renderIcon(FolderOpenSharp, theme.value.warningColor)
  },
  { label: '任务标签', key: 'changeLabel', disabled: !isOk.value, icon: renderIcon(Pricetags, theme.value.infoColor) },

  {
    label: '优先级',
    key: 'priority',
    disabled: !isOk.value,
    icon: renderIcon(StarSharp, theme.value.warningColor),
    children: priorityOptions.map((item) => ({
      ...item,
      key: `priority${item.key}`
    }))
  }
])

function onSelect(key: string) {
  emit('action', key)
}
</script>
