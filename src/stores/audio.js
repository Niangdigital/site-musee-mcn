import { defineStore } from 'pinia'
import { Howl } from 'howler'

export const useAudioStore = defineStore('audio', {
  state: () => ({
    isEnabled: true,
    isUnlocked: true, // ← CHANGE false en true
    currentSound: null,
    volume: 0.8,
    sounds: {}
  }),
  
  actions: {
    async unlock() {
      this.isUnlocked = true
      return true
    },
    
    loadSound(id, src) {
      if (!this.sounds[id]) {
        this.sounds[id] = new Howl({
          src: [src],
          volume: this.volume,
          preload: true,
          onloaderror: (id, error) => {
            console.error('❌ Howler load error:', error)
          },
          onplayerror: (id, error) => {
            console.error('❌ Howler play error:', error)
          }
        })
      }
      return this.sounds[id]
    },
    
    async play(src, id = 'current') {
      console.log('🔊 Audio play called:', { src, id, isEnabled: this.isEnabled, isUnlocked: this.isUnlocked })
      
      if (!this.isEnabled || !this.isUnlocked) {
        console.warn('⚠️ Audio blocked:', { isEnabled: this.isEnabled, isUnlocked: this.isUnlocked })
        return
      }
      
      this.stop()
      
      try {
        this.currentSound = this.loadSound(id, src)
        console.log('✅ Sound loaded, playing...')
        this.currentSound.play()
      } catch (e) {
        console.error('❌ Audio play failed:', e)
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