<template>
  <div class="artwork-viewer-3d" :style="{ aspectRatio: imageAspectRatio }">
    <div ref="containerRef" class="viewer-container" @click="increaseZoom"></div>
    <div class="viewer-controls">
      <p class="control-hint">Cliquez pour zoomer</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { gsap } from 'gsap'

const props = defineProps({
  artwork: { type: Object, required: true }
})

const containerRef = ref(null)
let scene, camera, renderer, imageMesh, animationFrameId

const zoom = ref(1.2)          // Zoom minimal
const speed = ref(0.0007)      // Vitesse constante
const imageAspectRatio = ref('4/3')

const imageUrl = computed(() => {
  try {
    return new URL(`/src/assets/images/artworks/${props.artwork.id}.jpg`, import.meta.url).href
  } catch (e) {
    console.error('Image not found:', props.artwork.id)
    return ''
  }
})

const init3DScene = (imgWidth, imgHeight) => {
  const container = containerRef.value
  if (!container) return

  const aspect = imgWidth / imgHeight
  imageAspectRatio.value = `${imgWidth}/${imgHeight}`

  if (renderer) {
    renderer.dispose()
    container.innerHTML = ''
  }

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 100)
  camera.position.z = 5

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.toneMapping = THREE.NoToneMapping
  renderer.outputEncoding = THREE.sRGBEncoding
  container.appendChild(renderer.domElement)

  const updateCanvasSize = () => {
    const width = container.clientWidth
    const height = width / aspect
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }
  updateCanvasSize()
  window.addEventListener('resize', updateCanvasSize)

  const texture = new THREE.TextureLoader().load(imageUrl.value)
  const material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })
  const geometry = new THREE.PlaneGeometry(3 * aspect, 3)
  imageMesh = new THREE.Mesh(geometry, material)
  scene.add(imageMesh)

  imageMesh.scale.set(zoom.value, zoom.value, 1)

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)
    const time = performance.now() * speed.value
    imageMesh.rotation.y = Math.sin(time) * 0.15
    imageMesh.rotation.x = Math.cos(time * 1.2) * 0.1
    renderer.render(scene, camera)
  }
  animate()
}

// Zoom au clic (limité)
const increaseZoom = () => {
  if (!imageMesh) return
  zoom.value += 0.1
  if (zoom.value > 2) zoom.value = 1.2    // reset au zoom minimal
  gsap.to(imageMesh.scale, { x: zoom.value, y: zoom.value, z: 1, duration: 0.5, ease: 'power2.out' })
}

onMounted(() => {
  const img = new Image()
  img.onload = () => init3DScene(img.width, img.height)
  img.src = imageUrl.value
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCanvasSize)
  if (renderer) renderer.dispose()
  cancelAnimationFrame(animationFrameId)
})
</script>

<style scoped>
.artwork-viewer-3d {
  position: relative;
  background: var(--color-beige);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  cursor: pointer;
}

.viewer-container {
  width: 100%;
  height: 100%;
}

.viewer-controls {
  position: absolute;
  bottom: var(--space-4);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: var(--color-white);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--border-radius);
  backdrop-filter: blur(10px);
}

.control-hint {
  margin: 0;
  font-size: 0.875rem;
}
</style>
