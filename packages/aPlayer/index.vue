<template>
    <div class="player aplayer">
        <audio ref="media"></audio>
        <div class="player__controls">
            <div class="player__controls--btn" @click.stop="togglePlay()">
                <div class="btn-play" :class="{stop: !playing}"></div>
            </div>
            <div class="player__controls--current">{{playedTime}}</div>
            <progress-bar ref="progress" class="player__controls--progress" @changeProgress="onMediaChangeProgress" />
            <div class="player__controls--durration">{{lengthTime}}</div>
        </div>
    </div>
</template>
<script>
import BASE from '../../src/utils/base'
import progressBar from '../components/progress-bar.vue'
export default {
    name: "aplayer",
    components: { progressBar, },
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
            volume: 0,
            muted: true
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
            this.media.title = this.playerOptions.title||'vue音视频播放器';
            this.media.autoplay = this.playerOptions.autoplay||false;
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
            this.media.addEventListener('play', this.onMediaPlay)
            this.media.addEventListener('pause', this.onMediaPause)
            this.media.addEventListener('abort', this.onMediaPause)
            this.media.addEventListener('progress', this.onMediaProgress)
            this.media.addEventListener('durationchange', this.onMediaDurationChange)
            this.media.addEventListener('seeking', this.onMediaSeeking)
            this.media.addEventListener('seeked', this.onMediaSeeking)
            this.media.addEventListener('timeupdate', this.onMediaSeeking)
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
.aplayer{
    .player{
        &__controls{
            &--current,&--durration{
                color: rgba($color: #898989, $alpha: 0.8);
            }
            &--btn{
                border: 1px solid rgba($color: #898989, $alpha: 0.8);
                .btn-play{
                    border: 2px solid rgba($color: #898989, $alpha: 0.8);
                    border-width: 0 2px;
                    &.stop{
                        border: 2px solid rgba($color: #898989, $alpha: 0.8);
                        border-width: 7px 10px;
                        border-color: transparent transparent transparent rgba($color: #898989, $alpha: 0.8);
                    }
                }
            }
        }

    }
}
</style>