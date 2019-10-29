<template>
    <div class="vue-player">
        <h2>vue-aplayer</h2>
        <audio ref="media" controls></audio>
        <div class="player-box">
            <progress-bar class="progress" ref="progress" @volumeChange="onMediaVolumeChange" />
        </div>
    </div>
</template>
<script>
import BASE from '../../utils/base'
import progressBar from './progress-bar.vue'
export default {
    name: "aPlayer",
    components: { progressBar },
    props: {
        playerOptions: {
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
    data(){
        return{
            status: {
                dataLength: 0, //
                loadedLength: 0, //已下载时长
                playedLength: 0, //已播放时长
                playing: false,
                playedTime: '00:00', // 当前播放时长
                lengthTime: '00:00', //音频长度
                volume: 0,
            }
        }
    },
    computed:{
        media(){
            return this.$refs.media
        }
    },
    created(){
        this.$nextTick(()=>{
            this.initMedia();
        })
    },
    methods: {
        initMedia(){
            this.media.preload = this.playerOptions.preload||true;
            this.media.title = this.playerOptions.title||'智能睡眠计划';
            this.media.autoplay = this.playerOptions.autoplay||false;
            if(this.playerOptions.type=='application/x-mpegURL'||this.playerOptions.type=='application/vnd.apple.mpegURL'){
              try {
                const Hls = require('hls.js')
                if (Hls.isSupported()) {
                  if (!this.hls) {
                    this.hls = new Hls()
                  }
                  this.hls.loadSource(this.playerOptions.src)
                  this.hls.attachMedia(this.media)
                    if(this.playerOptions.autoplay){
                        let _this = this;
                        this.hls.on(Hls.Events.MANIFEST_PARSED,function() {
                            _this.media.play();
                        });
                    }
                } else {
                    console.warn('HLS is not supported on your browser')
                    this.media.src = this.playerOptions.src
                    if(this.playerOptions.autoplay){
                        let _this = this;
                        this.media.addEventListener('loadedmetadata',function() {
                            _this.media.play();
                        });
                    }
                }
              } catch (e) {
                  console.log(e)
                console.warn('hls.js is required to support m3u8')
                this.media.src = this.playerOptions.src
              }
            }else{
                this.media.src = this.playerOptions.src
            }
            this.media.addEventListener('play', this.onMediaPlay)
            this.media.addEventListener('pause', this.onMediaPause)
            this.media.addEventListener('abort', this.onMediaPause)
            this.media.addEventListener('progress', this.onMediaProgress)
            this.media.addEventListener('durationchange', this.onMediaDurationChange)
            this.media.addEventListener('seeking', this.onMediaSeeking)
            this.media.addEventListener('seeked', this.onMediaSeeking)
            this.media.addEventListener('timeupdate', this.onMediaSeeking)
            this.media.addEventListener('volumechange', this.onMediaVolumeChange)
            this.media.addEventListener('ended', this.onMediaEnded)
        },
        onMediaPlay(){
            if(!this.screenTimer){
                this.screenTimer = setTimeout(()=>{
                    this.closeScreen++;
                },10000)
            }
            this.status.playing = true
        },
        onMediaPause(){
            this.status.playing = false
        },
        onMediaProgress(){
            if (this.media.buffered.length) {
                this.status.loadedLength = this.media.buffered.end(this.media.buffered.length - 1)
            } else {
                this.status.loadedLength = 0
            }
            this.$refs.progress.initProgress(this.status.loadedLength,this.status.playedLength,this.status.dataLength)
        },
        onMediaDurationChange(){
            console.log(this.media.duration)
            if (this.media.duration !== 1) {
                this.status.dataLength = this.media.duration
                this.status.lengthTime = BASE.turnTime(parseInt(this.media.duration))
            }
            this.$refs.progress.initProgress(this.status.loadedLength,this.status.playedLength,this.status.dataLength)
        },
        onMediaSeeking(){
            // console.log(this.status.volume)
            this.status.playedLength = this.media.currentTime;
            if(this.status.playedLength > 0 && this.status.dataLength > 0){
                this.status.volume = parseInt(this.status.playedLength * 100 / this.status.dataLength);
            }else{
                this.status.volume = 0;
            }
            this.status.playedTime = BASE.turnTime(parseInt(this.media.duration))
            this.$refs.progress.initProgress(this.status.loadedLength,this.status.playedLength,this.status.dataLength)
        },
        onMediaVolumeChange(v){
            if(v){
                console.log(v,v * this.status.dataLength)
                // return;
                this.media.currentTime = parseInt(v * this.status.dataLength);
            }else{
                console.log(this.media.volume,this.media.muted)
            }
        },
        onMediaEnded(){
            if (this.playerOptions.isLoop) {
                this.media.play();
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.progress{
    width: 400px;
    margin: 0 auto;
}
</style>