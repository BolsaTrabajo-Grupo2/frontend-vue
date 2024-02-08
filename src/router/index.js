import { createRouter, createWebHistory } from 'vue-router'
import StudentForm from '@/views/StudentForm.vue'
import HomeView from '@/views/Home.vue'
import LoginForm from '@/views/LoginForm.vue'
import StudentEditForm  from '@/views/StudentEditForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LoginForm
    },
    {
      path: '/student-add',
      name: 'student-add',
      component: StudentForm
    },
  ]
})

export default router
