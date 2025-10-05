import * as THREE from 'three'

export class Renderer3D {
  constructor(container) {
    this.container = container
    this.scene = null
    this.camera = null
    this.renderer = null
    this.mesh = null
    this.animationId = null
  }
  
  init() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xf5f1e8)
    
    const aspect = this.container.clientWidth / this.container.clientHeight
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000)
    this.camera.position.z = 5
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.container.appendChild(this.renderer.domElement)
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    this.scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    this.scene.add(directionalLight)
    
    this.addWall()
  }
  
  addWall() {
    const wallGeometry = new THREE.PlaneGeometry(10, 8)
    const wallMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      roughness: 0.8
    })
    const wall = new THREE.Mesh(wallGeometry, wallMaterial)
    wall.position.z = -2
    this.scene.add(wall)
  }
  
  loadTexture(imageUrl, width, height) {
    const loader = new THREE.TextureLoader()
    loader.load(imageUrl, (texture) => {
      if (this.mesh) {
        this.scene.remove(this.mesh)
      }
      
      const aspect = width / height
      const planeWidth = 3
      const planeHeight = planeWidth / aspect
      
      const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
      const material = new THREE.MeshStandardMaterial({ 
        map: texture,
        side: THREE.DoubleSide
      })
      
      this.mesh = new THREE.Mesh(geometry, material)
      this.mesh.position.z = 0
      this.scene.add(this.mesh)
      
      const frameGeometry = new THREE.BoxGeometry(
        planeWidth + 0.1,
        planeHeight + 0.1,
        0.05
      )
      const frameMaterial = new THREE.MeshStandardMaterial({ color: 0xd4af37 })
      const frame = new THREE.Mesh(frameGeometry, frameMaterial)
      frame.position.z = -0.05
      this.mesh.add(frame)
      
      this.animate()
    })
  }
  
  animate() {
    this.animationId = requestAnimationFrame(() => this.animate())
    
    if (this.mesh) {
      this.mesh.rotation.y = Math.sin(Date.now() * 0.0005) * 0.1
    }
    
    this.renderer.render(this.scene, this.camera)
  }
  
  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    
    if (this.renderer) {
      this.renderer.dispose()
      this.container.removeChild(this.renderer.domElement)
    }
    
    if (this.mesh) {
      this.mesh.geometry.dispose()
      this.mesh.material.dispose()
    }
  }
  
  onWindowResize() {
    if (!this.camera || !this.renderer) return
    
    const aspect = this.container.clientWidth / this.container.clientHeight
    this.camera.aspect = aspect
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
  }
}
