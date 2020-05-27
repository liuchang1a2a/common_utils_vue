<template>
    <div  class="vbox" v-cloak>
        <!--   分段下载  m3u8    data-setup='{}'-->
        <video  id="myVideo" class="video-js vjs-default-skin vjs-big-play-centered" :poster="poster">
        </video>
    </div>    
</template>
<script>


export default {
    name:'VideoJS',
    data(){
        return{
            src:'',
            poster: require("../assets/logo.png"),
            player:{}
        }
    },
    mounted:function(){
        this.initData();
    },
    beforeDestroy:function(){
        this.player.dispose();
    },
    methods:{
        initData:function(){
            this.initSrc();
        },
        initSrc:function(){
            var that = this;
            var postdata = this.$qs.stringify({
                path: "file/video/test.mp4"
            });

            // 设置axios 获取响应超时   axios.defaults.timeout
            this.$axios.post(this.$axios.defaults.baseURL+"video/m3u8", postdata).then(res=>{
                var data = res.data;
                if(data.code=='0'){
                    that.src = data.m3u8.replace(/\\/g,'/');                 
                    that.initVideo();
                }else{
                    that.showError(data.msg);
                }                    
            }).catch(err=>{
                that.src='';
            });

            
        },
        initVideo:function(){
            // import videojs-contrib-hls.min.js
            var that =this;
            this.player = this.$video('myVideo',{
                controls: true,
                autoplay: "muted", 
                preload:"auto",
                width:'400px',
                height:'300px',
                flash: { hls: { withCredentials: false }},
                html5: { hls: { withCredentials: false }},
            });
            
            // 跨域访问 m3u8问题
            this.src = this.$axios.defaults.baseURL+this.src;
            // 本地测试
            // this.src="http://127.0.0.1:8088/static/test.m3u8";            
            this.player.src({type:"application/x-mpegURL",src:this.src,withCredentials: false}); 
            
        },
    }
}
</script>
<style scoped>
    @import url("css/Video.css");
</style>
    