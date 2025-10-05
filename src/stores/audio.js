import { defineStore } from 'pinia'
import { Howl } from 'howler'

export const useAudioStore = defineStore('audio', {
  state: () => ({
    isEnabled: true, // ⚠️ CHANGÉ: true → false
    isUnlocked: false, // ⚠️ CHANGÉ: false → true
    currentSound: null,
    volume: 0.8,
    sounds: {}
  }),
  
  actions: {
    async unlock() {
      // Désactivé temporairement
      this.isUnlocked = true
      return true
    },
    
    loadSound(id, src) {
      if (!this.sounds[id]) {
        this.sounds[id] = new Howl({
          src: [src],
          volume: this.volume,
          preload: true
        })
      }
      return this.sounds[id]
    },
    
    async play(src, id = 'current') {
      if (!this.isEnabled || !this.isUnlocked) return
      
      this.stop()
      
      try {
        this.currentSound = this.loadSound(id, src)
        this.currentSound.play()
      } catch (e) {
        console.warn('Audio play failed:', e)
      }
    },
    
    stop() {
      if (this.currentSound) {
        this.currentSound.stop()
      }
    },
    
    toggle() {
      this.isEnabled = !this.isEnabled
      if (!this.isEnabled) {
        this.stop()
      }
      localStorage.setItem('mca_audio_enabled', this.isEnabled)
    },
    
    setVolume(val) {
      this.volume = Math.max(0, Math.min(1, val))
      Object.values(this.sounds).forEach(sound => {
        sound.volume(this.volume)
      })
    },
    
    loadSettings() {
      const saved = localStorage.getItem('mca_audio_enabled')
      if (saved !== null) {
        this.isEnabled = saved === 'true'
      }
    }
  }
})