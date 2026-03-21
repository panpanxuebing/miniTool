import { createApp } from 'vue'
import App from '@src/App.vue'
import '@src/styles.less'
import router from '@src/router'

const app = createApp(App)
app.use(router)
app.mount('#app')
