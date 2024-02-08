import { createRouter, createWebHistory } from 'vue-router'
import CompanyForm from '../views/CompanyForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CompanyForm
    },
    {
      path: '/edit/:CIF',
      name: 'editar',
      component: CompanyForm,
      props: true
    },
  ]
})

export default router
