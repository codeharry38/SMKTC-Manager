<template>
    <v-card v-if="windowLoad == true">
        <v-skeleton-loader type="article"></v-skeleton-loader>
        <v-skeleton-loader type="article"></v-skeleton-loader>
        <v-skeleton-loader type="actions"></v-skeleton-loader>
    </v-card>
    <v-card v-else>
        <v-app-bar  dark color="dark" dense flat>
            <v-icon class="mr-2">mdi-gamepad-variant</v-icon> 
            <v-toolbar-title class="dialogBoxTitle">
                {{edit == true ? `Edit Banner` : `New Banner `}}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="white" text fab x-small @click="close()"><v-icon>mdi-close</v-icon></v-btn>
        </v-app-bar>
        <v-form ref="form" @submit.prevent="Save()">
            <v-card-text class="pt-5">
                <v-row>
                    <v-col md=12>
                        <v-text-field v-model="name" :rules="nameRule" label="Banner Name" class="customField" color="black"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col v-if="cover == '' || cover == null"  sm=12 md=12 cols=12 class="py-5 my-5">
                        <v-btn @click="triggeredEvent=''; MediaBox = true" :color='is_not_valid ? `red` : `black`' block class='elevation-0' dark>Select Feature Image</v-btn>
                        <div v-if="is_not_valid" class="hiddenMessage red--text">Banner Image is required.</div>
                    </v-col>  
                    <v-col v-else sm=12 md=12 cols=12 class="py-5 my-5 mediaHolder">
                        <p class="selectedMediaP">Selected Media</p>
                        <v-img  :src="currentImage" class="selectedMedia" style="border:1px solid #ddd;" :lazy-src="currentImage" aspect-ratio="1" width="200">
                            <v-icon class="closeIcon" color="white" @click="removeImage">mdi-close</v-icon>
                            <v-icon class="replaceIcon" color="white" @click=" triggeredEvent='replace'; MediaBox = true">mdi-arrow-left-right</v-icon>
                        </v-img>
                    </v-col> 
                </v-row>
            </v-card-text>
            <v-card-actions class="text--center">
                <v-spacer></v-spacer>
                <v-switch v-model="miniHere" :label="miniHere == true ? 'Mini': 'Main'" :value="false" color="black"></v-switch>
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
            <Media :triggeredEvent="triggeredEvent" :loaded="cover" :react="MediaBox"></Media>
        </v-dialog>
    </v-card>  
</template> 

<script>
    import {bus} from '../../main'
    import Config from '../../config'
    import Media from '../media/index.vue'
    export default {
        name:'BannerBox',
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
            this.cover = data;
            this.MediaBox = false;
            });
        },
        data(){
            return {
                // Media Manager
                triggeredEvent:'',
                currentImage:'',
                MediaBox:false,
                cover:'',
                windowLoad:false,
                statusHere:true,
                miniHere:false,
                isLoading:false,
                
                // Database Content
                name:'',
                status:1,
                mini:0,
                // Validation
                nameRule: [
                    v => v.length >= 3 || 'minimum Length is 3 Character'
                ],
                is_not_valid:false,
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
            miniHere(val){
                if(val == true){
                    this.mini = 1;
                }else{
                    this.mini = 0;
                }
            },
            checkandfetch(){ 
                //
            },
            cover(){
                this.showMedia();
            }
        },
        computed:{
            checkandfetch(){
                return this.fetchbyId();
            },
            
        },
        methods:{
            is_image_selected(){
                if(this.cover == ""){
                    this.is_not_valid = true;
                }else{
                    this.is_not_valid = false;
                }
            },
            removeImage(){
                this.cover = null;
            },
            async showMedia(){
                if(this.cover !=null){
                    const Response = await this.$http.get(process.env.VUE_APP_API+'/media/id/'+this.cover);
                    this.currentImage = Config.mediaInit(Response.data);
                }
            },

            close(){
               this.edit == true ? '' : this.reset(); 
               bus.$emit('close',false);
            },
            reset(){
                this.banner = "";
                this.cover = "";
            },
            Save(){
                this.is_image_selected();
                if(this.$refs.form.validate() && this.is_not_valid == false){
                    this.edit == true ? this.update() : this.create();
                }
            },
            async create(){
                try{
                    this.isLoading = true;
                    const Response = await this.$http.post(process.env.VUE_APP_API+'/banner/create',{
                        name: this.name,
                        status:this.status,
                        mini:this.mini,
                        media: this.cover,
                    });
                    this.isLoading = false;
                    this.reset();
                    bus.$emit('response',{res: Response.data, type:'create', model:'banner'});
                    this.close();
                }catch(error){
                    this.isLoading = false;
                    bus.$emit('error',error);
                }
            },
            async update(){
                try{
                    this.isLoading = true;
                    const Response = await this.$http.put(process.env.VUE_APP_API+'/banner/update',{
                        id:this.id,
                        name: this.name,
                        status:this.status,
                        mini:this.mini,
                        media: this.cover,
                    });
                    this.isLoading = false;
                    bus.$emit('response',{res: Response.data, type:'update', model:'banner'});
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
                        const Response = await this.$http.get(process.env.VUE_APP_API+'/banner/id/'+this.id);
                        this.name= Response.data.name,
                        this.status = Response.data.status;
                        this.mini = Response.data.mini;
                        this.cover = Response.data.media;
                        this.statusHere = Response.data.status == 0 ? false : true,
                        this.miniHere = Response.data.mini == 0 ? false : true,
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
                        const Response = await this.$http.get(process.env.VUE_APP_API+'/offer/active/records');
                        this.offerHolder = Response.data;
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