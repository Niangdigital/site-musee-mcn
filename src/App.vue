<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useLanguageStore } from './stores/language'
import { useAudioStore } from './stores/audio'

const languageStore = useLanguageStore()
const audioStore = useAudioStore()

onMounted(() => {
  languageStore.loadSavedLanguage()
  audioStore.loadSettings()
})
</script>

<style>
/* Styles globaux déjà dans style.css */
</style>