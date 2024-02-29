<template>
    <v-container class="px-10 py-5" fluid>
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
                            <p class="customCardTopNumber">211</p>
                        </span>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-actions>
                        +50% than last weekl
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
                            <p class="customCardTopNumber">211</p>
                        </span>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-actions>
                        +50% than last weekl
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
                            <p class="customCardTopNumber">211</p>
                        </span>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-actions>
                        +50% than last weekl
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
            <v-col>
                <v-card flat class="customCards px-5 py-5">
                    <v-row>
                        <v-col cols="8">
                            <v-data-table
                                hide-default-footer
                                dense
                                :headers="gameHeader"
                                :items="tableData"
                                :items-per-page="100"
                                class="elevation-0 limitedColoumn pr-5 dataText">
                                <template v-slot:[`item.action`]="{ }">
                                    <v-icon small class="mr-2">mdi-pencil</v-icon>
                                </template>
                            </v-data-table>
                        </v-col>
                        <v-col cols="4" class="pl-5">
                            <v-card dark flat class="customCards text-center customGradientDarkBg d-flex flex-column align-center justify-center" height="100%">
                                <div class="tableDataGameTitle mb-10">Trading Game 1</div>
                                <div class="tableDataGameTitle">No. of Players</div>
                                <h2>211</h2>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
            <v-col>
                <v-card flat class="customCards px-5 py-5">
                    <v-row>
                        <v-col cols="8">
                            <v-data-table
                                hide-default-footer
                                dense
                                :headers="gameHeader"
                                :items="tableData"
                                :items-per-page="100"
                                class="elevation-0 limitedColoumn pr-5 dataText">
                                <template v-slot:[`item.action`]="{ }">
                                    <v-icon small class="mr-2">mdi-pencil</v-icon>
                                </template>
                            </v-data-table>
                        </v-col>
                        <v-col cols="4" class="pl-5">
                            <v-card dark flat class="customCards text-center customGradientDarkBg d-flex flex-column align-center justify-center" height="100%">
                                <div class="tableDataGameTitle mb-10">Trading Game 2</div>
                                <div class="tableDataGameTitle">No. of Players</div>
                                <h2>211</h2>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <!-- CHART FOR REVENU -->



    </v-container>
    
</template>
<script>
    import chart from './inc/chart.vue'
    export default {
        name: 'DashBoard',
        components: {
            chart
        },
      data () {
        return {
            gameHeader: [
                {
                    text: 'Pos.',
                    align: 'start',
                    sortable: true,
                    value: 'position',
                },
                { text: 'Player', value: 'playername' },
                { text: 'Vol.', value: 'volume' },
                { text: 'Act.', value: 'action',align:'end' }
            ],
            tableData: [
                {
                    position: '1',
                    playername: 'CodeHarry',
                    volume: '$10',
                },
                {
                    position: '2',
                    playername: 'CodeHarry',
                    volume: '$10',
                },
                {
                    position: '3',
                    playername: 'CodeHarry',
                    volume: '$10',
                },
                {
                    position: '4',
                    playername: 'CodeHarry',
                    volume: '$10',
                },
                {
                    position: '5',
                    playername: 'CodeHarry',
                    volume: '$10',
                },
                {
                    position: '6',
                    playername: 'CodeHarry',
                    volume: '$10',
                },
            ],
        }
      },
    }
</script>
  
