<template>
  <n-dropdown
    v-model:show="show"
    trigger="manual"
    :x="x"
    :y="y"
    :options="dropdownOptions"
    @select="onDropdownSelect"
    class="row-drop-down-menus"
    :to="to"
    :z-index="1000"
    :animated="false"
    :style="{ maxHeight: maxHeight }"
    scrollable
  />
  <DeleteTorrentDialog v-model:show="showDeleteDialog" />
  <ChangeDirDialog v-model:show="showChangeDirDialog" />
  <ChangeLables v-model:show="showChangeLabelDialog" />
  <ChangeTracker v-model:show="showChangeTrackerDialog" />
  <OtherTorrentSetting v-model:show="showChangeOtherDialog" />
</template>

<script setup lang="ts">
import { rpc } from '@/api/rpc'
import { useSettingStore, useTorrentStore } from '@/store'
import { ensurePathDelimiter, renderIcon, sleep, copyToClipboard } from '@/utils/index'
import { useMessage } from 'naive-ui'

import ArrowDownIcon from '@/assets/icons/arrowDown.svg?component'
import ArrowUpIcon from '@/assets/icons/arrowUp.svg?component'
import DismissSquareIcon from '@/assets/icons/dismissSquare.svg?component'
import DoubleArrowDownIcon from '@/assets/icons/doubleArrowDown.svg?component'
import DoubleArrowUpIcon from '@/assets/icons/doubleArrowUp.svg?component'
import FolderCopyIcon from '@/assets/icons/folderCopy.svg?component'
import {
  CaretForwardCircle,
  CopySharp,
  FlashSharp,
  FolderOpenSharp,
  MagnetSharp,
  PauseCircle,
  Pricetags,
  RefreshCircle,
  SettingsSharp,
  StarSharp,
  WifiSharp
} from '@vicons/ionicons5'
import AnyTouchCore from 'any-touch'
import { useThemeVars } from 'naive-ui'

const settingStore = useSettingStore()
const at = new AnyTouchCore(document.body, {
  preventDefault: false
})
at.use(AnyTouchCore.tap)

const theme = useThemeVars()
const torrentStore = useTorrentStore()
const props = defineProps<{
  x: number
  y: number
  to: string
}>()
const show = defineModel<boolean>('show')
const maxHeight = ref('auto')
const message = useMessage()
const showDeleteDialog = ref(false)
const showChangeDirDialog = ref(false)
const showChangeLabelDialog = ref(false)
const showChangeTrackerDialog = ref(false)
const showChangeOtherDialog = ref(false)
const dropdownOptions = [
  { label: '强制开始', key: 'forceStart', icon: renderIcon(FlashSharp, theme.value.primaryColor) },
  { label: '开始', key: 'start', icon: renderIcon(CaretForwardCircle, theme.value.primaryColor) },
  { label: '暂停', key: 'stop', icon: renderIcon(PauseCircle, theme.value.primaryColor) },
  { label: '重新校验', key: 'verify', icon: renderIcon(RefreshCircle, theme.value.primaryColor) },
  { label: '删除', key: 'remove', icon: renderIcon(DismissSquareIcon, theme.value.errorColor) },
  {
    type: 'divider',
    key: 'd1'
  },
  { label: '重新汇报(获取更多peer)', key: 'reannounce', icon: renderIcon(RefreshCircle, theme.value.primaryColor) },
  { label: '变更目录', key: 'changeDir', icon: renderIcon(FolderOpenSharp, theme.value.primaryColor) },
  {
    type: 'divider',
    key: 'd2'
  },
  { label: '复制名称', key: 'copyName', icon: renderIcon(CopySharp, theme.value.primaryColor) },
  { label: '复制路径', key: 'copyPath', icon: renderIcon(FolderCopyIcon, theme.value.primaryColor) },
  { label: '复制磁力链接', key: 'copyMagnet', icon: renderIcon(MagnetSharp, theme.value.primaryColor) },
  {
    type: 'divider',
    key: 'd3'
  },
  { label: '修改标签', key: 'changeLabel', icon: renderIcon(Pricetags, theme.value.primaryColor) },
  {
    label: '队列操作',
    key: 'queue',
    icon: renderIcon(StarSharp, theme.value.primaryColor),
    children: [
      {
        label: '队列置顶',
        key: 'moveTop',
        icon: renderIcon(DoubleArrowUpIcon, theme.value.infoColor)
      },
      {
        label: '队列上移',
        key: 'moveUp',
        icon: renderIcon(ArrowUpIcon, theme.value.infoColor)
      },
      {
        label: '队列下移',
        key: 'moveDown',
        icon: renderIcon(ArrowDownIcon, theme.value.infoColor)
      },
      {
        label: '队列置底',
        key: 'moveBottom',
        icon: renderIcon(DoubleArrowDownIcon, theme.value.infoColor)
      }
    ]
  },
  {
    type: 'divider',
    key: 'd4'
  },
  {
    label: '修改tracker',
    key: 'changeTracker',
    icon: renderIcon(WifiSharp, theme.value.primaryColor)
  },
  {
    label: '修改限速等限制属性',
    key: 'other',
    icon: renderIcon(SettingsSharp, theme.value.primaryColor)
  }
]

