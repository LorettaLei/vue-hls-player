# vue-hls-player
hls vue播放器，支持video和audio。
## 安装
```
npm install vue-hls-player
```
## 支持的事件
 - onplay: 开始播放。
 - onplaying: 已开始播放。
 - onpause: 被用户或程序暂停。
 - onabort: 退出。
 - onended: 播放结束
 - onerror: 加载期间发生错误时。
 - onprogress: 当浏览器正在获取媒介数据时运行的脚本
 - ondurationchange: 当媒介长度改变时运行的脚本。
 - onseeking: 当 seeking 属性设置为 true（指示定位是活动的）时运行的脚本。
 - onseeked: 当 seeking 属性设置为 false（指示定位已结束）时运行的脚本。
 - ontimeupdate: 当播放位置改变时（比如当用户快进到媒介中一个不同的位置时）运行的脚本。
 - onvolumechange: 	每当音量改变时（包括将音量设置为静音）时运行的脚本。（仅视频）
## 全局使用
```
//入口index.js
import player from 'vue-hls-player'
Vue.use(player)

//test.vue
<vplayer :playerOptions = "vOption" @onplay="play" />

vOption:{
    type: "application/x-mpegURL",//媒体类型，m3u8请给application/x-mpegURL或者application/vnd.apple.mpegURL，其他的会默认为普通音视频，注：微信不支持m3u8
    src: 'http://ph1vqefl0.bkt.clouddn.com/hlsnature2',//视频地址
    preload: true,//是否预下载，默认为true
    autoplay: true,//是否自动播放（兼容性不太好），默认为false
    isLoop: false,//是否循环，默认不循环
    playsinline: false, //h5是否行内播放，默认false，有兼容性问题
    poster: 'https://oimdztrab.qnssl.com/Frp4SyVe5PosdkUKRaE-krjK7B5z', //封面，仅视频有
    controls: 'progress,current,durration,volume' //显示的控件,volume只有视频有，没有配置controls项则全部显示。
    crossOrigin: false //设置视频的 CORS 设置。
}

methods:{
    play(e){
        console.log(e)
    }
}
```
## 使用audio
```
import { aplayer } from 'vue-hls-player'
components: { aplayer }

<aplayer :playerOptions = "aOption" @onpause="pause" />

aOption:{
    type: "application/x-mpegURL", //媒体类型，m3u8请给application/x-mpegURL或者application/vnd.apple.mpegURL，其他的会默认为普通音视频，注：微信不支持m3u8
    src: 'http://ph1vqefl0.bkt.clouddn.com/hlsnature2', //音频地址
    preload: true, //是否预下载，默认为true
    autoplay: true, //是否自动播放（兼容性不太好），默认为false
    isLoop: false, //是否循环，默认不循环
    controls: 'progress,current,durration', //显示的控件,没有配置controls项则全部显示。
}
methods:{
    pause(e){
        console.log(e)
    }
}
```
## 使用video
```
import { vplayer } from 'vue-hls-player'
components: { vplayer }

<vplayer :playerOptions = "vOption" @onpause="pause" />

vOption:{
    type: "application/x-mpegURL",//媒体类型，m3u8请给application/x-mpegURL或者application/vnd.apple.mpegURL，其他的会默认为普通音视频，注：微信不支持m3u8
    src: 'http://ph1vqefl0.bkt.clouddn.com/hlsnature2',//视频地址
    preload: true,//是否预下载，默认为true
    autoplay: true,//是否自动播放（兼容性不太好），默认为false
    isLoop: false,//是否循环，默认不循环
    poster: 'https://oimdztrab.qnssl.com/Frp4SyVe5PosdkUKRaE-krjK7B5z', //封面，仅视频有
    controls: 'progress,current,durration,volume', //显示的控件,volume只有视频有，没有配置controls项则全部显示。progress:进度条；current:已播放时长；durration：音视频长度；volume：音量
    crossOrigin: false //设置视频的 CORS 设置。
}

methods:{
    pause(e){
        console.log(e)
    }
}
```