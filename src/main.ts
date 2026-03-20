import { createApp } from 'vue'
import App from '@src/App.vue'
import '@src/styles.less'
import router from '@src/router'

createApp(App).use(router).mount('#app')
