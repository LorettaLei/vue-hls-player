import Aplayer from './index.vue'
  
Aplayer.install = function(Vue) {
  Vue.component(Aplayer.name, Aplayer);
};

export default Aplayer;