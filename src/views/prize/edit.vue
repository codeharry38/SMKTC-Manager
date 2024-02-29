<template>
    <v-container fluid class="px-10">
        <customBrandcrumb :list="[{text:'Edit Prize'}]"/>
        <v-row>
            <v-col lg=6 sm=6 md=6>
            </v-col>
            <v-col lg=6 sm=6 md=6 class="text-right">
            </v-col>
        </v-row>
        <v-row>
            <v-col md=12>
                <v-card v-if="windowLoad == true">
                    <v-skeleton-loader type="article"></v-skeleton-loader> 
                    <v-skeleton-loader type="actions"></v-skeleton-loader>                 
                </v-card>
                <v-card v-else>
                    <v-card-text class="pt-5">
                        <v-text-field v-model="name" label="Name" class="customField" color="black" hide-details></v-text-field>
                    </v-card-text>   
                    <v-card-actions class="text--center">
                        <v-spacer></v-spacer>
                        <v-switch v-model="statusHere" :label="statusHere == true ? 'Active': 'In Active'" :value="true" color="black"></v-switch>
                        <v-btn color="black" :loading="isLoading" dark class="mx-5" @click="Save()">Save</v-btn>
                    </v-card-actions>                 
                </v-card>  
            </v-col>
        </v-row>
        <v-row>
            <v-col md=6>
                <v-card v-if="windowLoad == true">
                    <v-skeleton-loader type="actions"></v-skeleton-loader>
                    <v-skeleton-loader type="table"></v-skeleton-loader>               
                </v-card>
                <v-card v-else class="pt-2">
                    <v-card-actions class="text--center pt-2">
                        <h3 class="pl-3">Grand Prizes</h3>
                        <v-spacer></v-spacer>
                        <v-btn color="black" @click="createBox = true" fab small dark class="mx-5 elevation-0" title="Add Position"><v-icon>mdi-plus</v-icon></v-btn>
                    </v-card-actions> 
                    <v-data-table :headers="header"  :items="records" item-key="id">
                        <template v-slot:[`item.prize_value`]="{ item }">{{item.prize_type == 'cash' ? '$ ' : ''}} {{ item.prize_value }}</template>
                        <template v-slot:[`item.action`]="{ item }">
                            <v-btn color="blue-grey darken-3" fab x-small @click="selectedId=item.id; editBox=true;" dark text><v-icon>mdi-pencil</v-icon></v-btn>
                            <v-btn color="red" fab x-small @click="delid=item.id; deleteBox=true" dark text><v-icon>mdi-delete</v-icon></v-btn>
                        </template>
                    </v-data-table>
                </v-card>  
            </v-col>

            <v-col md=6>
                <v-card v-if="windowLoad == true">
                    <v-skeleton-loader type="actions"></v-skeleton-loader>
                    <v-skeleton-loader type="table"></v-skeleton-loader>               
                </v-card>
                <v-card v-else class="pt-2" dark>
                    <v-card-actions class="text--center pt-2">
                        <h3 class="pl-3">Daily Prizes</h3>
                        <v-spacer></v-spacer>
                        <v-btn color="white" @click="createDailyBox = true" fab small class="mx-5 elevation-0 black--text" title="Add Position"><v-icon>mdi-plus</v-icon></v-btn>
                    </v-card-actions> 
                    <v-data-table :headers="header"  :items="recordDaily" item-key="id" dark>
                        <template v-slot:[`item.prize_value`]="{ item }">{{item.prize_type == 'cash' ? '$ ' : ''}} {{ item.prize_value }}</template>
                        <template v-slot:[`item.action`]="{ item }">
                            <v-btn color="white" fab x-small @click="selectedId=item.id; editBox=true;" text><v-icon>mdi-pencil</v-icon></v-btn>
                            <v-btn color="red" fab x-small @click="delid=item.id; deleteBox=true" dark text><v-icon>mdi-delete</v-icon></v-btn>
                        </template>
                    </v-data-table>
                </v-card>  
            </v-col>
        </v-row>
        <!--Create And Edit Diloges -->
        <!-- Create -->
        <!-- Create -->
        <v-dialog v-model="createBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <Prizem :edit="false"></Prizem>
        </v-dialog>
        <!-- Update -->
        <v-dialog v-model="editBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <Prizem :edit="true" :id="selectedId"></Prizem>
        </v-dialog>

        <!-- daily create -->
        <v-dialog v-model="createDailyBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <PrizemDaily :edit="false"></PrizemDaily>
        </v-dialog>
        <!-- daily Update -->
        <v-dialog v-model="editDailyBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <PrizemDaily :edit="true" :id="selectedId"></PrizemDaily>
        </v-dialog>



        <v-dialog v-model="deleteBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <delConfirm :url="delUrl" :selectedId="String(delid)" ></delConfirm>
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
import {bus} from '../../main'
import delConfirm from '../../components/confirmation/index.vue'
import Prizem from '../../components/prize/prize_meta.vue'
import PrizemDaily from '../../components/prize/prize_meta_daily.vue'
export default {
    name:'PrizeEdit',
    components:{Prizem,delConfirm,PrizemDaily},
    mounted(){
        this.fetchbyId();
        this.fetchrecords();
        this.fetchdailyrecords();
    },
    data(){
        return{
            // Dlete Url Is here
            delUrl:process.env.VUE_APP_API+'/prizemeta/delete',
            // Others
            selectedId:'',

            windowLoad:false,
            name:'',
            code:'',
            status:1,
            statusHere:true,
            isLoading:false,
            records:[],
            recordDaily:[],

        // Notification
            notificationBar:false,
            notificationColor:'black',
            notificationText:'',

            // Diloge Setting
            createBox:false,
            editBox:false,
            createDailyBox:false,
            editDailyBox:false,
            deleteBox:false,
            delid:'',
            header:[
                {text:'Position',value:'position'},
                {text:'Position Type',value:'position_type'},
                {text:'Prize Type',value:'prize_type'},
                {text:'Prize',value:'prize_value'},
                {text:'Action',value:'action', align: 'end'},
            ],
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
            this.createDailyBox = false;
            this.editDailyBox = false;
            this.deleteBox = false;
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
            this.fetchrecords();
            this.fetchdailyrecords();
        });

        bus.$on('deleted', () =>  {
            this.fetchrecords();
            this.fetchdailyrecords();
            this.delid = '';
        });            
    },
    methods:{
            async fetchbyId(){
                try{
                    this.windowLoad = true;
                    const Response = await this.$http.get(process.env.VUE_APP_API+'/prize/id/'+this.$route.params.id);
                    this.name = Response.data.name;
                    this.status = Response.data.status;
                    this.statusHere = Response.data.status == 0 ? false : true
                    this.windowLoad = false;
                }catch(error){
                    this.windowLoad = false;
                }
            },
            async Save(){
                try{
                    this.isLoading = true;
                    const Response = await this.$http.put(process.env.VUE_APP_API+'/prize/update',{
                        id: this.$route.params.id,
                        name: this.name,
                        status:this.status
                    });
                    this.isLoading = false;
                    this.action(Response.data);
                }catch(error){
                    this.isLoading = false;
                }
            },
            action(e){
                if(e.action == true){
                    this.notificationColor = 'black';
                    this.notificationBar = true;
                    this.notificationText = e.message;
                    this.fetchrecords();
                    this.fetchdailyrecords();
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
                    const response = await this.$http.get(process.env.VUE_APP_API+'/prizemeta/records/'+this.$route.params.id);
                    this.records = response.data;
                    this.pageLoad = false;
                }catch(error){
                    this.pageLoad = false;
                    bus.$emit('error',error);
                }
            },

            async fetchdailyrecords(){
                try{
                    const response = await this.$http.get(process.env.VUE_APP_API+'/prizemeta/daily/records/'+this.$route.params.id);
                    this.recordDaily = response.data;
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
                    let position = ar[0].position !== undefined ? ar[0].position : ' ';
                    let position_type = ar[0].position_type !== undefined ?  ar[0].position_type : ' ';
                    let prize_type = ar[0].prize_type !== undefined ?  ar[0].prize_type : ' ';
                    let prize_value = ar[0].prize_value !== undefined ?  ar[0].prize_value : ' ';

                    return position+' '+position_type+' '+prize_type+' '+prize_value;
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

</style>