<template>
    <v-card flat>
        <v-tabs v-model="MediaTabs" color="black">
            <v-tabs-slider color="black"></v-tabs-slider>
            <v-tab>Upload</v-tab>
            <v-tab>Media</v-tab>
        </v-tabs>
        <v-tabs-items v-model="MediaTabs" class="px-5 py-5">
            <v-tab-item>
                <v-container fluid class="px-0">
                    <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" @vdropzone-success="showMessage" v-on:vdropzone-removed-file="removedFile"></vue-dropzone>
                    <p class="fileUploadText">Please upload a valid image file (JPG, JPEG, PNG) with a maximum file size of 10MB.</p>
                </v-container>
            </v-tab-item>
            <!--------------------------------------- Meida Setting -------------------------------->
            <v-tab-item>
                <v-container fluid class="px-0">
                    <v-row>
                        <v-col v-if="SelectedMedia != ''" cols="12">
                            <v-btn color="red" @click="deleteMedia"  class="mr-5" dark :loading="isDeleteLoading">Delete Selected File</v-btn>
                        </v-col>
                        <!-- Media Showing -->
                        <v-col cols=12 md=12 lg="12" class="px-0">
                            <v-card class="mediaContainer pa-3" flat>
                                <v-row>
                                    <v-col v-if="mediaRecords.length < 1" cols="12" class="text-center py-10">
                                        <p>No Images uploaded yet!</p>
                                        <v-btn color="balck" @click="MediaTabs = 0"  class="mr-5">Upload Images</v-btn>
                                    </v-col>
                                    <v-col v-else cols="12" md="2" lg="2" v-for="(media, i) in mediaRecords" :key="i" :title="media.name">
                                        <v-img :class="mediaSelected(media.id) ? 'selectMedia mediaGallery' : 'mediaGallery'" @click="selectMedia(media.id)" :src="config.mediaInit(media)" 
                                        :lazy-src="config.mediaInit(media)" aspect-ratio="1">
                                        </v-img>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                        <!--
                        <v-col cols=12 md=4 lg=4 sm=4 class="px-0">
                            <v-card color="#efefef" flat height="500" class="pa-4" v-if="position">
                                <h3>Media Info</h3>
                                <v-divider class="mt-3 mb-5" color="#dedede"></v-divider>
                                <tabel class="Customtable">
                                    <tr>
                                        <td class="mediaInfo" style="width:120px">Upload_at:</td>
                                        <td class="mediaInfo"> 29/09/2021</td>
                                    </tr>
                                    <tr>
                                        <td class="mediaInfo" style="width:120px">Name:</td>
                                        <td class="mediaInfo" >{{position.fileName}}</td>
                                    </tr>
                                    <tr>
                                        <td class="mediaInfo" style="width:120px">Type:</td>
                                        <td class="mediaInfo">{{position.type}}</td>
                                    </tr>
                                    <tr>
                                        <td class="mediaInfo" style="width:120px">Size:</td>
                                        <td class="mediaInfo">{{config.formatFileSize(position.size,1)}}</td>
                                    </tr>
                                    <tr>
                                        <td class="mediaInfo" style="width:120px">File url:</td>
                                        <td class="mediaInfo"><a :href="config.fileUrl(position)" target="_blank">Click Here</a></td>
                                    </tr>
                                </tabel>
                                <v-btn small color="red" class="elevation-0 mt-5" block dark @click="deleteMedia()"> <v-icon x-small dark class="mr-2">mdi-delete</v-icon> Delete</v-btn>
                            </v-card>
                        </v-col> -->
                    </v-row>
                    <v-toolbar color="black" flat height="50">
                        <v-spacer></v-spacer>
                        <v-btn color="white" @click="pushMedia" :disabled="isDisable" class="mr-5">Select</v-btn>
                        <v-btn color="red" @click="cancel" dark>Cancel</v-btn>          
                    </v-toolbar>
                </v-container>
            </v-tab-item>
        </v-tabs-items>
    </v-card>
</template>

<script>
import config from '../../config'
import vue2Dropzone from 'vue2-dropzone'
import {bus} from '../../main'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
export default {
    name:'media-box',
    components: {
        vueDropzone: vue2Dropzone
    },
    props:['selected','loaded','triggeredEvent','react'],
    mounted(){
        this.fetchMedia();
        this.replaceMeida();
    },
    data(){
        return{
            MediaTabs:0,
            search:'',
            config: config,
            dropzoneOptions: {
                addRemoveLinks: true,
                destroyDropzone: false,
                url: process.env.VUE_APP_API+'/media/upload',
                thumbnailWidth: 150,
                maxFilesize: 10,
                headers: { "My-Awesome-Header": "header value" }
            },
            currentMedia: this.loaded,
            mediaRecords:[],
            SelectedMedia:'',
            position:'',
            isDisable: false,
            isDeleteLoading:false
        }
    },
    watch:{
       react(){
            this.replaceMeida();
       }
    },
    computed:{
        checkselection(){
            return this.replaceMeida();
        },
        
    },
    methods:{
        showMessage(){
            this.fetchMedia();
            this.MediaTabs = 1;
            this.$refs.myVueDropzone.removeAllFiles()
        },
        replaceMeida(){
            if(this.triggeredEvent == 'replace'){
                this.selectMedia(this.loaded);
            }else{
                //remain silence
            }
        },
        async deleteMedia(){
            try{
                this.isDeleteLoading = true;
                const response = await this.$http.get(process.env.VUE_APP_API+'/media/delete/'+this.SelectedMedia);
                alert(response.data.message);
                this.SelectedMedia = '';
                this.isDeleteLoading = false;
                this.fetchMedia();
            }catch(error){
                alert('there is an error' + error);
            }

        },
        async fetchMedia(){
            try{
                const response = await this.$http.get(process.env.VUE_APP_API+'/media');
                this.mediaRecords = response.data;
            }catch(error){
                alert('there is an error' + error);
            }
        },
        deleteArray(data){
            const remove = this.mediaRecords.indexOf(data);
            this.mediaRecords.splice(remove, 1);
        },
        // ============ Select Media ============
        selectMedia(id){
                if(this.SelectedMedia == id){
                    this.SelectedMedia = '';
                }else{
                    this.SelectedMedia = id;
                }
        },
        mediaSelected(id){
                return this.SelectedMedia == id ? true : false;
        },
        // ============Cancel Media ==========
        pushMedia(){ 
            bus.$emit('media',this.SelectedMedia);
            this.cancel();
        },
        cancel(){
            this.SelectedMedia = '';
            bus.$emit('close','mediaClose');
        }
    }

}
</script>

<style>
.Customtable{
    width: 100%;
    display: block;
    word-break: break-all;
}
.mediaInfo{
    color:#555;
    font-size:13px;
    font-weight: 400;
    line-height: 20px;
    margin-bottom:20px;
    word-wrap: break-word;
}
.selectMedia{
    box-shadow:0px 0px 0px 5px #37474f;
    position: relative;
}
.selectMedia::after{
    position:absolute;
    content:"\2713";
    font-size:15px;
    color:#fff;
    background:#37474f;
    width:30px;
    height:30px;
    right:0;
    top:0;
    text-align: center;
    line-height: 200%;
}
.mediaContainer{
    min-height:200px !important;
    max-height: 70vh;
    overflow-y:scroll;
    overflow-x:inherit;
}
.mediaGallery{
    cursor:pointer;
    border:1px solid rgba(00,00,00,0.1);
}
.fileUploadText{
    font-size:20px;
    margin-top:20px;
    text-align: center;
}

</style>