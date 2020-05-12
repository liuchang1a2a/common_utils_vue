<template>
    <div  class="upbox" v-cloak>
        <el-menu :default-active="activeMenu" class="el-menu-demo" mode="horizontal" @select="handleSelect">
             <el-menu-item index="1">上传至服务器</el-menu-item>
             <el-menu-item index="2">断点续传</el-menu-item>
        </el-menu>
        <el-input v-model="url" v-if="activeMenu=='1'" placeholder="服务器地址" class="up_input"></el-input>
        <el-upload v-if="activeMenu=='1'"
            class="uploader"
            :action="upUrl"
            :data="data"
            :before-upload="beforeUpload"
            :on-error="handleError"
            :show-file-list="false"
            :on-success="handleSuccess">
            <el-button size="small" type="primary">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">{{filename}}</div>
        </el-upload>
    </div>
</template>
<script>
export default {
    name:'Upload',
    data(){
        return{
            activeMenu:'1',
            upUrl:'file/httpUpload',
            data:{},
            url:'',
            filename:''
        }
    },
    mounted:function(){
        this.initData();
    },
    methods:{
         initData:function(){
             this.upUrl = this.$axios.defaults.baseURL+this.upUrl;

         },
         handleSelect:function(key, keyPath) {
            this.activeMenu = key;
            this.filename ='';
            this.url='';
            this.data={};
         },
         beforeUpload:function(file){
            if(this.url.trim()==''){
                this.showError("请输入服务器地址");
                return false;
            }
            var params = {
                "path":"/file/test"
            };
            var headers = {};
            var config = {};
            this.data.params = JSON.stringify(params);
            this.data.headers = JSON.stringify(headers);
            this.data.config = JSON.stringify(config);
            this.data.url = this.url;
         },

         handleSuccess:function(resp, file, fileList){
            if(resp.code!='0'){
                this.showError(resp.msg);
                fileList.forEach(function(item,idx){
                    if(item.uid==file.uid){
                        fileList.splice(idx,1);
                    }
                });
            }else{
                this.$message({
                    showClose: true,
                    message: '上传成功',
                    type: 'success'
                });
                this.filename = resp.info.org;
            }
            
        },
        handleError:function(err,file,fileList){
            this.showError(err);
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
@import url("css/Upload.css");
</style>
