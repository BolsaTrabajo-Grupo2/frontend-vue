import { createRouter, createWebHistory } from 'vue-router'
import StudentForm from '@/views/StudentForm.vue'
import StudentEditForm  from '@/views/StudentEditForm.vue'

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
      component: StudentEditForm,
      props: true
    },
  ]
})

export default router
