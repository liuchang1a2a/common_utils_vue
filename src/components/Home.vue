<template>
    <div>
        <h1>Home</h1>
        <p>{{msg}}</p>
        
        <router-link to="/home/checkcode" title="验证码">CheckCode</router-link>
        <router-link to="/home/markimg" title="水印">MarkImg</router-link>
        <router-link to="/home/qrcode"  title="二维码">QrCode</router-link>
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    name:'Home',
    data(){
        return {
            msg: "首页:展示templates链接地址"
        }
    },
    methods:{
        
    }
}
</script>