import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'

import NoteList from '@/views/note/NoteList.vue'
import UserList from '@/views/user/UserList.vue'
import UserNote from '@/views/user/UserNote.vue'

import DocentesView from '@/views/docente/DocentesView.vue'
import MateriasView from '@/views/materia/MateriasView.vue'
import DocenteDetail from '@/views/docente/DocenteDetail.vue'

import { isLogin } from '@/services/authService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },

    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },

    {
      path: '/usuarios',
      name: 'usuarios',
      component: UserList,
      meta: { requiresAuth: true },
    },

    {
      path: '/usuario/:id/notes',
      name: 'usuarioNote',
      component: UserNote,
      props: true,
      meta: { requiresAuth: true },
    },

    {
      path: '/notes',
      name: 'notes',
      component: NoteList,
      meta: { requiresAuth: true },
    },

    {
      path: '/docentes',
      name: 'docentes',
      component: DocentesView,
      meta: { requiresAuth: true },
    },

    {
      path: '/docentes/:id',
      name: 'docenteDetail',
      component: DocenteDetail,
      props: true,
      meta: { requiresAuth: true },
    },

    {
      path: '/materias',
      name: 'materias',
      component: MateriasView,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login' && isLogin()) {
    next('/')
  } 
  else if (to.meta.requiresAuth && !isLogin()) {
    next('/login')
  } 
  else {
    next()
  }
})

export default router