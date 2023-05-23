import { createRouter, createWebHistory } from "vue-router";
import Home from "@/layout/Home.vue";
import Cars from "@/pages/Cars.vue";
import Details from "@/pages/Details.vue";
import CarShow from "@/pages/CarShow.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
      redirect: "/cars",
      children: [
        {
          path: "/cars",
          name: "Cars",
          component: Cars,
        },
        {
          path: "/cars/:id",
          name: "CarShow",
          props: true,
          component: CarShow,
        },
        {
          path: "/details",
          name: "Details",
          component: Details,
        },
      ],
    },
  ],
});

export default router;
