<template>
    <v-container fluid class="px-10">
        <customBrandcrumb :list="[{text:'Stock List'}]"/>
        <v-row>
            <v-col v-if="pageLoad == true">
                <v-card flat>
                    <v-skeleton-loader
                        type="table"
                    ></v-skeleton-loader>
                </v-card>
            </v-col>
            <v-col v-else cols=12>
                <v-card flat>
                    <v-card-title>
                        <v-row>
                            <v-col cols=12 sm=6 md=8 class="pa-0 ma-0"></v-col>
                            <v-col cols=12 sm=6 md=4 class="py-0 my-0">
                                <v-text-field color="black" v-model="search" append-icon="mdi-magnify" label="Search" outlined hide-details dense></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-title>
                    <v-data-table :headers="header" :items="records" item-key="id" :search="search" :items-per-page="20">
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>

        <!-- Notifications -->
        <v-snackbar v-model="notificationBar" :timeout="10000" top right :color="notificationColor" multi-line class="mt-15" :vertical="true"> {{ notificationText }}
            <template v-slot:action="{ attrs }">
                <v-btn color="white" text v-bind="attrs" @click="notificationBar = false">Close</v-btn>
            </template>
        </v-snackbar>
        
    </v-container>
</template>

<script>
import {bus} from '../main'
export default {
    name:'stockList',
    mounted(){
        this.fetchrecords();
        this.fetchGame();
        document.title = 'StockMKT Challenge - Stock List'
    },
    data(){
        return{
            gloabl:this,
            pageLoad:true,
            // Dlete Url Is here
            delUrl:process.env.VUE_APP_API+'/ticket/delete',
            fab:false,
            gameHolder:'',
            header:[
                {text:'Symbol',value:'symbol'},
                {text:'Name',value:'name'},
            ],
            // Diloge Setting
            editBox:false,
            records:[],
            // Others
            selectedId:'',
            loading:false,
            search:'',
            //Notifications
            notificationBar:false,
            notificationColor:'black',
            notificationText:'',
            game:'',
            type:'all',
            tickeType:['all','free','online','offline'],
            filterLoading:false
        }
    },
    created(){
              
        window.addEventListener('keydown', event => {
            if(event.shiftKey && event.which === 78){
                    this.createBox = true;
            }
        });

        bus.$on('close',() =>  {
            this.createBox = false;
            this.editBox = false;
        });

        bus.$on('error', error =>  {
            //alert('s');
            this.notificationBar = true;
            this.notificationColor = 'red';
            this.notificationText = this.makeMessage(error);
        });

        bus.$on('response', data =>  {
            this.notificationBar = true;
            this.notificationColor = data.res.action == true ? 'black' : 'red';
            this.notificationText = data.res.message;
            if(data.type == 'create'){
                data.res.record == '' ? '' : this.records.unshift(data.res.record);
            }else{
                if(data.res.recordv !='' || data.res.recordv != null){
                    let foundIndex = this.records.findIndex(x => x.id == data.res.record.id);
                    this.records.splice(foundIndex,1,data.res.record);
                }
            }
        });           
    },
    computed:{
        isDisabled(){
            if(this.game == ''){
                return true
            }
            return false
        }
    },
    methods:{
       async fetchrecords(){
            try{
                const response = await this.$http.get(process.env.VUE_APP_API+'/stocks');
                this.records = response.data;
                this.pageLoad = false;
            }catch(error){
                this.pageLoad = false;
                alert(error);
            }
        },
    }


}
</script>

<style>
.v-speed-dial__list{
    left:auto !important;
    right:50px !important
}
.mt-70{
    margin-top:10%;
}
.isPaidChip{
    max-height:1px !important;
    padding:5px !important;
    border-radius:20px !important;
}
</style>