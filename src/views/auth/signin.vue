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
                    <p>Login into your account</p>
                    <v-form ref="form" @submit.prevent="signin">
                        <v-row class="pa-5 text-center" dense>
                            <v-col lg=7 cols=12 class="ma-auto py-0">
                                <v-text-field v-model="username" label="Username" :rules="usernameRule" prepend-inner-icon="mdi-account" class="customField" color="black" background-color="white"></v-text-field>
                            </v-col>
                            <v-col lg=7 cols=12 class="ma-auto py-0">
                                <v-text-field v-model="password" :type="fieldType" label="Password" :rules="passwordRule" required prepend-inner-icon="mdi-key" class="customField" color="black" background-color="white"
                                :append-icon="fieldType == 'password' ? `mdi-eye` : `mdi-eye-off`" @click:append="changeType"></v-text-field>
                            </v-col>
                            <v-col lg=7 cols=12 class="ma-auto py-0">
                                <v-btn color="black" block class="elevation-0 white--text" type="submit" :loading="isLoading">Log In</v-btn>
                            </v-col>
                            <v-col lg=7 cols=12 class="ma-auto mt-5">
                                <div>
                                    <p class="text-center">
                                        <router-link :to="{name:'forgotpassword'}" class="SidebarLink pr-3 mx-auto"><v-icon>mdi-lock-open-outline</v-icon> Forgot password?</router-link>  
                                    </p>
                                </div>
                            </v-col>
                        </v-row>
                    </v-form>  
                </v-card>
            </v-col>
            
        </v-row>
        <v-snackbar v-model="notificationBar" :timeout="10000" top center :color="notificationColor" multi-line class="mt-2 mr-8" :vertical="true"> {{ notificationText }}
            <template v-slot:action="{ attrs }">
                <v-btn color="white" text v-bind="attrs" @click="notificationBar = false">Close</v-btn>
            </template>
        </v-snackbar>
    </v-container>
    
</template>
<script>
  export default {
      name: 'sign-in',
      mounted(){
        document.title = 'StockMKT Challenge - Signin'
      },
      data () {
        return {
          username:'',
          password:'',
          fieldType:'password',
          // Other useful objects
            isLoading:false,
            //Notifications
          notificationBar:false,
          notificationColor:'black',
          notificationText:'',
          usernameRule: [
            v => v.length >= 3 || 'Username length should be at least 3 character'
            ],
            passwordRule: [
                v => v.length >= 6 || 'Password length should be at least 6 character'
            ],
        }
      },
      methods:{
        changeType(){
            if(this.fieldType == 'password'){
                this.fieldType = 'text';
            }else{
                this.fieldType = 'password';
            }
        },
        async signin() {
            try{
                if(this.$refs.form.validate()){
                    this.isLoading = true;
                    const response = await this.$store.dispatch('retrieveToken', {
                        username: this.username,
                        password: this.password,
                    });
                    if(response.status == 200){
                        this.action(response.data);
                        location.reload();
                    }
                    else{
                        this.action(response.data);
                    }
                    this.isLoading = false;
                }
            }catch(e){
                this.action(e);
                this.isLoading = false;
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
                this.notificationText = this.makeMessage(e);
            }
        },
        makeMessage(error){
            if(error.response){
                let ar = [];
                if(error.response.data.errors){
                    ar.push(error.response.data.errors);
                    let username = ar[0].username !== undefined ? ar[0].username : ' ';
                    let password = ar[0].password !== undefined ?  ar[0].password : ' ';
                    return username+' '+password;
                }else{
                    return error.response.data.message;
                }
            }else{
                return error;
            }
        },
      }
  }
  </script>
  
