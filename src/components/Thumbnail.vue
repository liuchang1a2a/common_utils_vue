<template>
    <div  class="thumb" v-cloak>
        <el-menu :default-active="activeMenu" class="el-menu-demo" mode="horizontal" @select="handleSelect">
             <el-menu-item index="1">等比例缩放</el-menu-item>  
             <el-menu-item index="2">调节质量</el-menu-item>    
             <el-menu-item index="3">压缩</el-menu-item>    <!--  有宽高缩减  -->
             <el-menu-item index="4">水印</el-menu-item>    <!--  服务端水印图  -->
             <el-menu-item index="5">旋转</el-menu-item>        
             <el-menu-item index="6">调整宽高</el-menu-item>    <!--   强制非等比例 -->
             <el-menu-item index="7">裁剪</el-menu-item> <!--  中间裁剪为例  -->
        </el-menu>
        <el-input-number v-model="scale" v-if="activeMenu=='1'" :precision="1" placeholder="缩放比例" class="scale" :step="0.1" :min="0.1" :max="10"></el-input-number>
        <el-input-number v-model="quality" v-if="activeMenu=='2'" :precision="2" placeholder="质量比" class="scale" :step="0.1" :min="0.01" :max="1.00"></el-input-number>
        <el-input-number v-model="limit" v-if="activeMenu=='3'"  placeholder="限制大小(KB)" class="scale" :min="1"></el-input-number>
        <el-input-number v-model="accuracy" v-if="activeMenu=='3'" :precision="1" placeholder="精度" class="scale" :step="0.1" :min="0.1" :max="1.00"></el-input-number>
        <el-input-number v-model="clarity" v-if="activeMenu=='4'" :precision="1" placeholder="透明度" class="scale" :step="0.1" :min="0.1" :max="1.0"></el-input-number>
        <el-input-number v-model="angle" v-if="activeMenu=='5'" :precision="1" placeholder="旋转角度" class="scale" :step="0.1" :min="0.0" :max="180.0"></el-input-number>
        <el-input-number v-model="width" v-if="activeMenu=='6'||activeMenu=='7'"  placeholder="宽" class="scale" :min="10" :max="activeMenu=='7'?maxWidth:Infinity"></el-input-number>
        <el-input-number v-model="height" v-if="activeMenu=='6'||activeMenu=='7'"  placeholder="高" class="scale" :min="10" :max="activeMenu=='7'?maxHeight:Infinity"></el-input-number>

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
            src:'',
            quality:'',
            accuracy:'',
            limit:'',
            clarity:'',
            angle:'',
            width:'',
            height:'',
            maxWidth:'',
            maxHeight:''
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
            this.scale = '';
            this.quality='';
            this.accuracy='',
            this.limit='';
            this.clarity = '';
            this.angle='';
            this.width='';
            this.height='';
            this.maxWidth='';
            this.maxHeight='';
        },
        check:function(){
            if(this.activeMenu=='1'&&(this.scale==''||this.scale==null)){
                this.showError("请选择缩放比例");
                return false;
            }
            if(this.activeMenu=='2'&&(this.quality==''||this.quality==null)){
                this.showError("请选择质量比");
                return false;
            }
            if(this.activeMenu=='3'&&(this.accuracy==''||this.accuracy==null)){
                this.showError("请选择精度");
                return false;
            }
            if(this.activeMenu=='3'&&(this.limit==''||this.limit==null)){
                this.showError("请选择限制大小");
                return false;
            }
            if(this.activeMenu=='4'&&(this.clarity==''||this.clarity==null)){
                this.showError("请选择透明度");
                return false;
            }
            if(this.activeMenu=='5'&&(this.angle==''||this.angle==null)){
                this.showError("请选择旋转角度");
                return false;
            }
            if(this.activeMenu=='6'&&(this.width==''||this.width==null)){
                this.showError("请选择调整宽度");
                return false;
            }
            if(this.activeMenu=='6'&&(this.height==''||this.height==null)){
                this.showError("请选择调整高度");
                return false;
            }
            if(this.activeMenu=='7'&&(this.width==''||this.width==null)){
                this.showError("请选择裁剪宽度");
                return false;
            }
            if(this.activeMenu=='7'&&(this.height==''||this.height==null)){
                this.showError("请选择裁剪高度");
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
            if(this.activeMenu=='2'){
                this.qualify();
            }
            if(this.activeMenu=='3'){
                this.compress();
            }
            if(this.activeMenu=='4'){
                this.watermark();
            }
            if(this.activeMenu=='5'){
                this.rotate();
            }
            if(this.activeMenu=='6'){
                this.resize();
            }
            if(this.activeMenu=='7'){
                this.cut();
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
                 this.orgname = file.name;
                 if(this.activeMenu=='6'||this.activeMenu=='7'){
                     this.maxWidth = info.width;
                     this.maxHeight = info.height;
                     this.width = info.width;
                     this.height = info.height;
                 }
             }else{
                 this.showError(res.msg);
             }
        },
        zoom:function(){
            this.src = this.$axios.defaults.baseURL+"img/zoom?path="+encodeURIComponent(this.orgpath)+"&scale="+this.scale+"&v="+new Date();
        },
        qualify:function(){
            this.src = this.$axios.defaults.baseURL+"img/quality?path="+encodeURIComponent(this.orgpath)+"&scale="+this.quality+"&v="+new Date();
        },
        compress:function(){
            this.src = this.$axios.defaults.baseURL+"img/compress?path="+encodeURIComponent(this.orgpath)+"&scale="+this.quality+"&v="+new Date();
        },
        watermark:function(){
            this.src = this.$axios.defaults.baseURL+"img/watermark?path="+encodeURIComponent(this.orgpath)+"&clarity="+this.clarity+"&v="+new Date();
        },
        rotate:function(){
            this.src = this.$axios.defaults.baseURL+"img/rotate?path="+encodeURIComponent(this.orgpath)+"&angle="+this.angle+"&v="+new Date();
        },
        resize:function(){
            this.src = this.$axios.defaults.baseURL+"img/resize?path="+encodeURIComponent(this.orgpath)+"&width="+this.width+"&height="+this.height+"&v="+new Date();
        },
        cut:function(){
            this.src = this.$axios.defaults.baseURL+"img/cut?path="+encodeURIComponent(this.orgpath)+"&width="+this.width+"&height="+this.height+"&v="+new Date();
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
