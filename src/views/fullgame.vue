<template>
    <v-container  v-if="pageLoad == false" class="px-10 py-5" fluid>
        <!-- BreadCrumb-->
        <customBrandcrumb :list="[{text:'Game Detail'}]"/>
        <!-- CHART FOR REVENU -->
        <v-row class="px-5 mt-5">
            <v-col lg="12">
                <v-card flat class="customCards px-5 py-5">
                    <v-row>
                        <v-col cols="12" class="pl-5">
                            <v-card dark flat class="customCards py-15 text-center customGradientDarkBg px-15 " height="100%">
                                <v-card-actions>
                                    <div class="tableDataGameTitle-box">{{game.name}}</div>
                                    <v-spacer></v-spacer>
                                    <div class="tableDataGameTitle-box">No. of Players</div>
                                    <h2 class="pl-5">{{ game.totalPlayer }}</h2>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                        <v-col cols="12">
                            <v-tabs v-model="tab" align-with-title>
                                <v-tabs-slider color="black"></v-tabs-slider>
                                <v-tab>Leader Board</v-tab>
                                <v-tab>Grand Prize</v-tab>
                                <v-tab>Daily Prize</v-tab>
                            </v-tabs>
                        </v-col>
                        <v-col cols="12">
                            <v-tabs-items v-model="tab">
                                <!-- Leader Board-->
                                <v-tab-item>
                                    <v-card-title>
                                        <v-row>
                                            <v-col cols=12 sm=6 md=8 class="pa-0 ma-0"></v-col>
                                            <v-col cols=12 sm=6 md=4 class="py-0 my-0 pb-5">
                                                <v-text-field color="black" v-model="search" append-icon="mdi-magnify" label="Search" outlined hide-details dense></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-card-title>
                                    <v-data-table
                                        dense
                                        :headers="gameHeader"
                                        :items="game.gameplay"
                                        :search="search"
                                        class="elevation-0 pr-5 dataText">
                                        <template v-slot:[`item.player`]="{ item }">
                                            <v-list-item>
                                                <v-list-item-avatar  color="black" size="35" dark><span class="white--text" style="text-transform:uppercase;">{{item.player[0]}}</span></v-list-item-avatar>
                                                <v-list-item-content> 
                                                    <v-list-item-title style="text-transform:capitalize;">{{ item.player }}</v-list-item-title>
                                                    <v-list-item-subtitle>{{ item.email }}</v-list-item-subtitle>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </template>
                                        <template v-slot:[`item.ticket_number`]="{ item }">{{ item.ticket_number}}</template>
                                        <template v-slot:[`item.access_code`]="{ item }"><v-chip class="ma-2" color="back" style="text-transform: uppercase;" x-small label>{{ item.access_code}}</v-chip></template>
                                        <template v-slot:[`item.ticket_type`]="{ item }"><v-chip class="ma-2" color="back" style="text-transform: uppercase;" x-small label>{{ item.ticket_type}}</v-chip></template>
                                        <template v-slot:[`item.volume`]="{ item }">$ {{(item.grand_total).toFixed(2)}}</template>
                                        <template v-slot:[`item.action`]="{ item }">
                                            <router-link :to="{name:'playerscreen', params:{game:item.gameplayId}}" class="link-text">
                                                <v-icon small class="mr-2">mdi-eye</v-icon>
                                            </router-link>
                                        </template>
                                    </v-data-table>
                                </v-tab-item>

                                <!-- Grand Prize  -->
                                <v-tab-item>
                                    <v-data-table :headers="grandHeader" :items="recordsGrand" class="elevation-0 pr-5 dataText">
                                        <template v-slot:[`item.player`]="{ item }">
                                            <v-list-item>
                                                <v-avatar color="black" size="30" light class="mr-5"><span class="red--text" style="text-transform:uppercase;"><b>{{item.player[0]}}</b></span></v-avatar>
                                                <!---<v-list-item-avatar  color="white" size="35" dark class="black--text" style="text-transform:uppercase;">{{item.player_meta.name[0]}}</v-list-item-avatar>-->
                                                <v-list-item-content>
                                                    <v-list-item-title style="text-transform:capitalize;">{{ item.player }}</v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </template>
                                        <template v-slot:[`item.grand_total`]="{ item }">
                                            $ {{Number(item.grand_total).toFixed(2)}}
                                        </template>
                                        <template v-slot:[`item.position_type`]="{ item }">
                                            {{ item.Prize.position_type }}
                                        </template>

                                        <template v-slot:[`item.dailywinner`]="{ item }">
                                            {{ item.Prize.prize_type == 'cash' ? `$`+item.Prize.prize_value : item.Prize.prize_value}}
                                        </template>
                                        <template v-slot:[`item.ticket_no`]="{ item }">
                                            {{item.Ticket.ticket_number}}
                                        </template>
                                        <template v-slot:[`item.diff`]="{ item }">
                                            <span :class="(Number(item.grand_total).toFixed(2) - 100000) < 0 ? 'otherValue mx-3 red--text' : 'otherValue mx-3 green--text' ">{{ (Number(item.grand_total).toFixed(2) - 100000) >= 0 ? '+' : ''}} {{(((Number(item.grand_total).toFixed(2) - 100000) * 100) / 100000).toFixed(2) }} %</span>
                                        </template>
                                        <template v-slot:[`item.action`]="{ item }">
                                            <router-link :to="{name:'playerscreen', params:{game:item.gameplayId}}" class="link-text">
                                                <v-icon small class="mr-2">mdi-eye</v-icon>
                                            </router-link>
                                        </template>
                                    </v-data-table>
                                </v-tab-item>

                                <!-- Daily Prizes -->
                                <v-tab-item>
                                    <v-card v-if="(is_daily == 0)" class="pa-5 text-center elevation-0" color="transparent" dark>
                                        <h3 class="black--text">This game is not selected for daily prizes.</h3>
                                    </v-card>
                                    <v-data-table v-else :headers="dailyHeader" :items="records" class="elevation-0 pr-5 dataText">
                                        <template v-slot:[`item.player`]="{ item }">
                                            <v-list-item>
                                                <v-avatar color="black" size="30" light class="mr-5"><span class="red--text" style="text-transform:uppercase;"><b>{{item.player[0]}}</b></span></v-avatar>
                                                <!---<v-list-item-avatar  color="white" size="35" dark class="black--text" style="text-transform:uppercase;">{{item.player_meta.name[0]}}</v-list-item-avatar>-->
                                                <v-list-item-content>
                                                    <v-list-item-title style="text-transform:capitalize;">{{ item.player }}</v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </template>
                                        <template v-slot:[`item.grand_total`]="{ item }">
                                            $ {{Number(item.grand_total).toFixed(2)}}
                                        </template>
                                        <template v-slot:[`item.position_type`]="{ item }">
                                            {{ item.Prize.position_type }}
                                        </template>

                                        <template v-slot:[`item.dailywinner`]="{ item }">
                                            {{ item.Prize.prize_type == 'cash' ? `$`+item.Prize.prize_value : item.Prize.prize_value}}
                                        </template>
                                        <template v-slot:[`item.ticket_no`]="{ item }">
                                            {{item.Ticket.ticket_number}}
                                        </template>
                                        <template v-slot:[`item.diff`]="{ item }">
                                            <span :class="(Number(item.grand_total).toFixed(2) - 100000) < 0 ? 'otherValue mx-3 red--text' : 'otherValue mx-3 green--text' ">{{ (Number(item.grand_total).toFixed(2) - 100000) >= 0 ? '+' : ''}} {{(((Number(item.grand_total).toFixed(2) - 100000) * 100) / 100000).toFixed(2) }} %</span>
                                        </template>
                                        <template v-slot:[`item.action`]="{ item }">
                                            <router-link :to="{name:'playerscreen', params:{game:item.gameplayId}}" class="link-text">
                                                <v-icon small class="mr-2">mdi-eye</v-icon>
                                            </router-link>
                                        </template>
                                    </v-data-table>
                                </v-tab-item>
                            </v-tabs-items>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <!-- CHART FOR REVENU -->
    </v-container>
    <v-container v-else fluid  style="min-height:80vh; width:666px !important">
        <div>
            <v-row class="d-flex align-content-center flex-wrap justify-center" align="center" justify="center" style="min-height:80vh;">
                <v-col cols="12" class="mx-auto text-center">
                    <h2 class="WaitingContent">Loading...</h2>
                    <br>
                    <v-progress-linear color="black" indeterminate rounded height="6"></v-progress-linear>
                </v-col>
            </v-row>
        </div>
