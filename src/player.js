import aPlayer from './components/aPlayer.vue'
import vPlayer from './components/vPlayer.vue'
const install = function(Vue) {
    if (install.installed) return;
    Vue.component(vPlayer.name, vPlayer)
    Vue.component(vPlayer.name, vPlayer)
}
export default {
    aPlayer,
    vPlayer
}