<template>
    <div v-cloak>
        <div  class="markbox">
            <el-input v-model="text" placeholder="请输入内容" class="mark_txt"></el-input>
            <el-upload class="avatar-uploader el-upload--text mark_uploader" 
            :action="uploadUrl"
            ref="upload"	   
            :show-file-list="false" 
            :on-success="handleSuccess" 
            :before-upload="beforeUpload" 
            :data="data">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip" v-if="orgname==''">上传文件不超过10M</div>
                <div slot="tip" class="el-upload__tip" v-else>{{orgname}}</div>
            </el-upload>
            <el-button size="small" type="primary" @click="preview">预览</el-button>
        </div>
        <!--
        添加图片 <br/>
        -->
    </div>
</template>
<script>
export default {
    name:'MarkImg',
    data(){
        return {
            text:'',
            uploadUrl:'',
            data:{},
            orgname:'',
            path:''
        }
    },
    mounted:function(){
        this.initData();
    },
    methods:{
        initData:function(){
            this.uploadUrl = this.$axios.defaults.baseURL+"/img/upload";
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
             console.log(res);    
             if(res.code=='0'){
                 var info = res.info;
                 this.orgname = info.org;
                 this.path = info.path;
             }else{
                 this.showError(res.msg);
             }
        },
        preview:function(){
            if(this.path==''){
                this.showError("请上传文件");
                return false;
            }
            var ext = "png";
            var json = {
                "text": this.text,
                // "color":'',
                "fsize":30,
                // "fstyle":'',
                "x":250,
                "y":520
            };
            var url = this.$axios.defaults.baseURL+"img/marktxt?path="+encodeURIComponent(this.path)+"&ext="+ext+"&json="+encodeURIComponent(JSON.stringify(json));
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
<style>
@import url("css/MarkImg.css");
</style>