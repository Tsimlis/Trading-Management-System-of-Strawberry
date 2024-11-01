<template>
    <div class="modal fade" tabindex="-1" role="dialog" id="chat-farmer">
        <div class="modal-dialog" role="document">
            <form class="modal-content" @submit.prevent="onSubmit()">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fa fa-comments-o" aria-hidden="true"></i> ข้อความ {{send.send_name}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div id="msg" class="modal-body" style="max-height: 400px; overflow-y: auto;">
                    <div v-if="chat.send_id == userId.u_id">
                        <div class="form-group col mb-0" v-for="item in data" :key="item" >
                            <div  v-if="JSON.parse(item).receive">
                                <div class="row">
                                    <label class="m-0 mr-3" >{{ send.send_name }} </label>
                                    <label class="m-0 pt-2 align-text-bottom" style="font-size: 10px;"> {{ JSON.parse(item).time }} </label>
                                </div>

                                <div class="row pl-3" >
                                    <img :src="JSON.parse(item).receive" alt="image_msg" v-if="JSON.parse(item).receive.length > 200" >
                                    <label class="p-1 mb-2 bg-warning text-dark shadow " style="border-radius: 10px;" v-if="JSON.parse(item).receive.length < 200">{{ JSON.parse(item).receive }}</label>
                                </div>
                            </div>
                            
                            <div class="form-group text-right m-0" @click="onDelete(item)" v-if="JSON.parse(item).send">
                                <label class="m-0 pt-2 align-text-bottom" style="font-size: 10px;"> {{ JSON.parse(item).time }} </label><br>
                                <img :src="JSON.parse(item).send" alt="image_msg" v-if="JSON.parse(item).send.length > 200">
                                <label class="p-1 mb-2 bg-secondary text-white shadow " style="border-radius: 10px;" v-if="JSON.parse(item).send.length < 200">{{ JSON.parse(item).send }}</label>
                            </div>
                        </div>
                    </div>
                    
                    <div v-if="chat.send_id != userId.u_id">
                        <div class="form-group col mb-0" v-for="item in data" :key="item" >
                            <div  v-if="JSON.parse(item).send">
                                <div class="row">
                                    <label class="m-0 mr-3" >{{ send.rec_name }} </label>
                                    <label class="m-0 pt-2 align-text-bottom" style="font-size: 10px;"> {{ JSON.parse(item).time }} </label>
                                </div>

                                <div class="row pl-3" >
                                    <img :src="JSON.parse(item).send" alt="image_msg" v-if="JSON.parse(item).send.length > 200" >
                                    <label class="p-1 mb-2 bg-warning text-dark shadow " style="border-radius: 10px;"  v-if="JSON.parse(item).send.length < 200">{{ JSON.parse(item).send }}</label>
                                </div>
                            </div>
                            
                            <div class="form-group text-right m-0" @click="onDelete(item)" v-if="JSON.parse(item).receive">
                                <label class="m-0 pt-2 align-text-bottom" style="font-size: 10px;"> {{ JSON.parse(item).time }} </label><br>
                                <img :src="JSON.parse(item).receive" alt="image_msg" v-if="JSON.parse(item).receive.length > 200" >
                                <label class="p-1 mb-2 bg-secondary text-white shadow " style="border-radius: 10px;" v-if="JSON.parse(item).receive.length < 200" >{{ JSON.parse(item).receive }}</label>
                            </div>
                        </div>
                    </div>
                    
                </div>

                <div class="modal-footer">
                    <div class="col">
                        <div >
                            <label class="btn btn-secondary mr-3" style="float: left;" >
                                <i class="fa fa-upload"></i>
                                <input type="file" class="d-none" @change="onChangeFile($event.target)">
                            </label>
                            <input type="text" class="form-control col-10" placeholder="เขียนข้อความ" v-model="send.message">
                        </div>
                        
                        <button type="submit" class="btn btn-info btn-block mt-2 mb-4">ส่งข้อความ</button>
                    </div>
                    
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import {mapState} from 'vuex';
import imageCompression from 'browser-image-compression';

