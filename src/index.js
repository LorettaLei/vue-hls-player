import Vue from 'vue';
import App from './app.vue';
require('./styles/base.css')
import { aPlayer, vPlayer } from './utils/vue-hls-player'
App.use(vPlayer)
App.use(aPlayer)
new Vue({
    el: '#app',
    render: h => h(App)
});
