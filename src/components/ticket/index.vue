<template>
    <v-card v-if="windowLoad == true">
        <v-skeleton-loader type="article"></v-skeleton-loader>
        <v-skeleton-loader type="article"></v-skeleton-loader>
        <v-skeleton-loader type="actions"></v-skeleton-loader>
    </v-card>
    <v-card v-else>
        <v-app-bar  dark color="dark" dense flat>
            <v-icon class="mr-2">mdi-ticket</v-icon> 
            <v-toolbar-title class="dialogBoxTitle">
                Edit Ticket
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="white" text fab x-small @click="close()"><v-icon>mdi-close</v-icon></v-btn>
        </v-app-bar>
        <v-form ref="form" @submit.prevent="Save()">
            <v-card-text class="pt-5">
                <v-row>
                    <v-col md=12>
                        <v-text-field label="Access Code" id="id" v-model="Ticketdata.access_code" disabled hide-details></v-text-field>
                    </v-col>
                    <v-col md=12>
                        <v-text-field label="Ticket Number" id="id" v-model="Ticketdata.ticket_number" disabled hide-details></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col md=12>
                        <v-autocomplete :items="playerHolder" :rules="ticketAssignRule" v-model="player" label="Ticket Assign to" class="customField" color="black" item-text="name" item-value="id">
                            <template v-slot:item="data">
                                <template>
                                <v-list-item-avatar>
                                    <v-avatar color="#333" size="36" dark><span class="text-white" style="text-transform:uppercase;"><b>{{data.item.name[0]}}</b></span></v-avatar>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                    <v-list-item-subtitle v-html="data.item.email"></v-list-item-subtitle>
                                </v-list-item-content>
                                </template>
                            </template>
                        </v-autocomplete>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions class="text--center">
                <v-spacer></v-spacer>
                <v-switch v-model="statusHere" :label="statusHere == true ? 'Paid': 'Not Paid'" :value="true" color="black"></v-switch>
                <v-btn color="black" :loading="isLoading" dark class="mx-5" type="submit">Save</v-btn>
            </v-card-actions>
        </v-form>
    </v-card>  
</template>

<script>
    import {bus} from '../../main'
    export default {
        name:'TicketBox',
        props:['id','edit'],
        created(){
            window.addEventListener('keyup', event => {
                if(event.which === 27){
                    this.close();
                }
            })
        },
        data(){
            return {
                windowLoad:true,
                status:0,
                statusHere:true,
                isLoading:false,
                playerHolder:[],
                // Database Content
                Ticketdata:{
                    access_code:'',
                    ticket_number:''
                },
                player:'',
                ticketAssignRule: [
                    v => !!v || 'Select player'
                ],
            }
        },
        watch:{
            statusHere(val){
                if(val == true){
                    this.status = 1;
                }else{
                    this.status = 0;
                }
            },
            checkandfetch(){ 
                //
            }
        },
        computed:{
            checkandfetch(){
                return this.fetchbyId(), this.fetchPlayers();
            },
        },
        methods:{
            close(){
               this.edit == true ? '' : this.reset(); 
               bus.$emit('close',false);
            },
            reset(){
                this.name = '';
            },
            async fetchPlayers(){
                    try{
                        this.windowLoad = true;
                        const Response = await this.$http.get(process.env.VUE_APP_API+'/player/active');
                        this.playerHolder = Response.data;
                        this.windowLoad = false;
                    }catch(error){
                        this.windowLoad = false;
                        bus.$emit('error',error);
                    }
            },
            async fetchbyId(){
                try{
                    this.windowLoad = true;
                    const Response = await this.$http.get(process.env.VUE_APP_API+'/ticket/id/'+this.id);
                    this.Ticketdata = Response.data;
                    this.player = Response.data.assign_to;
                    this.status = Response.data.is_paid;
                    this.statusHere = Response.data.is_paid == 0 ? false : true
                    this.windowLoad = false;
                }catch(error){
                    this.windowLoad = false;
                    bus.$emit('error',error);
                }
            },
            async Save(){
                try{
                    if(this.$refs.form.validate()){
                        this.isLoading = true;
                        const Response = await this.$http.put(process.env.VUE_APP_API+'/ticket/update',{
                            id:this.id,
                            assign_to: this.player,
                            is_paid:this.status
                        });
                        this.isLoading = false;
                        this.reset();
                        bus.$emit('response',{res: Response.data, type:'update', model:'ticket'});
                        this.close();
                    }
                }catch(error){
                    this.isLoading = false;
                    bus.$emit('error',error);
                }
            },
        }
    }
</script>

<style>
.text-white{
    color:#fff !important;
}
</style>