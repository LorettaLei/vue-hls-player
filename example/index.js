import Vue from 'vue';
import App from './app.vue';
// require('../sr/styles/base.css')
import player from '../lib/vue-hls-player'
console.log(player)
Vue.use(player)
new Vue({
    el: '#app',
    render: h => h(App)
});
