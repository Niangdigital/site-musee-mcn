import { ref, onMounted, onUnmounted } from 'vue'

export function use3DViewer() {
  const viewMode = ref('2d') // '2d', '3d', 'vr'
  const isVRSupported = ref(false)
  const is3DActive = ref(false)

  // Vérifier le support VR
  const checkVRSupport = async () => {
    if ('xr' in navigator) {
      try {
        const supported = await navigator.xr.isSessionSupported('immersive-vr')
        isVRSupported.value = supported
      } catch (error) {
        console.warn('VR support check failed:', error)
        isVRSupported.value = false
      }
    } else {
      isVRSupported.value = false
    }
  }

  // Changer le mode de visualisation
  const setViewMode = (mode) => {
    if (mode === 'vr' && !isVRSupported.value) {
      console.warn('VR not supported on this device')
      return false
    }
    viewMode.value = mode
    is3DActive.value = mode === '3d' || mode === 'vr'
    return true
  }

  // Effet parallaxe pour la vue 3D
  const applyParallax = (element, mouseX, mouseY) => {
    if (!element) return

    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (mouseX - centerX) / rect.width
    const deltaY = (mouseY - centerY) / rect.height

    // Rotation basée sur la position de la souris
    const rotateY = deltaX * 15 // Max 15 degrés
    const rotateX = -deltaY * 15

    // Translation pour effet de profondeur
    const translateZ = 30

    element.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateZ(${translateZ}px)
    `
  }

  // Réinitialiser la transformation
  const resetTransform = (element) => {
    if (!element) return
    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
  }

  // Créer un effet de profondeur simple avec ombres
  const create3DEffect = (imageUrl) => {
    return {
      backgroundImage: `url(${imageUrl})`,
      transform: 'perspective(1000px) translateZ(30px)',
      boxShadow: `
        0 20px 40px rgba(0, 0, 0, 0.3),
        0 30px 60px rgba(0, 0, 0, 0.2),
        0 40px 80px rgba(0, 0, 0, 0.1)
      `,
      transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out'
    }
  }

  // Modes disponibles
  const availableModes = ref([
    { 
      id: '2d', 
      label: 'viewModes.2d',
      icon: '🖼️',
      description: 'Vue standard rapide'
    },
    { 
      id: '3d', 
      label: 'viewModes.3d',
      icon: '🎨',
      description: 'Vue avec profondeur'
    },
    { 
      id: 'vr', 
      label: 'viewModes.vr',
      icon: '🥽',
      description: 'Réalité virtuelle',
      disabled: !isVRSupported.value
    }
  ])

  onMounted(() => {
    checkVRSupport()
  })

  return {
    viewMode,
    isVRSupported,
    is3DActive,
    availableModes,
    setViewMode,
    applyParallax,
    resetTransform,
    create3DEffect,
    checkVRSupport
  }
}