<template>
    <div class="robot" v-cloak>
        <el-menu :default-active="activeMenu" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-submenu index="1">
                <template slot="title">reCAPTCHA2</template>
                <el-menu-item index="1-1">explicit</el-menu-item>
                <el-menu-item index="1-2">implicit</el-menu-item>
            </el-submenu>
            <el-menu-item index="2">reCAPTCHA3</el-menu-item>
            <el-menu-item index="3">aliyun</el-menu-item>
        </el-menu>
        <div class="check" align="center">
            <template v-if="activeMenu=='1-1'">
                <div id="recap2"></div>
                <el-button size="small" style="margin-top:5px;" type="primary" @click="check">验证</el-button>
            </template>
            <template v-if="activeMenu=='1-2'">
                <span>
                    修改JS地址: "https://www.recaptcha.net/recaptcha/api.js?onload=onloadCallback&render=explicit"
                </span>
                <h5><a href="" @click="detail">详情</a></h5>
                
               <!--
               <div id="recap2imp"></div>
               <el-button size="small" style="margin-top:5px;" type="primary" @click="check('implicit')">点击验证</el-button>
               -->
            </template>
            <template v-if="activeMenu=='2'">   
                <el-button size="small" type="primary" @click="onSubmit">验证</el-button>
            </template>
        </div>
        
    </div>
</template>
<script>

export default {
    name:'Robot',
    data(){
        return{
            activeMenu:'1-1',
            recap2Url:'robot/recaptcha2',
            recap3Url:'robot/recaptcha3',
            recap2Key_ex:'6LdCWv8UAAAAADsi6hbAe30Ksm5YIp59k5UFspOv',   // reCAPTCHA2公钥
            recap2Key_im:'6Ld3t_8UAAAAAAZdUxg0UI9rrc3NBeTn1kdefoLP',   // reCAPTCHA2 隐式公钥
            recap3Key:'6Lc-KgAVAAAAAPX5uW0sqjWFRe_Oj83xJI6u93Sn',       // reCAPTCHA2公钥
            widgetId: ''
        }
    },
    mounted:function(){
        this.initData();
        this.initRobot();            
    },
    methods: {
        initData:function(){
            this.recap2Url = this.$axios.defaults.baseURL+ this.recap2Url;
            this.recap3Url = this.$axios.defaults.baseURL+ this.recap3Url;
        },
        handleSelect:function(key, keyPath){
            var that = this;
            this.activeMenu = key;
            this.widgetId = '';
            if(key=='1-1'){
                this.$nextTick(()=>{
                    that.initRobot();
                });                
            }
            if(key=='1-2'){
                this.$nextTick(()=>{
                    // that.initImp();
                });
            }
        },
        initRobot:function(){
            var that = this;
            this.widgetId = grecaptcha.render('recap2', {
                'sitekey': that.recap2Key_ex, //公钥
                'theme': 'light', //主题颜色，有light与dark两个值可选
                'size': 'normal',//尺寸规则，有normal与compact两个值可选
                'callback': that.callback, //验证成功回调
                'expired-callback': that.expiredCallback, //验证过期回调
                'error-callback': that.errorCallback //验证错误回调
            });
        },
        initImp:function(){
            var that = this;
            this.widgetId = grecaptcha.render('recap2imp', {
                    'sitekey': that.recap2Key_im,
                    "callback": that.callback,
                    "size": "invisible"
            });
        },
        detail:function(){
            window.open("https://developers.google.com/recaptcha/docs/display#explicit_render");
        },
        callback:function(args){
            console.log("验证成功");
        },
        expiredCallback:function(args){
            this.showError("验证过期");
        },
        errorCallback:function(args){
            this.showError("验证失败");
        },
        check:function(){
            var that = this;
            var responseToken = grecaptcha.getResponse(this.widgetId);
            var json = {token: responseToken};
            if(arguments[0]!=undefined){
                json.type = arguments[0];
            }
            var postdata = this.$qs.stringify(json);
            this.$axios.post(this.$axios.defaults.baseURL+"robot/recaptcha2", postdata).then(res=>{
                var data = res.data;
                if(data.code=='0'){
                    this.$message({
                        showClose: true,
                        message: "验证成功!",
                        type: 'success'
                    });
                }else{
                    that.showError(data.msg);
                }                    
            }).catch(err=>{
                    that.showError("发送校验请求失败");
            });
            
        },
        onSubmit:function(e){
            var that = this;
            e.preventDefault();
            grecaptcha.ready(function() {
                grecaptcha.execute(that.recap3Key, {action: 'submit'}).then(function(token) {
                    var postdata = that.$qs.stringify({
                        token: token
                    });
                    that.$axios.post(that.$axios.defaults.baseURL+"robot/recaptcha3", postdata).then(res=>{
                        var data = res.data;
                        if(data.code=='0'){
                            that.$message({
                                showClose: true,
                                message: "验证成功!",
                                type: 'success'
                            });
                        }else{
                            that.showError(data.msg);
                        }                    
                    }).catch(err=>{
                            that.showError("发送校验请求失败");
                    });
                });
            });

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
@import url(css/Robot.css);
</style>