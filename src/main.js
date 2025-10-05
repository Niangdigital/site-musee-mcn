import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import { useCommentsStore } from './stores/comments'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
const commentsStore = useCommentsStore()
commentsStore.loadComments()