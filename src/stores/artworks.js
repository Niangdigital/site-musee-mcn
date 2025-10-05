import { defineStore } from 'pinia'
import artworksData from '../assets/data/artworks.json'

export const useArtworksStore = defineStore('artworks', {
  state: () => ({
    artworks: artworksData,
    currentArtwork: null,
    viewMode: '2d'
  }),
  
  actions: {
    getArtworkById(id) {
      return this.artworks.find(a => a.id === id)
    },
    
    setCurrentArtwork(id) {
      this.currentArtwork = this.getArtworkById(id)
    },
    
    setViewMode(mode) {
      if (['2d', '3d', 'vr'].includes(mode)) {
        this.viewMode = mode
      }
    },
    
    searchArtworks(query, lang = 'fr') {
      const q = query.toLowerCase()
      return this.artworks.filter(artwork => 
        artwork.title[lang].toLowerCase().includes(q) ||
        artwork.description[lang].toLowerCase().includes(q)
      )
    },
    
    // Compteur de vues
    incrementViews(artworkId) {
      const key = `artwork_${artworkId}_views`
      const current = parseInt(localStorage.getItem(key) || '0')
      localStorage.setItem(key, current + 1)
    },
    
    getViews(artworkId) {
      const key = `artwork_${artworkId}_views`
      return parseInt(localStorage.getItem(key) || '0')
    },
    
    // Reset vues (utilitaire)
    resetViews(artworkId) {
      const key = `artwork_${artworkId}_views`
      localStorage.removeItem(key)
    }
  },
  
  getters: {
    allArtworks: (state) => state.artworks,
    totalCount: (state) => state.artworks.length,
    
    // Œuvres les plus vues
    mostViewed: (state) => {
      return [...state.artworks].sort((a, b) => {
        const aViews = parseInt(localStorage.getItem(`artwork_${a.id}_views`) || '0')
        const bViews = parseInt(localStorage.getItem(`artwork_${b.id}_views`) || '0')
        return bViews - aViews
      })
    }
  }
})