<template>
  <div class="comments-section">
    <div class="comments-header">
      <h3>💬 {{ t('comments.title') }} ({{ comments.length }})</h3>
    </div>
    
    <CommentForm @submit="handleCommentSubmit" />
    
    <div v-if="comments.length === 0" class="no-comments">
      <p>{{ t('comments.noComments') }}</p>
    </div>
    
    <div v-else class="comments-list">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        @like="handleLike"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCommentsStore } from '../../stores/comments.js'
import { useLanguageStore } from '../../stores/language.js'
import translations from '../../assets/data/translations.json'
import CommentForm from './CommentForm.vue'
import CommentItem from './CommentItem.vue'

const props = defineProps({
  artworkId: { type: String, required: true }
})

const commentsStore = useCommentsStore()
const languageStore = useLanguageStore()

const comments = computed(() => commentsStore.getArtworkComments(props.artworkId))

const t = (key) => {
  const keys = key.split('.')
  let value = translations
  for (const k of keys) value = value[k]
  return value[languageStore.current] || value['fr']
}

const handleCommentSubmit = (commentData) => {
  commentsStore.addComment(props.artworkId, commentData)
}

const handleLike = (commentId) => {
  commentsStore.likeComment(props.artworkId, commentId)
}

const handleDelete = (commentId) => {
  if (confirm(t('comments.delete'))) {
    commentsStore.deleteComment(props.artworkId, commentId)
  }
}

onMounted(() => {
  commentsStore.loadComments()
})
</script>

<style scoped>
.comments-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

.comments-header {
  margin-bottom: 1.5rem;
}

.comments-header h3 {
  font-size: 1.5rem;
  color: #2c5530;
  margin: 0;
}

.no-comments {
  text-align: center;
  padding: 3rem 2rem;
  color: #6b7280;
  background: #f9fafb;
  border-radius: 0.75rem;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>