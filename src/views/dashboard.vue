<template>
        <v-container  v-if="pageLoad == false" class="px-10 py-5" fluid>
            <!-- BreadCrumb-->
            <customBrandcrumb :list="[{text:'dashboard'}]"/>

            <v-row class="px-5 mt-15">
                <v-col>
                    <v-card flat class="customCards px-2">
                        <v-card-title primary-title>
                            <v-avatar color="white" pa-5 class="dashboardIconPosition" width="70">
                                <v-img height="120" src="/images/total-user.png"></v-img>
                            </v-avatar>
                            <v-spacer></v-spacer>
                            <span>
                                <span class="customCardTopHeading">Total Players</span>
                                <br>
                                <p class="customCardTopNumber">{{ totalPlayer }}</p>
                            </span>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-actions>
                            Number of registered players.
                        </v-card-actions>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card flat class="customCards px-2">
                        <v-card-title primary-title>
                            <v-avatar color="white" pa-5 class="dashboardIconPosition" width="70">
                                <v-img height="120" src="/images/active-user.png"></v-img>
                            </v-avatar>
                            <v-spacer></v-spacer>
                            <span>
                                <span class="customCardTopHeading">Active Players</span>
                                <br>
                                <p class="customCardTopNumber">{{ activePlayer }}</p>
                            </span>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-actions>
                            Players who are active.
                        </v-card-actions>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card flat class="customCards px-2">
                        <v-card-title primary-title>
                            <v-avatar color="white"  class="dashboardIconPosition px-2" width="70">
                                <v-img height="30" src="/images/active-games.png"></v-img>
                            </v-avatar>
                            <v-spacer></v-spacer>
                            <span>
                                <span class="customCardTopHeading">Active Games</span>
                                <br>
                                <p class="customCardTopNumber">{{ activeGame }}</p>
                            </span>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-actions>
                            Currently active games.
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
            <!-- CHART FOR REVENU -->

            <v-row class="mt-5 px-5">
                <v-col>
                    <v-card flat class="customCards pa-5">
                        <chart />
                    </v-card>
                </v-col>
            </v-row>
            <!-- Game Data -->
            <v-row class="px-5 mt-5">
                <v-col v-for="(game,i) in gameData" :key="i" lg="6">
                    
                    <v-card flat class="customCards px-5 py-5">
                        <v-row>
                            <v-col cols="12">
                                <v-card dark flat class="customCards py-5 text-center customGradientDarkBg px-15">
                                    <v-card-actions>
                                        <div class="tableDataGameTitle-box">{{game.name}}</div>
                                        <v-spacer></v-spacer>
                                        <div class="tableDataGameTitle-box">No. of Players</div>
                                        <span class="pl-5">{{ game.totalPlayer }}</span>
                                    </v-card-actions>
                                    <router-link :to="{name:'fullgame', params:{id:game.game}}" class="link-text">
                                        <v-btn color="white" class="black--text elevation-0 mt-5" small>See Detail</v-btn>
                                    </router-link>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-data-table
                                    hide-default-footer
                                    dense
                                    :headers="gameHeader"
                                    :items="game.gameplay"
                                    :items-per-page="10"
                                    class="elevation-0 limitedColoumn pr-5 dataText">
                                    <template v-slot:[`item.player`]="{ item }">
                                        <v-list-item>
                                            <v-list-item-avatar  color="black" size="30" dark><span class="white--text" style="text-transform:uppercase;">{{item.player[0]}}</span></v-list-item-avatar>
                                            <v-list-item-content> 
                                                <v-list-item-title style="font-size:12px;">{{ item.player }}</v-list-item-title>
                                                <v-list-item-subtitle style="font-size:12px;">Ticket No. {{ item.ticket_number }}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </template>
                                    <template v-slot:[`item.grand_total`]="{ item }">$ <span  style="font-size:12px;">{{Number(item.grand_total).toFixed(2)}}</span></template>
                                    <template v-slot:[`item.action`]="{ item }">
                                        <router-link :to="{name:'playerscreen', params:{game:item.gameplayId}}" class="link-text">
                                            <v-icon small class="mr-2">mdi-eye</v-icon>
                                        </router-link>
                                    </template>
                                </v-data-table>
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
    import chart from '../components/inc/chart.vue'
    export default {
        name: 'DashBoard',
        components: {
           chart
        },
      data () {
        return {
            totalPlayer:'',
            activePlayer:'',
            activeGame:'',
            revenue:[],
            gameData:[],
            gameHeader: [
                { text: 'Player', value: 'player' },
                { text: 'Vol.', value: 'grand_total' },
                { text: 'Screen', value: 'action',align:'end' }
            ],
            pageLoad:true
        }
      },
      mounted(){
            this.dashboardData();
            document.title = 'StockMKT Challenge - Dahsboard'
        },
      methods:{
        async dashboardData(){
            try{
                this.pageLoad = true;
                const response = await this.$http.get(process.env.VUE_APP_API+'/dashboard');
                this.totalPlayer = response.data.total_player;
                this.activePlayer = response.data.active_player;
                this.activeGame = response.data.active_game;
                //this.revenue = response.data.revenue;
                this.gameData =  response.data.latest_game;
                this.pageLoad = false;
            }catch(error){
                this.pageLoad = false;
                alert(error);
            }
        }
      }
    }
</script>