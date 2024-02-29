<template>
    <div>
        <v-card class="elevation-0 pa-0 ma-0 py-5" v-if="windowLoading == false">
            <v-row class="ma-0" align="center" justify="center" v-if="records.length > 0">
                <v-col lg="6" v-for="(record,i) in records" :key="i" class="mb-5">
                    <v-card dark class="elevation-0 pa-5">
                        <span :class="record.status == 1 ? `Gamestatus greenBox` : `Gamestatus redBox`" >{{ record.status == 1 ? 'Playing' : 'Not started by player' }}</span>
                        <v-card-actions class="text--center">
                            {{record.game.name}}
                            <v-spacer></v-spacer>
                            {{record.ticket.access_code}} - {{record.ticket.ticket_number}}
                        </v-card-actions>
                        <v-card-actions class="text--center">
                            <v-chip class="mt-5 customChipClaim" x-small>Start At: {{record.start_at}}</v-chip>
                            <v-spacer></v-spacer>
                            <v-chip class="mt-5 customChipRed ml-3" x-small>Last Entrance: {{record.entrance_deadline}}</v-chip>
                            <v-spacer></v-spacer>
                            <v-chip class="mt-5 customChipClaim ml-3" x-small>End At: {{record.end_at}}</v-chip>
                        </v-card-actions>
                        <v-card class="py-2 px-5 valueData mt-6" color="grey darken-4" dark>
                            <v-card-actions class="text--center">
                                <h2>Total Value:</h2>
                                <v-spacer></v-spacer>
                                <h2>$ {{ (record.total).toFixed(2) }}</h2>
                        </v-card-actions>
                        </v-card>
                    </v-card>
                </v-col>
            </v-row>
            <v-row class="ma-0" align="center" justify="center" v-else>
                <v-col lg="6" class="mb-5">
                    <v-card dark class="elevation-0 pa-5 py-10">
                        <h2 class="notice">No Record Found!</h2>
                    </v-card>
                </v-col>
            </v-row>
        </v-card>
        <v-card class="elevation-0 pa-0 ma-0 py-5" v-else>
            <v-row class="ma-0" align="center" justify="center">
                <v-col lg="6" class="py-15">
                    <v-progress-linear color="black" indeterminate rounded height="6"></v-progress-linear>
                </v-col>
            </v-row>
        </v-card>
    </div>
</template>

<script>
export default {
    name:'current-games',
    props:['id'],
    data(){
        return {
            //Records
            records:[],

            // loading Var
            windowLoading: true
        }
    },
    watch:{
        checkandfetch(){ 
            
        }
    },
    computed:{
        checkandfetch(){
            return this.fetchDetails();
        },
    },
    methods:{
        async fetchDetails(){
            try{
                this.windowLoading = true;
                const response = await this.$http.get(process.env.VUE_APP_API+'/player/gameplay/active/'+this.id);
                this.records = response.data;
                this.windowLoading = false;
            }catch(error){
                alert(error);
                this.windowLoading = false;
            }
        }
    }
}
</script>

<style>
.customChipRed
{
  background: #9c0041 !important;
  color:#fff !important;
  border-radius: 8px !important;
  font-size: 10px !important;
  height: 16px !important;
  padding: 14px !important;
}

.customChipClaim
{
  background: #ffffff !important;
  color:#222 !important;
  border-radius: 8px !important;
  font-size: 10px !important;
  height: 16px !important;
  padding: 14px !important;
}

.valueData{
    border-radius:15px !important;
    box-shadow: inset 0px 0px 25px #000000 !important;
    border: 1px solid !important;
}
.valueData h2{
    font-weight: 100 !important;
    font-size:20px !important;
}
.notice{
    color:#e20101 !important;
    font-size:20px !important;
    font-weight:100 !important;
    text-align: center;
}
.Gamestatus{
    position: absolute;
    left: auto !important;
    right: 30px !important;
    top: -14px !important;
    color: #fff !important;
    font-size: 12px !important;
    font-weight: bold !important;
    padding: 5px 15px !important;
    border-radius: 5px !important;
}
.redBox{
    background:red !important;
}
.greenBox{
    background: rgb(0, 167, 0) !important;
}

</style>