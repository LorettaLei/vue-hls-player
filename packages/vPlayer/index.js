import Vplayer from './index.vue'
  
Vplayer.install = function(Vue) {
  Vue.component(Vplayer.name, Vplayer);
};

export default Vplayer;