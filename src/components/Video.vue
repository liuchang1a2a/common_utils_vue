<template>
    <div  class="vbox" v-cloak>
        <el-menu :default-active="activeMenu" class="el-menu-demo" mode="horizontal" @select="handleSelect">
             <el-menu-item index="1">本地视频</el-menu-item>  
             <el-menu-item index="2">网络视频</el-menu-item>
             <el-menu-item index="3">视频水印</el-menu-item>   
        </el-menu>
        <template v-if="activeMenu=='2'">
            <el-input v-model="url" v-if="activeMenu=='2'" placeholder="视频链接地址 http://..." class="url_input"></el-input>
            <el-button size="small" v-if="activeMenu=='2'" type="primary" class="url_btn" @click="play">确定</el-button>
        </template>
        <video controls="controls" class="player" :poster="poster" preload="auto"  height="300" width="400" :src="Src"  type="video/mp4">
                您的浏览器不支持html5!
        </video>
        
    </div>
</template>
<script>
export default {
    name:'Video',
    data(){
        return{
            activeMenu:'1',
            Src:'',
            localUrl:'video/getLocal',
            webUrl: 'video/getWeb',
            url:'',
            poster: require("../assets/logo.png"),
        }
    },
    mounted:function(){
        this.initData();
    },
    methods:{
        initData:function(){
            this.initLocal();
            // require('../../assets/logo.png');
            // this.poster = require('../../assets/error_video.bmp');
        },
        initLocal:function(){      // blob 视频加密
            var that = this;
            var path = "/file/video/test.mp4";
            var url = this.$axios.defaults.baseURL+this.localUrl+"?path="+encodeURIComponent(path);
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);//配置请求方式、请求地址以及是否同步
            xhr.responseType = 'blob';
            xhr.onload = function(e) {
                if (xhr.status === 200) {
                    var blob = this.response;
                    // 获取blob对象地址，并把值赋给容器
                    that.Src = URL.createObjectURL(blob);
                }
            };
            xhr.send();
        },
        handleSelect:function(key, keyPath) {
            var that = this;
            this.activeMenu = key;
            this.url='';
            this.Src='';
            if(this.activeMenu=='1'){
                this.initLocal();
            }
         },
        play:function(){
            var that = this;
            if(this.url.trim()==""){
                this.showError("视频地址不能为空!");
                return false;
            }
            var url = this.$axios.defaults.baseURL+this.webUrl+"?url="+encodeURIComponent(this.url);
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);//配置请求方式、请求地址以及是否同步
            xhr.responseType = 'blob';
            xhr.onload = function(e) {
                if (xhr.status === 200) {
                    var blob = this.response;
                    // 获取blob对象地址，并把值赋给容器
                    that.Src = URL.createObjectURL(blob);
                }
            };
            xhr.send();

        },
        // mp2t
        showError: function(msg){
            this.$message({
                showClose: true,
                message: msg,
                type: 'error'
            });
        },


    }
}
</script>
<style scoped>
@import url("css/Video.css");
</style>