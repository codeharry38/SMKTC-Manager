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
                {{edit == true ? `Edit Grand Position` : `New Grand Position `}}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="white" text fab x-small @click="close()"><v-icon>mdi-close</v-icon></v-btn>
        </v-app-bar>
        <v-form ref="form" @submit.prevent="Save()">
            <v-card-text class="pt-5">
                <v-row>
                    <v-col md=6>
                        <v-text-field v-model="position" :rules="positionRule" type="number" label="Position No" class="customField" color="black"></v-text-field>
                    </v-col>
                    <v-col md=6>
                        <v-select :items="positionTypeHolder" v-model="position_type" :rules="positionTypeRule" label="Position Type" class="customField" color="black"></v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col md=6>
                        <v-select :items="prizeTypeHolder" v-model="prize_type" :rules="prizeTypeRule" label="Prize Type" class="customField" color="black"></v-select>
                    </v-col>
                    <v-col md=6>
                        <v-text-field v-model="prize_value" label="Prize" :rules="prizeRule" class="customField" color="black"></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions class="text--center">
                <v-spacer></v-spacer>
                <v-btn color="black" :loading="isLoading" dark class="mx-5" type="submit">Save</v-btn>
            </v-card-actions>
        </v-form>
    </v-card>  
</template>

<script>
    import {bus} from '../../main'
    export default {
        name:'PositionBox',
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
                status:1,
                statusHere:true,
                isLoading:false,
                // Database Content
                position: '',
                position_type: '',
                prize_type: '',
                prize_value: '',
                prize:this.$route.params.id,
                prizeTypeHolder:['cash','item'],
                positionTypeHolder:['higher', 'lower'],
                // Validation
                positionRule: [
                    v => (v.length >= 1 && /[0-9-]+/.test(v)) || 'Please enter Valid value'
                ],
                positionTypeRule: [
                    v => !!v || 'Select Position Type'
                ],
                prizeTypeRule: [
                    v => !!v || 'Select Prize Type'
                ],
                prizeRule: [
                v => (v.length >= 1) || 'Please enter Valid value'
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
                this.position = "";
                this.position_type = "";
                this.prize_type = "";
                this.prize_value = "";
            },
            async fetchbyId(){
                if(this.edit == true){
                    //alert(this.id);
                    try{
                        this.windowLoad = true;
                        const Response = await this.$http.get(process.env.VUE_APP_API+'/prizemeta/id/'+this.id);

                        this.position = Response.data.position;
                        this.position_type = Response.data.position_type;
                        this.prize_type = Response.data.prize_type;
                        this.prize_value = Response.data.prize_value;
                        //this.prize= Response.data.prize;
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
                    const Response = await this.$http.post(process.env.VUE_APP_API+'/prizemeta/create',{
                        position:this.position,
                        position_type:this.position_type,
                        prize_type:this.prize_type,
                        prize_value:this.prize_value,
                        prize:this.prize
                    });
                    this.isLoading = false;
                    this.reset();
                    bus.$emit('response',{res: Response.data, type:'create', model:'postion'});
                    this.close();
                }catch(error){
                    this.isLoading = false;
                    bus.$emit('error',error);
                }
            },
            async update(){
                try{
                    this.isLoading = true;
                    const Response = await this.$http.put(process.env.VUE_APP_API+'/prizemeta/update',{
                        id:this.id,
                        position:this.position,
                        position_type:this.position_type,
                        prize_type:this.prize_type,
                        prize_value:this.prize_value,
                        prize:this.prize
                    });
                    this.isLoading = false;
                    bus.$emit('response',{res: Response.data, type:'update', model:'postion'});
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