<template>
    <v-card v-if="windowLoad == true">
        <v-skeleton-loader type="article"></v-skeleton-loader>
        <v-skeleton-loader type="article"></v-skeleton-loader>
        <v-skeleton-loader type="actions"></v-skeleton-loader>
    </v-card>
    <v-card v-else color="white" style="display:table;">
        <v-app-bar  dark color="dark" dense flat>
            <v-icon class="mr-2">mdi-gamepad-variant</v-icon> 
            <v-toolbar-title class="dialogBoxTitle">
                {{edit == true ? `Edit Game` : `New Game `}}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="white" text fab x-small @click="close()"><v-icon>mdi-close</v-icon></v-btn>
        </v-app-bar>
        <v-form ref="form" @submit.prevent="Save()">
            <v-card-text class="pt-5">
                <v-row>
                    <v-col md=4>
                        <v-text-field v-model="name" :rules="nameRule" label="Game Name" class="customField" color="black"></v-text-field>
                    </v-col>
                    <v-col md=4>
                        <v-text-field v-model="cost" :rules="costRule" label="Entrance Cost" class="customField" color="black" type="number" min="1"></v-text-field>
                    </v-col>
                    <v-col md=4>
                        <v-text-field v-model="sponsor" :rules="sponsorRule" label="Game Sponsor" class="customField" color="black"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col md=4>
                        <v-text-field v-model="start_at" :rules="startAtRule" label="Start Date" type="date" class="customField" color="black"></v-text-field>
                    </v-col>
                    <v-col md=4>
                        <v-text-field v-model="end_at" :rules="endAtRule" label="End Date" :min="start_at" type="date" class="customField" color="black"></v-text-field>
                    </v-col>
                    <v-col md=4>
                        <v-text-field v-model="entrance_deadline" :rules="entranceDeadlineRule" :min="start_at" :max="end_at"  label="Entrance Deadline" type="date" class="customField" color="black"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col md=4>
                        <v-select :items="organizationHolder" :rules="organizationRule" item-text="name" item-value="id" v-model="organization" label="Select Organization" class="customField" color="black"></v-select>
                    </v-col>
                    <v-col md=4>
                        <v-select :items="offerHolder" item-text="name" item-value="id" v-model="offer" label="Select Offer" class="customField" color="black"></v-select>
                    </v-col>
                    <v-col md=4>
                        <v-select :items="prizeHolder" item-text="name" :rules="prizeRule" item-value="id" v-model="prize" label="Select Prize" class="customField" color="black"></v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col md=3>
                        <v-text-field v-model="reserve_tickets" label="Reserve Ticket Count" :rules="reserveTicketRule" type="number" class="customField" color="black" append-icon="mdi-tickets" ></v-text-field>
                    </v-col>
                    <v-col md=3>
                        <v-text-field v-model="online_tickets" label="Online Ticket Count" :rules="onlineTicketRule" type="number" class="customField" color="black" append-icon="mdi-tickets" ></v-text-field>
                    </v-col>
                    <v-col md=3>
                        <v-text-field v-model="offline_tickets" label="Offline Ticket Count" :rules="offlineTicketRule" type="number" class="customField" color="black" append-icon="mdi-tickets" ></v-text-field>
                    </v-col>
                    <v-col md=3>
                        <v-text-field v-model="free_tickets" label="Free Ticket Count" :rules="freeTicketRule" type="number" class="customField" color="black" append-icon="mdi-tickets" ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col v-if="cover == '' || cover == null"  sm=12 md=12 cols=12 class="py-5 my-5">
                        <v-btn @click="triggeredEvent=''; coverType='feature'; MediaBox = true" color="black" block class="elevation-0" dark >Select Feature Image</v-btn>
                    </v-col>  
                    <v-col v-else sm=12 md=6 cols=6 class="py-5 my-5 mediaHolder">
                        <p class="selectedMediaP">Selected Media</p>
                        <v-img  :src="currentImage" class="selectedMedia" style="border:1px solid #ddd;" :lazy-src="currentImage" aspect-ratio="1" width="200">
                            <v-icon class="closeIcon" color="white" @click="removeImage">mdi-close</v-icon>
                            <v-icon class="replaceIcon" color="white" @click=" triggeredEvent='replace'; coverType='feature'; MediaBox = true">mdi-arrow-left-right</v-icon>
                        </v-img>
                    </v-col> 
                    <!-- OFFER MEDIA MANAGER START HERE.-->
                    <v-col v-if="offerCover == '' || offerCover == null"  sm=12 md=6 cols=6 class="py-5 my-5">
                        <v-btn @click="triggeredOfferEvent=''; coverType='offer'; MediaBox = true" color="black" block class="elevation-0" dark>Select prize Image</v-btn>
                    </v-col>  
                    <v-col v-else sm=12 md=6 cols=6 class="py-5 my-5 mediaHolder">
                        <p class="selectedMediaP">Selected Media</p>
                        <v-img  :src="offerImage" class="selectedMedia" style="border:1px solid #ddd;" :lazy-src="offerImage" aspect-ratio="1" width="200">
                            <v-icon class="closeIcon" color="white" @click="removeOfferImage">mdi-close</v-icon>
                            <v-icon class="replaceIcon" color="white" @click=" triggeredEvent='replace'; coverType='offer'; MediaBox = true">mdi-arrow-left-right</v-icon>
                        </v-img>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions class="text--center">
                <v-spacer></v-spacer>
                <v-switch v-model="dailyHere" :label="dailyHere == true ? 'Daily Prize': 'Not Daily Prize'" :value="false" color="black" class="mr-5"></v-switch>
                <v-switch v-model="statusHere" :label="statusHere == true ? 'Active': 'In Active'" :value="true" color="black"></v-switch>
                <v-btn color="black" :loading="isLoading" dark class="mx-5" type="submit">Save</v-btn>
            </v-card-actions>
        </v-form>
        <v-dialog v-model="MediaBox" width="950" style="min-height:800px;" transition="dialog-transition">
            <v-app-bar  dark color="dark" dense flat>
                <v-toolbar-title class="dialogBoxTitle">
                    Media Manager
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn color="white" text fab x-small @click="MediaBox = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-app-bar>
            <Media v-if="coverType == 'feature'" :triggeredEvent="triggeredEvent" :loaded="cover" :react="MediaBox"></Media>
            <Media v-if="coverType == 'offer'" :triggeredEvent="triggeredEvent" :loaded="offerCover" :react="MediaBox"></Media>
        </v-dialog>
    </v-card>  
