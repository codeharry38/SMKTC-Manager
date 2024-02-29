<template>
    <v-container fluid class="px-10">
        <customBrandcrumb :list="[{text:'Offer Manager'}]"/>
        <v-row>
            <v-col lg=6 sm=6 md=6>
            </v-col>
            <v-col lg=6 sm=6 md=6 class="text-right">
                <v-speed-dial v-model="fab" :right="true" direction="left" :open-on-hover="true" transition="slide-y-reverse-transition">
                    <template v-slot:activator>
                        <v-btn v-model="fab" color="black" dark fab small>
                            <v-icon v-if="fab">mdi-close</v-icon>
                            <v-icon v-else>mdi-octagram</v-icon>
                        </v-btn>
                    </template>
                    <v-btn fab dark small color="indigo">
                        <v-icon @click="createBox = true">mdi-plus</v-icon>
                    </v-btn>
                    <v-btn v-if="selection.length > 0" fab dark small color="red" @click="deleteBox=true">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </v-speed-dial>
            </v-col>
        </v-row>
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
                    <v-data-table v-model="selection" :headers="header" :items="records" show-select item-key="id" :search="search">
                        <template v-slot:[`item.name`]="{ item }">
                            <v-tooltip top color="primary">
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on">
                                    {{gloabl.$config.stringTrimer(item.name,12)}}
                                    </span>
                                </template>
                                <span>{{item.name}}</span>
                            </v-tooltip>
                        </template>
                        <template v-slot:[`item.status`]="{ item }">
                            <v-chip class='ma-1' label x-small :color="item.status == 1 ? 'green' : 'red'" dark @click="statusUpdate(item.status, item.id)">{{item.status == 1 ? 'Active' : 'In Active'}}</v-chip>
                        </template>
                        <template v-slot:[`item.action`]="{ item }">
                            <v-btn color="blue-grey darken-3" fab small @click="selectedId=item.id; editBox=true;" dark text><v-icon>mdi-pencil</v-icon></v-btn>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
        <!--Create And Edit Diloges -->
        <!-- Create -->
        <v-dialog v-model="createBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <Offer :edit="false"></Offer>
        </v-dialog>
        <!-- Update -->
        <v-dialog v-model="editBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <Offer :edit="true" :id="selectedId"></Offer>
        </v-dialog>
        <v-dialog v-model="deleteBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <delConfirm :url="delUrl" :selectedId="deleteconveter" ></delConfirm>
        </v-dialog>

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
import delConfirm from '../components/confirmation/index.vue'
import Offer from '../components/offer/index.vue'
export default {
    name:'OfferManager',
    components:{Offer,delConfirm},
    mounted(){
        this.fetchrecords();
        document.title = 'StockMKT Challenge - Offer Manager'
    },
    data(){
        return{
            gloabl:this,
            pageLoad:true,
            // Dlete Url Is here
            delUrl:process.env.VUE_APP_API+'/offer/delete',
            fab:false,
            header:[
                {text:'Offer',value:'name'},
                {text:'Offer Code',value:'offercode'},
                {text:'Start',value:'f_start_at'},
                {text:'End',value:'f_end_at'},
                {text:'Status',value:'status'},
                {text:'Action',value:'action'},
            ],
            // Diloge Setting
            createBox:false,
            editBox:false,
            deleteBox:false,
            // Selection of Data
            selection:[],
            records:[],
            // Others
            selectedId:'',
            loading:false,
            search:'',
            //Notifications
            notificationBar:false,
            notificationColor:'black',
            notificationText:''
        }
    },
    created(){
        window.addEventListener('keyup', event => {
            if(this.selection.length > 0){
                if(event.which === 46){
                    this.deleteBox = true;
                }
            }
        });
        
        window.addEventListener('keydown', event => {
            if(event.shiftKey && event.which === 78){
                    this.createBox = true;
            }
        });

        bus.$on('close',() =>  {
            this.createBox = false;
            this.editBox = false;
            this.deleteBox = false;
            this.selection = [];
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

        bus.$on('deleted', () =>  {
            for(let i = 0; i < this.selection.length; i++){
                if(this.records.indexOf(this.selection[i])!= -1){
                    this.records.splice(this.records.indexOf(this.selection[i]),1);
                }
            }
        });            
    },
    computed:{
        deleteconveter(){
            let deleteId = [...new Set(this.selection.map(it => it.id))];
            return deleteId.toString();
        }
    },
    methods:{
         async statusUpdate(data,id){
            if(data == 1){
                const response =  await this.$http.post(process.env.VUE_APP_API+'/offer/status',{
                    id:id,
                    status:0
                });
                this.action(response.data);
            }else{
                const response =  await this.$http.post(process.env.VUE_APP_API+'/offer/status',{
                    id:id,
                    status:1
                });
                this.action(response.data);
            }
        },

        action(e){
            if(e.action == true){
                this.notificationColor = 'black';
                this.notificationBar = true;
                this.notificationText = e.message;
                this.fetchrecords();
                this.CreateBox = false;
                this.EditBox = false;
            }else{
                this.notificationColor = 'red';
                this.notificationBar = true;
                this.notificationText = this.makeMessage(e);
            }
        },
       async fetchrecords(){
            try{
                const response = await this.$http.get(process.env.VUE_APP_API+'/offer/records');
                this.records = response.data;
                this.pageLoad = false;
            }catch(error){
                this.pageLoad = false;
                bus.$emit('error',error);
            }
        },
        makeMessage(error){
            if(error.response){
                let ar = [];
                if(error.response.data.errors){
                    ar.push(error.response.data.errors);
                    let name = ar[0].name !== undefined ? ar[0].name : ' ';
                    let offercode = ar[0].offercode !== undefined ?  ar[0].offercode : ' ';
                    let buy = ar[0].buy !== undefined ?  ar[0].buy : ' ';
                    let free = ar[0].free !== undefined ?  ar[0].free : ' ';
                    let end_at = ar[0].end_at !== undefined ?  ar[0].end_at : ' ';
                    let start_at = ar[0].start_at !== undefined ?  ar[0].start_at : ' ';

                    return name+' '+offercode+' '+buy+' '+free+' '+end_at+' '+start_at;
                }else{
                    return error.response.data.message;
                }
            }else{
                return error;
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
</style>