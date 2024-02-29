<template>
    <v-container fluid class="px-10">
        <customBrandcrumb :list="[{text:'Billing Manager'}]"/>
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
                        <template v-slot:[`item.name`]="{ item }">
                            <v-tooltip top color="black">
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on">
                                    {{gloabl.$config.stringTrimer(item.name,12)}}
                                    </span>
                                </template>
                                <span>{{item.name}}</span>
                            </v-tooltip>
                        </template>
                        <template v-slot:[`item.organization`]="{ item }">
                                <span>{{item.organization == null ? 'NAN' : item.organization.name}}</span>
                        </template>
                        <template v-slot:[`item.action`]="{ item }">
                              <router-link :to="{name:'invoice', params:{game:item.id}}" class="link-text">
                                  <v-btn color="back" class="white--text elevation-0 ml-5" x-small dark>View Invoice</v-btn>
                              </router-link>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>  
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
  export default {
    name:'BillingManager',
    mounted(){
        this.fetchrecords();
        document.title = 'StockMKT Challenge - Billing'
    },
    data(){
        return{
            gloabl:this,
            pageLoad:true,
            fab:false,
            header:[
                {text:'Game',value:'name'},
                {text:'Organization',value:'organization'},
                {text:'Tickets',value:'numberoftickets'},
                {text:'Action',value:'action'},
            ],
            records:[],
            loading:false,
            search:'',
            //Notifications
            notificationBar:false,
            notificationColor:'black',
            notificationText:''
        }
    },
    methods:{
  
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
                this.pageLoad = true;
                const response = await this.$http.get(process.env.VUE_APP_API+'/game/billings');
                this.records = response.data;
                console.log(response.data)
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
  </style>