</template>

<script>
    import {bus} from '../../main'
    import Config from '../../config'
    import Media from '../media/index.vue'
    export default {
        name:'GameBox',
        props:['id','edit'],
        components: { Media: Media},
        created(){
            window.addEventListener('keyup', event => {
                if(event.which === 27){
                    this.close();
                }
            });

            bus.$on('close',() =>  {
                this.MediaBox = false;
            });

            bus.$on('media',data =>  {
                if(this.coverType == 'feature'){
                    this.cover = data;
                    this.MediaBox = false;
                }
                if(this.coverType == 'offer'){
                    this.offerCover = data;
                    this.MediaBox = false;
                }
            });
        },
        data(){
            return {
                // Media Condition
                coverType:'',
                offerCover:'',
                offerImage:'',
                // Media Manager
                triggeredEvent:'',
                currentImage:'',
                MediaBox:false,
                cover:'',
                windowLoad:false,
                organizationHolder:[],
                offerHolder:[],
                prizeHolder:[],
                statusHere:true,
                isLoading:false,
                // Database Content
                name:'',
                start_at:'',
                end_at:'',
                entrance_deadline:'',
                cost:'1',
                sponsor:'',
                reserve_tickets:'',
                online_tickets:'',
                offline_tickets:'',
                free_tickets:'',
                organization:'',
                prize:'',
                offer:0,
                status:1,
                dailyHere:false,
                is_daily_prize:0,
                // Validation
                nameRule: [
                    v => v.length >= 3 || 'minimum Length is 3 Character'
                ],
                sponsorRule: [
                    v => v.length >= 3 || 'minimum Length is 3 Character'
                ],
                startAtRule: [
                    v => v.length >= 3 || 'Select Start Date'
                ],
                endAtRule: [
                    v => v.length >= 3 || 'Select End Date'
                ],
                entranceDeadlineRule: [
                    v => v.length >= 3 || 'Select Entrance Deadline'
                ],
                organizationRule: [
                    v => !!v || 'Select an Organization'
                ],
                //offerRule: [
               //     v => !!v || 'Select an Offer'
              //  ],
                prizeRule: [
                    v => !!v || 'Select Prize'
                ],
                costRule: [
                    v => (v > 0 && /[0-9-]+/.test(v)) || 'Enter valid cost'
                ],
                reserveTicketRule: [
                    v => (/[0-9-]+/.test(v)) || 'Enter minimum value 0 for Reserve Ticket'
                ],
                onlineTicketRule: [
                    v => (/[0-9-]+/.test(v)) || 'Enter minimum value 0 for Online Ticket'
                ],
                offlineTicketRule: [
                    v => (/[0-9-]+/.test(v)) || 'Enter minimum value 0 for Offline Ticket'
                ],
                freeTicketRule: [
                    v => (/[0-9-]+/.test(v)) || 'Enter minimum value 0 for Free Ticket'
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
            dailyHere(val){
                if(val == true){
                    this.is_daily_prize = 1;
                }else{
                    this.is_daily_prize = 0;
                }
            },
            checkandfetch(){ 
                //
            },
            cover(){
                this.showMedia();
            },
            offerCover(){
                this.showMedia();
            },

        },
        computed:{
            checkandfetch(){
                return this.fetchbyId(), this.fetechOrganization(), this.fetechOffer(), this.fetechPrize();
            },
        },
        methods:{
            removeImage(){
                this.cover = null;
            },
            removeOfferImage(){
                this.offerCover = null;
            },
            async showMedia(){
                if(this.cover !=null){
                    const Response = await this.$http.get(process.env.VUE_APP_API+'/media/id/'+this.cover);
                    this.currentImage = Config.mediaInit(Response.data);
                }
                if(this.offerCover !=null){
                    const Response = await this.$http.get(process.env.VUE_APP_API+'/media/id/'+this.offerCover);
                    this.offerImage = Config.mediaInit(Response.data);
                }
            },

            close(){
               this.edit == true ? '' : this.reset(); 
               bus.$emit('close',false);
            },
            reset(){
                this.name = "";
                this.start_at = "";
                this.end_at = "";
                this.entrance_deadline = "";
                this.cost = "";
                this.sponsor = "";
                this.reserve_tickets = "";
                this.online_tickets = "";
                this.offline_tickets = "";
                this.free_tickets = "";
                this.organization = "";
                this.prize = "";
                this.offer = 0;
                this.cover = "";
                this.offerCover = "";
            },
            Save(){
                if(this.$refs.form.validate()){
                    this.edit == true ? this.update() : this.create();
                }
            },
            async create(){
                try{
                    this.isLoading = true;
                    const Response = await this.$http.post(process.env.VUE_APP_API+'/game/create',{
                        name: this.name,
                        start_at: this.start_at,
                        end_at: this.end_at,
                        entrance_deadline: this.entrance_deadline,
                        cost: this.cost,
                        sponsor: this.sponsor,
                        reserve_tickets: this.reserve_tickets,
                        online_tickets: this.online_tickets,
                        offline_tickets: this.offline_tickets,
                        free_tickets: this.free_tickets,
                        organization: this.organization,
                        prize: this.prize,
                        offer: this.offer,
                        status:this.status,
                        media: this.cover,
                        offermedia: this.offerCover,
                        is_daily_prize:this.is_daily_prize
                    });
                    this.isLoading = false;
                    this.reset();
                    bus.$emit('response',{res: Response.data, type:'create', model:'game'});
                    this.close();
                }catch(error){
                    this.isLoading = false;
                    bus.$emit('error',error);
                }
            },
            async update(){
                try{
                    this.isLoading = true;
                    const Response = await this.$http.put(process.env.VUE_APP_API+'/game/update',{
                        id:this.id,
                        name: this.name,
                        start_at: this.start_at,
                        end_at: this.end_at,
                        entrance_deadline: this.entrance_deadline,
                        cost: this.cost,
                        sponsor: this.sponsor,
                        reserve_tickets: this.reserve_tickets,
                        online_tickets: this.online_tickets,
                        offline_tickets: this.offline_tickets,
                        free_tickets: this.free_tickets,
                        organization: this.organization,
                        prize: this.prize,
                        offer: this.offer,
                        status:this.status,
                        offermedia: this.offerCover,
                        media: this.cover,
                        is_daily_prize:this.is_daily_prize
                    });
                    this.isLoading = false;
                    bus.$emit('response',{res: Response.data, type:'update', model:'game'});
                    this.close();
                }catch(error){
                    this.isLoading = false;
                    bus.$emit('error',error);
                }
            },
            // Fetch 
            async fetchbyId(){
                if(this.edit == true){
                    //alert(this.id);
                    try{
                        this.windowLoad = true;
                        const Response = await this.$http.get(process.env.VUE_APP_API+'/game/id/'+this.id);
                        this.name= Response.data.name,
                        this.start_at= Response.data.start_at,
                        this.end_at= Response.data.end_at,
                        this.entrance_deadline= Response.data.entrance_deadline,
                        this.cost= Response.data.cost,
                        this.sponsor= Response.data.sponsor,
                        this.reserve_tickets = Response.data.reserve_tickets,
                        this.online_tickets= Response.data.online_tickets,
                        this.offline_tickets= Response.data.offline_tickets,
                        this.free_tickets= Response.data.free_tickets,
                        this.organization= Response.data.organization,
                        this.prize= Response.data.prize,
                        this.offer= Response.data.offer.id,
                        this.status = Response.data.status;
                        this.cover = Response.data.media;
                        this.offerCover = Response.data.offermedia;
                        this.statusHere = Response.data.status == 0 ? false : true
                        this.is_daily_prize = Response.data.is_daily_prize;
                        this.dailyHere = Response.data.is_daily_prize == 0 ? false : true
                        
                        this.windowLoad = false;
                    }catch(error){
                        this.windowLoad = false;
                        bus.$emit('error',error);
                    }
                }
            },


            // Fetching Prize
            async fetechPrize(){
                    try{
                        this.windowLoad = true;
                        const Response = await this.$http.get(process.env.VUE_APP_API+'/prize/active/records');
                        this.prizeHolder = Response.data;
                        this.windowLoad = false;

                    }catch(error){
                        this.windowLoad = false;
                        bus.$emit('error',error);
                    }
            },

            // Fetching Offer
            async fetechOffer(){
                    try{
                        this.windowLoad = true;
                        /* eslint-disable */
                        const Response = await this.$http.get(process.env.VUE_APP_API+'/offer/active/records');
                        let listData = Response.data;
                        listData.unshift({'name':'No Offer', 'id':0});
                        this.offerHolder = listData;
                        this.windowLoad = false;

                    }catch(error){
                        this.windowLoad = false;
                        bus.$emit('error',error);
                    }
            },

            // Fetching Organize
            async fetechOrganization(){
                    try{
                        this.windowLoad = true;
                        const Response = await this.$http.get(process.env.VUE_APP_API+'/organization/active/records');
                        this.organizationHolder = Response.data;
                        this.windowLoad = false;

                    }catch(error){
                        this.windowLoad = false;
                        bus.$emit('error',error);
                    }
            }
        }
    }
</script>

<style>
.selectedMediaP{
    font-size:15px;
    padding-bottom:0px;
    font-weight: bold;
}
.selectedMedia:hover .replaceIcon {
    opacity:1;
    transition:all ease 0.5s;
}
.selectedMedia:hover .closeIcon {
    opacity:1;
    transition:all ease 0.5s;
}
.replaceIcon{
    opacity: 0;
    padding: 9px;
    font-size: 15px !important;
    background: rgba(00,00,00,0.7);
    position: absolute !important;
    left: auto;
    right: 5px;
    top: 41px;
    transition:all ease 0.5s;
}
.replaceIcon:hover{
    background:rgba(255,255,255,0.9);
    color:#000 !important;
}
.closeIcon{
    opacity: 0;
    padding: 9px;
    font-size: 15px !important;
    background: rgba(00,00,00,0.7);
    position: absolute !important;
    left: auto;
    right: 5px;
    top: 5px;
    transition:all ease 0.5s;
}
.closeIcon:hover{
    background:rgba(199, 1, 1, 0.9);
}
.mediaHolder{
    background:rgba(00,00,00,0.1);
    border:1px solid #ddd;
}
</style>