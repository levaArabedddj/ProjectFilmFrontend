import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth'; // Импортируем хранилище
import Register from '@/components/Register.vue';
import Dashboard from '../components/Dashboard.vue'; 
import Login from '../components/Login.vue'; 
import ActorDashboard from "@/components/ActorDashboard.vue"; 
import CrewDashboard from "@/components/CrewDashboard.vue"; 
import DirectorDashboard from "@/components/DirectorDashboard.vue"; 
import { jwtDecode } from "jwt-decode";
import Home from '@/views/Home.vue'; // Добавили главную страницу
import MainPageDirector from '@/components/MainPageDirector.vue';
import CreateCasting from '@/components/CreateCasting.vue' 
import CastingPanel from '@/page/CastingPanel.vue';
import CastingApplications from "@/components/CastingApplications.vue";


const routes = [
  { path: '/', component: Home }, // Главная страница
  { path: '/register', name: 'Register', component: Register },
  { path: '/dashboard', component: Dashboard },
  { path:'/signin', component: Login },
  { path: "/actor-dashboard", component: ActorDashboard, meta: { role: "ACTOR" } },
  { path: '/director-dashboard/:id', name: 'DirectorDashboard', component: DirectorDashboard, meta: { role: "DIRECTOR" } },
  { path: "/crew-dashboard", component: CrewDashboard, meta: { role: "CREW_MEMBER" } },
  { path: "/main-page-director", component: MainPageDirector },
  { path: '/casting/create/:movieId', name: 'CreateCasting', component: CreateCasting, props: true}, // Добавили маршрут для создания кастинга
  { path: '/casting/dashboard/:movieId', name: 'CastingPanel', component: CastingPanel, props: true, meta: { role: 'DIRECTOR' }}, 
  {path: '/movies/:movieId/castings',name: 'CastingList',component: () => import('@/components/CastingList.vue')},
  {
    path: "/applications/:filmId/:castingId",
    name: "CastingApplications",
    component: CastingApplications,
    props: true
  },{
  path: '/oauth2/callback',
  name: 'OAuth2Callback',
  component: () => import('@/components/OAuth2Callback.vue')
}

  
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Используем хранилище для получения токена
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const token = authStore.token;

  if (token) {
    try {
      const decoded = jwtDecode(token); // ✅ Исправил импорт
      const userRoles = decoded.roles || []; // ✅ Роли - это массив

      if (to.meta.role && !userRoles.includes(`ROLE_${to.meta.role.toUpperCase()}`)) {
        next("/unauthorized");
      } else {
        next();
      }
    } catch (error) {
      console.error("Ошибка декодирования токена:", error);
      authStore.logout();
      next("/signin");
    }
  } else {
    if (to.meta.requiresAuth) {
      next("/signin");
    } else {
      next();
    }
  }
});

export default router;
