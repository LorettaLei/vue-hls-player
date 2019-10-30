<template>
    <div class="player vplayer">
        <video ref="media"></video>
        <div class="player__controls">
            <div class="player__controls--btn">
                <div class="btn-play" :class="{stop: !playing}" @click.stop="togglePlay()"></div>
            </div>
            <div class="player__controls--current">{{playedTime}}</div>
            <progress-bar ref="progress" class="player__controls--progress" @changeProgress="onMediaChangeProgress" />
            <div class="player__controls--durration">{{lengthTime}}</div>
            <div class="player__controls--btn" @mouseenter="volumeBarShow=true" @mouseleave="volumeBarShow=false">
                <volume-bar @changeVolume="onMediaVolumeChange" v-model="volume" v-if="volumeBarShow" />
                <div class="btn-volume" @click="muted = !muted">
                    <div class="volume"></div>
                    <div class="muted" v-if="muted"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import BASE from '../utils/base'
import progressBar from './progress-bar.vue'
import volumeBar from './volume-bar.vue'
export default {
    name: "vPlayer",
    components: { progressBar,volumeBar },
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
                    title: '',
                    crossOrigin: false,
                    controls: 'progress,timer'
                }
            }
        }
    },
    data(){
        return{
            dataLength: 0, //
            loadedLength: 0, //已下载时长
            playedLength: 0, //已播放时长
            playing: false,
            playedTime: '00:00', // 当前播放时长
            lengthTime: '00:00', //音频长度
            volume: 1,
            muted: false,
            volumeBarShow: false
        }
    },
    computed:{
        media(){
            return this.$refs.media
        }
    },
    mounted(){
        console.log(2,new Date().getTime())
        this.initMedia();
    },
    methods: {
        initMedia(){
            console.log(this.media.mediaGroup)
            this.media.preload = this.playerOptions.preload||true;
            this.media.title = this.playerOptions.title||'vue音视频播放器';
            this.media.autoplay = this.playerOptions.autoplay||false;
            this.media.poster = this.playerOptions.poster||'';
            if(this.playerOptions.playsinline){
                this.media.setAttribute('playsinline', this.playerOptions.playsinline)
                this.media.setAttribute('webkit-playsinline', this.playerOptions.playsinline)
                this.media.setAttribute('x5-playsinline', this.playerOptions.playsinline)
                this.media.setAttribute('x5-video-player-type', 'h5')
                this.media.setAttribute('x5-video-player-fullscreen', false)
            }
            if(this.playerOptions.crossOrigin){
                this.media.crossOrigin = this.playerOptions.crossOrigin;
            }
            if(this.playerOptions.type && (this.playerOptions.type=='application/x-mpegURL'||this.playerOptions.type=='application/vnd.apple.mpegURL')){
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
            console.log(this.media.crossOrigin,this.media.mediaGroup)
            this.media.addEventListener('play', this.onMediaPlay)
            this.media.addEventListener('playing', this.onMediaPlay)
            this.media.addEventListener('pause', this.onMediaPause)
            this.media.addEventListener('abort', this.onMediaPause)
            this.media.addEventListener('progress', this.onMediaProgress)
            this.media.addEventListener('durationchange', this.onMediaDurationChange)
            this.media.addEventListener('seeking', this.onMediaSeeking)
            this.media.addEventListener('seeked', this.onMediaSeeking)
            this.media.addEventListener('timeupdate', this.onMediaSeeking)
            this.media.addEventListener('volumechange', this.onMediaVolumeChange(this.media.volume))
            this.media.addEventListener('ended', this.onMediaEnded)
        },
        togglePlay(){
            if(this.playing){
                this.media.pause()
            }else{
                this.media.play();
            }
        },
        onMediaPlay(){
            this.playing = true
        },
        onMediaPause(){
            this.playing = false
        },
        onMediaProgress(){
            if (this.media.buffered.length) {
                this.loadedLength = this.media.buffered.end(this.media.buffered.length - 1)
            } else {
                this.loadedLength = 0
            }
            this.$refs.progress.initProgress(this.loadedLength,this.playedLength,this.dataLength)
        },
        onMediaDurationChange(){
            if (this.media.duration !== 1) {
                this.dataLength = this.media.duration;
                this.lengthTime = BASE.turnTime(parseInt(this.media.duration))
            }
            this.$refs.progress.initProgress(this.loadedLength,this.playedLength,this.dataLength)
        },
        onMediaSeeking(){
            this.playedLength = this.media.currentTime;
            this.playedTime = BASE.turnTime(parseInt(this.media.currentTime))
            this.$refs.progress.initProgress(this.loadedLength,this.playedLength,this.dataLength)
        },
        onMediaVolumeChange(v){
          console.log(v);
          this.volume = v;
          if(v==0){
              this.muted = true;
          }else{
              this.muted = false;
          }
          this.media.volume = v;  
        },
        onMediaChangeProgress(v){
            this.media.currentTime = parseInt(v * this.dataLength);
        },
        onMediaEnded(){
            if (this.playerOptions.isLoop) {
                this.media.play();
            }
        }
    }
}
</script>
<style lang="scss">
.vplayer{
    position: relative;
    font-size: 0;
    video{
        width: 100%;
        height: 100%;
    }
    .player{
        font-size: 14px;
        &__controls{
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 5px 10px;
            background: rgba($color: #000000, $alpha: 0.6)
        }
    }
}
</style>