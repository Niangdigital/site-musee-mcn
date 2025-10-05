export class AudioManager {
  constructor() {
    this.context = null
    this.sources = new Map()
  }
  
  async init() {
    if (!this.context) {
      this.context = new (window.AudioContext || window.webkitAudioContext)()
    }
    
    if (this.context.state === 'suspended') {
      await this.context.resume()
    }
  }
  
  async loadAudio(url, id) {
    try {
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer)
      this.sources.set(id, audioBuffer)
      return audioBuffer
    } catch (error) {
      console.error('Audio load error:', error)
      return null
    }
  }
  
  play(id, loop = false) {
    const buffer = this.sources.get(id)
    if (!buffer) return null
    
    const source = this.context.createBufferSource()
    source.buffer = buffer
    source.loop = loop
    source.connect(this.context.destination)
    source.start(0)
    
    return source
  }
  
  stop(source) {
    if (source) {
      source.stop()
    }
  }
}

export default new AudioManager()
