<template>
  <v-container fluid class="gameContinue" style="min-width:100% !important">
    <v-row class="pl-8">
        <v-col md="12">
            <v-card class="py-5 px-5 border-radius">
                <v-card-actions>
                    <v-btn @click="goBack()" color="transparent" class="black--text elevation-0" x-small><v-icon class="mr-2" color="black" small>mdi-arrow-left</v-icon>Go Back</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
    <v-row class="pl-8">
        <v-col md="12">
            <v-card class="py-5 px-5 border-radius">
                <v-card-actions>
                    <span class="black--text">Game<br>{{ record.game?.name }}</span> 
                    <v-spacer></v-spacer>
                    <span class="black--text">Ticket#<br>{{ record.ticket?.ticket_number}}</span>
                    <v-spacer></v-spacer>
                    <span class="black--text">Access Code<br>{{record.ticket?.access_code}}</span>
                    <v-spacer></v-spacer>
                    <span class="black--text">Date<br>{{  record.game?.start_at }}</span>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
    <v-row class="pl-8">
        <v-col md="12">
            <v-card class="py-5 px-5 border-radius" v-if="record.status == 1">
                <v-card-actions>
                <h4><b>Total Value <br> $ 100000.00</b></h4>
                <v-spacer></v-spacer>
                <h4><b>Current Value <br> ${{ (record.total).toFixed(2) }}</b></h4>
                <v-spacer></v-spacer>
                <b><span :class="(record.total.toFixed(2) - 100000) < 0 ? 'otherValue mx-3 red--text' : 'otherValue mx-3 green--text' ">(+)/(-)<br>
                    {{ Number(record.total.toFixed(2) - 100000) >= 0 ? '+ ' : ''}} {{((Number(record.total.toFixed(2) - 100000)* 100) / 100000).toFixed(2) }} %</span></b>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
    <v-row>
        <v-col md="12 pt-0">
            <ul class="stockList">
                <li v-for="(stock, i) in record.stocks" :key="i">
                    <v-card color="transparent" class="elevation-0">
                        <v-card-actions>
                            <span class="stockName mx-3">{{stock.stock_meta.symbol}}</span>
                            <v-spacer></v-spacer>                         
                        </v-card-actions>
                        <v-card-actions>
                            <span class="otherValue mx-3" style="width:100%">Value<br>$20000</span> 
                            <span class="otherValue mx-3" style="width:100%">Current Value<br>${{ Number(stock.total_value).toFixed(2) }}</span>
                            <span :class="(Number(stock.total_value).toFixed(2) - 20000) < 0 ? 'otherValue mx-3 red--text' : 'otherValue mx-3 green--text' " style="width:100%">(+)/(-)<br>{{ (Number(stock.total_value).toFixed(2) - 20000) >= 0 ? '+ ' : ''}} {{(((Number(stock.total_value).toFixed(2) - 20000) * 100) / 20000).toFixed(2) }} %</span>
                            <span class="otherValue mx-3" style="width:100%">Open<br>{{stock.open}}</span>
                            <span class="otherValue mx-3 highValue" style="width:100%">High<br>{{stock.high}}</span>
                            <span class="otherValue mx-3 lowValue" style="width:100%">Low<br>{{stock.low}}</span>
                            <span class="otherValue mx-3" style="width:100%">Close<br>{{stock.close}}</span>
                            <span class="otherValue mx-3" style="width:100%">Volume<br>{{stock.volume}}</span>
                        </v-card-actions>
                    </v-card>
                    <v-card color="transparent" class="elevation-0 border-top-action-panel">
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <p class="stockFullName mb-0">{{stock.stock_meta?.name}}</p>
                        </v-card-actions>
                    </v-card>
                </li>
            </ul>
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
    export default {
        name: 'continue-game',
        created() {
            //console.log(this.stockLists);
            this.fetchData();
        },
        mounted(){
            document.title = 'StockMKT Challenge - Player Screen'
        },
        data(){
            return{
                // backend Fetched Data
            game:{},
            record:{},
            pageLoad:true,
            //Notifications
            notificationBar:false,
            notificationColor:'black',
            notificationText:'',
            }
        },

    methods:{

        goBack(){
                history.back();
            },
        async fetchData(){
            try{
                this.pageload = true;
                const response = await this.$http.get(process.env.VUE_APP_API+'/gameplay/continue/'+this.$route.params.game);
                this.game = response.data.game;
                this.record = response.data;
                this.pageload = false;
            }catch(e){
                this.action(e);
                this.pageload = false;
            }
        },
        action(e){
            if(e.action == true){
                this.notificationColor = 'black';
                this.notificationBar = true;
                this.notificationText = e.message;
            }else{
                this.notificationColor = 'red';
                this.notificationBar = true;
                this.notificationText = e.message;
            }
        },
    }
} 
</script>
    <style>
    .stockList{
        margin:0px;
        padding:0px;
    }
    .stockList li{
        display:table;
        width:100%;
        list-style: none;
        padding:10px 20px;
        color:rgb(0, 0, 0) !important;
        border-radius:15px;
        margin-top:10px;
        background:rgb(255, 255, 255);
    }

    .stockList li .stockName{
        font-size:15px;
        font-weight: bold;
        color:red;
        background:rgba(255, 0, 0, 0.151);
        padding:5px 15px;
        border-radius:10px;
    }
    .stockList li .otherValue{
        font-size:11px;
        text-align: center;
        color:rgb(0, 0, 0);
    }
    .stockList li span{
        display:inline-block;
        float:left;
    }
    .totalValue{
        font-size:20px;
    }
    .highValue{
        color:rgb(0, 189, 0) !important;
    }
    .lowValue{
        color:red !important;
    }
    .activeStock{
        background:#ffffff !important;
    }
    .activeStock .otherValue{
        background:#ffffff !important;
        color:#000 !important;
    }
    .activeStock .highValue{
        color:rgb(0, 189, 0) !important;
    }
    .activeStock .lowValue{
        color:red !important;
    }
    .border-top-action-panel{
        border-top:1px solid #000;
    }
    .customTrandBtn{
        border-radius:15px !important;
        font-size:13px !important;
        text-transform:capitalize !important;
        background:#111236 !important;
        padding:10px 15px !important;
    }
    .border-radius{
        border-radius: 15px !important;
        box-shadow: none !important;
    }
    .valueData{
        border-radius:15px !important;
        border: 1px solid !important;
    }
    .valueData h4{
        font-weight: 100 !important;
    }
    </style>