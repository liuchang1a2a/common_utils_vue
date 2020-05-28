<template>
    <div  class="thumb" v-cloak>
        <el-menu :default-active="activeMenu" class="el-menu-demo" mode="horizontal" @select="handleSelect">
             <el-menu-item index="1">等比例缩放</el-menu-item>  
             <el-menu-item index="2">调节质量</el-menu-item>
             <el-menu-item index="3">压缩</el-menu-item> 
             <el-menu-item index="4">水印</el-menu-item> 
             <el-menu-item index="5">旋转</el-menu-item> 
             <el-menu-item index="6">裁剪</el-menu-item> 
        </el-menu>
        <el-input-number v-model="scale" :precision="1" placeholder="缩放比例" class="scale" :step="0.1" :min="0.1" :max="10"></el-input-number>
        <el-upload class="avatar-uploader el-upload--text uploader" 
            :action="uploadUrl" 
            ref="upload"	   
            :multiple="false"
            :show-file-list="false" 
            :on-success="handleSuccess" 
            :before-upload="beforeUpload" 
            accept="image/*"
            :data="data">
                <el-button slot="trigger" size="small" type="primary">上传图片</el-button>
                <div slot="tip" class="el-upload__tip">{{orgname==''?'上传文件不超过20M':orgname}}</div>
         </el-upload>
         <el-button class="submit" size="small" @click="submit" type="primary">确定</el-button>

        <div class="img_box">
            <img :src="src" v-if="src!=''" @click="viewOrg" title="查看原图" />
        </div>
    </div>
</template>
<script>
export default {
    name:'Thumbnail',
    data(){
        return{
            activeMenu:'1',
            uploadUrl:'img/upload',
            data:{},
            orgname:'',
            orgpath:'',
            scale:'',
            src:''
        }
    },
    mounted:function(){
        this.initData();
    },
    methods:{
        initData:function(){
            this.uploadUrl = this.$axios.defaults.baseURL+this.uploadUrl;
        },
        handleSelect:function(key, keyPath) {
            var that = this;
            this.activeMenu = key;
            this.orgname = '';
            this.orgpath ='';
        },
        check:function(){
            if(this.activeMenu=='1'&&(this.scale==''||this.scale==null)){
                this.showError("请选择缩放比例");
                return false;
            }
            if(this.orgpath==''){
                this.showError("请选择图片");
                return false;
            }
            return true;
        },
        submit:function(){
            if(!this.check()){
                return false;
            }
            if(this.activeMenu=='1'){
                this.zoom();
            }
        },
        beforeUpload: function(file) {
            this.data.path = "/file/img";
            const isLt10M = file.size / 1024 / 1024  < 20;
            if (!isLt10M) {
                this.showError('上传图片大小不能超过20MB');
                return false;
            }
        },
        handleSuccess: function (res, file) {   
             if(res.code=='0'){
                 var info = res.info;
                 this.orgpath = info.path;
                 // 处理不同操作
                 this.orgname = file.name;
             }else{
                 this.showError(res.msg);
             }
        },
        zoom:function(){
            // this.orgpath
            this.src = this.$axios.defaults.baseURL+"img/zoom?path="+encodeURIComponent(this.orgpath)+"&scale="+this.scale+"&v="+new Date();
        },
        viewOrg:function(){
            var url = this.$axios.defaults.baseURL+this.orgpath;
            window.open(url,"_blank");
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
@import url(css/Thumbnail.css);
</style>
