<template>
    <div v-cloak>
        <div  class="markbox">
            <el-menu :default-active="activeMenu" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                <el-submenu index="1">
                    <template slot="title">本地图片</template>
                    <el-menu-item index="1-1">标识文字</el-menu-item>
                    <el-menu-item index="1-2">标识图片</el-menu-item>
                </el-submenu>
                 <el-submenu index="2">
                    <template slot="title">网络图片</template>
                    <el-menu-item index="2-1">标识文字</el-menu-item>
                    <el-menu-item index="2-2">标识图片</el-menu-item>
                </el-submenu>
            </el-menu>
            <el-input v-if="activeMenu=='1-1'||activeMenu=='2-1'" v-model="text" placeholder="请输入内容" class="mark_txt"></el-input>
            <el-upload v-if="activeMenu=='1-1'||activeMenu=='1-2'" class="avatar-uploader el-upload--text mark_uploader" 
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
            <el-input v-if="activeMenu=='2-1'||activeMenu=='2-2'" v-model="url" placeholder="请输入图片地址 http://" class="mark_txt"></el-input>
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
            activeMenu:"1-1",
            text:'',
            uploadUrl:'',
            data:{},
            orgname:'',
            path:'',
            url:'',
            downUrl:'',
        }
    },
    mounted:function(){
        this.initData();
    },
    methods:{
        initData:function(){
            this.uploadUrl = this.$axios.defaults.baseURL+"/img/upload";
            this.downUrl = this.$axios.defaults.baseURL+"/img/download";
        },
        handleSelect:function(key, keyPath) {
            this.activeMenu = key;
            this.text='';
            this.url='';
            this.orgname='';
            this.path='';
        },
       download:function(){
            var that =this;
            var path = '';
            var postdata = this.$qs.stringify({
                url: this.url,
                path:'/file/test'
            });
            // 同步
            // var axios = async function(){
            //    return await this.$axios.post(this.downUrl, postdata).res;
            // };
            // var res = axios;
            // var data =res.data;
            // console.log(data);
            // if(data.code=='0'){
            //     var info = data.info;
            //     path =info.path;
            // }else{
            //     this.showError(data.msg);
            // }
            // return path;

            return  new Promise((resolve,reject)=>{
                that.$axios.post(this.downUrl, postdata).then(res=>{
                    var data = res.data;
                    resolve(data.code==0?resolve(data.info.path):'');
                }).catch(err=>{
                    reject('');
                });
            });

            
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
        preview: async function(){
            var path = '';
            if(this.activeMenu=='1-1'){
                if(this.path==''){
                    this.showError("请上传文件");
                    return false;
                }
                path = this.path;
            }else if(this.activeMenu=='2-1'){
                if(this.url==''){
                    this.showError("请输入图片地址");
                    return false;
                }
                path = await this.download();         
                if(path==''){
                    this.showError("图片解析失败");
                    return false;
                }
            }
            var ext = "png";
            var json = {
                "text": this.text,
                    // "color":'',
                "fsize":30,
                    // "fstyle":'',
                // "x":250,
                // "y":520
            };
            var url = this.$axios.defaults.baseURL+"img/marktxt?path="+encodeURIComponent(path)+"&ext="+ext+"&json="+encodeURIComponent(JSON.stringify(json));
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