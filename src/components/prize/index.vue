<template>
    <v-card v-if="windowLoad == true">
        <v-skeleton-loader type="article"></v-skeleton-loader>
        <v-skeleton-loader type="article"></v-skeleton-loader>
        <v-skeleton-loader type="actions"></v-skeleton-loader>
    </v-card>
    <v-card v-else>
        <v-app-bar  dark color="dark" dense flat>
            <v-icon class="mr-2">mdi-account</v-icon> 
            <v-toolbar-title class="dialogBoxTitle">
                New Prize
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="white" text fab x-small @click="close()"><v-icon>mdi-close</v-icon></v-btn>
        </v-app-bar>
        <v-form ref="form" @submit.prevent="Save()">
            <v-card-text class="pt-5">
                <v-row>
                    <v-col md=12>
                        <v-text-field v-model="name" :rules="nameRule" label="Name" class="customField" color="black"></v-text-field>
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
        name:'PrizeIndex',
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
            }
        },
        methods:{
            close(){
               this.edit == true ? '' : this.reset(); 
               bus.$emit('close',false);
            },
            reset(){
                this.name = '';
            },
            async Save(){
                try{
                    if(this.$refs.form.validate()){
                    this.isLoading = true;
                    const Response = await this.$http.post(process.env.VUE_APP_API+'/prize/create',{
                        name: this.name,
                        status:this.status
                    });
                    this.isLoading = false;
                    console.log(Response.data)
                    this.reset();
                    bus.$emit('response',{res: Response.data, type:'create', model:'prize'});
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

</style>