watch(
  () => props.y,
  (y) => {
    const clientHeight = document.documentElement.clientHeight
    const m = clientHeight - y
    let d = 20
    if (y > m) {
      d = Math.max(20, settingStore.safeArea.top)
    } else {
      d = Math.max(20, settingStore.safeArea.bottom)
    }
    maxHeight.value = `${m > y ? m - d : y - d}px`
  }
)
const closeDropdown = (e: any) => {
  if (e.target instanceof HTMLElement && e.target.closest('.row-drop-down-menus')) {
    return
  }
  show.value = false
}
onMounted(() => {
  at.on('tap', closeDropdown)
})
onUnmounted(() => {
  at.off('tap', closeDropdown)
})
async function onDropdownSelect(key: string) {
  const ids = torrentStore.selectedKeys
  if (!ids || ids.length === 0) {
    message.warning('请先选择任务')
    return
  }
  switch (key) {
    case 'start':
      await rpc.torrentStart(ids)
      await sleep(1000)
      await torrentStore.fetchTorrents()
      message.success('已开始任务')
      break
    case 'forceStart':
      await rpc.torrentStartNow(ids)
      await sleep(1000)
      await torrentStore.fetchTorrents()
      message.success('已强制开始任务')
      break
    case 'stop':
      await rpc.torrentStop(ids)
      await sleep(1000)
      await torrentStore.fetchTorrents()
      message.success('已暂停任务')
      break
    case 'verify':
      await rpc.torrentVerify(ids)
      await sleep(1000)
      await torrentStore.fetchTorrents()
      message.success('已重新校验任务')
      break
    case 'remove':
      showDeleteDialog.value = true
      break
    case 'copyName':
      const names = torrentStore.selectedKeys
        .map((id) => torrentStore.torrents.find((t) => t.id === id)?.name)
        .join('\n')
      const nameSuccess = await copyToClipboard(names)
      if (nameSuccess) {
        message.success('已复制名称')
      } else {
        message.error('复制失败，请重试')
      }
      break
    case 'copyPath':
      const paths = torrentStore.selectedKeys
        .map((id) => {
          const t = torrentStore.torrents.find((t) => t.id === id)
          return t ? `${ensurePathDelimiter(t.downloadDir, t.name)}` : ''
        })
        .join('\n')
      const pathSuccess = await copyToClipboard(paths)
      if (pathSuccess) {
        message.success('已复制路径')
      } else {
        message.error('复制失败，请重试')
      }
      break
    case 'copyMagnet':
      const magnets = torrentStore.selectedKeys
        .map((id) => torrentStore.torrents.find((t) => t.id === id)?.magnetLink)
        .join('\n')
      const magnetSuccess = await copyToClipboard(magnets)
      if (magnetSuccess) {
        message.success('已复制磁力链接')
      } else {
        message.error('复制失败，请重试')
      }
      break
    case 'reannounce':
      await rpc.torrentReannounce(ids)
      await sleep(1000)
      await torrentStore.fetchTorrents()
      message.success('已重新汇报')
      break
    case 'changeDir':
      showChangeDirDialog.value = true
      break
    case 'changeLabel':
      showChangeLabelDialog.value = true
      break
    case 'moveTop':
      await rpc.queueMoveTop(ids)
      await sleep(1000)
      await torrentStore.fetchTorrents()
      message.success('已置顶')
      break
    case 'moveUp':
      await rpc.queueMoveUp(ids)
      await sleep(1000)
      await torrentStore.fetchTorrents()
      message.success('已上移')
      break
    case 'moveDown':
      await rpc.queueMoveDown(ids)
      await sleep(1000)
      await torrentStore.fetchTorrents()
      message.success('已下移')
      break
    case 'moveBottom':
      await rpc.queueMoveBottom(ids)
      await sleep(1000)
      await torrentStore.fetchTorrents()
      message.success('已置底')
      break
    case 'changeTracker':
      showChangeTrackerDialog.value = true
      break
    case 'other':
      showChangeOtherDialog.value = true
      break
  }
}
</script>
