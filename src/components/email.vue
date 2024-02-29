<template>
    <v-card v-if="windowLoad == true">
        <v-skeleton-loader type="article"></v-skeleton-loader>
        <v-skeleton-loader type="article"></v-skeleton-loader>
        <v-skeleton-loader type="actions"></v-skeleton-loader>
    </v-card>
    <v-card v-else>
        <v-app-bar  dark color="dark" dense flat>
            <v-icon class="mr-2">mdi-envelop</v-icon> 
            <v-toolbar-title class="dialogBoxTitle">
                Send Invoice
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="white" text fab x-small @click="close()"><v-icon>mdi-close</v-icon></v-btn>
        </v-app-bar>
        <form @submit.prevent="send()">
            <v-card-text class="pt-5">
                <v-row>
                    <v-col md=12>
                        <v-text-field v-model="email" label="Email" class="customField" color="black" hide-details required></v-text-field>
                    </v-col>
                    <v-col md=12>
                        <v-text-field v-model="subject" label="Subject" class="customField" color="black" hide-details required></v-text-field>
                    </v-col>
                    <v-col md=12>
                        <v-textarea v-model="message" label="Message" class="customField" color="black" hide-details required></v-textarea>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions class="text--center">
                <v-spacer></v-spacer>
                <v-btn color="black" :loading="isLoading" dark class="mx-5" type="submit">Send</v-btn>
            </v-card-actions>
        </form>
    </v-card>  
</template>

<script>
    import {bus} from '../main'
    export default {
        name:'emailBox',
        props:['id'],
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
                email:'',
                subject:'',
                message:'',
                isLoading:false,
            }
        },
        watch:{
        },
        computed:{
        },
        methods:{
            close(){
               this.edit == true ? '' : this.reset(); 
               bus.$emit('close',false);
            },
            reset(){
                this.email = '';
                this.subject = '';
                this.message = '';
            },
            async send(){
                try{
                    this.isLoading = true;
                    const Response = await this.$http.post(process.env.VUE_APP_API+'/email/invoice',{
                        game:this.id,
                        email: this.email,
                        subject: this.subject,
                        message:this.message
                    });
                    this.isLoading = false;
                    this.reset();
                    bus.$emit('response',{res: Response.data, type:'create', model:'email'});
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