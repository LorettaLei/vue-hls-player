<template>
    <div class="volume" @mousedown="setVolume($event,1)" @mousemove="setVolume($event)">
        <div class="volume__con">
            <div class="volume--bar" @mousedown.stop="pressBarStart($event)" @mousemove.stop="" :style="'top:'+(1-volume)*100+'%'"></div>
            <div class="volume--volume" @mousemove.stop="" :style="'height:'+volume*100+'%'"></div>
            <div class="volume--bg" ref="volume"></div>
        </div>
    </div>
</template>
<script>
export default {
    model: {
        prop: 'volume',
        event: 'changeVolume'
    },
    props: {
        volume: {
            type: Number,
            default: 0
        }
    },
    data(){
        return {
            mousedownnow: false,
        }
    },
    mounted(){
        document.addEventListener('mouseup',(e)=>{
            if(this.mousedownnow){
                this.mousedownnow = false;
            }
        },true)
    },
    methods: {
        setVolume(e,type){
            let volume = parseInt(e.offsetY*100/this.$refs.volume.offsetHeight)/100;
            volume = volume < 0 ? 0 : volume > 1 ? 1 : volume;
            if(type){
                this.$emit('changeVolume',1 - volume);
                e.stopPropagation();
            }else if(this.mousedownnow){
                this.$emit('changeVolume',1 - volume);
                e.stopPropagation();
            }
        },
        pressBarStart(e){
            this.mousedownnow = true;
        }
    }
}
</script>
<style lang="scss">
.volume{
    width: 30px;
    height: 90px;
    position: absolute;
    top: -90px;
    left: 0;
    &__con{
        width: 30px;
        height: 80px;
        position: relative;
    }
    &--bar{
        width: 14px;
        height: 14px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 1);
        background-clip: padding-box;
        border: 2px solid rgba(255, 255, 255, .3);
        box-shadow: 0 0 1px 1px rgba(255, 255, 255, .2);
        position: absolute;
        margin-top: -7px;
        left: 8px;
        z-index: 4;
        cursor: pointer;
    }
    &--volume,
    &--bg{
        background: rgba(255, 255, 255, .3);
        position: absolute;
        bottom: 0;
        left: 13px;
        width: 4px;
        height: 80px;
        border-radius: 4px;
        z-index: 2;
    }
    &--volume{
        z-index: 3;
        background: rgba(255, 255, 255, .4);
    }
}
</style>