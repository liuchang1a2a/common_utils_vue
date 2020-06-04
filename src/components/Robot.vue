<template>
    <div class="robot" v-cloak>
        <el-menu :default-active="activeMenu" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-submenu index="1">
                <template slot="title">reCAPTCHA2</template>
                <el-menu-item index="1-1">explicit</el-menu-item>
                <el-menu-item index="1-2">implicit</el-menu-item>
            </el-submenu>
            <el-menu-item index="2">reCAPTCHA3</el-menu-item>
            <el-submenu index="3">
                <template slot="title">aliyun</template>
                <el-menu-item index="3-1">滑动</el-menu-item>
                <el-menu-item index="3-2">智能</el-menu-item>
                <el-menu-item index="3-3">无痕</el-menu-item>
            </el-submenu>
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
            <template v-if="activeMenu=='3-1'">  
                <div id="slip" class="nc-container"></div>
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
            recap3Key:'6Lc-KgAVAAAAAPX5uW0sqjWFRe_Oj83xJI6u93Sn',       // reCAPTCHA3公钥
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
            if(key=='3-1'){
                 this.$nextTick(()=>{
                    that.initSlip();
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
        initSlip:function(){
            var that = this;
            var nc_token = ["FFFF0N0000000000924C", (new Date()).getTime(), Math.random()].join(':');
            var NC_Opt =
            {
                renderTo: "#slip",
                appkey: "FFFF0N0000000000924C",
                scene: "nc_login",
                token: nc_token,
                customWidth: 300,
                trans: { "key1": "code0" },
                elementID: ["usernameID"],
                is_Opt: 0,
                language: "cn",
                isEnabled: true,
                timeout: 3000,
                times: 5,
                apimap: {
                // 'analyze': '//a.com/nocaptcha/analyze.jsonp',
                // 'get_captcha': '//b.com/get_captcha/ver3',
                // 'get_captcha': '//pin3.aliyun.com/get_captcha/ver3'
                // 'get_img': '//c.com/get_img',
                // 'checkcode': '//d.com/captcha/checkcode.jsonp',
                // 'umid_Url': '//e.com/security/umscript/3.2.1/um.js',
                // 'uab_Url': '//aeu.alicdn.com/js/uac/909.js',
                // 'umid_serUrl': 'https://g.com/service/um.json'
                },
                callback: function (data) {
                    // window.console && console.log(nc_token)
                    // window.console && console.log(data.csessionid)
                    // window.console && console.log(data.sig)
                    that.checkAli(data.csessionid,data.sig,nc_token,NC_Opt.scene);
                }
            }
            var nc = new noCaptcha(NC_Opt);
            nc.upLang('cn', {
                _startTEXT: "请按住滑块，拖动到最右边",
                _yesTEXT: "验证通过",
                _error300: "哎呀，出错了，点击<a href=\"javascript:__nc.reset()\">刷新</a>再来一次",
                _errorNetwork: "网络不给力，请<a href=\"javascript:__nc.reset()\">点击刷新</a>",
            });
        },
        checkAli:function(sessionid,sig,token,scene){
            var that = this;
            var postdata = this.$qs.stringify({
                "sessionId": sessionid,
                "sig":sig,
                "token": token,
                "scene": scene
            });
            this.$axios.post(this.$axios.defaults.baseURL+"robot/aliyun", postdata).then(res=>{
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