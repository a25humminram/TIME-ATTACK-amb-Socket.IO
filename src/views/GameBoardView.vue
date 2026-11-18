<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { socket } from '@/services/socket'
import { useGameStore } from '../stores/game.js'

import KeyPad from '../components/KeyPad.vue'
import ResultsTable from '../components/ResultsTable.vue'
import ScoreBoard from '../components/ScoreBoard.vue'

const gameStore = useGameStore()

const nom = ref('')

const tecles = ['A', 'S', 'D', 'F']

const tempsObjectiu = {
  A: 2,
  S: 4,
  D: 5,
  F: 7
}

const jugant = ref(false)
const resultats = ref([])

let tempsInici = 0

const premudes = computed(() => resultats.value.map(r => r.tecla))

// ---------- SOCKET.IO ----------
function connectat() {
  console.log('Connectat al servidor!', socket.id)
}

function rebreClassificacio(dades) {
  console.log('Classificació rebuda:', dades)
  gameStore.actualitzarClassificacio(dades)
}

onMounted(() => {
  socket.on('connect', connectat)
  socket.on('classificacio', rebreClassificacio)
  socket.connect()
})

onUnmounted(() => {
  socket.off('connect', connectat)
  socket.off('classificacio', rebreClassificacio)
  socket.disconnect()
})
// -------------------------------

function entrarJoc() {
  if (nom.value.trim() !== '') {
    gameStore.guardarNom(nom.value.trim())
  }
}

function iniciarJoc() {
  resultats.value = []
  tempsInici = Date.now()
  jugant.value = true
}

function rebreTecla(tecla) {
  if (!jugant.value) return

  if (resultats.value.some(r => r.tecla === tecla)) return

  const temps = (Date.now() - tempsInici) / 1000
  const objectiu = tempsObjectiu[tecla]
  const error = Math.abs(temps - objectiu)

  resultats.value.push({
    tecla: tecla,
    tempsReal: Number(temps.toFixed(2)),
    objectiu: objectiu,
    error: Number(error.toFixed(2))
  })

  if (resultats.value.length === tecles.length) {
    jugant.value = false

    // Calculem l'error total
    const errorTotal = resultats.value.reduce(
      (total, r) => total + r.error, 0
    )

    const errorFinal = Number(errorTotal.toFixed(2))

    gameStore.guardarPartida(errorFinal)

    socket.emit('resultat', {
      nom: gameStore.nomJugador,
      errorTotal: errorFinal
    })
  }
}
</script>

<template>
  <div v-if="!gameStore.nomJugador" class="container mt-5 text-center" style="max-width: 400px;">
    <h2 class="mb-4">Benvingut a TIME ATTACK!</h2>

    <input
      v-model="nom"
      class="form-control mb-3"
      placeholder="Introdueix el teu nom"
      @keyup.enter="entrarJoc"
    />

    <button class="btn btn-primary w-100" @click="entrarJoc">
      Entrar al joc
    </button>
  </div>

  <div v-else class="container mt-4 text-center" style="max-width: 700px;">
    <h1>TIME ATTACK</h1>
    <h2 class="h4 text-muted">Hola, {{ gameStore.nomJugador }}!</h2>

    <ScoreBoard />

    <button class="btn btn-success" @click="iniciarJoc" :disabled="jugant">
      {{ jugant ? 'Jugant...' : 'Començar partida' }}
    </button>

    <KeyPad
      :tecles="tecles"
      :bloquejat="!jugant"
      :premudes="premudes"
      @premuda="rebreTecla"
    />

    <ResultsTable
      v-if="!jugant && resultats.length === tecles.length"
      :resultats="resultats"
    />
  </div>
</template>