export default {
    props:{
        message: {
            required: true
        }
    },
    data(){
        return{
            youId: '',
            send: {
                type: "",
                id: "",
                rec_id: "",
                rec_name: "",
                send_id: "",
                send_name: "",
                message: "",
            },
            chat: {},
            data: {},
        }
    },
    watch: {
        message(value){
            if(!value) return
            this.jquery("#chat-farmer").modal();
            if(value.b_id) { // มาจากหน้า buyfarmer
                this.youId = value.b_user_id
                this.send.rec_id = value.b_user_id
                this.send.rec_name = value.b_name
            } else if (value.f_id) { // มาจากหน้า buylist
                this.youId = value.f_buying_id
                this.send.rec_id = value.f_buying_id
                this.send.rec_name = value.f_buying_name
            }
            

            /// ฟังกชันแสดงข้อความของทั้ง 2 คน
            this.getMessage();
            setInterval(() => { this.getMessage(); }, 5000);
            
            this.send.send_id = this.userId.u_id
            this.send.send_name = this.userId.u_fullname
        },
        chat(num){
            if(!num) return false
            
            this.send.id = num.id
            this.data = JSON.parse(num.message)
            // ตรวจสอบว่าใครเริ่มส่งก่อน
            num.send_id == this.userId.u_id ? this.send.type = 'send' : this.send.type = 'receive';

            // เปิดอ่านก็ให้ cout เป็น 0
            axios.put(`/api/socket/cout/${num.id}`, [this.send.type]).then( ).catch(error => this.alertify.error(error.response.data.message))
        }
    },
    computed: {
        ...mapState({ userId: state => state.user })
    },
    mounted() {
        // ตรวจจับการปิดด้วย  Event ของหน้า dialog
        this.jquery("#chat-farmer").on("hide.bs.modal", event => {
            this.$emit('onClose', event)
            this.Reset();
        })
    },
    updated() {
        this.scrollToBottom(); //เลื่อนข้อความล่างสุด
    },
    methods: {
    onSubmit(){
        if(this.send.message == '') return
        
        axios.post(`/api/socket/send`, this.send).then(() => {
                this.getMessage();
                this.send.message = ""
            }).catch(err => this.alertify.error(err.response.data.message));

    },
    onDelete(item){
        const list = []
        this.data.forEach((value) => {
            JSON.parse(value).time == JSON.parse(item).time ? '' : list.push(value);
        })
        
        this.alertify.confirm('คุณต้องการลบข้อความนี้ใช่หรือไม่', () => {
            axios.put(`/api/socket/deleteItem/${this.send.id}`, list)
                .then( () => this.getMessage() ).catch(error => this.alertify.error(error.response.data.message))
        })
    },
    getMessage(){
        axios.post(`/api/socket/message/${this.userId.u_id}`, [this.youId])
            .then(res => this.chat = res.data ).catch(error => this.alertify.error(error.response.data.message))
        // console.log('check')
    },
    Reset(){
        this.send = {}
        this.data = {}
        this.chat.id = "",
        this.chat.message = "",
        this.chat.send_id = ""
    },
    onChangeFile(input) {
        this.send.message = "";
        const file = input.files[0];
        this.compressed(file);
    },
    async compressed(file){

      const options = {
        maxSizeMB: 0.3, // ขนาดสูงสุดของไฟล์ (หน่วย MB)
        maxWidthOrHeight: 250, // ขนาดสูงสุดของภาพ (กว้างหรือสูง)
        useWebWorker: true, // ใช้ Web Worker เพื่อลดเวลาในการประมวลผล
        maxIteration: 10, // จำนวนครั้งในการบีบอัดเพื่อรักษาคุณภาพ
        initialQuality: 0.3 // คุณภาพเริ่มต้นในการบีบอัด (0 - 1)
      };

      try {
        // บีบอัดไฟล์
        const compressedFile = await imageCompression(file, options);
        // แปลงไฟล์บีบอัดเป็น Base64
        this.send.message = await imageCompression.getDataUrlFromFile(compressedFile);
      } catch (error) {
        console.error('Error during image compression:', error);
      }
    },
    scrollToBottom() {
      const container = document.getElementById('msg');
      container.scrollTop = container.scrollHeight;
    },
  }
}
</script>

<style scoped>
.modal{
    color: #525662;
}
.modal-body,
.modal-footer {
    padding-left: 8%;
    padding-right: 8%;
}
.form-check{
    margin-bottom: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>