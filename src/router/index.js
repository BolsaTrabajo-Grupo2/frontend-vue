import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from '@/stores/store';
import StudentForm from '@/views/StudentForm.vue'
import HomeView from '@/views/Home.vue'
import LoginForm from '@/views/LoginForm.vue'
import StudentEditForm from '@/views/StudentEditForm.vue'
import CompanyForm from '@/views/CompanyForm.vue'
import CompanyEditForm from '@/views/CompanyEditForm.vue'
import ListOffer from '@/views/ListOffer.vue'
import UsersListVue from '@/views/UsersList.vue'
import OfferForm from '@/views/OfferForm.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      name: 'login',
      component: LoginForm
    },
    {
      path: '/student-add',
      name: 'student-add',
      component: StudentForm,
      meta: { requiresAuth: true }
    },
    {
      path: '/student-mod/:id',
      name: 'student-mod',
      component: StudentEditForm,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/company-add',
      name: 'company-add',
      component: CompanyForm,
      meta: { requiresAuth: true }
    },
    {
      path: '/company-mod/:id',
      name: 'company-mod',
      component: CompanyEditForm,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/listOffers',
      name: 'listOffers',
      component: ListOffer,
      meta: { requiresAuth: true }
    },
    {
      path: '/users-list',
      name: 'users-list',
      component: UsersListVue,
      meta: { requiresAuth: true }
    },
    {
      path: '/offer-add',
      name: 'offer-add',
      component: OfferForm,
      meta: { requiresAuth: true }
    }
  ]
})


// router.beforeEach((to, from, next) => {
//   const store = useStore();
//   console.log("Usuario en el store:", store.user);
//   const isAuthenticated = store.user;

//   if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
//     router.push('/'); 
//   } else {
//     next(); 
//   }
// });

export default router
