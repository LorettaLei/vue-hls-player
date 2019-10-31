<template>
    <div class="app">
        <h2>vue音视频播放器</h2>
        <aPlayer :playerOptions = "aOption" />
        <vPlayer :playerOptions = "vOption" />
    </div>
</template>
<script>
// import aPlayer from './components/aPlayer.vue'
// import vPlayer from './components/vPlayer.vue'
export default {
    // components: { aPlayer, vPlayer },
    data(){
        return {
            aOption: {
                type: "application/x-mpegURL",
                src: 'http://ph1vqefl0.bkt.clouddn.com/hlsnature2',
                preload: true,
                autoplay: true,
                isLoop: false,
                poster: 'https://oimdztrab.qnssl.com/Frp4SyVe5PosdkUKRaE-krjK7B5z',
                title: '音频播放器',
                description: '',
                controls: 'progress,timer'
            },
            vOption: {
                type: "application/x-mpegURL",
                src: 'http://obbfzjhuq.bkt.clouddn.com/WEw3RTROUVFFT0MxNTY4MTAzODQ5NTQ1',
                preload: true,
                autoplay: true,
                isLoop: false,
                poster: 'https://oimdztrab.qnssl.com/FlRHT5-abdwNVXyBb-sYzUPIihoe',
                playsinline: true,
                title: '视频播放器'
            },
        }
    },
    created(){
        // console.log(vueHlsPlayer)
    }
}
</script>
<style lang="scss">
// @import './styles/player.scss';
.player{
    width: 400px;
    margin: 0 auto;
    min-height: 30px;
}
</style>