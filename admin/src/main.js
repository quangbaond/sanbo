import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Highcharts from "highcharts";
import Stock from "highcharts/modules/stock";
import HighchartsVue from "highcharts-vue";
import HighchartsMore from "highcharts/highcharts-more";
import item from 'highcharts/modules/item-series';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import router from './router';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import store from './store';
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
Stock(Highcharts);
HighchartsMore(Highcharts);
item(Highcharts);

const app = createApp(App)
app.use(router)
app.use(store)
app.use(HighchartsVue)
app.use(Antd)
app.use(VueSweetalert2)
app.use(ToastPlugin)
app.mount('#app')
