import { createRouter, createWebHistory } from 'vue-router'
import StudentForm from '@/views/StudentForm.vue'
import HomeView from '@/views/Home.vue'
import LoginForm from '@/views/LoginForm.vue'
import StudentEditForm  from '@/views/StudentEditForm.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },{
      path: '/',
      name: 'login',
      component: LoginForm
    },
    {
      path: '/student-add',
      name: 'student-add',
      component: StudentForm
    },
    {
      path: '/student-mod/:id',
      name: 'student-mod',
      component: StudentEditForm,
      props: true
    }
  ]
})

export default router
