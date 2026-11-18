<script setup>
import { computed } from 'vue'
import { useGameStore } from '../stores/game.js'

const store = useGameStore()

const classificacioOrdenada = computed(() => {
  const copia = [...store.classificacio]
  copia.sort((a, b) => a.errorTotal - b.errorTotal)
  return copia
})
</script>

<template>
  <div class="my-4">
    <h2 class="h4">HISTORIAL DE PARTIDES</h2>

    <p v-if="store.partides.length === 0" class="text-muted">
      Encara no hi ha cap partida registrada.
    </p>

    <template v-else>
      <table class="table table-striped table-bordered text-center">
        <thead>
          <tr>
            <th>Partida</th>
            <th>Jugador</th>
            <th>Error total</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="partida in store.partides"
            :key="partida.id"
          >
            <td>{{ partida.id }}</td>
            <td>{{ partida.nom }}</td>
            <td>{{ partida.errorTotal }} s</td>
          </tr>
        </tbody>
      </table>

      <button class="btn btn-danger btn-sm" @click="store.esborrarPartides()">
        Esborrar historial
      </button>
    </template>

    <h2>CLASSIFICACIÓ GLOBAL</h2>

    <p v-if="store.classificacio.length === 0">
      Encara no hi ha resultats. Sigues el primer a jugar!
    </p>

    <table v-else>
      <thead>
        <tr>
          <th>Posició</th>
          <th>Jugador</th>
          <th>Error total</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(resultat, index) in classificacioOrdenada"
          :key="index"
          :class="{ 'bg-warning': index === 0 }"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ resultat.nom }}</td>
          <td>{{ resultat.errorTotal }} s</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>