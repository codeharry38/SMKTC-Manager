<template>
    <v-container fluid class="px-10">
        <customBrandcrumb :list="[{text:'Invoice'}]"/>
        <v-row>
            <v-col lg=6 sm=6 md=6>
            </v-col>
            <v-col lg=6 sm=6 md=6 class="text-right">
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
                <v-card flat class="px-10" id="printableArea">
                    <v-row class="pt-10">
                        <v-col lg="6">
                            <H2 class="invoiceHeading">Game: {{ records.name }}</H2>
                        </v-col>
                        <v-col lg="6">
                            <H2 class="invoiceHeading text-right">Organization: {{ records.organization.name }}</H2>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col lg="12">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col lg="6">
                            <ul class="ticketList">
                                <li><b>Game Start At: {{ records.start_at }}</b></li>
                                <li><b>Last Entrance: {{ records.entrance_deadline }}</b></li>
                                <li><b>Game End At: {{ records.end_at }}</b></li>
                                <li v-if="records.online_tickets == '0' && records.reserve_tickets == '0' && records.offline_tickets == '0'" ><b>Entry cost: $ 0.00</b></li>
                                <li v-else><b>Entry cost: ${{ Number(records.cost).toFixed(2) }}</b></li>
                            </ul>
                        </v-col>
                        <v-col lg="6">
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col lg="12">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row class="py-15">
                        <v-col lg="4">
                            <h3 class="pb-5 shortHeading">Generated Tickets</h3>
                            <ul class="ticketList">
                                <li>Online: {{ records.online_tickets }}</li>
                                <li>Reserve: {{ records.reserve_tickets }}</li>
                                <li>Free: {{ records.free_tickets }}</li>
                                <li>Offline: {{ records.offline_tickets }}</li>
                                <li>Total Generated: {{ Number(records.online_tickets) +  Number(records.free_tickets) + Number(records.offline_tickets) + Number(records.reserve_tickets)}}</li>
                            </ul>
                        </v-col>
                        <v-col lg="4 text-center">
                            <h3 class="pb-5 shortHeading">Paid Tickets</h3>
                            <ul class="ticketList">
                                <li>Online: {{ records.online_paid }}</li>
                                <li>Reserve: {{ records.reserve_paid }}</li>
                                <li>Offline: {{ records.offline_paid }}</li>
                                <li>Total Paid: ${{ ((Number(records.online_paid) + Number(records.reserve_paid)) * Number(records.cost)).toFixed(2)}}</li>
                            </ul>
                        </v-col>
                        <v-col lg="4 text-right">
                            <h3 class="pb-5 shortHeading">Claimed Tickets</h3>
                            <ul class="ticketList">
                                <li>Online: {{ records.online_claim }}</li>
                                <li>Reserve: {{ records.reserve_claim }}</li>
                                <li>Free: {{ records.free_claim }}</li>
                                <li>Offline: {{ records.offline_claim }}</li>
                                <li>Total Claimed: {{ records.online_claim +  records.free_claim + records.offline_claim}}</li>
                            </ul>
                        </v-col> 
                    </v-row>
                    <v-col lg="12">
                            <v-divider></v-divider>
                        </v-col>
                    <v-row class="py-15">
                        <v-col lg="6 ">
                            <h3 class="pb-5 shortHeading">Stock Registered</h3>
                            <ul class="ticketList">
                                <li>{{ ((Number(records.online_tickets) +  Number(records.free_tickets) + Number(records.offline_tickets) + Number(records.reserve_tickets)) * 5)}}</li>
                            </ul>
                        </v-col>
                        <v-col lg="6 text-right">
                            <h3 class="pb-5 shortHeading">Claimed Stocks</h3>
                            <ul class="ticketList">
                                <li>Total Claimed: {{ ((records.online_claim +  records.free_claim + records.offline_claim + records.reserve_claim) * 5)}}</li>
                            </ul>
                        </v-col>
                    </v-row>
                </v-card>
                <v-row>
                    <v-col lg="6">
                        <v-btn @click="printDiv" dark block>Print</v-btn>
                    </v-col>
                    <v-col lg="6">
                        <v-btn @click="createBox = true" dark block>Send an Email</v-btn>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>  

        <v-dialog v-model="createBox" scrollable persistent max-width="800px" transition="dialog-transition">
          <Email :id="route"></Email>
      </v-dialog>
        <!-- Notifications -->
          <v-snackbar v-model="notificationBar" :timeout="10000" top center :color="notificationColor" multi-line class="mt-2 mr-8" :vertical="true"> {{ notificationText }}
              <template v-slot:action="{ attrs }">
                  <v-btn color="white" text v-bind="attrs" @click="notificationBar = false">Close</v-btn>
              </template>
          </v-snackbar>
        
    </v-container>
  </template>
  
  <script>
  import {bus} from '../../main'
  import Email from '../../components/email.vue'
  export default {
    name:'BillingManager',
    components:{Email},
    mounted(){
        document.title = 'StockMKT Challenge - Invoce'
    },
    data(){
        return{
            gloabl:this,
            pageLoad:true,
            fab:false,
            route:this.$route.params.game,
            header:[
                {text:'Game',value:'name'},
                {text:'Organization',value:'organization'},
                {text:'Tickets',value:'numberoftickets'},
                {text:'Action',value:'action'},
            ],
            records:[],
            loading:false,
            search:'',
            // Diloge Setting
          createBox:false,
            //Notifications
            notificationBar:false,
            notificationColor:'black',
            notificationText:''
        }
    },
    created(){
        this.fetchrecords();
      bus.$on('close',() =>  {
            this.createBox = false;
      });

      bus.$on('error', error =>  {
          //alert('s');
          this.notificationBar = true;
          this.notificationColor = 'red';
          this.notificationText = error;
      });

      bus.$on('response', data =>  {
          this.notificationBar = true;
          this.notificationColor = data.res.action == true ? 'black' : 'red';
          this.notificationText = data.res.message;
      });      
  },
    methods:{
        printDiv() {
            let printContents = document.getElementById('printableArea').innerHTML;

            document.body.innerHTML = printContents;

            window.print();

            location.reload();
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
                this.notificationText = e;
            }
        },
       async fetchrecords(){
            try{
                const response = await this.$http.get(process.env.VUE_APP_API+'/game/invoice/'+this.$route.params.game);
                this.records = response.data;
                this.pageLoad = false;
            }catch(error){
                this.pageLoad = false;
                bus.$emit('error',error);
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
  .invoiceHeading{
    font-size:25px;
    font-weight: 600;
  }
  .shortHeading{
    font-size:15px;
    font-weight:600;
  }
  .ticketList{
    margin:0px ;
    padding:0px;
  }
  .ticketList li{
    list-style-type:none;
    font-size:14px;
    font-weight:500;
    margin:0px;
    padding:0px;
    line-height:35px;
  }
  </style>