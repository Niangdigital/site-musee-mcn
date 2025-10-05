<template>
  <div class="code-input-container">
    <div class="code-input-wrapper">
      <h3>{{ t('code.title') }}</h3>
      <p class="hint">{{ t('code.hint') }}</p>
      
      <form @submit.prevent="submitCode">
        <input
          v-model="code"
          type="text"
          :placeholder="t('code.placeholder')"
          class="code-field"
          @input="validateCode"
        />
        
        <p v-if="error" class="error-msg">{{ error }}</p>
        
        <button 
          type="submit" 
          class="submit-btn"
          :disabled="!isValid"
        >
          {{ t('code.submit') }} →
        </button>
      </form>
      
      <!-- Exemples -->
      <div class="examples">
        <p class="examples-title">{{ t('code.examples') }}</p>
        <div class="example-codes">
          <button 
            v-for="ex in examples"
            :key="ex"
            @click="code = ex"
            class="example-btn"
          >
            {{ ex }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useArtworksStore } from '../../stores/artworks'
import { useLanguageStore } from '../../stores/language'
import translations from '../../assets/data/translations.json'

const emit = defineEmits(['code-submitted'])
const artworksStore = useArtworksStore()
const languageStore = useLanguageStore()

const code = ref('')
const error = ref('')
const examples = ['artwork-1', 'artwork-2']

const isValid = computed(() => {
  return code.value.trim().length > 0 && !error.value
})

const t = (key) => {
  const keys = key.split('.')
  let value = translations
  for (const k of keys) value = value[k]
  return value[languageStore.current] || value['fr']
}

const validateCode = () => {
  error.value = ''
  const trimmed = code.value.trim()
  
  if (trimmed && !artworksStore.getArtworkById(trimmed)) {
    error.value = t('code.invalid')
  }
}

const submitCode = () => {
  const trimmed = code.value.trim()
  
  if (!trimmed) {
    error.value = t('code.enterCode')
    return
  }
  
  if (!artworksStore.getArtworkById(trimmed)) {
    error.value = t('code.notFound')
    return
  }
  
  emit('code-submitted', trimmed)
}
</script>

<style scoped>
.code-input-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
}

.code-input-wrapper {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h3 {
  font-size: 1.5rem;
  color: #2c5530;
  margin-bottom: 0.5rem;
}

.hint {
  color: #6b7280;
  font-size: 0.938rem;
  margin-bottom: 2rem;
}

form {
  margin-bottom: 2rem;
}

.code-field {
  width: 100%;
  padding: 1rem;
  font-size: 1.125rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-family: monospace;
  text-align: center;
  transition: border-color 0.15s;
  margin-bottom: 1rem;
}

.code-field:focus {
  outline: none;
  border-color: #2c5530;
}

.error-msg {
  color: #dc2626;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.125rem;
  background: #2c5530;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.15s;
}

.submit-btn:hover:not(:disabled) {
  background: #1e3a23;
}

.submit-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.examples {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
}

.examples-title {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
}

.example-codes {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.example-btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-family: monospace;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #374151;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.15s;
}

.example-btn:hover {
  background: #e5e7eb;
  border-color: #2c5530;
  transform: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .code-input-container {
    padding: 1rem;
  }
  
  .code-input-wrapper {
    padding: 1.5rem;
  }
}
</style>