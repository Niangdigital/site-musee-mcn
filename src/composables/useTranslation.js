import { computed } from 'vue'
import { useLanguageStore } from '../stores/language'

export function useTranslation() {
  const languageStore = useLanguageStore()
  
  return {
    // Fonction de traduction
    t: computed(() => languageStore.t),
    
    // Langue actuelle
    currentLang: computed(() => languageStore.currentLanguage),
    
    // Changer la langue
    setLanguage: languageStore.setLanguage,
    
    // Pour les œuvres d'art
    getArtworkText: languageStore.getArtworkText,
    
    // Langues disponibles
    availableLanguages: languageStore.availableLanguages
  }
}