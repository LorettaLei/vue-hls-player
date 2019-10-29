<template>
    <div class="player__progress" @mousedown.stop="changeVolue($event)" @mousemove.stop="mousemove($event)" @mouseup.stop="mouseup($event)" ref="progress">
        <div class="player__progress--bar" @mousedown.stop="mousedown($event)" :style="'left:'+parseInt(played*100/length)+'%'"></div>
        <div class="player__progress--played" :style="'width:'+parseInt(played*100/length)+'%'"></div>
        <div class="player__progress--loaded" :style="'width:'+parseInt(loaded*100/length)+'%'"></div>
        <div class="player__progress--length"></div>
    </div>
</template>
<script>
export default {
    props: {
    },
    data(){
        return {
            mousedownnow: false,
            oldx: 0,
            newx: 0,
            loaded: 0,
            played: 0,
            length: 0
        }
    },
    mounted(){
        document.addEventListener('mouseup',(e)=>{
            if(this.mousedownnow){
                this.mouseup(e);
                e.stopPropagation;
                e.preventDefault();
            }
        })
        document.addEventListener('mousemove',(e)=>{
            if(this.mousedownnow){
                this.mousemove(e);
                e.stopPropagation;
                e.preventDefault();
            }
        })
    },
    methods: {
        initProgress(load,play,len){
            this.loaded = load;
            this.played = play;
            this.length = len;
        },
        changeVolue(e){
            let volume = (e.clientX - this.$refs.progress.offsetLeft)/this.$refs.progress.offsetWidth;
            if(volume>100){
                volume = 100;
            }
            if(volume<0){
                volume = 0;
            }
            this.$emit('volumeChange',volume);
        },
        mousedown(e){
            this.mousedownnow = true;
        },
        mousemove(e){
            if(this.mousedownnow){
                let volume = parseInt((e.clientX - this.$refs.progress.offsetLeft)*100/this.$refs.progress.offsetWidth)
                if(volume<0){
                    volume = 0;
                }else if(volume>100){
                    volume = 1;
                }else{
                    volume = volume/100;
                }
                this.$emit('volumeChange',volume);
            }
        },
        mouseup(e){
            this.mousedownnow = false;
        }
    }
}
</script>
<style lang="scss" scoped>
.player__progress{
    height: 10px;
    border: 3px solid rgba(108, 211, 255, 0);
    position: relative;
    &--bar{
        width: 20px;
        height: 20px;
        border-radius: 10px;
        background: rgba(58, 167, 255, 1);
        background-clip: padding-box;
        border: 4px solid rgba(58, 167, 255, .3);
        box-shadow: 0 0 3px 3px rgba(255, 255, 255, .4);
        position: absolute;
        top: -8px;
        margin-left: -10px;
        z-index: 4;
        cursor: pointer;
    }
    &--loaded,
    &--played,
    &--length{
        background: rgba(88, 89, 89, .2);
        position: absolute;
        top: 0;
        left: 0;
        height: 4px;
        border-radius: 4px;
        z-index: 2;
    }
    &--played{
        z-index: 3;
        background: linear-gradient(180deg, rgba(108, 211, 255, 1) 0%, rgba(58, 167, 255, 1) 100%);
    }
    &--length{
        width: 100%;
    }
}
</style>