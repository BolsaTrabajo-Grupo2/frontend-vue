import { createRouter, createWebHistory } from 'vue-router'
import StudentForm from '@/views/StudentForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: StudentForm
    },
    {
      path: '/edit/:id',
      name: 'editar',
      component: StudentForm,
      props: true
    },
  ]
})

export default router
