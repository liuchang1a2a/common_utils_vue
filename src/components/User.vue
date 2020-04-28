<template>
    <div>
        User id:{{dynamicId}}  <!-- 传递查询参数-->
    </div>
</template>
<script>
export default {
    name:'User',
    data(){
        return {
            
        }
    },
    methods:{

    },
    computed:{
        dynamicId(){
            return this.$route.params.id;
        }
    },
    watch:{
        $route (to,from){
            console.log(to);
            console.log(from);
            this.dynamicId = to.params.id;
        }
    }
}
</script>