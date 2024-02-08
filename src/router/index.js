import { createRouter, createWebHistory } from 'vue-router'
import CompanyForm from '../views/CompanyForm.vue'
import CompanyEditFormVue from '@/views/CompanyEditForm.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CompanyForm
    },
    {
      path: '/edit/:id',
      name: 'editar',
      component: CompanyEditFormVue,
      props: true
    }
  ]
})

export default router
