<template>
    <div style="width:300px; margin:auto; margin-top: 20px;" v-cloak>
        <el-menu :default-active="activeMenu" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">标准</el-menu-item>
            <el-menu-item index="2">GIF</el-menu-item>
        </el-menu>
        <div class="code_box">
            <el-input v-model="code" placeholder="请输入验证码" :style="{'line-height':height+'px'}"></el-input>
            <img :src="url"  v-if="activeMenu=='1'" @click="refresh" title="换一张"/>
            <img :src="gifurl"  v-if="activeMenu=='2'" @click="gifrefresh" title="换一张"/>
        </div>
        <el-button type="primary" @click="check">验证</el-button>
    </div>    
</template>
<script>
export default {
    name:'CheckCode',
    data(){
        return {
            code:'',
            url:'',
            width:200,
            height:70,
            jsonStr:{},
            chkUrl:'/img/chkcode',
            activeMenu:'1',
            gifurl:''
        }        
    },
    mounted: function(){
        this.initData();
    },
    methods:{
        initData:function(){
            this.setCode();
            this.refresh();
        },
        handleSelect:function(key, keyPath){
            this.activeMenu = key;
            if(key=='1'){
                this.refresh();
            }else{
                this.gifrefresh();
            }
        },
        refresh:function(){
            var base = this.$axios.defaults.baseURL;
            var jsonstr = JSON.stringify(this.jsonStr);
            if(jsonstr=="{}"){
                this.url = base+"img/code?v="+new Date().getMilliseconds();
            }else{
                this.url = base+"img/code?jsonStr="+encodeURIComponent(jsonstr)+"&v="+new Date().getMilliseconds();
            }
        },
        gifrefresh:function(){
            this.gifurl = this.$axios.defaults.baseURL+"img/gifcode?width="+this.width+"&height="+this.height+"&v="+new Date().getMilliseconds();
        },
        setCode:function(){
            this.jsonStr = {
                // "num": 4,  //字符个数
                // "txt": 's,x,f,c,g', // 可选字符内容
                // "cn": false,  // 是否为中文字符
                // "repeat": true, //是否可重复
                // "ext": "jpg", //生成文件后缀
                "width": this.width,   //图片宽度
                "height": this.height, //图片高度
                // "lnum": 5,  //干扰线个数
                // "dnum": 40, // 噪点数量
                // "color": "#0000FF", //文字颜色
                // "bgcolor": "#B0C4DE", //背景颜色
                // "lcolor": "#00BFFF",   //干扰线颜色
                // "dcolor": "#5F9EA0",   //噪点颜色
                // "fstyle": '宋体',   //字体
                // "fsize": 50, //字体大小
            };
        },
        check:function(){
           var that =this; 
           if(this.code.trim()==""){
               this.showError("验证码不能为空");
               return false;
           }
           if(this.jsonStr.num==undefined&&this.code.length!=4){
               this.showError("验证码长度违法");
               return false;
           }else if(this.jsonStr.num!=undefined&&this.code.length!=this.jsonStr.num){
               this.showError("验证码长度违法");
               return false;
           }

           

            var postdata = this.$qs.stringify({
                "code": this.code
            });

            this.$axios.post(this.chkUrl, postdata).then(function (response) {
                var data = response.data;
                if(data.code=='0'){
                    that.showMsg("验证通过");
                }else{
                    that.showError(data.msg);
                    return false;
                }
            }).catch(function (error) {
                console.log(error);
            });

        },
        showMsg:function(msg){
            this.$message({
                showClose: true,
                message: msg,
                type: 'success'
            });
        },
        showError:function(msg){
            this.$message({
                showClose: true,
                message: msg,
                type: 'error'
            });
        }
    }
}
</script>
<style>
@import url("css/CheckCode.css");
</style>