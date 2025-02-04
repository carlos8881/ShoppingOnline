import { createApp } from 'vue';
import TopMenu from './components/TopMenu.vue';
import SystemMenu from './components/SystemMenu.vue';

//創建 TopMenu Vue應用程式
createApp(TopMenu).mount('#topmenu');

//創建 SysteamMenu Vue應用程式
createApp(SystemMenu).mount('#system_menu');