<template>
    <v-app-bar app class="elevation-0 px-5" color="transparent">
        <ul class="customBreadCrumbs">
            <li><a href="#"> <v-icon>mdi-home-outline</v-icon> </a></li>
            <li v-for="(item, i) in items" :key="i">
                <span v-if="i == item.lenght-1">{{item.text}}</span>
                <a v-else href="#">{{item.text}}</a>
            </li>
        </ul>
    </v-app-bar>
</template>

<script>
    export default {
        props: {
            list:[]
        },
        name: 'BreadCrumbs',
      data () {
        return {
            items: this.list
        }
      },
    }
</script>
<style scoped>
.customBreadCrumbs{
    margin:0px;
    padding:0px;
}
.customBreadCrumbs li{
    display:inline-block;
    list-style-type:none;

}
.customBreadCrumbs li:after{
    list-style-type:none;
    content: '/' !important;
    margin-left:10px;
    margin-right:10px;
    color:#444;
}
.customBreadCrumbs li:last-child:after{
    content: '' !important;
}
.customBreadCrumbs li a{
    
    text-decoration:none;
    color:#444;
    font-size:12px;
    text-transform: capitalize;
}
</style>