import { computed } from 'vue'
import { useAudioStore } from '../stores/audio.js'
import { useTextToSpeech } from './useTextToSpeech'

export function useAudioPreferences() {
  const audioStore = useAudioStore()
  const { speak, stop } = useTextToSpeech()

  // États
  const isAudioEnabled = computed(() => audioStore.isAudioEnabled)
  const isPlaying = computed(() => audioStore.isPlaying)

  // Alias "isMuted" pour compatibilité avec WelcomeScreen.vue
  const isMuted = computed(() => !audioStore.isAudioEnabled)

  // Actions
  const toggleAudio = () => {
    audioStore.toggleAudio()
  }

  const toggleMute = () => {
    audioStore.toggleAudio()
  }

  const enableAudio = () => {
    audioStore.enableAudio()
  }

  const disableAudio = () => {
    audioStore.disableAudio()
  }

  const savePreference = () => {
    localStorage.setItem('isAudioEnabled', JSON.stringify(audioStore.isAudioEnabled))
  }

  const playText = async (text, options = {}) => {
    if (!audioStore.isAudioEnabled) {
      console.log('Audio is disabled, skipping playback')
      return
    }

    try {
      await speak(text, options)
    } catch (error) {
      console.error('Error playing text:', error)
    }
  }

  const stopPlayback = () => {
    stop()
  }

  const playIfEnabled = async (text, options = {}) => {
    if (audioStore.isAudioEnabled) {
      await playText(text, options)
    }
  }

  const getAudioIcon = () => {
    return audioStore.isAudioEnabled ? 'volume-on' : 'volume-off'
  }

  const getAudioLabel = () => {
    return audioStore.isAudioEnabled ? 'muteAudio' : 'unmuteAudio'
  }

  return {
    isAudioEnabled,
    isMuted,          // ✅ exposé pour ton WelcomeScreen.vue
    isPlaying,
    toggleAudio,
    toggleMute,       // ✅ exposé pour ton WelcomeScreen.vue
    enableAudio,
    disableAudio,
    savePreference,   // ✅ exposé pour ton WelcomeScreen.vue
    playText,
    stopPlayback,
    playIfEnabled,
    getAudioIcon,
    getAudioLabel
  }
}
