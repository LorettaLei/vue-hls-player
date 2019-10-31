<template>
    <div class="progress" @mousedown="changeProgress($event,1)" @mousemove="changeProgress($event)">
        <div class="progress--bar" @mousedown.stop="pressBarStart($event)" @mousemove.stop="" :style="'left:'+parseInt(played*100/length)+'%'"></div>
        <div class="progress--played" @mousemove.stop="" :style="'width:'+parseInt(played*100/length)+'%'"></div>
        <div class="progress--loaded" @mousemove.stop="" :style="'width:'+parseInt(loaded*100/length)+'%'"></div>
        <div class="progress--length" ref="mediaLength"></div>
    </div>
</template>
<script>
export default {
    props: {
    },
    data(){
        return {
            mousedownnow: false,
            loaded: 0,
            played: 0,
            length: 0
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
        initProgress(load,play,len){
            this.loaded = load;
            this.played = play;
            this.length = len;
        },
        changeProgress(e,type){
            // console.log(e.clientX,e.pageX,e.offsetX,e.target,this.$refs.mediaLength.clientWidth)
            if(type){
                this.$emit('changeProgress',parseInt(e.offsetX*100/this.$refs.mediaLength.offsetWidth)/100);
            }else if(this.mousedownnow){
                this.$emit('changeProgress',parseInt(e.offsetX*100/this.$refs.mediaLength.offsetWidth)/100);
            }
        },
        pressBarStart(e){
            console.log(2)
            this.mousedownnow = true;
        }
    }
}
</script>
<style lang="scss">
.progress{
    height: 30px;
    position: relative;
    cursor: pointer;
    &--bar{
        width: 20px;
        height: 20px;
        border-radius: 10px;
        background: rgba(58, 167, 255, 1);
        background-clip: padding-box;
        border: 4px solid rgba(58, 167, 255, .3);
        box-shadow: 0 0 3px 3px rgba(58, 167, 255, .2);
        position: absolute;
        top: 5px;
        margin-left: -10px;
        z-index: 4;
        cursor: pointer;
    }
    &--loaded,
    &--played,
    &--length{
        background: rgba(255, 255, 255, .3);
        position: absolute;
        top: 13px;
        left: 0;
        height: 4px;
        border-radius: 4px;
        z-index: 2;
    }
    &--played{
        z-index: 3;
        background: linear-gradient(180deg, rgba(108, 211, 255, 0.5) 0%, rgba(58, 167, 255, 0.8) 100%);;
    }
    &--length{
        width: 100%;
    }
}
.aplayer{
    .progress{
        &--loaded,
        &--played,
        &--length{
            background: rgba(88, 89, 89, .2);
        }
    }
}
</style>