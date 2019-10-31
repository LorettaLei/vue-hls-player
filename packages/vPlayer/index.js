import vplayer from './index.vue'
  
vplayer.install = function(Vue) {
  Vue.component(vplayer.name, vplayer);
};

export default vplayer;