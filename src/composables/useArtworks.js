import { ref, computed } from 'vue'
import artworksData from '../assets/data/artworks.json'

// State global partagé entre tous les composants
const artworks = ref(artworksData.artworks)
const loading = ref(false)
const error = ref(null)

export function useArtworks() {
  /**
   * Récupère toutes les œuvres
   */
  const getAllArtworks = () => {
    return artworks.value
  }

  /**
   * Récupère une œuvre par son ID
   */
  const getArtworkById = (id) => {
    return artworks.value.find(artwork => artwork.id === id)
  }

  /**
   * Récupère une œuvre par son QR code
   */
  const getArtworkByQRCode = (qrCode) => {
    return artworks.value.find(artwork => artwork.qrCode === qrCode)
  }

  /**
   * Recherche des œuvres par titre (dans une langue donnée)
   */
  const searchArtworks = (query, lang = 'fr') => {
    if (!query || query.trim() === '') {
      return artworks.value
    }

    const searchTerm = query.toLowerCase().trim()
    
    return artworks.value.filter(artwork => {
      const title = artwork.titles[lang].toLowerCase()
      const artist = artwork.artist.toLowerCase()
      const category = artwork.category.toLowerCase()
      
      return title.includes(searchTerm) || 
             artist.includes(searchTerm) || 
             category.includes(searchTerm)
    })
  }

  /**
   * Filtre les œuvres par catégorie
   */
  const filterByCategory = (category) => {
    if (!category || category === 'all') {
      return artworks.value
    }
    
    return artworks.value.filter(artwork => artwork.category === category)
  }

  /**
   * Récupère toutes les catégories uniques
   */
  const getCategories = computed(() => {
    const categories = new Set(artworks.value.map(a => a.category))
    return Array.from(categories).sort()
  })

  /**
   * Récupère les œuvres récentes (simulé par ordre d'ID)
   */
  const getFeaturedArtworks = (limit = 3) => {
    return artworks.value.slice(0, limit)
  }

  /**
   * Vérifie si une œuvre existe par son ID
   */
  const artworkExists = (id) => {
    return artworks.value.some(artwork => artwork.id === id)
  }

  /**
   * Compte le nombre total d'œuvres
   */
  const totalArtworks = computed(() => {
    return artworks.value.length
  })

  /**
   * Récupère des œuvres aléatoires
   */
  const getRandomArtworks = (count = 3) => {
    const shuffled = [...artworks.value].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  /**
   * Filtre et recherche combinés
   */
  const filterAndSearch = (searchQuery, category, lang = 'fr') => {
    let filtered = artworks.value

    // Filtre par catégorie
    if (category && category !== 'all') {
      filtered = filtered.filter(a => a.category === category)
    }

    // Recherche par texte
    if (searchQuery && searchQuery.trim() !== '') {
      const searchTerm = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(artwork => {
        const title = artwork.titles[lang].toLowerCase()
        const artist = artwork.artist.toLowerCase()
        return title.includes(searchTerm) || artist.includes(searchTerm)
      })
    }

    return filtered
  }

  /**
   * Recharge les données (utile si on ajoute un système de mise à jour)
   */
  const refreshArtworks = async () => {
    loading.value = true
    error.value = null
    
    try {
      // En production, ce serait un appel API
      // const response = await fetch('/api/artworks')
      // artworks.value = await response.json()
      
      // Pour l'instant, on recharge depuis le JSON
      artworks.value = artworksData.artworks
    } catch (err) {
      error.value = 'Erreur lors du chargement des œuvres'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    artworks,
    loading,
    error,
    
    // Computed
    getCategories,
    totalArtworks,
    
    // Methods
    getAllArtworks,
    getArtworkById,
    getArtworkByQRCode,
    searchArtworks,
    filterByCategory,
    getFeaturedArtworks,
    artworkExists,
    getRandomArtworks,
    filterAndSearch,
    refreshArtworks
  }
}