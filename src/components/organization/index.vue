<template>
    <v-card v-if="windowLoad == true">
        <v-skeleton-loader type="article"></v-skeleton-loader>
        <v-skeleton-loader type="article"></v-skeleton-loader>
        <v-skeleton-loader type="actions"></v-skeleton-loader>
    </v-card>
    <v-card v-else>
        <v-app-bar  dark color="dark" dense flat>
            <v-icon class="mr-2">mdi-city</v-icon> 
            <v-toolbar-title class="dialogBoxTitle">
                {{edit == true ? `Edit Organization` : `New Organization`}}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="white" text fab x-small @click="close()"><v-icon>mdi-close</v-icon></v-btn>
        </v-app-bar>
        <v-form ref="form" @submit.prevent="Save()">
            <v-card-text class="pt-5">
                <v-row>
                    <v-col md=12>
                        <v-text-field v-model="name" :rules="nameRule" label="Name" class="customField" color="black" required></v-text-field>
                    </v-col>
                    <v-col md=12>
                        <v-text-field v-model="code" :rules="nameRule" label="Code" class="customField" color="black" required></v-text-field>
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
        name:'OrganizationBox',
        props:['id','edit'],
        created(){
            window.addEventListener('keyup', event => {
                if(event.which === 27){
                    this.close();
                }
                if(event.which === 13){
                    this.Save();
                }
            })
        },
        data(){
            return {
                windowLoad:false,
                name:'',
                code:'',
                status:1,
                statusHere:true,
                isLoading:false,
                // Validation
                nameRule: [
                    v => v.length >= 3 || 'minimum Length is 3 Character'
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
                this.code = '';
            },
            async fetchbyId(){
                if(this.edit == true){
                    //alert(this.id);
                    try{
                        this.windowLoad = true;
                        const Response = await this.$http.get(process.env.VUE_APP_API+'/organization/id/'+this.id);
                        this.name = Response.data.name;
                        this.code = Response.data.code;
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
                    const Response = await this.$http.post(process.env.VUE_APP_API+'/organization/create',{
                        name: this.name,
                        code: this.code,
                        status:this.status
                    });
                    this.isLoading = false;
                    this.reset();
                    bus.$emit('response',{res: Response.data, type:'create', model:'organization'});
                    this.close();
                }catch(error){
                    this.isLoading = false;
                    bus.$emit('error',error);
                }
            },
            async update(){
                try{
                    this.isLoading = true;
                    const Response = await this.$http.put(process.env.VUE_APP_API+'/organization/update',{
                        id:this.id,
                        name: this.name,
                        code: this.code,
                        status:this.status
                    });
                    this.isLoading = false;
                    bus.$emit('response',{res: Response.data, type:'update', model:'organization'});
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