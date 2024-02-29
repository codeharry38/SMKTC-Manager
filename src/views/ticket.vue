<template>
    <v-container fluid class="px-10">
        <customBrandcrumb :list="[{text:'Ticket Manager'}]"/>
        <v-row>
            <v-col v-if="pageLoad == true">
                <v-card flat>
                    <v-skeleton-loader
                        type="table"
                    ></v-skeleton-loader>
                </v-card>
            </v-col>
            <v-col v-else cols=12>
                <v-form @submit.prevent="filter">
                    <v-card dark class="d-flex align-center">
                        <v-row class="px-5 py-3" align="center">
                            <v-col lg="2">
                                <h2>Filter Ticket:</h2>
                            </v-col>
                            <v-col lg="3">
                                <v-autocomplete v-model="game" :items="gameHolder" flat item-text="name"
                                item-value="id" hide-details label="Select Game"></v-autocomplete>
                            </v-col>
                            <v-col lg="2">
                                <v-select :items="tickeType" v-model="type" label="Ticket Type" hide-details flat></v-select>
                            </v-col>
                            <v-col lg="2">
                                <v-btn light type="submit" :loading="filterLoading" :disabled="isDisabled"> Filter Now </v-btn>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-form>
                <v-card flat>
                    <v-card-title>
                        <v-row>
                            <v-col cols=12 sm=6 md=8 class="pa-0 ma-0"></v-col>
                            <v-col cols=12 sm=6 md=4 class="py-0 my-0">
                                <v-text-field color="black" v-model="search" append-icon="mdi-magnify" label="Search" outlined hide-details dense></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-title>
                    <v-data-table :headers="header" :items="records" item-key="id" :search="search">
                        <template v-slot:[`item.game`]="{ item }">
                            <v-tooltip top color="black">
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on">
                                        {{gloabl.$config.stringTrimer(item.game,10)}}
                                    </span>
                                </template>
                                <span>{{item.game}}</span>
                            </v-tooltip>
                        </template>
                        <template v-slot:[`item.is_paid`]="{ item }">
                            <v-tooltip top color="black" x-small>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on">
                                        <v-chip class='ma-1 isPaidChip' label x-small :color="item.is_paid == 1 ? 'green' : 'red'" dark :title="item.is_paid == 1 ? 'Paid' : 'Not Paid'"></v-chip>
                                    </span>
                                </template>
                                <span>{{item.is_paid == 1 ? 'Paid' : 'Not Paid'}}</span>
                            </v-tooltip>
                        </template>
                        <template v-slot:[`item.claimed_by`]="{ item }">
                            <v-tooltip top color="black" x-small>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on">
                                        {{gloabl.$config.stringTrimer(item.claimed_by,10)}}
                                    </span>
                                </template>
                                <span>{{item.claimed_by}}</span>
                            </v-tooltip>
                        </template>
                        <template v-slot:[`item.assign`]="{ item }">
                            <v-tooltip top color="black" x-small>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on">
                                        {{gloabl.$config.stringTrimer(item.assign,10)}}
                                    </span>
                                </template>
                                <span>{{item.assign}}</span>
                            </v-tooltip>
                        </template>
                        <template v-slot:[`item.action`]="{ item }">
                            <v-btn color="blue-grey darken-3" fab small @click="selectedId=item.id; editBox=true;" dark text><v-icon>mdi-pencil</v-icon></v-btn>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
        <!--Create And Edit Diloges -->
        <v-dialog v-model="editBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <Ticket :edit="true" :id="selectedId"></Ticket>
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
import Ticket from '../components/ticket/index.vue'
export default {
    name:'TicketManager',
    components:{Ticket},
    mounted(){
        this.fetchrecords();
        this.fetchGame();
        document.title = 'StockMKT Challenge - Ticket Manager'
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
                {text:'Access code',value:'access_code'},
                {text:'Number',value:'ticket_number'},
                {text:'Game',value:'game'},
                {text:'Start At',value:'start_at'},
                {text:'End At',value:'end_at'},
                {text:'Assign to',value:'assign'},
                {text:'Claimed By',value:'claimed_by'},
                {text:'Paid',value:'is_paid'},
                {text:'Type',value:'ticket_type'},
                {text:'Action',value:'action'},
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
            tickeType:['all','free','reserve','online','offline'],
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
        async fetchGame(){
            try{
              const response = await this.$http.get(process.env.VUE_APP_API+'/game/records');
              this.gameHolder = response.data;
              //this.pageLoad = false;
            }catch(error){
              //this.pageLoad = false;
              bus.$emit('error',error);
            }
        },
        async filter(){
            try{
                this.pageLoad = true;
                this.filterLoading = true;
                const response = await this.$http.get(process.env.VUE_APP_API+'/ticket/filter?game='+this.game+'&type='+this.type);
                this.records = response.data;
                this.pageLoad = false;
                this.filterLoading = false;
            }catch(error){
                this.pageLoad = false;
                this.filterLoading = false;
                bus.$emit('error',error);
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
                const response = await this.$http.get(process.env.VUE_APP_API+'/ticket/records');
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
                    let code = ar[0].code !== undefined ?  ar[0].code : ' ';

                    return name+' '+code;
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
.isPaidChip{
    max-height:1px !important;
    padding:5px !important;
    border-radius:20px !important;
}
</style>