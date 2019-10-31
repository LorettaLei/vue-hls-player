# vue-player
hls vue播放器，支持video和audio
## 安装
```
npm install vue-player
```
## 全局使用
```
//入口index.js
import player from '../lib/vue-hls-player'
Vue.use(player)

//test.vue
<vplayer :playerOptions = "vOption" />

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

```
## 使用audio
```
import { aplayer } from 'vue-hls-player'
components: { aplayer }

<aplayer :playerOptions = "aOption" />

aOption:{
    type: "application/x-mpegURL", //媒体类型，m3u8请给application/x-mpegURL或者application/vnd.apple.mpegURL，其他的会默认为普通音视频，注：微信不支持m3u8
    src: 'http://ph1vqefl0.bkt.clouddn.com/hlsnature2', //音频地址
    preload: true, //是否预下载，默认为true
    autoplay: true, //是否自动播放（兼容性不太好），默认为false
    isLoop: false, //是否循环，默认不循环
    controls: 'progress,current,durration', //显示的控件,没有配置controls项则全部显示。
}
```
## 使用video
```
import { vplayer } from 'vue-hls-player'
components: { vplayer }

<vplayer :playerOptions = "vOption" />

vOption:{
    type: "application/x-mpegURL",//媒体类型，m3u8请给application/x-mpegURL或者application/vnd.apple.mpegURL，其他的会默认为普通音视频，注：微信不支持m3u8
    src: 'http://ph1vqefl0.bkt.clouddn.com/hlsnature2',//视频地址
    preload: true,//是否预下载，默认为true
    autoplay: true,//是否自动播放（兼容性不太好），默认为false
    isLoop: false,//是否循环，默认不循环
    poster: 'https://oimdztrab.qnssl.com/Frp4SyVe5PosdkUKRaE-krjK7B5z', //封面，仅视频有
    controls: 'progress,current,durration,volume', //显示的控件,volume只有视频有，没有配置controls项则全部显示。
    crossOrigin: false //设置视频的 CORS 设置。
}
```