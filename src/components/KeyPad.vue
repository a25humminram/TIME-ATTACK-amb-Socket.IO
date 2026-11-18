<script setup>
defineProps({
  tecles: Array,
  bloquejat: Boolean,
  premudes: Array
})

const emit = defineEmits(['premuda'])
</script>

<template>
  <div class="d-flex justify-content-center gap-3 mt-4">
    <button
      v-for="tecla in tecles"
      :key="tecla"
      class="btn btn-primary btn-lg"
      style="width: 100px; height: 100px; font-size: 32px;"
      :disabled="bloquejat || premudes.includes(tecla)"
      @click="emit('premuda', tecla)"
    >
      {{ tecla }}
    </button>
  </div>
</template>