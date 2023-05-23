import { createApp } from "vue";
import { createPinia } from "pinia";
import bootstrap from "bootstrap/dist/js/bootstrap.js";
import "bootstrap/dist/css/bootstrap.css";
import "@/assets/ main.scss";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(bootstrap);
app.use(createPinia());
app.use(router);

app.mount("#app");
