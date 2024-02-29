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
                    <p>Set new password.</p>
                    <v-form @submit.prevent="updatePassword">
                        <v-row class="pa-5 text-center" dense>
                            <v-col lg=7 cols=12 class="ma-auto py-0">
                                <v-text-field v-model="password" required type="password" label="Password" prepend-inner-icon="mdi-key" class="customField" color="black" background-color="white"></v-text-field>
                            </v-col>
                            <v-col lg=7 cols=12 class="ma-auto py-0">
                                <v-btn color="black" block class="elevation-0 white--text" type="submit" :loading="isLoading">Update</v-btn>
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
      name: 'update-password',
      data () {
        return {
            password:'',
            // Other useful objects
            isLoading:false,
            //Notifications
            notificationBar:false,
            notificationColor:'black',
            notificationText:''
        }
      },
      mounted(){
        document.title = 'StockMKT Challenge - Reset Passowrd'
      },
      methods:{
        async updatePassword(){
            try{
                this.isLoading = true;
                const response = await this.$http.post(process.env.VUE_APP_API+'/update/password?email='+this.$route.query.email+'&ty='+this.$route.query.ty+'&tc='+this.$route.query.tc,{
                    password:this.password
                });
                this.action(response.data);
                this.isLoading = false;
                setTimeout( () => this.$router.push({ name: 'signin' }), 3000);
            }catch(error){
                this.isloading =  false;
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
                this.notificationText = e;
            }
        }
      }
  }
  </script>
  
  <style>
  
  
  </style>