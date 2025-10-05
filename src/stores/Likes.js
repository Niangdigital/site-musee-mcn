import { defineStore } from 'pinia'

export const useLikesStore = defineStore('likes', {
  state: () => ({
    likes: {},
    userLikes: []
  }),
  
  actions: {
    loadLikes() {
      const saved = localStorage.getItem('mca_likes')
      const userSaved = localStorage.getItem('mca_user_likes')
      
      if (saved) this.likes = JSON.parse(saved)
      if (userSaved) this.userLikes = JSON.parse(userSaved)
    },
    
    toggleLike(artworkId) {
      const hasLiked = this.hasUserLiked(artworkId)
      
      if (hasLiked) {
        this.likes[artworkId] = Math.max((this.likes[artworkId] || 1) - 1, 0)
        this.userLikes = this.userLikes.filter(id => id !== artworkId)
      } else {
        this.likes[artworkId] = (this.likes[artworkId] || 0) + 1
        this.userLikes.push(artworkId)
      }
      
      this.saveLikes()
    },
    
    hasUserLiked(artworkId) {
      return this.userLikes.includes(artworkId)
    },
    
    saveLikes() {
      localStorage.setItem('mca_likes', JSON.stringify(this.likes))
      localStorage.setItem('mca_user_likes', JSON.stringify(this.userLikes))
    }
  },
  
  getters: {
    getLikesCount: (state) => (artworkId) => {
      return state.likes[artworkId] || 0
    },
    
    isLikedByUser: (state) => (artworkId) => {
      return state.userLikes.includes(artworkId)
    }
  }
})