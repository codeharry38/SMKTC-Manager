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
                {{edit == true ? `Player Details` : `New Player`}}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="white" text fab x-small @click="close()"><v-icon>mdi-close</v-icon></v-btn>
        </v-app-bar>
        <v-tabs color="black" right>
            <v-tab>Player Details</v-tab> <v-tab>Current palying</v-tab> <v-tab>other Played</v-tab>
            <v-tab-item>
                <v-form ref="form" @submit.prevent="Save()">
                    <v-card-text class="pt-5">
                        <v-row>
                            <v-col md=12>
                                <v-text-field v-model="name" :rules="nameRule" label="Name" class="customField" color="black"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col md=6>
                                <v-text-field v-model="email" :rules="emailRule" label="Email" class="customField" color="black" type="email"></v-text-field>
                            </v-col>
                            <v-col md=6>
                                <v-text-field v-model="phone" :rules="phoneRule" label="Phone" class="customField" color="black" type="tel"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col md=6>
                                <v-text-field v-model="username" :rules="usernameRule" label="Username" class="customField" color="black"></v-text-field>
                            </v-col>
                            <v-col md=6>
                                <v-text-field v-if="edit==true" v-model="password" label="Password" class="customField" color="black"></v-text-field>
                                <v-text-field v-else v-model="password" :rules="passwordRule" label="Password" class="customField" color="black"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col md=12>
                                <v-textarea v-model="address" label="Address" class="customField" color="black" hide-details required></v-textarea>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions class="text--center">
                        <v-spacer></v-spacer>
                        <v-switch v-model="statusHere" :label="statusHere == true ? 'Active': 'In Active'" :value="true" color="black"></v-switch>
                        <v-btn color="black" :loading="isLoading" dark class="mx-5" type="submit">Save</v-btn>
                    </v-card-actions>
                </v-form>
        </v-tab-item>
        <v-tab-item>
            <activePlay :id="id"></activePlay>
        </v-tab-item>
        <v-tab-item>
            <inActivePlay :id="id"></inActivePlay>
        </v-tab-item>
    </v-tabs>







        
    </v-card>  
</template>

<script>
    import {bus} from '../../main'
    import activePlay from './currentGames.vue'
    import inActivePlay from './otherGames.vue'
    export default {
        name:'PlayerIndex',
        props:['id','edit'],
        components:{activePlay, inActivePlay},
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
                email:'',
                phone:'',
                username:'',
                password:'',
                address:'',
                status:1,
                statusHere:true,
                isLoading:false,
                // Validation
                nameRule: [
                    v => v.length >= 3 || 'minimum Length is 3 Character'
                ],
                emailRule: [
                    v => (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(v)) || 'Must be a valid e-mail.'
                ],
                phoneRule: [
                    v => (v?.length > 9 && /[0-9-]+/.test(v)) || 'Phone number needs to be at least 9 digits.'
                ],
                usernameRule: [
                    v => v.length >= 5 || 'minimum Length is 5 Character'
                ],
                passwordRule: [
                    v => v.length >= 8 || 'minimum Length is 8 Character'
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
                        const Response = await this.$http.get(process.env.VUE_APP_API+'/player/id/'+this.id);
                        this.name = Response.data.name;
                        this.email = Response.data.email;
                        this.phone = Response.data.phone;
                        this.username = Response.data.username;
                        this.status = Response.data.status;
                        this.statusHere = Response.data.status == 0 ? false : true;
                        this.address = Response.data.address;
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
                    const Response = await this.$http.post(process.env.VUE_APP_API+'/player/create',{
                        name: this.name,
                        company: this.company,
                        email: this.email,
                        phone: this.phone,
                        username: this.username,
                        password: this.password,
                        address: this.address,
                        status:this.status
                    });
                    this.isLoading = false;
                    console.log(Response.data)
                    this.reset();
                    bus.$emit('response',{res: Response.data, type:'create', model:'player'});
                    this.close();
                    
                }catch(error){
                    this.isLoading = false;
                    bus.$emit('error',error);
                }
            },
            async update(){
                try{
                    this.isLoading = true;
                    const Response = await this.$http.put(process.env.VUE_APP_API+'/player/update',{
                        id:this.id,
                        name: this.name,
                        company: this.company,
                        email: this.email,
                        phone: this.phone,
                        username: this.username,
                        password: this.password,
                        address: this.address,
                        status:this.status
                    });
                    this.isLoading = false;
                    bus.$emit('response',{res: Response.data, type:'update', model:'player'});
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