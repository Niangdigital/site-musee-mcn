<template>
  <div class="artwork-viewer-3d">
    <div ref="containerRef" class="viewer-container"></div>
    <div class="viewer-controls">
      <p class="control-hint">🖱️ Effet 3D automatique</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Renderer3D } from '../../utils/renderer3D'

const props = defineProps({
  artwork: {
    type: Object,
    required: true
  }
})

const containerRef = ref(null)
let renderer = null

onMounted(() => {
  if (!containerRef.value) return
  
  renderer = new Renderer3D(containerRef.value)
  renderer.init()
  
  const img = new Image()
  img.onload = () => {
    renderer.loadTexture(props.artwork.image, img.width, img.height)
  }
  img.src = props.artwork.image
  
  window.addEventListener('resize', handleResize)
})

const handleResize = () => {
  if (renderer) {
    renderer.onWindowResize()
  }
}

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<style scoped>
.artwork-viewer-3d {
  position: relative;
  background: var(--color-beige);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  aspect-ratio: 4/3;
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
  background: rgba(0, 0, 0, 0.7);
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