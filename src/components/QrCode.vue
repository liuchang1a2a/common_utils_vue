<template>
    <div  v-cloak>
        <div class="qrbox">
            <el-menu :default-active="activeMenu" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="1">生成二维码</el-menu-item>
                    <el-menu-item index="2">解析二维码</el-menu-item>
            </el-menu>
            <el-input v-if="activeMenu=='1'" v-model="content" placeholder="请输入内容" class="qr_txt"></el-input>
            <el-upload class="avatar-uploader el-upload--text qr_uploader" 
                :action="uploadUrl" 
                ref="upload"	   
                :show-file-list="false" 
                :on-success="handleSuccess" 
                :before-upload="beforeUpload" 
                :data="data">
                <el-button size="small" type="primary">上传{{img}}</el-button>
                <div slot="tip" class="el-upload__tip" v-if="orgname==''">上传文件不超过10M</div>
                <div slot="tip" class="el-upload__tip" v-else>{{orgname}}</div>
            </el-upload>
            <el-button size="small" type="primary" @click="preview">{{btn}}</el-button>
        </div>
        <div>
            <img :src="imgSrc" v-if="activeMenu=='1'"/>
            <span v-if="text!=''&&activeMenu=='2'">{{text}}</span>
        </div>
    </div>
</template>
<script>
export default {
    name:'QrCode',
    data(){
        return{
            activeMenu:'1',
            btn:'生成',
            content:'',
            uploadUrl:'',
            path:'',
            data:{},
            orgname:'',
            img:'LOGO',
            imgSrc:'',
            text:''
        }
    },
    mounted:function(){
        this.initData();
    },
    methods:{
        initData:function(){
            this.uploadUrl = this.$axios.defaults.baseURL+"/img/upload";
        },
        handleSelect:function(key, keyPath){
            if(key=='1'){
                this.btn = '生成';
                this.img = 'LOGO';
            }else{
                this.btn = '解析';
                this.img = '二维码';
            }
            this.activeMenu = key;
            this.content = '';
            this.path = '';
            this.orgname='';
            this.imgSrc ='';
            this.text='';
        },
        beforeUpload: function(file) {
            this.data.path = "/file/img";
            const isLt10M = file.size / 1024 / 1024  < 10;
            if (!isLt10M) {
                this.$message.error('上传图片大小不能超过10MB');
                return false;
            }
        },
        handleSuccess: function (res, file) {   
             if(res.code=='0'){
                 var info = res.info;
                 this.orgname = info.org;
                 this.path = info.path;
             }else{
                 this.showError(res.msg);
             }
        },
        preview:function(){
            var that = this;
            var base = this.$axios.defaults.baseURL;
            if(this.activeMenu=='1'){
                if(this.content.trim()==''){
                    this.showError("内容不能为空");
                    return false;
                }
                
                var ext = "png";
                var json = JSON.stringify({
                    "content": this.content,
                    "img": this.path,
                    "compress": true,
                    "size": 300,
                    "logo_width": 60,
                    "logo_height": 60
                });
                this.imgSrc = base+"img/qrencode?json="+encodeURIComponent(json)+"&ext="+ext;

            }

            if(this.activeMenu=='2'){
                if(this.path==''){
                    this.showError("请上传二维码图片");
                    return false;
                }
                var postdata = this.$qs.stringify({
                    path: this.path
                });
                this.$axios.post(base+"img/qrdecode", postdata).then(res=>{
                    var data = res.data;
                    if(data.code=='0'){
                        that.text = data.content;
                    }else{
                        that.showError(data.msg);
                    }                    
                }).catch(err=>{
                    that.text='';
                });
                

            }



        },
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
@import url("css/QrCode.css");
</style>