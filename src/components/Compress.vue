<template>
    <div class="filebox" v-cloak> 
        <el-menu :default-active="activeMenu" class="el-menu-demo" mode="horizontal" @select="handleSelect">
             <el-menu-item index="1">压缩文件</el-menu-item>
             <el-menu-item index="2">压缩文件夹</el-menu-item>
        </el-menu>

        <el-upload v-if="activeMenu=='1'"
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

        <!-- 按钮触发input按钮  后包装为组件-->
        <input v-if="activeMenu=='2'" ref="file" type='file' name="file" webkitdirectory @change.stop="changesData"/>

        <span>{{dir}}</span>
        <!-- 添加删除功能-->
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
            data:{},
            activeMenu:'1',
            upDirUrl:'file/uploadDir',
            dir:''
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
            this.upDirUrl = this.$axios.defaults.baseURL+this.upDirUrl;
        },
        changesData:function(e) {
            var that = this;
            if(e.target.files.length==0){
                this.showError("不能上传空文件夹");
                return false;
            }
            var path = e.target.files[0].webkitRelativePath;
            var dir = path.substr(0,path.indexOf("/"));
            // 上传 FormData
            let params = new FormData();
            params.append("folder",dir);
            // params.append("path","/file/dir");
            for(var i=0;i<e.target.files.length;i++){
                var file = e.target.files[i];
                var uid = this.uuid(8,16);
                //webkitRelativePath:  upload/github.txt 
                params.append(uid,file.webkitRelativePath);
                params.append("file",file,file.name+"_"+uid);
            }
            let config = {
                headers: { "Content-Type": "multipart/form-data" },
                //添加上传进度监听事件
                // onUploadProgress: e => {
                // var completeProgress = ((e.loaded / e.total * 100) | 0) + "%";
                // this.progress = completeProgress;
                // }
            };
            this.$axios.post(this.upDirUrl, params, config).then(
                function (res){ 
                    var data = res.data;
                    if(data.code=='0'){
                        that.files.push(data.dir);
                        that.dir = dir;
                    }else{
                        that.showError(data.msg);
                    }
                }
            ).catch(function (error) {
               that.showError(error);
            });


        },
        uuid:function(len, radix) {
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = [], i;
            radix = radix || chars.length;
            
            if (len) {
                for (i = 0; i < len; i++) 
                uuid[i] = chars[0 | Math.random()*radix];
            } else {
                var r;
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                    r = 0 | Math.random()*16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }
            
            return uuid.join('');
        },
        handleSelect:function(key, keyPath) {
            this.activeMenu = key;
            this.files=[];
            this.dir = '';
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
            if(this.files.length==0){
                this.showError("请上传文件");
                return false;
            }
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