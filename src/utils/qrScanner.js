import { BrowserQRCodeReader } from '@zxing/library'

export class QRScanner {
  constructor() {
    this.reader = new BrowserQRCodeReader()
    this.stream = null
  }
  
  async startScan(videoElement, onSuccess, onError) {
    try {
      const controls = await this.reader.decodeFromVideoDevice(
        undefined,
        videoElement,
        (result, error) => {
          if (result) {
            onSuccess(result.getText())
          }
          if (error && error.name !== 'NotFoundException') {
            onError(error)
          }
        }
      )
      
      this.stream = controls
      return controls
    } catch (error) {
      onError(error)
      return null
    }
  }
  
  stopScan() {
    if (this.stream) {
      this.stream.stop()
      this.stream = null
    }
  }
  
  async getDevices() {
    try {
      const devices = await this.reader.listVideoInputDevices()
      return devices
    } catch (error) {
      console.error('Failed to get devices:', error)
      return []
    }
  }
}

export default new QRScanner()