</v-container>

</template>
<script>
export default {
    name: 'full-game',
  data () {
    return {
        tab:0,
        game:[],
        gameHeader: [
            { text: 'Player', value: 'player' },
            { text: 'Vol.', value: 'volume' },
            { text: 'Ticket No.', value: 'ticket_number' },
            { text: 'Access Code', value: 'access_code' },
            { text: 'Ticket Type', value: 'ticket_type' },
            { text: 'Screen', value: 'action',align:'end' }
        ],
        records:[],
        is_daily:0,
        dailyHeader: [
            { text: '#Position', value: 'position', sortable:false },
            { text: 'Players', value: 'player', sortable:false },
            { text: 'Ticket No.', value: 'ticket_no', sortable:false },
            { text: 'Position Type', value: 'position_type', sortable:false },
            { text: 'Prize', value: 'dailywinner', sortable:false },
            { text: 'Winner Volume', value: 'grand_total', sortable:false },
            { text: '(+/-)', value: 'diff', sortable:false },
            { text: 'Prize Date', value: 'created_at', sortable:false },
            { text: 'Screen', value: 'action',align:'end' }
        ],

        recordsGrand:[],
        grandHeader: [
          { text: '#Position', value: 'position', sortable:false },
            { text: 'Players', value: 'player', sortable:false },
            { text: 'Ticket No.', value: 'ticket_no', sortable:false },
            { text: 'Position Type', value: 'position_type', sortable:false },
            { text: 'Prize', value: 'dailywinner', sortable:false },
            { text: 'Winner Volume', value: 'grand_total', sortable:false },
            { text: '(+/-)', value: 'diff', sortable:false },
            { text: 'Prize Date', value: 'created_at', sortable:false },
            { text: 'Screen', value: 'action',align:'end' }
        ],
        pageLoad:true,
        search:'',
    }
  },
  mounted(){
        this.fetchData();
        this.fetchrecords();
        this.daily_prize();
        this.fetchGrand();
        document.title = 'StockMKT Challenge - Game Details'
    },
  methods:{
        async fetchData(){
            try{
                this.pageLoad = true;
                const response = await this.$http.get(process.env.VUE_APP_API+'/fullgame/'+this.$route.params.id);
                this.game =  response.data;
                this.pageLoad = false;
            }catch(error){
                this.pageLoad = false;
                alert(error);
            }
        },
        async daily_prize(){
            try{
                const response = await this.$http.get(process.env.VUE_APP_API+'/game/info/'+this.$route.params.id);
                this.is_daily = response.data.is_daily_prize;
                this.pageLoad = false;
            }catch(error){
                this.pageLoad = false;
                //bus.$emit('error',error);
            }
        },
          async fetchrecords(){
            try{
                const response = await this.$http.get(process.env.VUE_APP_API+'/dailywinner/'+this.$route.params.id);
                this.records = response.data;
                this.pageLoad = false;
            }catch(error){
                this.pageLoad = false;
            }
        },
        async fetchGrand(){
            try{
                const response = await this.$http.get(process.env.VUE_APP_API+'/grandwinner/'+this.$route.params.id);
                if(response.data == ''){ 
                    this.noData = true
                }
                this.recordsGrand = response.data;
                this.pageLoad = false;
            }catch(error){
                this.pageLoad = false;
            }
        },
  }
}
</script>
<style scoped>
.tableDataGameTitle-box{
    font-size:13px;
    color:#fff;
}
</style>