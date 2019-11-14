<template>
    <div class="player aplayer">
        <audio ref="media"></audio>
        <div class="player__controls">
            <div class="player__controls--btn" @click.stop="togglePlay()">
                <div class="btn-play" :class="{stop: !playing}"></div>
            </div>
            <div class="player__controls--current" v-if="playerOptions.controls===undefined || playerOptions.controls.indexOf('current')!='-1'">{{playedTime}}</div>
            <progress-bar ref="progress" v-if="playerOptions.controls===undefined || playerOptions.controls.indexOf('progress')!='-1'" class="player__controls--progress" @changeProgress="onMediaChangeProgress" />
            <div class="player__controls--durration" :class="{error:error}" v-if="playerOptions.controls===undefined || playerOptions.controls.indexOf('durration')!='-1'">{{error ? 'error!' : lengthTime}}</div>
        </div>
    </div>
</template>
<script>
import BASE from '../../src/utils/base'
import progressBar from '../components/progress-bar.vue'
export default {
    name: "Aplayer",
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
                    controls: 'progress,current,durration'
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
            muted: true,
            error: false
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
            this.media.addEventListener('play', (e)=>{this.onMediaPlay();this.$emit('onplay',e);})
            this.media.addEventListener('playing', (e)=>{this.onMediaPlay();this.$emit('onplaying',e);})
            this.media.addEventListener('pause',  (e)=>{this.onMediaPause();this.$emit('onpause',e);})
            this.media.addEventListener('abort', (e)=>{this.onMediaPause();this.$emit('onabort',e);})
            this.media.addEventListener('progress', (e)=>{this.onMediaProgress();this.$emit('onprogress',e);})
            this.media.addEventListener('durationchange', (e)=>{this.onMediaDurationChange();this.$emit('ondurationchange',e);})
            this.media.addEventListener('seeking', (e)=>{this.onMediaSeeking();this.$emit('onseeking',e);})
            this.media.addEventListener('seeked', (e)=>{this.onMediaSeeking();this.$emit('onseeked',e);})
            this.media.addEventListener('timeupdate', (e)=>{this.onMediaSeeking();this.$emit('ontimeupdate',e);})
            this.media.addEventListener('ended', (e)=>{this.onMediaEnded();this.$emit('onended',e);})
            this.media.addEventListener('error', (e)=>{this.onMediaError();this.$emit('onerror',e);})
        },
        onMediaError(){
            this.error = true;
        },
        togglePlay(){
            if(this.playing){
                this.media.pause()
            }else{
                this.media.play();
            }
        },
        onMediaPlay(){
            this.error = false;
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
.player{
    *{
        box-sizing: border-box;
    }
    &__controls{
        display: flex;
        align-items: center;
        justify-content: space-between;
        &--progress{
            flex: 1;
            margin: 0 8px;
        }
        &--current,&--durration{
            width: 10%;
            min-width: 40px;
            font-size: 14px;
            color: rgba($color: #fff, $alpha: 0.8);
            line-height: 1;
            margin: 0 8px;
            user-select:none;
        }
        &--current{
            text-align: center;
        }
        &--durration{
            text-align: center;
        }
        &--btn {
            margin: 0 8px;
            width: 30px;
            height: 30px;
            border-radius: 25px;
            border: 1px solid rgba($color: #fff, $alpha: 0.8);
            position: relative;
            cursor: pointer;
            .btn-play {
                width: 10px;
                height: 14px;
                border: 2px solid rgba($color: #fff, $alpha: 0.8);
                border-width: 0 2px;
                position: absolute;
                top: 7px;
                left: 9px;
                &.stop {
                    width: 0;
                    height: 0;
                    border: 2px solid rgba($color: #fff, $alpha: 0.8);
                    border-width: 7px 10px;
                    border-color: transparent transparent transparent rgba($color: #fff, $alpha: 0.8);
                    left: 10px;
                }
            }
            .btn-volume{
                position: relative;
                width: 30px;
                height: 30px;
                .volume{
                    position: absolute;
                    top: 3px;
                    left: -7px;
                    width: 10px;
                    height: 22px;
                    border: 2px solid rgba(255, 255, 255, 0.8);
                    border-width: 9px 12px;
                    border-color: transparent rgba(255, 255, 255, 0.8) transparent transparent;
                    border-radius: 13px;
                    &::after{
                        display: block;
                        content: '';
                        width: 18px;
                        height: 18px;
                        border: 2px solid rgba(255, 255, 255, 0.8);
                        border-color: transparent rgba(255, 255, 255, 0.8) transparent transparent;
                        position: absolute;
                        top: -9px;
                        left: -5px;
                        border-radius: 18px;
                    }
                }
                .muted{
                    display: block;
                    content: '';
                    width: 4px;
                    height: 24px;
                    background: rgba($color: #fff, $alpha: 0.8);
                    border-radius: 4px;
                    transform: rotate(135deg);
                    position: absolute;
                    top: 1px;
                    left: 13px;
                    background-clip: padding-box;
                    border: 1px solid rgba($color: #898989, $alpha: 0.2);
                }
            }
        }
    }
}
.aplayer{
    .player{
        &__controls{
            &--current,&--durration{
                color: rgba($color: #898989, $alpha: 0.8);
            }
            &--durration.error{
                color: red;
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