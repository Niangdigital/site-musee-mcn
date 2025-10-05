import { defineStore } from 'pinia'

export const useCommentsStore = defineStore('comments', {
  state: () => ({
    comments: {}
  }),
  
  actions: {
    loadComments() {
      const saved = localStorage.getItem('mca_comments')
      if (saved) {
        this.comments = JSON.parse(saved)
      }
    },
    
    addComment(artworkId, comment) {
      if (!this.comments[artworkId]) {
        this.comments[artworkId] = []
      }
      
      const newComment = {
        id: Date.now(),
        author: comment.author,
        text: comment.text,
        date: new Date().toISOString(),
        likes: 0
      }
      
      this.comments[artworkId].unshift(newComment)
      this.saveComments()
      
      return newComment
    },
    
    likeComment(artworkId, commentId) {
      const artwork = this.comments[artworkId]
      if (artwork) {
        const comment = artwork.find(c => c.id === commentId)
        if (comment) {
          comment.likes = (comment.likes || 0) + 1
          this.saveComments()
        }
      }
    },
    
    deleteComment(artworkId, commentId) {
      if (this.comments[artworkId]) {
        this.comments[artworkId] = this.comments[artworkId].filter(c => c.id !== commentId)
        this.saveComments()
      }
    },
    
    saveComments() {
      localStorage.setItem('mca_comments', JSON.stringify(this.comments))
    }
  },
  
  getters: {
    getArtworkComments: (state) => (artworkId) => {
      return state.comments[artworkId] || []
    },
    
    getCommentsCount: (state) => (artworkId) => {
      return state.comments[artworkId]?.length || 0
    }
  }
})