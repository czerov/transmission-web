import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import SettingsPageView from '../views/SettingsPageView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/', name: 'Dashboard', component: DashboardView },
  { path: '/settings', name: 'Settings', component: SettingsPageView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
