import { ref } from 'vue'
import { useAudioStore } from '../stores/audio.js'
import { useLanguageStore } from '../stores/language.js'

export function useTextToSpeech() {
  const audioStore = useAudioStore()
  const languageStore = useLanguageStore()
  const isSupported = ref('speechSynthesis' in window)

  // Mapping des codes de langue vers les codes de synthèse vocale
  const languageVoiceMap = {
    'fr': 'fr-FR',
    'en': 'en-US',
    'wo': 'fr-FR' // Wolof utilise la voix française par défaut
  }

  const speak = (text, options = {}) => {
    return new Promise((resolve) => {
      if (!isSupported.value) {
        console.warn('Text-to-Speech not supported')
        resolve()
        return
      }

      if (!audioStore.isAudioEnabled) {
        resolve()
        return
      }

      // Arrêter toute lecture en cours
      window.speechSynthesis.cancel()
      
      // Délai pour éviter l'erreur "not-allowed"
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text)
        
        // Configuration de la voix
        const lang = options.lang || languageStore.currentLanguage || 'fr'
        utterance.lang = languageVoiceMap[lang] || 'fr-FR'
        utterance.rate = options.rate || 0.9
        utterance.pitch = options.pitch || 1
        utterance.volume = options.volume || 1

        // Sélectionner une voix appropriée
        const voices = window.speechSynthesis.getVoices()
        const voice = voices.find(v => v.lang.startsWith(utterance.lang))
        if (voice) {
          utterance.voice = voice
        }

        // Événements
        utterance.onstart = () => {
          audioStore.setPlaying(true)
          audioStore.setCurrentUtterance(utterance)
        }

        utterance.onend = () => {
          audioStore.setPlaying(false)
          audioStore.setCurrentUtterance(null)
          resolve()
        }

        utterance.onerror = (event) => {
          audioStore.setPlaying(false)
          audioStore.setCurrentUtterance(null)
          
          if (event.error === 'not-allowed' || event.error === 'interrupted') {
            console.warn('Speech cancelled:', event.error)
          } else {
            console.error('Speech error:', event.error)
          }
          resolve()
        }

        // Lancer la synthèse
        window.speechSynthesis.speak(utterance)
      }, 100)
    })
  }

  const stop = () => {
    audioStore.stopSpeech()
  }

  const pause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause()
      audioStore.setPlaying(false)
    }
  }

  const resume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
      audioStore.setPlaying(true)
    }
  }

  const loadVoices = () => {
    return new Promise((resolve) => {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        resolve(voices)
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          resolve(window.speechSynthesis.getVoices())
        }
      }
    })
  }

  return {
    isSupported,
    speak,
    stop,
    pause,
    resume,
    loadVoices
  }
}