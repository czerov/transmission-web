import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { useThemeVars, type CustomThemeCommonVars, type ThemeCommonVars } from 'naive-ui'
import { setDomain as setDomainApi, setAuth as setAuthApi } from '@/api/rpc'

const DEFAULT_TRACKERS = [
  'udp://tracker.opentrackr.org:1337/announce',
  'udp://open.demonii.com:1337/announce',
  'udp://open.stealth.si:80/announce',
  'udp://exodus.desync.com:6969/announce',
  'udp://tracker.torrent.eu.org:451/announce',
  'udp://explodie.org:6969/announce',
  'udp://wepzone.net:6969/announce',
  'udp://ttk2.nbaonlineservice.com:6969/announce',
  'udp://tracker.tryhackx.org:6969/announce',
  'udp://tracker.theoks.net:6969/announce',
  'udp://tracker.srv00.com:6969/announce',
  'udp://tracker.ololosh.space:6969/announce',
  'udp://tracker.fnix.net:6969/announce',
  'udp://tracker.dler.org:6969/announce',
  'udp://t.overflow.biz:6969/announce',
  'udp://retracker01-msk-virt.corbina.net:80/announce',
  'udp://public.tracker.vraphim.com:6969/announce',
  'udp://p4p.arenabg.com:1337/announce',
  'udp://opentracker.io:6969/announce',
  'udp://open.dstud.io:6969/announce'
]

export const useSettingStore = defineStore('setting', () => {
  const setting = useStorage(
    'setting',
    {
      theme: 'light',
      defaultTrackers: DEFAULT_TRACKERS,
      domain: window.location.origin,
      savePassword: false,
      auth: ''
    },
    localStorage,
    { mergeDefaults: true, deep: true, writeDefaults: true }
  )
  const authSession = useStorage('auth', '', sessionStorage, { mergeDefaults: true, deep: true, writeDefaults: true })

  function setDomain(val: string) {
    setting.value.domain = val
    setDomainApi(val)
  }

  setDomain(setting.value.domain)

  const serverHost = computed(() => {
    return setting.value.domain.replace(/^https?:\/\//, '')
  })

  const safeArea = reactive({
    top: 0,
    bottom: 0
  })

  const doc = document.documentElement
  const docStyle = window.getComputedStyle(doc)
  safeArea.top = parseInt(docStyle.getPropertyValue('--top-inset')) || 0
  safeArea.bottom = parseInt(docStyle.getPropertyValue('--bottom-inset')) || 0
  const themeDefault = useThemeVars()

  const themeVars = ref<ThemeCommonVars & CustomThemeCommonVars>(themeDefault.value)

  const lineHeight = computed(() => {
    if (themeVars.value.lineHeight && themeVars.value.lineHeight.endsWith('px')) {
      return parseInt(themeVars.value.lineHeight)
    }
    return Math.round(parseInt(themeVars.value.fontSize) * parseFloat(themeVars.value.lineHeight)) || 22
  })

  function setTheme(val: string) {
    setting.value.theme = val
  }

  function setDefaultTrackers(val: string[]) {
    setting.value.defaultTrackers = val
  }

  function setThemeVars(val: ThemeCommonVars & CustomThemeCommonVars) {
    themeVars.value = val
  }

  function setAuth(username: string, password: string) {
    if (!username || !password) {
      return ''
    }
    const auth = btoa(username + ':' + password)

    // 如果启用记住密码，则保存 auth
    if (setting.value.savePassword) {
      setting.value.auth = auth
    } else {
      authSession.value = auth
    }
    return auth
  }

  function setSavePassword(val: boolean) {
    setting.value.savePassword = val
    if (val) {
      authSession.value = ''
    } else {
      setting.value.auth = ''
    }
  }

  watch(
    [() => authSession.value, () => setting.value.auth],
    () => {
      setAuthApi(authSession.value || setting.value.auth)
    },
    {
      immediate: true,
      flush: 'pre'
    }
  )

  return {
    setting,
    setTheme,
    setDefaultTrackers,
    themeVars,
    setThemeVars,
    safeArea,
    lineHeight,
    serverHost,
    setDomain,
    setAuth,
    setSavePassword
  }
})
