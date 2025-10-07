<template>
  <div
    class="artwork-viewer-3d"
    ref="artworkContainer"
    :style="{ aspectRatio: imageAspectRatio }"
  >
    <div ref="containerRef" class="viewer-container"></div>

    <!-- Contrôles -->
    <div class="viewer-controls">
      <p class="control-hint">🖱️ Effet 3D immersif en réalité virtuelle.</p>
      <button v-if="!isFullscreen" @click="toggleFullscreen" class="control-btn">
        Plein écran
      </button>
    </div>

    <button
      v-if="isFullscreen"
      @click="exitFullscreenAndVR"
      class="exit-fullscreen"
    >
      ✖
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  artwork: { type: Object, required: true },
})

const artworkContainer = ref(null)
const containerRef = ref(null)
let scene, camera, renderer, imageMesh, animationFrameId

const zoom = ref(1.0)
const speed = ref(0.0000)
const imageAspectRatio = ref('4/3')
const vrMode = ref(true)
const isFullscreen = ref(false)

const imageUrl = computed(() => {
  try {
    return new URL(`/src/assets/images/artworks/${props.artwork.id}.jpg`, import.meta.url).href
  } catch (e) {
    console.error('Image not found for 3D:', props.artwork.id)
    return ''
  }
})

let initialContainerWidth = 0
let initialContainerHeight = 0

const init3DScene = (imgWidth, imgHeight) => {
  const container = containerRef.value
  if (!container) return

  const aspect = imgWidth / imgHeight
  imageAspectRatio.value = `${imgWidth}/${imgHeight}`

  initialContainerWidth = container.clientWidth
  initialContainerHeight = container.clientHeight

  if (renderer) {
    renderer.dispose()
    container.innerHTML = ''
  }

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 100)
  camera.position.z = 5

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)

  const updateCanvasSize = () => {
    const width = container.clientWidth
    let height = width / aspect

    // ✅ Sur mobile, on limite la hauteur à 450px
    if (window.innerWidth < 768 && height > 450) {
      height = 450
    }

    if (vrMode.value && window.innerWidth < 768) {
      renderer.setSize(width / 1.2, height)
    } else {
      renderer.setSize(width, height)
    }

    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  updateCanvasSize()
  window.addEventListener('resize', updateCanvasSize)

  const texture = new THREE.TextureLoader().load(imageUrl.value)
  const geometry = new THREE.PlaneGeometry(3 * aspect, 3)
  const material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })
  imageMesh = new THREE.Mesh(geometry, material)
  scene.add(imageMesh)
  imageMesh.scale.set(zoom.value, zoom.value, 1)

  let mouseX = 0, mouseY = 0
  const onMouseMove = (e) => {
    const rect = container.getBoundingClientRect()
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
  }
  container.addEventListener('mousemove', onMouseMove)

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)
    const time = performance.now() * speed.value
    imageMesh.rotation.y = Math.sin(time) * 0.15 + mouseX * 0.2
    imageMesh.rotation.x = Math.cos(time * 1.2) * 0.1 + mouseY * 0.15
    renderer.render(scene, camera)
  }
  animate()
}

const toggleFullscreen = async () => {
  const container = artworkContainer.value
  if (!container) return
  if (!document.fullscreenElement) {
    await container.requestFullscreen()
    isFullscreen.value = true
  } else {
    await document.exitFullscreen()
    isFullscreen.value = false
    resetAfterFullscreen()
  }
}

const exitFullscreenAndVR = async () => {
  vrMode.value = false
  if (document.fullscreenElement) {
    await document.exitFullscreen()
    isFullscreen.value = false
  }
  resetAfterFullscreen()
}

const resetAfterFullscreen = () => {
  if (!containerRef.value || !renderer) return
  const container = containerRef.value
  container.style.width = initialContainerWidth + 'px'
  container.style.height = initialContainerHeight + 'px'
  renderer.setSize(initialContainerWidth, initialContainerHeight)
  camera.aspect = initialContainerWidth / initialContainerHeight
  camera.updateProjectionMatrix()
}

onMounted(() => {
  const img = new Image()
  img.onload = () => init3DScene(img.width, img.height)
  img.src = imageUrl.value
})

onUnmounted(() => {
  window.removeEventListener('resize', () => {})
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
  cursor: grab;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.control-hint {
  margin: 0;
  font-size: 0.875rem;
}

.control-btn {
  padding: 0.3rem 0.6rem;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-size: 0.8rem;
}

.control-btn:hover {
  background: var(--color-primary-dark);
}

.exit-fullscreen {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  border-radius: var(--border-radius-sm);
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  z-index: 10;
  font-size: 1rem;
}

/* ✅ Responsive mobile */
@media (max-width: 768px) {
  .artwork-viewer-3d {
    max-height: 450px;
  }

  .viewer-controls {
    flex-direction: column;
    bottom: var(--space-2);
    padding: var(--space-2);
    font-size: 0.75rem;
  }

  .control-btn {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }

  .control-hint {
    font-size: 0.75rem;
    text-align: center;
  }

  .exit-fullscreen {
    font-size: 0.9rem;
    padding: 0.25rem 0.4rem;
  }
}
</style>
