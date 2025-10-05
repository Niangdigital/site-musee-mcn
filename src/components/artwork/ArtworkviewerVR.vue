<template>
  <div class="artwork-viewer-vr">
    <div ref="containerRef" class="vr-container">
      <div class="vr-preview">
        <img :src="artwork.image" :alt="title" class="vr-preview-img" />
        <div class="vr-overlay">
          <div class="vr-icon">🥽</div>
          <p class="vr-text">Mode VR</p>
        </div>
      </div>
    </div>
    
    <div class="vr-controls">
      <button 
        v-if="vrSupported" 
        @click="enterVR" 
        class="vr-button"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="2" y="7" width="20" height="10" rx="2" stroke-width="2"/>
          <circle cx="8" cy="12" r="2" stroke-width="2"/>
          <circle cx="16" cy="12" r="2" stroke-width="2"/>
        </svg>
        Lancer la VR
      </button>
      <p v-else class="vr-warning">
        ⚠️ WebXR non supporté sur cet appareil
      </p>
      <p class="vr-hint">
        📱 Utilisez un casque VR ou Google Cardboard
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLanguageStore } from '../../stores/language'
import * as THREE from 'three'

const props = defineProps({
  artwork: {
    type: Object,
    required: true
  }
})

const languageStore = useLanguageStore()
const containerRef = ref(null)
const vrSupported = ref(false)

const title = computed(() => props.artwork.title[languageStore.current])

onMounted(() => {
  if ('xr' in navigator) {
    navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
      vrSupported.value = supported
    })
  }
})

const enterVR = async () => {
  if (!containerRef.value || !vrSupported.value) return
  
  try {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 3
    
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.xr.enabled = true
    containerRef.value.appendChild(renderer.domElement)
    
    const loader = new THREE.TextureLoader()
    const texture = await loader.loadAsync(props.artwork.image)
    
    const geometry = new THREE.PlaneGeometry(4, 3)
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)
    
    const session = await navigator.xr.requestSession('immersive-vr')
    await renderer.xr.setSession(session)
    
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera)
    })
    
  } catch (error) {
    console.error('VR Error:', error)
    alert('Impossible de lancer le mode VR')
  }
}
</script>

<style scoped>
.artwork-viewer-vr {
  background: var(--color-gray-900);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.vr-container {
  aspect-ratio: 4/3;
  position: relative;
}

.vr-preview {
  width: 100%;
  height: 100%;
  position: relative;
}

.vr-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(2px) brightness(0.7);
}

.vr-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  color: var(--color-white);
}

.vr-icon {
  font-size: 4rem;
  animation: float 2s ease-in-out infinite;
}

.vr-text {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.vr-controls {
  padding: var(--space-6);
  text-align: center;
}

.vr-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-8);
  font-size: 1.125rem;
  background: var(--color-primary);
  margin-bottom: var(--space-4);
}

.vr-button svg {
  width: 24px;
  height: 24px;
}

.vr-warning {
  color: var(--color-accent);
  margin-bottom: var(--space-4);
}

.vr-hint {
  color: var(--color-gray-700);
  font-size: 0.875rem;
  margin: 0;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style> 