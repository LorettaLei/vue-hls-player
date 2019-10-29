// import 'babel-polyfill'
import Vue from 'vue';
// import promise from 'es6-promise'
// import 'es6-promise/auto'
// require('es6-promise').polyfill()
// promise.polyfill()
import App from './app.vue';
require('./styles/base.css')
new Vue({
    el: '#app',
    render: h => h(App)
});
