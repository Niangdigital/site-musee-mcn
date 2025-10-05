import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    current: 'fr',
    available: ['fr', 'en', 'wo'],
    labels: {
      fr: 'Français',
      en: 'English',
      wo: 'Wolof'
    }
  }),
  
  actions: {
    setLanguage(lang) {
      if (this.available.includes(lang)) {
        this.current = lang
        localStorage.setItem('mca_language', lang)
      }
    },
    
    loadSavedLanguage() {
      const saved = localStorage.getItem('mca_language')
      if (saved && this.available.includes(saved)) {
        this.current = saved
      }
    }
  },
  
  getters: {
    currentLabel: (state) => state.labels[state.current]
  }
})