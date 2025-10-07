import { createRouter, createWebHistory } from 'vue-router'
import { useLanguageStore } from '../stores/language.js' // ⚠️ AJOUTER CETTE LIGNE



const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: () => import('../views/Welcome.vue'),
    meta: { requiresLanguage: true }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresLanguage: true }
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: () => import('../views/Gallery.vue'),
    meta: { requiresLanguage: true }
  },
  {
    path: '/artwork/:id',
    name: 'Artwork',
    component: () => import('../views/ArtworkPage.vue'),
    meta: { requiresLanguage: true }
  },
  {
    path: '/scan',
    name: 'Scan',
    component: () => import('../views/Scan.vue'),
    meta: { requiresLanguage: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const languageStore = useLanguageStore()
  
  if (to.meta.requiresLanguage && !languageStore.current) {
    next({ name: 'Welcome' })
  } else {
    next()
  }
})

export default router