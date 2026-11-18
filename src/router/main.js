import { createRouter, createWebHistory } from 'vue-router'
import GameBoardView from '../views/GameBoardView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'game',
      component: GameBoardView
    }
  ]
})

export default router