<template>
    <v-container class="pt-3" fluid>
        <v-row class="pa-0 ">
            <v-col cols="6" class="pa-0">
                <v-card flat class="text-center d-flex flex-column align-center justify-center tile" color="transparent" height="100%">
                    <v-img src="/images/loginpage.jpg" max-height="100vh" class="align-center justify-center">
                        <p class="white--text logoHeading">Stockmkt Challenge</p>
                    </v-img>
                </v-card>
            </v-col>
            <v-col cols="6" class="pa-0">
                <v-card flat class="text-center d-flex flex-column align-center justify-center tile" color="white" height="100vh">
                    <p>Enter your registered email</p>
                    <v-form ref="form" @submit.prevent="send">
                        <v-row class="pa-5 text-center" dense>
                            <v-col lg=7 cols=12 class="ma-auto py-0 mb-2">
                                <v-text-field v-model="email" label="Email" :rules="emailRule" prepend-inner-icon="mdi-account"  class="customField" color="black" background-color="white"></v-text-field>
                            </v-col>
                            <v-col lg=7 cols=12 class="ma-auto py-0">
                                <v-btn color="black" block class="elevation-0 white--text" :loading="isLoading" type="submit">Send Link</v-btn>
                            </v-col>
                            <v-col lg=7 cols=12 class="ma-auto mt-5">
                                <div>
                                    <p class="text-center">
                                        <router-link :to="{name:'signin'}" class="SidebarLink pr-3 mx-auto">Want to Login?</router-link>
                                    </p>
                                </div>
                            </v-col>
                        </v-row>
                    </v-form>  
                </v-card>
            </v-col>
        </v-row>
        <!-- Notifications -->
        <v-snackbar v-model="notificationBar" :timeout="10000" top center :color="notificationColor" multi-line class="mt-2 mr-8" :vertical="true"> {{ notificationText }}
            <template v-slot:action="{ attrs }">
                <v-btn color="white" text v-bind="attrs" @click="notificationBar = false">Close</v-btn>
            </template>
        </v-snackbar>
    </v-container>
  </template>
  
<script>
    export default {
        name: 'forgot-password',
        mounted(){
            document.title = 'StockMKT Challenge - Forgot Password?'
        },
        data () {
            return {
                email:'',
                // Other useful objects
                isLoading:false,
                //Notifications
                notificationBar:false,
                notificationColor:'black',
                notificationText:'',
                //Validation
                emailRule: [
                    /* eslint-disable */
                    v => (/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm.test(v)) || 'Must be a valid e-mail.'
                ],
            }
        },
        methods:{
            async send(){
                try{
                    if(this.$refs.form.validate()){
                        this.isLoading =  true;
                        const response = await this.$http.post(process.env.VUE_APP_API+'/reset/password',{
                            email:this.email
                        });
                        this.action(response.data);
                        this.isLoading = false;
                        if(response.data.action == true){
                            setTimeout( () => this.$router.push({ name: 'signin' }), 3000);
                        }
                    }
                }catch(error){
                    this.isLoading =  false;
                    this.action(error);
                }
            },
            action(e){
                if(e.action == true){
                    this.notificationColor = 'black';
                    this.notificationBar = true;
                    this.notificationText = e.message;
                }else{
                    this.notificationColor = 'red';
                    this.notificationBar = true;
                    this.notificationText = e.message;
                }
            }
        }
    } 
</script>
  
  <style>
  .text-center{
    text-align:center !important;
  }
  .SidebarLink{
    color:#000 !important;
    text-decoration: none !important;
  }
  
  </style>