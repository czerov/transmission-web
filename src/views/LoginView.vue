<template>
  <div class="flex items-center justify-center min-h-screen">
    <n-card class="w-[420px] rounded-lg shadow-lg login-card">
      <h2 class="text-xl font-bold mb-6 text-center">Transmission 登录</h2>
      <n-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        size="large"
        label-placement="left"
        label-width="auto"
        :show-feedback="false"
      >
        <n-space vertical size="large">
          <n-form-item path="domain" label="域名">
            <n-input v-model:value="loginForm.domain" placeholder="https://example.com:9091" clearable />
          </n-form-item>

          <n-form-item path="username" label="用户名">
            <n-input v-model:value="loginForm.username" placeholder="请输入用户名" clearable />
          </n-form-item>

          <n-form-item path="password" label="密码">
            <n-input
              v-model:value="loginForm.password"
              type="password"
              placeholder="请输入密码"
              show-password-on="click"
              @keyup.enter="onLogin"
            />
          </n-form-item>

          <n-form-item>
            <n-checkbox v-model:checked="loginForm.rememberPassword">记住密码</n-checkbox>
          </n-form-item>

          <n-form-item>
            <n-button type="primary" size="large" block @click="onLogin" :loading="loading"> 登录 </n-button>
          </n-form-item>
        </n-space>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { rpc } from '@/api/rpc'
import { useSessionStore, useSettingStore } from '@/store'
import type { FormInst, FormRules } from 'naive-ui'
import { useMessage } from 'naive-ui'
const settingStore = useSettingStore()
const sessionStore = useSessionStore()

interface LoginForm {
  domain: string
  username: string
  password: string
  rememberPassword: boolean
}

const formRef = ref<FormInst | null>(null)
const loading = ref(false)
const router = useRouter()
const message = useMessage()

const loginForm = ref<LoginForm>({
  domain: settingStore.setting.domain,
  username: '',
  password: '',
  rememberPassword: settingStore.setting.savePassword
})

// 表单验证规则
const rules: FormRules = {
  domain: [
    {
      required: true,
      trigger: ['input', 'blur']
    },
    {
      pattern: /^https?:\/\/.+/,
      trigger: ['input', 'blur']
    }
  ],
  username: [
    {
      required: true,
      trigger: ['input', 'blur']
    },
    {
      min: 2,
      trigger: ['input', 'blur']
    }
  ],
  password: [
    {
      required: true,
      trigger: ['input', 'blur']
    },
    {
      min: 1,
      trigger: ['input', 'blur']
    }
  ]
}

const onLogin = async () => {
  try {
    console.debug('loginForm', loginForm.value)
    // 先进行表单验证
    await formRef.value?.validate()

    loading.value = true

    settingStore.setDomain(loginForm.value.domain)
    // 设置记住密码状态
    settingStore.setSavePassword(loginForm.value.rememberPassword)

    // 生成 auth 并设置到 rpc
    settingStore.setAuth(loginForm.value.username, loginForm.value.password)

    await rpc.sessionGet() // 能获取到说明登录成功
    message.success('登录成功')
    router.push('/')
  } catch (validationErrors) {
    // 如果是表单验证错误，不需要特殊处理，naive-ui 会自动显示错误信息
    if (Array.isArray(validationErrors)) {
      return
    }
    // 处理登录接口错误
    const e = validationErrors as any
    if (e.response && (e.response.status === 401 || e.response.status === 403)) {
      message.error('用户名或密码错误')
    } else {
      message.error('登录失败，请检查服务端或网络')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  sessionStore.fetchSession().then((res) => {
    if (res) {
      router.replace('/')
    }
  })
})
</script>

<style scoped lang="less">
.login-card {
  position: relative;
  -webkit-backdrop-filter: blur(10px) brightness(95%);
  backdrop-filter: blur(10px) brightness(95%);
  background-color: color-mix(in srgb, var(--n-color) 50%, transparent 80%);
}
</style>
