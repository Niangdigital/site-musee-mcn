import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    current: 'fr',
    available: ['fr', 'en', 'wo'],
    labels: {
      fr: 'Français',
      en: 'English',
      wo: 'Wolof'
    },
    listeners: []
  }),
  
  actions: {
    setLanguage(lang) {
      if (this.available.includes(lang)) {
        const oldLang = this.current
        this.current = lang
        
        console.log('[LanguageStore] Changement de langue:', oldLang, '→', lang)
        localStorage.setItem('mca_language', lang)
        console.log('[LanguageStore] Langue sauvegardée dans localStorage')
        
        // Notifier tous les listeners du changement
        console.log('[LanguageStore] Notification de', this.listeners.length, 'listener(s)')
        this.listeners.forEach((callback, index) => {
          try {
            console.log('[LanguageStore] Appel du listener', index)
            callback(lang, oldLang)
          } catch (error) {
            console.error('[LanguageStore] Erreur dans le listener', index, ':', error)
          }
        })
      } else {
        console.warn('[LanguageStore] Langue non disponible:', lang)
      }
    },
    
    loadSavedLanguage() {
      const saved = localStorage.getItem('mca_language')
      console.log('[LanguageStore] Chargement de la langue sauvegardée:', saved)
      
      if (saved && this.available.includes(saved)) {
        this.current = saved
        console.log('[LanguageStore] Langue chargée:', saved)
      } else {
        console.log('[LanguageStore] Utilisation de la langue par défaut:', this.current)
      }
    },
    
    onLanguageChange(callback) {
      if (typeof callback === 'function') {
        this.listeners.push(callback)
        console.log('[LanguageStore] Nouveau listener enregistré. Total:', this.listeners.length)
        
        // Retourner une fonction de nettoyage
        return () => {
          const index = this.listeners.indexOf(callback)
          if (index > -1) {
            this.listeners.splice(index, 1)
            console.log('[LanguageStore] Listener supprimé. Total:', this.listeners.length)
          }
        }
      }
      console.warn('[LanguageStore] Callback invalide fourni à onLanguageChange')
      return () => {} // Fonction vide si callback invalide
    }
  },
  
  getters: {
    currentLabel: (state) => state.labels[state.current]
  }
})