import { createApp } from 'vue'
import 'uno.css'
import './style.css'
import App from './App.vue'
import router from './router'
import pinia from './store'
import VueVirtualScroller from 'vue-virtual-scroller'
import VTouch from '@any-touch/vue3'

const app = createApp(App)
app.use(VTouch)
app.use(VueVirtualScroller)
app.use(router)
app.use(pinia)

app.mount('#app')
