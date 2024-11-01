<template>
    <div class="modal fade" tabindex="-1" role="dialog"  ref="modal"> <!-- id="order-qrcode" -->
        <div class="modal-dialog" role="document">
            <form class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fa fa-qrcode" aria-hidden="true"></i> QRcode</h5>
                    <!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button> -->
                </div>
                <div class="modal-body">
                    <div class="form-group col" v-show="qrImage.svg">
                        <div v-html="qrImage.svg"></div>
                        
                        <div class="row text-center">
                            <div class="col-6"><label>ชื่อร้าน : {{code.sale_name}}</label></div>
                            <div class="col-6"><label>จำนวนเงิน : {{code.sale_pay}}</label></div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="btn btn-secondary btn-block">
                            <i class="fa fa-upload "></i> ยืนยันใบเสร็จ
                            <input type="file" class="d-none" @change="onChangeFile($event.target)">
                        </label>

                        <img class="img-fluid w-100" :src="Image || '/img/no-image.png'" alt="image example" v-if="Image">
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" @click="submit()" class="btn btn-info btn-block mt-2 mb-4 " id="countdown" :disabled="timeLeftDisplay != 'ยืนยันคำสั่งซื้อ'">{{ timeLeftDisplay }}</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props:{
        code: {
            required: true
        }
    },
    data(){
        return{
            store: [],
            Image: "",
            qrImage: [],
            timeLeft: 30,
            countingDown: false,
            countdownInterval: null,
        }
    },
    watch: {
        code(value){
            if(!value) return
            // this.jquery("#order-qrcode").modal();
            // console.log(value)

            axios.get(`/api/userinfo/${value.customer_id}`)
                .then(res => this.store = res.data).catch(error => this.alertify.error(error.response.data.message))
        },
        store(val){
            axios.post(`/api/qrcode/store/${this.code.sale_pay}`, this.store)
                .then(res => this.qrImage = res.data ).catch(error => this.alertify.error(error.response.data.message))
        },
        Image(value){
            // หยุดการนับถอยหลัง
            this.stopTime();
            this.timeLeft = 0;
            // เพิ่มรูปเพื่อการบันทึกหลักฐานการชำระ
            Object.assign(this.code, {imagePay: value})
        }
    },
    computed: {
        timeLeftDisplay() { // เปลี่ยนการแสดงผลเป็นข้อความ "ยืนยันคำสั่งซื้อ" เมื่อการนับถอยหลังเสร็จสิ้น
            let time = `${this.timeLeft}`;
            this.Image != '' ? time = 'ยืนยันคำสั่งซื้อ' : '';
            return time
        },
    },
    mounted() {
        this.jquery(this.$refs.modal).modal('show');

        // ตรวจจับการปิดด้วย  Event ของหน้า dialog
        this.jquery("#order-qrcode").on("hide.bs.modal", event => {
            this.$emit('onClose', null, '')
            this.stopTime();
        })

        // ฟังกชันนับถอยหลัง
        this.startCountdown();
    },
    methods: {
        submit(){
            this.$emit('onClose', null, this.code)
            this.stopTime();
            setInterval(() => { this.jquery('#order-qrcode').modal('hide'); }, 2000) 
        },
        startCountdown() {
            if (!this.countingDown) {
                this.countingDown = true;
                this.countdownInterval = setInterval(() => {
                    this.timeLeft--;
                    if (this.timeLeft <= 0) {
                        this.stopTime();
                        this.alertify.error('เกินระยะเวลาการชำระ');
                    }
                }, 1000);
            }
        },
        stopTime(){
            clearInterval(this.countdownInterval);
            this.countingDown = false;
            this.qrImage = []
        },
        // เปลี่ยนไฟล์อัพโหลดเป็น Base64 string
        onChangeFile(input) {
        this.Image = "";
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            if (file.type.indexOf("image/") >= 0) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.addEventListener("load", () => {
                this.Image = reader.result;
            });
            return;
            }
        }
        this.alertify.warning("กรุณาเลือกภาพที่จะอัพโหลด !");
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