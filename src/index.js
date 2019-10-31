import aplayer from '../packages/aplayer/index'
import vplayer from '../packages/vplayer/index'
const install = function(Vue) {
    if (install.installed) return;
    Vue.component(aplayer.name, aplayer)
    Vue.component(vplayer.name, vplayer)
}
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}
export default {
    install,
    aplayer,
    vplayer
}