<template>
    <div class="vue-player">
        <h2>vue-player</h2>
        <video ref="video"></video>
    </div>
</template>
<script>
export default {
    name: "vPlayer",
    props: {
        options: {
            type: Object,
            default(){
                return {
                    type: "",
                    src: '',
                    preload: true,
                    autoplay: true,
                    isLoop: false,
                    poster: '',
                    playsinline: true,
                    title: ''
                }
            }
        }
    },
    computed:{
        video(){
            return this.$refs.video
        }
    },
}
</script>