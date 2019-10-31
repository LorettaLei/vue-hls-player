import aplayer from './index.vue'
  
aplayer.install = function(Vue) {
  Vue.component(aplayer.name, aplayer);
};

export default aplayer;