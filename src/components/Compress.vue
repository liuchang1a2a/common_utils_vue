<template>
    <div class="filebox" v-cloak> 
        <el-upload
            class="uploader"
            :action="upUrl"
            :data="data"
            :before-upload="beforeUpload"
            :on-preview="handlePreview"
            :before-remove="handleRemove"
            :on-error="handleError"
            :on-success="handleSuccess"
            multiple>
            <el-button size="small" type="primary">选择文件</el-button>
            <!--
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            -->
        </el-upload>
        <el-button size="small" type="primary" class="btn" @click="compress">压缩</el-button>
    </div>
</template>
<script>
export default {
    name:'Compress',
    data(){
        return {
            upUrl:'file/upload',
            upDir:'/file/tmp',
            delUrl:'file/del',
            zipUrl:'/file/zip',
            files:[],
            data:{}
        }
    },
    mounted:function(){
        this.initData();
    },
    methods:{
        initData:function(){
            this.upUrl = this.$axios.defaults.baseURL+this.upUrl;
            this.delUrl = this.$axios.defaults.baseURL+this.delUrl;
            this.zipUrl = this.$axios.defaults.baseURL+this.zipUrl;
        },
        beforeUpload:function(file){
            this.data.path = this.upDir;
        },
        handlePreview:function(file){
            console.log(file);
        },
        handleRemove:function(file,fileList){
            var info = file.response.info;
            var that = this;
            var postdata = this.$qs.stringify({
                path:info.path
            });
            return  new Promise((resolve,reject)=>{
                that.$axios.post(this.delUrl, postdata).then(res=>{
                    var data = res.data;
                     if(data.code=='0'){
                         resolve(data.msg);
                         that.files.forEach(function(item,idx){
                             if(item==info.path){
                                 that.files.splice(idx,1);
                             }
                         });
                    }else{
                        that.showError(data.msg);
                        reject(data.msg);
                    }
                }).catch(err=>{
                    that.showError(err);
                    reject(err);
                });
            });
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
                this.files.push(resp.info.path);
            }
        },
        handleError:function(err,file,fileList){
            this.showError(err);
        },
        compress:function(){
            var name = "test.zip";
            var json = {
                "paths": this.files
            };
            var url = this.zipUrl+"?filename="+name+"&json="+encodeURIComponent(JSON.stringify(json));
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
@import url("css/Compress.css");
</style>