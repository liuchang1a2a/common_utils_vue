<template>
    <div>
        <h1>Home</h1>
        <p>{{msg}}</p>
        <router-link to="/home/checkcode" title="验证码">CheckCode</router-link>
        <router-link to="/home/markimg" title="水印">MarkImg</router-link>
         <router-link to="/home/thumbnail"   title="图片处理">Thumbnail</router-link>
        <router-link to="/home/qrcode"  title="二维码">QrCode</router-link>
        <router-link to="/home/compress" title="压缩文件">Compress</router-link>
        <router-link to="/home/upload" title="上传文件">Upload</router-link>
        <router-link to="/home/video"   title="视频">Video</router-link>
        <router-link to="/home/videojs"   title="m3u8视频">VideoJS</router-link>
        <router-link to="/home/robot"   title="人机验证">Robot</router-link>
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    name:'Home',
    data(){
        return {
            msg: "首页:展示templates链接地址"
        }
    },
    methods:{
        
    }
}
</script>