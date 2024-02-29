<template>
    <v-card v-if="windowLoad == true">
        <v-skeleton-loader type="article"></v-skeleton-loader>
        <v-skeleton-loader type="article"></v-skeleton-loader>
        <v-skeleton-loader type="actions"></v-skeleton-loader>
    </v-card>
    <v-card v-else>
        <v-app-bar  dark color="dark" dense flat>
            <v-icon class="mr-2">mdi-octagram</v-icon> 
            <v-toolbar-title class="dialogBoxTitle">
                {{edit == true ? `Edit Offer` : `New Offer`}}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="white" text fab x-small @click="close()"><v-icon>mdi-close</v-icon></v-btn>
        </v-app-bar>
        <v-form ref="form" @submit.prevent="Save()">
            <v-card-text class="pt-5">
                <v-row>
                    <v-col md=12>
                        <v-text-field v-model="name" :rules="nameRule" label="Offer Name" class="customField" color="black"></v-text-field>
                    </v-col>
                    <v-col md=12>
                        <v-text-field v-model="offercode" :rules="offerCodeRule" label="Offer Code" class="customField" color="black"></v-text-field>
                    </v-col>
                    <v-col md=12>
                        <v-text-field v-model="paidticket" :rules="paidTicketRule" label="Buy Tickets" class="customField" color="black" type="number" min="1"></v-text-field>
                    </v-col>
                    <v-col md=12>
                        <v-text-field v-model="freeticket" :rules="freeTicketRule" label="Free Tickets" class="customField" color="black" type="number" min="1"></v-text-field>
                    </v-col>
                    <v-col md=12>
                        <v-text-field v-model="start_at" :rules="startAtRule" label="Start" type="date" class="customField" color="black"></v-text-field>
                    </v-col>
                    <v-col md=12>
                        <v-text-field v-model="end_at" :rules="EndAtRule" label="End" type="date" class="customField" color="black"></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions class="text--center">
                <v-spacer></v-spacer>
                <v-switch v-model="statusHere" :label="statusHere == true ? 'Active': 'In Active'" :value="true" color="black"></v-switch>
                <v-btn color="black" :loading="isLoading" dark class="mx-5" type="submit">Save</v-btn>
            </v-card-actions>
        </v-form>
    </v-card>  
</template>

<script>
    import {bus} from '../../main'
    export default {
        name:'OfferBox',
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
                windowLoad:false,
                name:'',
                offercode:'',
                paidticket:'',
                freeticket:'',
                start_at:'',
                end_at:'',
                status:1,
                statusHere:true,
                isLoading:false,
                // Validation
                nameRule: [
                    v => v.length >= 3 || 'minimum Length is 3 Character'
                ],
                offerCodeRule: [
                    v => v.length >= 3 || 'minimum Length is 3 Character'
                ],
                paidTicketRule: [
                    v => (v > 0 && /[0-9-]+/.test(v)) || 'Enter valid number of payable tickets'
                ],
                freeTicketRule: [
                v => (v > 0 && /[0-9-]+/.test(v)) || 'Enter valid number of free tickets'
                ],
                startAtRule: [
                v => v.length >= 3 || 'Select Start Date'
                ],
                EndAtRule: [
                v => v.length >= 3 || 'Select End Date'
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
                return this.fetchbyId();
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
            async fetchbyId(){
                if(this.edit == true){
                    //alert(this.id);
                    try{
                        this.windowLoad = true;
                        const Response = await this.$http.get(process.env.VUE_APP_API+'/offer/id/'+this.id);
                        this.name = Response.data.name;
                        this.offercode = Response.data.offercode;
                        this.paidticket = Response.data.paidticket;
                        this.freeticket = Response.data.freeticket;
                        this.start_at = Response.data.start_at;
                        this.end_at = Response.data.end_at;
                        this.status = Response.data.status;
                        this.statusHere = Response.data.status == 0 ? false : true
                        this.windowLoad = false;
                    }catch(error){
                        this.windowLoad = false;
                        bus.$emit('error',error);
                    }
                }
            },
            Save(){
                if(this.$refs.form.validate()){
                    this.edit == true ? this.update() : this.create();
                }
            },
            async create(){
                try{
                    this.isLoading = true;
                    const Response = await this.$http.post(process.env.VUE_APP_API+'/offer/create',{
                        name:this.name,
                        offercode:this.offercode,
                        paidticket:this.paidticket,
                        freeticket:this.freeticket,
                        start_at:this.start_at,
                        end_at:this.end_at,
                        status:this.status
                    });
                    this.isLoading = false;
                    this.reset();
                    bus.$emit('response',{res: Response.data, type:'create', model:'offer'});
                    this.close();
                }catch(error){
                    this.isLoading = false;
                    bus.$emit('error',error);
                }
            },
            async update(){
                try{
                    this.isLoading = true;
                    const Response = await this.$http.put(process.env.VUE_APP_API+'/offer/update',{
                        id:this.id,
                        name:this.name,
                        offercode:this.offercode,
                        paidticket:this.paidticket,
                        freeticket:this.freeticket,
                        start_at:this.start_at,
                        end_at:this.end_at,
                        status:this.status
                    });
                    this.isLoading = false;
                    bus.$emit('response',{res: Response.data, type:'update', model:'offer'});
                    this.close();
                }catch(error){
                    this.isLoading = false;
                    bus.$emit('error',error);
                }
            }
        }
    }
</script>

<style>

</style>