<template>
  <div class="number-input">
    <form @submit.prevent="handleSubmit" class="input-form">
      <div class="input-group">
        <input 
          v-model="artworkNumber"
          type="text"
          :placeholder="translations[currentLang].placeholder"
          class="artwork-input"
          maxlength="10"
          @input="clearError"
        />
        <button 
          type="submit" 
          class="btn-search"
          :disabled="!artworkNumber.trim()"
        >
          <span class="search-icon">🔍</span>
          {{ translations[currentLang].search }}
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-message">
        <span class="error-icon">⚠️</span>
        {{ error }}
      </div>

      <!-- Success Message -->
      <div v-if="success" class="success-message">
        <span class="success-icon">✅</span>
        {{ translations[currentLang].found }}
      </div>
    </form>

    <!-- Quick Access -->
    <div class="quick-access">
      <p class="quick-title">{{ translations[currentLang].quickAccess }}</p>
      <div class="quick-buttons">
        <button 
          v-for="num in quickNumbers" 
          :key="num"
          @click="quickSearch(num)"
          class="quick-btn"
        >
          #{{ num }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue'
import { useArtworks } from '../composables/useArtworks.js'

const props = defineProps({
  currentLang: {
    type: String,
    default: 'fr'
  }
})

const emit = defineEmits(['search-artwork'])

const artworkNumber = ref('')
const error = ref(null)
const success = ref(false)

// Utilisation du composable
const { artworkExists, getAllArtworks } = useArtworks()

// Numéros d'accès rapide (œuvres populaires)
const quickNumbers = getAllArtworks().slice(0, 3).map(a => a.id)

const translations = {
  fr: {
    placeholder: 'Ex: 001, 042, 123...',
    search: 'Rechercher',
    quickAccess: 'Accès rapide',
    found: 'Œuvre trouvée ! Redirection...',
    notFound: 'Aucune œuvre trouvée avec ce numéro',
    invalid: 'Veuillez entrer un numéro valide'
  },
  en: {
    placeholder: 'Ex: 001, 042, 123...',
    search: 'Search',
    quickAccess: 'Quick access',
    found: 'Artwork found! Redirecting...',
    notFound: 'No artwork found with this number',
    invalid: 'Please enter a valid number'
  },
  wo: {
    placeholder: 'Misaal: 001, 042, 123...',
    search: 'Seet',
    quickAccess: 'Accès bu gaaw',
    found: 'Gisoon na yéen bi! Dañuy jaay...',
    notFound: 'Gisul yéen ak nimero bii',
    invalid: 'Bind ab nimero bu baax'
  }
}

// Mock data - Liste des œuvres existantes
// Maintenant géré par le composable

const handleSubmit = () => {
  const number = artworkNumber.value.trim()
  
  if (!number) {
    error.value = translations[props.currentLang].invalid
    return
  }

  // Formater le numéro (ajouter des zéros devant si nécessaire)
  const formattedNumber = number.padStart(3, '0')
  
  // Vérifier si l'œuvre existe via le composable
  if (artworkExists(formattedNumber)) {
    success.value = true
    error.value = null
    
    setTimeout(() => {
      emit('search-artwork', formattedNumber)
    }, 800)
  } else {
    error.value = translations[props.currentLang].notFound
    success.value = false
  }
}

const quickSearch = (number) => {
  artworkNumber.value = number
  handleSubmit()
}

const clearError = () => {
  error.value = null
  success.value = false
}
</script>

<style scoped>
.number-input {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.input-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.input-group {
  display: flex;
  gap: var(--space-3);
  width: 100%;
}

.artwork-input {
  flex: 1;
  padding: var(--space-4);
  border: 2px solid var(--color-gray-300);
  border-radius: var(--border-radius);
  font-size: 1.1rem;
  font-family: inherit;
  transition: all var(--transition-fast);
  text-align: center;
  font-weight: 600;
  letter-spacing: 1px;
}

.artwork-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.1);
}

.artwork-input::placeholder {
  color: var(--color-gray-500);
  font-weight: 400;
  letter-spacing: normal;
}

.btn-search {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-6);
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.btn-search:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-search:disabled {
  background: var(--color-gray-300);
  cursor: not-allowed;
  opacity: 0.6;
}

.search-icon {
  font-size: 1.2rem;
}

.error-message {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: #fee;
  border: 2px solid #fcc;
  border-radius: var(--border-radius);
  color: #c33;
  font-weight: 500;
  animation: shake 0.3s ease-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.error-icon {
  font-size: 1.2rem;
}

.success-message {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: #efe;
  border: 2px solid #cfc;
  border-radius: var(--border-radius);
  color: #363;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-icon {
  font-size: 1.2rem;
}

/* Quick Access */
.quick-access {
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-gray-200);
}

.quick-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-gray-700);
  margin-bottom: var(--space-3);
  text-align: center;
}

.quick-buttons {
  display: flex;
  gap: var(--space-2);
  justify-content: center;
  flex-wrap: wrap;
}

.quick-btn {
  padding: var(--space-2) var(--space-4);
  background: var(--color-gray-100);
  color: var(--color-primary);
  border: 2px solid var(--color-gray-300);
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.quick-btn:hover {
  background: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .input-group {
    flex-direction: column;
  }
  
  .btn-search {
    width: 100%;
    justify-content: center;
  }
  
  .artwork-input {
    font-size: 1rem;
  }
}
</style>