import { BrowserQRCodeReader } from '@zxing/library'

export class QRScanner {
  constructor() {
    this.reader = new BrowserQRCodeReader()
    this.controls = null
  }
  
  async startScan(videoElement, onSuccess, onError) {
    try {
      // Vérifier que l'élément vidéo existe
      if (!videoElement) {
        throw new Error('Video element not found')
      }

      // Arrêter tout scan précédent
      this.stopScan()

      // Démarrer le scan avec le callback
      this.controls = await this.reader.decodeFromVideoDevice(
        undefined, // undefined = caméra par défaut
        videoElement,
        (result, error) => {
          if (result) {
            const text = result.getText()
            console.log('QR Code détecté:', text)
            onSuccess(text)
          }
          if (error && error.name !== 'NotFoundException') {
            console.error('Erreur de scan:', error)
            onError(error)
          }
        }
      )
      
      return this.controls
    } catch (error) {
      console.error('Erreur au démarrage du scan:', error)
      onError(error)
      return null
    }
  }
  
  stopScan() {
    if (this.controls) {
      try {
        this.controls.stop()
      } catch (e) {
        console.error('Erreur lors de l\'arrêt du scan:', e)
      }
      this.controls = null
    }
    
    // Réinitialiser le reader
    if (this.reader) {
      this.reader.reset()
    }
  }
  
  async getDevices() {
    try {
      const devices = await this.reader.listVideoInputDevices()
      return devices
    } catch (error) {
      console.error('Impossible de lister les appareils:', error)
      return []
    }
  }
}

export default new QRScanner()